const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const courseController = require('../controllers/courseController');
const { auth, authorize, optionalAuth, requireVerifiedEmail } = require('../middleware/auth');
const { uploadCourseContent, uploadQuestionImage, handleMulterError, cleanupFiles } = require('../middleware/upload');

// Validation middleware
const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters'),
  body('category').isMongoId().withMessage('Invalid category ID'),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'all_levels']).withMessage('Invalid level'),
  body('pricing.type').isIn(['free', 'one_time', 'subscription']).withMessage('Invalid pricing type'),
  body('pricing.amount').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

const moduleValidation = [
  body('title').trim().notEmpty().withMessage('Module title is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
];

const lessonValidation = [
  body('title').trim().notEmpty().withMessage('Lesson title is required'),
  body('type').isIn(['video', 'text', 'quiz', 'assignment']).withMessage('Invalid lesson type'),
  body('content').optional().trim(),
  body('estimatedDuration').optional().isInt({ min: 1 }).withMessage('Duration must be positive')
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment too long')
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
];

// Public routes
router.get('/', optionalAuth, paginationValidation, courseController.getAllCourses);
router.get('/:courseId', optionalAuth, courseController.getCourseById);

// Protected routes - require authentication
router.use(auth); // All routes below require authentication

// Course management
router.post('/', authorize('teacher', 'admin'), requireVerifiedEmail, courseValidation, courseController.createCourse);
router.put('/:courseId', authorize('teacher', 'admin'), courseValidation, courseController.updateCourse);
router.delete('/:courseId', authorize('teacher', 'admin'), courseController.deleteCourse);
router.post('/:courseId/publish', authorize('teacher', 'admin'), courseController.publishCourse);

// Course content upload
router.post('/:courseId/thumbnail', 
  authorize('teacher', 'admin'), 
  cleanupFiles,
  uploadQuestionImage, 
  handleMulterError, 
  courseController.uploadThumbnail
);

// Module management
router.post('/:courseId/modules', authorize('teacher', 'admin'), moduleValidation, courseController.addModule);
router.put('/:courseId/modules/:moduleId', authorize('teacher', 'admin'), moduleValidation, courseController.updateModule);
router.delete('/:courseId/modules/:moduleId', authorize('teacher', 'admin'), courseController.deleteModule);

// Lesson management
router.post('/:courseId/modules/:moduleId/lessons', 
  authorize('teacher', 'admin'), 
  lessonValidation, 
  courseController.addLesson
);

// Course materials upload
router.post('/:courseId/materials',
  authorize('teacher', 'admin'),
  cleanupFiles,
  uploadCourseContent,
  handleMulterError,
  async (req, res) => {
    // Handle uploaded materials
    res.json({
      success: true,
      files: req.files?.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        path: file.path
      }))
    });
  }
);

// Enrollment
router.post('/:courseId/enroll', requireVerifiedEmail, courseController.enrollInCourse);
router.get('/enrolled/my-courses', courseController.getEnrolledCourses);
router.get('/enrolled/:userId', authorize('admin', 'teacher'), courseController.getEnrolledCourses);

// Instructor courses
router.get('/instructor/my-courses', authorize('teacher', 'admin'), courseController.getInstructorCourses);
router.get('/instructor/:instructorId', courseController.getInstructorCourses);

// Reviews
router.post('/:courseId/reviews', requireVerifiedEmail, reviewValidation, courseController.addReview);

// Statistics (instructor/admin only)
router.get('/:courseId/statistics', authorize('teacher', 'admin'), courseController.getCourseStatistics);

module.exports = router;