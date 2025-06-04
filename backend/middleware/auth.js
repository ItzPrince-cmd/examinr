const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password -tokens');

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.accountStatus.isActive) {
      throw new Error('Account is not active');
    }

    req.userId = decoded.userId;
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ 
      success: false,
      error: 'Please authenticate',
      message: error.message || 'Authentication failed'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password -tokens');
      
      if (user && user.accountStatus.isActive) {
        req.userId = decoded.userId;
        req.user = user;
        req.token = token;
      }
    }
  } catch (error) {
    // Silent fail - user remains unauthenticated
    console.log('Optional auth failed:', error.message);
  }
  
  next();
};

// Check if user owns the resource
const isOwner = (resourceField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return next();
    }

    // Check if user owns the resource
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

// Verify email before allowing certain actions
const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (!req.user.accountStatus.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
      message: 'Please verify your email address to access this feature'
    });
  }

  next();
};

module.exports = { 
  auth, 
  authorize, 
  optionalAuth,
  isOwner,
  requireVerifiedEmail
};