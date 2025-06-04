const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Redis imports (optional)
let RedisStore = null;
let redis = null;

try {
  const RateLimitRedis = require('rate-limit-redis');
  RedisStore = RateLimitRedis.default || RateLimitRedis;
  redis = require('redis');
} catch (error) {
  // Redis packages not installed or not available
}
const { logger } = require('../utils/logger');

// Redis client for rate limiting (optional - falls back to memory store)
let redisClient = null;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          logger.error('Redis connection failed after 10 retries');
          return false;
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });
  
  redisClient.on('error', (err) => {
    logger.error('Redis client error:', err);
  });
  
  redisClient.connect().catch(err => {
    logger.error('Failed to connect to Redis:', err);
    redisClient = null;
  });
}

// Helmet configuration
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'self'"],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin', 'allow-popups'],
      reportUri: '/api/security/csp-report',
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Base rate limiter configuration
const createRateLimiter = (options) => {
  const baseConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit headers
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests, please try again later.',
        retryAfter: req.rateLimit.resetTime
      });
    },
    skip: (req) => {
      // Skip rate limiting for whitelisted IPs
      const whitelist = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
      return whitelist.includes(req.ip);
    }
  };

  // Use Redis store if available
  if (redisClient && redisClient.isOpen && RedisStore) {
    try {
      baseConfig.store = new RedisStore({
        client: redisClient,
        prefix: 'rl:',
        sendCommand: (...args) => redisClient.sendCommand(args)
      });
    } catch (error) {
      logger.warn('Failed to create Redis store for rate limiting, using memory store', error);
    }
  }

  return rateLimit({ ...baseConfig, ...options });
};

// Different rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),

  // Stricter rate limiter for auth endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts, please try again later.'
  }),

  // Rate limiter for password reset
  passwordReset: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    skipSuccessfulRequests: false,
    message: 'Too many password reset attempts, please try again later.'
  }),

  // Rate limiter for file uploads
  fileUpload: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Too many file uploads, please try again later.'
  }),

  // Rate limiter for payment endpoints
  payment: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    message: 'Too many payment attempts, please try again later.'
  }),

  // Rate limiter for API key generation
  apiKey: createRateLimiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 5,
    message: 'Too many API key requests, please try again tomorrow.'
  }),

  // Aggressive rate limiter for suspected attacks
  aggressive: createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10,
    message: 'Suspicious activity detected. Access temporarily blocked.'
  })
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000'
    ];

    // Add production domains
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push(
        'https://examinr.com',
        'https://www.examinr.com',
        'https://app.examinr.com',
        'https://api.examinr.com'
      );
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS: Origin not allowed', { origin, ip: origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key'
  ],
  exposedHeaders: [
    'X-CSRF-Token',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset'
  ],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

// File upload restrictions
const fileUploadOptions = {
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB default
    files: 5 // Max 5 files per request
  },
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded',
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.warn('File upload rejected - invalid mime type', {
        mimetype: file.mimetype,
        filename: file.originalname,
        ip: req.ip
      });
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
    }
  }
};

// Environment-based configuration
const securityConfig = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'test',
  
  // Security tokens and keys
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
  csrfSecret: process.env.CSRF_SECRET || process.env.JWT_SECRET + '_csrf',
  encryptionKey: process.env.ENCRYPTION_KEY,
  
  // Session configuration
  sessionConfig: {
    secret: process.env.SESSION_SECRET || 'examinr-session-secret-change-in-production',
    name: 'examinr.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    },
    store: redisClient ? new (require('connect-redis').default)({
      client: redisClient,
      prefix: 'sess:'
    }) : undefined
  },
  
  // API Keys
  webhookApiKeys: process.env.WEBHOOK_API_KEYS?.split(',').map(k => k.trim()) || [],
  internalApiKey: process.env.INTERNAL_API_KEY,
  
  // External service keys (should be encrypted in production)
  services: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        authSource: 'admin'
      }
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    redis: {
      url: process.env.REDIS_URL
    }
  }
};

// Validate required security configurations
const validateSecurityConfig = () => {
  const required = ['JWT_SECRET', 'SESSION_SECRET'];
  const missing = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    logger.error('Missing required security configuration', { missing });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  } else if (missing.length > 0) {
    logger.warn('Missing security configuration - using defaults (not safe for production)', { missing });
  }
};

module.exports = {
  helmetConfig,
  corsOptions,
  rateLimiters,
  fileUploadOptions,
  securityConfig,
  validateSecurityConfig,
  redisClient
};