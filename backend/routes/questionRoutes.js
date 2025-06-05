const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createQuestion,
  bulkImportQuestions,
  searchQuestions,
  getQuestionsByCategory,
  updateQuestion,
  deleteQuestion,
  getQuestionAnalytics,
  getSearchSuggestions,
  getPopularSearches,
  getCategoryHierarchy,
  saveSearchPreset,
  getSearchPresets,
  getUnusedQuestions
} = require('../controllers/questionController');

// Create single question
router.post('/create', auth, authorize('teacher', 'admin'), createQuestion);

// Bulk import questions from CSV/Excel
router.post('/bulk-import', auth, authorize('admin'), bulkImportQuestions);

// Advanced search with filters - available to all authenticated users
router.get('/search', auth, searchQuestions);

// Search suggestions/autocomplete
router.get('/search/suggestions', auth, getSearchSuggestions);

// Popular search terms
router.get('/search/popular', auth, getPopularSearches);

// Save search preset
router.post('/search/presets', auth, saveSearchPreset);

// Get user's search presets
router.get('/search/presets', auth, getSearchPresets);

// Get unused questions (admin only)
router.get('/search/unused', auth, authorize('admin'), getUnusedQuestions);

// Get category hierarchy
router.get('/categories/hierarchy', auth, getCategoryHierarchy);

// Get questions by category
router.get('/by-category', auth, authorize('teacher', 'admin'), getQuestionsByCategory);

// Update question
router.put('/:id', auth, authorize('teacher', 'admin'), updateQuestion);

// Delete question (soft delete)
router.delete('/:id', auth, authorize('admin'), deleteQuestion);

// Get question performance analytics
router.get('/analytics/:id', auth, authorize('teacher', 'admin'), getQuestionAnalytics);

module.exports = router;