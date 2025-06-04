const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const batchController = require('../controllers/batchController');

// Validation rules
const createBatchValidation = [
  body('name').notEmpty().withMessage('Batch name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('schedule.startDate').isISO8601().withMessage('Valid start date is required'),
  body('schedule.endDate').isISO8601().withMessage('Valid end date is required'),
  body('schedule.classDays').isArray().withMessage('Class days must be an array'),
  body('schedule.classTime.hour').isInt({ min: 0, max: 23 }).withMessage('Valid hour is required'),
  body('schedule.classTime.minute').isInt({ min: 0, max: 59 }).withMessage('Valid minute is required')
];

const sessionValidation = [
  body('title').notEmpty().withMessage('Session title is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('duration').isInt({ min: 30, max: 180 }).withMessage('Duration must be between 30 and 180 minutes')
];

// Public routes (for browsing)
router.get('/', batchController.getBatches);
router.get('/:batchId', batchController.getBatchById);

// Protected routes
router.use(auth);

// Teacher routes
router.post('/', createBatchValidation, batchController.createBatch);
router.put('/:batchId', batchController.updateBatch);
router.delete('/:batchId', batchController.deleteBatch);
router.get('/teacher/my-batches', batchController.getTeacherBatches);
router.get('/:batchId/students', batchController.getBatchStudents);

// Student routes
router.post('/:batchId/enroll', batchController.enrollInBatch);
router.post('/:batchId/unenroll', batchController.unenrollFromBatch);
router.get('/student/my-batches', batchController.getStudentBatches);

// Live session routes
router.post('/:batchId/sessions', sessionValidation, batchController.addLiveSession);
router.post('/:batchId/sessions/:sessionId/start', batchController.startLiveSession);
router.post('/:batchId/sessions/:sessionId/end', batchController.endLiveSession);

module.exports = router;