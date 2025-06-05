const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const questionImportService = require('../services/questionImportService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/imports';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|xlsx|xls|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only CSV, Excel, and Word files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for large files
});

// @desc    Validate import file without importing
// @route   POST /api/questions/import/validate
// @access  Private/Admin
exports.validateImport = [upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);

  try {
    const validationReport = await questionImportService.validateFile(
      filePath,
      fileExt,
      {
        previewLimit: req.body.previewLimit || 10
      }
    );

    // Clean up file after validation
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: validationReport.isValid ? 'File is valid for import' : 'File has validation errors',
      validation: validationReport
    });
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error validating file',
      error: error.message
    });
  }
})];

// @desc    Preview import without processing
// @route   POST /api/questions/import/preview
// @access  Private/Admin
exports.previewImport = [upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);

  try {
    const validationReport = await questionImportService.validateFile(
      filePath,
      fileExt,
      {
        previewLimit: parseInt(req.body.limit) || 10
      }
    );

    // Clean up file after preview
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      preview: validationReport.preview,
      totalRows: validationReport.totalRows,
      validRows: validationReport.validRows,
      hasErrors: !validationReport.isValid,
      errorCount: validationReport.errors.length,
      warningCount: validationReport.warnings.length
    });
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error generating preview',
      error: error.message
    });
  }
})];

// @desc    Process import with progress tracking
// @route   POST /api/questions/import/process
// @access  Private/Admin
exports.processImport = [upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);

  try {
    // Start import process
    const jobResult = await questionImportService.processImport(
      filePath,
      fileExt,
      req.user._id,
      {
        duplicateAction: req.body.duplicateAction || 'skip', // skip, update, or create
        skipDuplicateCheck: req.body.skipDuplicateCheck === 'true',
        autoPublish: req.body.autoPublish === 'true'
      }
    );

    // Clean up file after import
    fs.unlinkSync(filePath);

    // Send WebSocket notification if available
    if (req.io) {
      req.io.to(req.user._id.toString()).emit('import:completed', {
        jobId: jobResult.id,
        status: jobResult.status,
        results: {
          success: jobResult.successCount,
          errors: jobResult.errorCount,
          duplicates: jobResult.duplicateCount
        }
      });
    }

    res.json({
      success: true,
      message: 'Import process completed',
      jobId: jobResult.id,
      results: {
        totalProcessed: jobResult.totalRows,
        successfulImports: jobResult.successCount,
        errors: jobResult.errorCount,
        duplicates: jobResult.duplicateCount
      }
    });
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error processing import',
      error: error.message
    });
  }
})];

// @desc    Get import job status
// @route   GET /api/questions/import/status/:jobId
// @access  Private/Admin
exports.getImportStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  
  const jobStatus = questionImportService.getJobStatus(jobId);
  
  if (!jobStatus) {
    return res.status(404).json({
      success: false,
      message: 'Import job not found'
    });
  }

  // Check if user owns this job
  if (jobStatus.userId.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    job: {
      id: jobStatus.id,
      fileName: jobStatus.fileName,
      status: jobStatus.status,
      progress: jobStatus.progress,
      totalRows: jobStatus.totalRows,
      processedRows: jobStatus.processedRows,
      results: {
        success: jobStatus.successCount,
        errors: jobStatus.errorCount,
        duplicates: jobStatus.duplicateCount
      },
      errors: jobStatus.errors.slice(0, 100), // Limit errors returned
      duplicates: jobStatus.duplicates.slice(0, 50), // Limit duplicates returned
      startedAt: jobStatus.startedAt,
      completedAt: jobStatus.completedAt
    }
  });
});

// @desc    Download import template
// @route   GET /api/questions/import/template/:type
// @access  Private/Teacher/Admin
exports.downloadTemplate = asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  let templatePath;
  let fileName;
  
  switch (type) {
    case 'csv':
      templatePath = path.join(__dirname, '..', 'templates', 'question_import_template.csv');
      fileName = 'question_import_template.csv';
      break;
    case 'excel':
      templatePath = path.join(__dirname, '..', 'templates', 'question_import_template.xlsx');
      fileName = 'question_import_template.xlsx';
      break;
    case 'guide':
      templatePath = path.join(__dirname, '..', 'templates', 'question_import_guide.md');
      fileName = 'question_import_guide.md';
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid template type. Use csv, excel, or guide'
      });
  }
  
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({
      success: false,
      message: 'Template file not found'
    });
  }
  
  res.download(templatePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading template:', err);
      res.status(500).json({
        success: false,
        message: 'Error downloading template'
      });
    }
  });
});

// @desc    Get import history
// @route   GET /api/questions/import/history
// @access  Private/Admin
exports.getImportHistory = asyncHandler(async (req, res) => {
  const jobs = [];
  
  // Get all jobs for the user (or all jobs for superadmin)
  for (const [jobId, job] of questionImportService.jobs) {
    if (req.user.role === 'superadmin' || job.userId.toString() === req.user._id.toString()) {
      jobs.push({
        id: job.id,
        fileName: job.fileName,
        status: job.status,
        totalRows: job.totalRows,
        successCount: job.successCount,
        errorCount: job.errorCount,
        duplicateCount: job.duplicateCount,
        startedAt: job.startedAt,
        completedAt: job.completedAt
      });
    }
  }
  
  // Sort by started date (newest first)
  jobs.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  
  res.json({
    success: true,
    history: jobs.slice(0, 50) // Limit to last 50 imports
  });
});

// WebSocket handler for real-time progress updates
exports.setupImportSocketHandlers = (io) => {
  questionImportService.on('progress', (data) => {
    // Send progress update to the user who initiated the import
    if (data.userId) {
      io.to(data.userId.toString()).emit('import:progress', {
        jobId: data.jobId,
        progress: data.progress,
        processedRows: data.processedRows,
        totalRows: data.totalRows,
        status: data.status
      });
    }
  });
};

module.exports = exports;