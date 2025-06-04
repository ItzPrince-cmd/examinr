const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('firstName').optional().trim().notEmpty().withMessage('First name is required'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/verify', auth, authController.verifyToken);
router.post('/logout', auth, authController.logout);
router.post('/logout-all', auth, authController.logoutAll);
router.post('/refresh-token', auth, authController.refreshToken);
router.post('/forgot-password', body('email').isEmail(), authController.forgotPassword);
router.post('/reset-password/:token', body('password').isLength({ min: 6 }), authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', auth, authController.resendVerificationEmail);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;