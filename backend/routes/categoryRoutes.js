const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { auth, authorize } = require('../middleware/auth');

// Validation middleware
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('icon').optional().trim(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description too long'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
];

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getCategoryById);
router.get('/:categoryId/courses', paginationValidation, categoryController.getCoursesByCategory);

// Admin routes
router.post('/', auth, authorize('admin', 'superadmin'), categoryValidation, categoryController.createCategory);
router.put('/:categoryId', auth, authorize('admin', 'superadmin'), categoryValidation, categoryController.updateCategory);
router.delete('/:categoryId', auth, authorize('admin', 'superadmin'), categoryController.deleteCategory);

module.exports = router;