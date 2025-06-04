const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, authorize, isOwner, requireVerifiedEmail } = require('../middleware/auth');
const { uploadAvatar, handleMulterError, cleanupFiles } = require('../middleware/upload');

// Validation middleware
const profileUpdateValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('profile.dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('profile.phone.number').optional().isMobilePhone().withMessage('Invalid phone number')
];

const userIdValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// User profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, profileUpdateValidation, userController.updateProfile);
router.post('/avatar', auth, cleanupFiles, uploadAvatar, handleMulterError, userController.uploadAvatar);
router.delete('/avatar', auth, userController.deleteAvatar);

// User preferences
router.put('/preferences', auth, userController.updatePreferences);

// Learning progress
router.get('/learning-progress', auth, userController.getLearningProgress);
router.get('/learning-progress/:userId', auth, userIdValidation, userController.getLearningProgress);

// User management (admin routes)
router.get('/all', auth, authorize('admin', 'superadmin'), paginationValidation, userController.getAllUsers);
router.get('/statistics', auth, authorize('admin', 'superadmin'), userController.getUserStatistics);
router.post('/bulk-operation', auth, authorize('admin', 'superadmin'), userController.bulkUserOperation);

// User by ID routes
router.get('/:userId', auth, userIdValidation, userController.getUserById);
router.put('/:userId', auth, authorize('admin', 'superadmin'), userIdValidation, userController.updateUserById);
router.delete('/:userId', auth, userIdValidation, userController.deleteUser);

module.exports = router;