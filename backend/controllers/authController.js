const User = require('../models/User');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const EmailService = require('../services/emailService');
const emailService = new EmailService();

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { firstName, lastName, name, email, password, role } = req.body;

    // Support both old (name) and new (firstName, lastName) formats
    let userFirstName, userLastName;
    if (firstName && lastName) {
      userFirstName = firstName;
      userLastName = lastName;
    } else if (name) {
      const nameParts = name.trim().split(' ');
      userFirstName = nameParts[0];
      userLastName = nameParts.slice(1).join(' ') || nameParts[0];
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Name is required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create user
    const user = new User({
      firstName: userFirstName,
      lastName: userLastName,
      email,
      password,
      role: role || 'student'
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.accountStatus.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.accountStatus.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to user
    user.tokens = user.tokens || [];
    user.tokens.push({ token: refreshToken });
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    // Remove sensitive data
    user.password = undefined;
    user.tokens = undefined;

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user,
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', '),
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    // If we reach here, the token is valid (auth middleware passed)
    const user = await User.findById(req.userId).select('-password -tokens -accountStatus');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during token verification' 
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check user exists and get password
    const user = await User.findOne({ email }).select('+password +accountStatus');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      // Increment login attempts (handled by the model method)
      await user.incrementLoginAttempts();
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts' 
      });
    }

    // Check if account is active
    if (!user.accountStatus.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated' 
      });
    }

    // Check if email is verified (warning only)
    if (!user.accountStatus.isEmailVerified) {
      console.log('Warning: User logging in with unverified email:', email);
    }

    // Reset failed login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    
    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token
    user.tokens = user.tokens || [];
    user.tokens.push({ token: refreshToken });
    
    // Keep only last 5 refresh tokens
    if (user.tokens.length > 5) {
      user.tokens = user.tokens.slice(-5);
    }
    
    await user.save();

    // Remove sensitive data
    user.password = undefined;
    user.tokens = undefined;
    user.accountStatus = undefined;

    // Convert to plain object with virtuals
    const userObject = user.toObject({ virtuals: true });

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: userObject,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token required' 
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(refreshToken)) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.tokens.some(tokenObj => tokenObj.token === refreshToken)) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Replace old refresh token with new one
    user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== refreshToken);
    user.tokens.push({ token: tokens.refreshToken });
    await user.save();

    // Blacklist old refresh token
    tokenBlacklist.add(refreshToken);

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired refresh token' 
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.userId; // From auth middleware

    if (refreshToken) {
      // Blacklist the refresh token
      tokenBlacklist.add(refreshToken);

      // Remove from user's tokens
      const user = await User.findById(userId);
      if (user) {
        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== refreshToken);
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error during logout' 
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    // Find user and clear all tokens
    const user = await User.findById(userId);
    if (user) {
      // Blacklist all user's refresh tokens
      user.tokens.forEach(tokenObj => {
        tokenBlacklist.add(tokenObj.token);
      });
      
      user.tokens = [];
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error during logout' 
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.accountStatus.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.accountStatus.passwordResetExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Send password reset email
    await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending password reset email' 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Hash token and find user
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      'accountStatus.passwordResetToken': hashedToken,
      'accountStatus.passwordResetExpire': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    // Set new password
    user.password = password;
    user.accountStatus.passwordResetToken = undefined;
    user.accountStatus.passwordResetExpire = undefined;
    user.accountStatus.passwordChangedAt = new Date();

    // Invalidate all existing tokens
    user.tokens = [];

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error resetting password' 
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token and find user
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      'accountStatus.emailVerificationToken': hashedToken,
      'accountStatus.emailVerificationExpire': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired verification token' 
      });
    }

    // Verify email
    user.accountStatus.isEmailVerified = true;
    user.accountStatus.emailVerificationToken = undefined;
    user.accountStatus.emailVerificationExpire = undefined;
    user.accountStatus.emailVerifiedAt = new Date();

    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(user);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying email' 
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.accountStatus.isEmailVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already verified' 
      });
    }

    // Check if last email was sent recently (prevent spam)
    if (user.accountStatus.emailVerificationExpire && 
        user.accountStatus.emailVerificationExpire > Date.now() + 23 * 60 * 60 * 1000) {
      return res.status(429).json({ 
        success: false,
        message: 'Verification email was sent recently. Please check your inbox or wait before requesting again.' 
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.accountStatus.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.accountStatus.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending verification email' 
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const userId = req.userId; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    user.accountStatus.passwordChangedAt = new Date();
    
    // Invalidate all existing tokens except current
    const currentToken = req.body.refreshToken;
    if (currentToken) {
      user.tokens = user.tokens.filter(tokenObj => tokenObj.token === currentToken);
    } else {
      user.tokens = [];
    }

    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error changing password' 
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword
};