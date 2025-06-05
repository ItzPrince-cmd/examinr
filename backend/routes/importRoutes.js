const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  validateImport,
  previewImport,
  processImport,
  getImportStatus,
  downloadTemplate,
  getImportHistory
} = require('../controllers/importController');

// All import routes require admin access (except template download)
router.use(auth);

// Template download - teachers can also download
router.get('/template/:type', authorize('teacher', 'admin'), downloadTemplate);

// Import operations - admin only
router.post('/validate', authorize('admin'), validateImport);
router.post('/preview', authorize('admin'), previewImport);
router.post('/process', authorize('admin'), processImport);
router.get('/status/:jobId', authorize('admin'), getImportStatus);
router.get('/history', authorize('admin'), getImportHistory);

module.exports = router;