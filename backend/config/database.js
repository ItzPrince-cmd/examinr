const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB optimization options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Connection pooling
  maxPoolSize: 10, // Max number of connections
  minPoolSize: 2,  // Min number of connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // Write concern for data consistency
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  },
  // Read preference for load balancing
  readPreference: 'primary',
  // Enable compression
  compressors: ['zlib'],
  // Auto-create indexes
  autoIndex: false,
  // Connection monitoring
  heartbeatFrequencyMS: 10000,
  // Enable retryable writes
  retryWrites: true,
  retryReads: true
};

// Connection state monitoring
let connectionRetries = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr', 
      mongoOptions
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Reset retry counter on successful connection
    connectionRetries = 0;
    
    // Monitor connection events
    setupConnectionMonitoring(conn);
    
    // Setup indexes
    if (process.env.NODE_ENV === 'production') {
      await createIndexes();
    }
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(`Retrying connection... Attempt ${connectionRetries}/${MAX_RETRIES}`);
      setTimeout(connectDB, RETRY_DELAY);
    } else {
      console.error('Max connection retries reached. Running without DB connection.');
      // Allow server to run without DB in development
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

// Monitor MongoDB connection events
const setupConnectionMonitoring = (conn) => {
  conn.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  conn.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  conn.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  conn.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  // Monitor slow queries
  mongoose.set('debug', (collectionName, method, query, doc) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`MongoDB: ${collectionName}.${method}`, { query, doc });
    }
  });
};

// Create production indexes
const createIndexes = async () => {
  try {
    console.log('Creating MongoDB indexes...');
    
    // Import models to ensure indexes are created
    require('../models/User');
    require('../models/Question');
    require('../models/Quiz');
    require('../models/QuizAttempt');
    require('../models/Course');
    require('../models/Category');
    require('../models/Batch');
    require('../models/SearchAnalytics');
    require('../models/StudentAnalytics');
    
    await mongoose.connection.syncIndexes();
    console.log('MongoDB indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Graceful shutdown
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

// Export connection metrics
const getConnectionStats = () => {
  const { readyState, host, port, name } = mongoose.connection;
  return {
    readyState,
    host,
    port,
    database: name,
    connections: mongoose.connections.length,
    models: Object.keys(mongoose.models).length
  };
};

module.exports = { 
  connectDB, 
  disconnectDB, 
  getConnectionStats,
  mongoose
};