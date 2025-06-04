const { logger } = require('../utils/logger');

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// MongoDB error handler
const handleMongoError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return new AppError(
      `${field} '${value}' already exists`,
      409,
      'DUPLICATE_KEY',
      { field, value: process.env.NODE_ENV === 'production' ? '[REDACTED]' : value }
    );
  }
  
  if (error.name === 'CastError') {
    return new AppError(
      'Invalid data format',
      400,
      'INVALID_FORMAT',
      { field: error.path }
    );
  }
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    return new AppError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      { errors }
    );
  }
  
  return error;
};

// JWT error handler
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }
  
  return error;
};

// Multer error handler
const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large', 413, 'FILE_TOO_LARGE');
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files', 413, 'TOO_MANY_FILES');
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field', 400, 'UNEXPECTED_FIELD');
  }
  
  return error;
};

// Development error response
const sendErrorDev = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  
  logger.error('Error in development', {
    error: err,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers,
      body: req.body
    }
  });
  
  res.status(statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    code: err.code,
    details: err.details
  });
};

// Production error response
const sendErrorProd = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn('Operational error', {
      message: err.message,
      code: err.code,
      statusCode,
      ip: req.ip,
      url: req.url
    });
    
    res.status(statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Programming error', {
      error: err,
      stack: err.stack,
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip
      }
    });
    
    // Generic message
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  
  // Handle specific error types
  if (err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError') {
    error = handleMongoError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  } else if (err.name === 'MulterError') {
    error = handleMulterError(err);
  } else if (err.name === 'PayloadTooLargeError') {
    error = new AppError('Request payload too large', 413, 'PAYLOAD_TOO_LARGE');
  } else if (err.name === 'UnauthorizedError') {
    error = new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
  }
  
  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

// Not found handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    404,
    'NOT_FOUND'
  );
  next(error);
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Error logger middleware
const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent')
    }
  });
  next(err);
};

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
    error: err,
    stack: err.stack
  });
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', {
    error: err,
    stack: err.stack
  });
  process.exit(1);
});

// SIGTERM handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  catchAsync,
  errorLogger,
  handleMongoError,
  handleJWTError,
  handleMulterError
};