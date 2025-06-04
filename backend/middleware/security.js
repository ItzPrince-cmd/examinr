const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const crypto = require('crypto');
const { logger } = require('../utils/logger');

// MongoDB injection prevention
const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn('Attempted NoSQL injection', {
      ip: req.ip,
      key,
      url: req.url,
      method: req.method
    });
  }
});

// XSS protection
const xssProtection = xss();

// HTTP Parameter Pollution prevention
const hppProtection = hpp({
  whitelist: ['sort', 'fields', 'page', 'limit', 'filter', 'search']
});

// HTTPS redirect middleware for production
const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
    return res.redirect('https://' + req.get('Host') + req.url);
  }
  next();
};

// API key authentication for webhooks
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    logger.warn('Webhook access attempt without API key', {
      ip: req.ip,
      url: req.url
    });
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }

  // Verify API key
  const validApiKeys = process.env.WEBHOOK_API_KEYS?.split(',') || [];
  const hashedApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const isValid = validApiKeys.some(validKey => {
    const hashedValidKey = crypto.createHash('sha256').update(validKey.trim()).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hashedApiKey), Buffer.from(hashedValidKey));
  });

  if (!isValid) {
    logger.warn('Invalid API key used for webhook', {
      ip: req.ip,
      url: req.url,
      apiKey: apiKey.substring(0, 8) + '...' // Log partial key for debugging
    });
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  // Add webhook identifier to request
  req.isWebhook = true;
  req.webhookApiKey = hashedApiKey;
  
  next();
};

// Request size validation
const requestSizeValidator = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  const maxSize = 10 * 1024 * 1024; // 10MB default
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    logger.warn('Request size limit exceeded', {
      ip: req.ip,
      url: req.url,
      size: contentLength,
      maxSize
    });
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers not covered by helmet
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
};

// IP-based request tracking for anomaly detection
const requestTracker = (() => {
  const requests = new Map();
  const WINDOW_SIZE = 60 * 1000; // 1 minute
  const THRESHOLD = 100; // Max requests per window
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const ipRequests = requests.get(ip);
    
    // Remove old requests outside the window
    const validRequests = ipRequests.filter(timestamp => now - timestamp < WINDOW_SIZE);
    
    if (validRequests.length >= THRESHOLD) {
      logger.warn('Potential DDoS attack detected', {
        ip,
        requestCount: validRequests.length,
        windowSize: WINDOW_SIZE,
        threshold: THRESHOLD
      });
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    // Cleanup old IPs periodically
    if (Math.random() < 0.01) { // 1% chance on each request
      for (const [ip, timestamps] of requests.entries()) {
        if (timestamps.length === 0 || now - timestamps[timestamps.length - 1] > WINDOW_SIZE * 2) {
          requests.delete(ip);
        }
      }
    }
    
    next();
  };
})();

// Content Security Policy
const contentSecurityPolicy = (req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "https:", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'", "https:"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'font-src': ["'self'", "https:", "data:"],
    'connect-src': ["'self'", "https:"],
    'media-src': ["'self'", "https:"],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };
  
  const policy = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
  
  res.setHeader('Content-Security-Policy', policy);
  next();
};

// Input validation middleware
const inputValidator = (req, res, next) => {
  // Check for common attack patterns
  const suspiciousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\(/gi,
    /expression\(/gi,
    /__proto__/gi,
    /constructor\[/gi
  ];
  
  const checkValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          logger.warn('Suspicious input detected', {
            ip: req.ip,
            url: req.url,
            pattern: pattern.toString(),
            value: value.substring(0, 100) // Log first 100 chars
          });
          return false;
        }
      }
    }
    return true;
  };
  
  const checkObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          if (!checkObject(value)) return false;
        } else if (!checkValue(value)) {
          return false;
        }
      }
    }
    return true;
  };
  
  if (!checkObject(req.body) || !checkObject(req.query) || !checkObject(req.params)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }
  
  next();
};

module.exports = {
  mongoSanitizeMiddleware,
  xssProtection,
  hppProtection,
  httpsRedirect,
  apiKeyAuth,
  requestSizeValidator,
  securityHeaders,
  requestTracker,
  contentSecurityPolicy,
  inputValidator
};