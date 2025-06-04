require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Security imports
const { 
  helmetConfig, 
  corsOptions, 
  rateLimiters, 
  securityConfig,
  validateSecurityConfig 
} = require('./config/security');
const {
  mongoSanitizeMiddleware,
  xssProtection,
  hppProtection,
  httpsRedirect,
  securityHeaders,
  requestSizeValidator,
  inputValidator
} = require('./middleware/security');
const { doubleSubmitCSRF } = require('./middleware/csrfProtection');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const securityRoutes = require('./routes/securityRoutes');

// Middleware imports
const { 
  errorHandler, 
  notFoundHandler, 
  errorLogger 
} = require('./middleware/errorHandler');
const connectDB = require('./config/database');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Validate security configuration
validateSecurityConfig();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Trust proxy (for production behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CORS configuration (must be early to handle preflight requests)
app.use(cors(corsOptions));

// Security middleware - Order matters!
app.use(httpsRedirect); // HTTPS redirect for production
app.use(helmetConfig); // Helmet security headers
app.use(securityHeaders); // Additional security headers
app.use(mongoSanitizeMiddleware); // MongoDB injection prevention
app.use(xssProtection); // XSS protection
app.use(hppProtection); // HTTP Parameter Pollution prevention

// Request parsing with size limits
app.use(express.json({ 
  limit: process.env.MAX_REQUEST_SIZE || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_REQUEST_SIZE || '10mb' 
}));

// Session configuration (required for CSRF with session-based approach)
app.use(session({
  ...securityConfig.sessionConfig,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  })
}));

// CSRF protection (after session middleware)
app.use(doubleSubmitCSRF.middleware());

// Request validation
app.use(requestSizeValidator);
app.use(inputValidator);

// Compression middleware
app.use(compression());

// Import logger and security monitor
const { expressLogger, logger } = require('./utils/logger');
const securityMonitor = require('./monitoring/security-monitor');

// Logging middleware
app.use(expressLogger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security monitoring middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    securityMonitor.trackRequest(req, res);
  });
  next();
});

// CSP report endpoint
app.post('/api/security/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  logger.warn('CSP Violation', {
    report: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  res.status(204).end();
});

// Static files with security headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Rate limiting on API routes
app.use('/api/', rateLimiters.general);

// API Routes with specific rate limiters
app.use('/api/auth', rateLimiters.auth, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', rateLimiters.payment, paymentRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/batches', require('./routes/batchRoutes'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Examinr API Documentation"
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Maintenance mode
app.use((req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable for maintenance',
      retryAfter: 3600 // 1 hour
    });
  }
  next();
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  logger.info('Socket.io client connected', { socketId: socket.id });

  // Exam room events
  socket.on('join-exam', (examId) => {
    socket.join(`exam-${examId}`);
    logger.info('Socket joined exam room', { socketId: socket.id, examId });
  });

  socket.on('leave-exam', (examId) => {
    socket.leave(`exam-${examId}`);
    logger.info('Socket left exam room', { socketId: socket.id, examId });
  });

  // Batch and live class events
  socket.on('join-batch', ({ batchId, userId, role }) => {
    socket.join(`batch-${batchId}`);
    socket.userId = userId;
    socket.userRole = role;
    
    // Notify others in the batch
    socket.to(`batch-${batchId}`).emit('user-joined-batch', {
      userId,
      role,
      socketId: socket.id
    });
    
    logger.info('Socket joined batch room', { socketId: socket.id, batchId, userId, role });
  });

  socket.on('leave-batch', ({ batchId }) => {
    socket.leave(`batch-${batchId}`);
    
    // Notify others in the batch
    socket.to(`batch-${batchId}`).emit('user-left-batch', {
      userId: socket.userId,
      socketId: socket.id
    });
    
    logger.info('Socket left batch room', { socketId: socket.id, batchId });
  });

  // Live session events
  socket.on('join-live-session', ({ sessionId, batchId, userId, role }) => {
    socket.join(`session-${sessionId}`);
    
    // Get current participants count
    const room = io.sockets.adapter.rooms.get(`session-${sessionId}`);
    const participantCount = room ? room.size : 0;
    
    // Notify the joiner about current participants
    socket.emit('session-participants', { count: participantCount });
    
    // Notify others in the session
    socket.to(`session-${sessionId}`).emit('participant-joined', {
      userId,
      role,
      socketId: socket.id,
      participantCount: participantCount
    });
    
    logger.info('User joined live session', { sessionId, userId, role });
  });

  socket.on('leave-live-session', ({ sessionId, userId }) => {
    socket.leave(`session-${sessionId}`);
    
    // Notify others in the session
    socket.to(`session-${sessionId}`).emit('participant-left', {
      userId,
      socketId: socket.id
    });
    
    logger.info('User left live session', { sessionId, userId });
  });

  // WebRTC signaling for live video
  socket.on('offer', ({ sessionId, offer, targetSocketId }) => {
    socket.to(targetSocketId).emit('offer', {
      offer,
      senderSocketId: socket.id
    });
  });

  socket.on('answer', ({ sessionId, answer, targetSocketId }) => {
    socket.to(targetSocketId).emit('answer', {
      answer,
      senderSocketId: socket.id
    });
  });

  socket.on('ice-candidate', ({ sessionId, candidate, targetSocketId }) => {
    socket.to(targetSocketId).emit('ice-candidate', {
      candidate,
      senderSocketId: socket.id
    });
  });

  // Chat messages in live session
  socket.on('session-chat-message', ({ sessionId, message, userId, userName }) => {
    io.to(`session-${sessionId}`).emit('new-chat-message', {
      message,
      userId,
      userName,
      timestamp: new Date(),
      socketId: socket.id
    });
  });

  // Screen sharing events
  socket.on('start-screen-share', ({ sessionId, userId }) => {
    socket.to(`session-${sessionId}`).emit('screen-share-started', {
      userId,
      socketId: socket.id
    });
  });

  socket.on('stop-screen-share', ({ sessionId, userId }) => {
    socket.to(`session-${sessionId}`).emit('screen-share-stopped', {
      userId,
      socketId: socket.id
    });
  });

  // Hand raise feature
  socket.on('raise-hand', ({ sessionId, userId, userName }) => {
    socket.to(`session-${sessionId}`).emit('hand-raised', {
      userId,
      userName,
      socketId: socket.id
    });
  });

  socket.on('lower-hand', ({ sessionId, userId }) => {
    socket.to(`session-${sessionId}`).emit('hand-lowered', {
      userId,
      socketId: socket.id
    });
  });

  socket.on('disconnect', () => {
    logger.info('Socket.io client disconnected', { socketId: socket.id });
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  
  // Serve static files
  app.use(express.static(frontendBuildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
}

// Error logging middleware
app.use(errorLogger);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info('Server started with enhanced security', {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    security: {
      helmet: true,
      cors: true,
      rateLimiting: true,
      mongoSanitize: true,
      xssProtection: true,
      csrf: true,
      https: process.env.NODE_ENV === 'production',
      monitoring: true
    }
  });
  
  // Start security monitoring
  securityMonitor.start();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  securityMonitor.stop();
  await mongoose.connection.close();
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});