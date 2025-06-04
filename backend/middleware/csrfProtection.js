const crypto = require('crypto');
const { logger } = require('../utils/logger');

// Custom CSRF protection implementation
class CSRFProtection {
  constructor(options = {}) {
    this.tokenLength = options.tokenLength || 32;
    this.cookieName = options.cookieName || '_csrf';
    this.headerName = options.headerName || 'x-csrf-token';
    this.paramName = options.paramName || '_csrf';
    this.sessionKey = options.sessionKey || 'csrfSecret';
    this.ignoreMethods = options.ignoreMethods || ['GET', 'HEAD', 'OPTIONS'];
    this.excludePaths = options.excludePaths || ['/api/webhooks', '/api/health', '/api/auth/register', '/api/auth/login'];
  }

  generateToken() {
    return crypto.randomBytes(this.tokenLength).toString('hex');
  }

  generateSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  createToken(req, res, next) {
    // Skip for ignored methods
    if (this.ignoreMethods.includes(req.method)) {
      return next();
    }

    // Skip for excluded paths
    if (this.excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Initialize session if not exists
    if (!req.session) {
      logger.error('Session middleware not initialized before CSRF protection');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Generate or retrieve secret
    if (!req.session[this.sessionKey]) {
      req.session[this.sessionKey] = this.generateSecret();
    }

    // Generate token
    const token = this.generateToken();
    const secret = req.session[this.sessionKey];
    const hash = crypto
      .createHash('sha256')
      .update(token + secret)
      .digest('hex');

    // Store token hash in session
    req.session.csrfTokenHash = hash;
    req.csrfToken = () => token;

    // Set token in response header for API responses
    res.setHeader('X-CSRF-Token', token);

    next();
  }

  verifyToken(req, res, next) {
    // Skip for ignored methods
    if (this.ignoreMethods.includes(req.method)) {
      return next();
    }

    // Skip for excluded paths
    if (this.excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Skip for webhook requests with valid API key
    if (req.isWebhook) {
      return next();
    }

    // Get token from request
    const token = this.getTokenFromRequest(req);

    if (!token) {
      logger.warn('CSRF token missing', {
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      return res.status(403).json({
        success: false,
        message: 'CSRF token missing'
      });
    }

    // Verify token
    const secret = req.session?.[this.sessionKey];
    const storedHash = req.session?.csrfTokenHash;

    if (!secret || !storedHash) {
      logger.warn('CSRF session data missing', {
        ip: req.ip,
        url: req.url
      });
      return res.status(403).json({
        success: false,
        message: 'Invalid session'
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(token + secret)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))) {
      logger.warn('Invalid CSRF token', {
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
    }

    // Regenerate token for next request
    this.createToken(req, res, () => {});

    next();
  }

  getTokenFromRequest(req) {
    // Check header
    let token = req.headers[this.headerName];
    
    // Check body
    if (!token && req.body) {
      token = req.body[this.paramName];
    }
    
    // Check query
    if (!token && req.query) {
      token = req.query[this.paramName];
    }
    
    // Check cookie
    if (!token && req.cookies) {
      token = req.cookies[this.cookieName];
    }

    return token;
  }

  middleware() {
    return [
      this.createToken.bind(this),
      this.verifyToken.bind(this)
    ];
  }

  // Middleware to only create token (for GET routes that render forms)
  init() {
    return this.createToken.bind(this);
  }

  // Middleware to only verify token (for POST/PUT/DELETE routes)
  verify() {
    return this.verifyToken.bind(this);
  }
}

// Double Submit Cookie Pattern for stateless CSRF protection
class DoubleSubmitCSRF {
  constructor(options = {}) {
    this.cookieName = options.cookieName || 'csrf-token';
    this.headerName = options.headerName || 'x-csrf-token';
    this.secret = options.secret || process.env.CSRF_SECRET;
    this.maxAge = options.maxAge || 86400000; // 24 hours
    this.ignoreMethods = options.ignoreMethods || ['GET', 'HEAD', 'OPTIONS'];
    this.excludePaths = options.excludePaths || ['/api/webhooks', '/api/health', '/api/auth/register', '/api/auth/login'];
  }

  generateToken() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(16).toString('hex');
    const data = `${timestamp}.${random}`;
    
    const hmac = crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('hex');
    
    return `${data}.${hmac}`;
  }

  verifyToken(token) {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [timestamp, random, signature] = parts;
    const data = `${timestamp}.${random}`;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return false;
    }
    
    // Check token age
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > this.maxAge) {
      return false;
    }
    
    return true;
  }

  middleware() {
    return (req, res, next) => {
      // Skip for ignored methods
      if (this.ignoreMethods.includes(req.method)) {
        // Generate token for GET requests
        const token = this.generateToken();
        res.cookie(this.cookieName, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: this.maxAge
        });
        req.csrfToken = () => token;
        return next();
      }

      // Skip for excluded paths
      if (this.excludePaths.some(path => req.path.startsWith(path))) {
        return next();
      }

      // Skip for webhook requests
      if (req.isWebhook) {
        return next();
      }

      // Get tokens
      const cookieToken = req.cookies?.[this.cookieName];
      const headerToken = req.headers[this.headerName];

      // Verify tokens
      if (!cookieToken || !headerToken) {
        logger.warn('CSRF tokens missing', {
          ip: req.ip,
          url: req.url,
          method: req.method,
          hasCookie: !!cookieToken,
          hasHeader: !!headerToken
        });
        return res.status(403).json({
          success: false,
          message: 'CSRF validation failed'
        });
      }

      // Tokens must match
      if (cookieToken !== headerToken) {
        logger.warn('CSRF token mismatch', {
          ip: req.ip,
          url: req.url,
          method: req.method
        });
        return res.status(403).json({
          success: false,
          message: 'CSRF validation failed'
        });
      }

      // Verify token validity
      if (!this.verifyToken(cookieToken)) {
        logger.warn('Invalid CSRF token', {
          ip: req.ip,
          url: req.url,
          method: req.method
        });
        return res.status(403).json({
          success: false,
          message: 'CSRF validation failed'
        });
      }

      // Generate new token for next request
      const newToken = this.generateToken();
      res.cookie(this.cookieName, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: this.maxAge
      });
      req.csrfToken = () => newToken;

      next();
    };
  }
}

// Export middleware instances
const csrfProtection = new CSRFProtection();
const doubleSubmitCSRF = new DoubleSubmitCSRF();

module.exports = {
  CSRFProtection,
  DoubleSubmitCSRF,
  csrfProtection,
  doubleSubmitCSRF
};