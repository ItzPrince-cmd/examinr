const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/avatars', 'uploads/materials', 'uploads/temp'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp';
    
    if (file.fieldname === 'avatar') {
      uploadPath = 'uploads/avatars';
    } else if (file.fieldname === 'material' || file.fieldname === 'courseContent') {
      uploadPath = 'uploads/materials';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter functions
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype) && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid document type'));
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mkv|mov|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  const allowedMimeTypes = [
    'video/mp4',
    'video/avi',
    'video/x-msvideo',
    'video/x-matroska',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/webm'
  ];

  if (allowedMimeTypes.includes(file.mimetype) && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid video format'));
  }
};

const courseContentFilter = (req, file, cb) => {
  // Allow images, documents, and videos for course content
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const docTypes = /pdf|doc|docx|ppt|pptx/;
  const videoTypes = /mp4|avi|mkv|mov|webm/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = imageTypes.test(extname);
  const isDoc = docTypes.test(extname);
  const isVideo = videoTypes.test(extname);

  if (isImage || isDoc || isVideo) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type for course content'));
  }
};

// Multer upload configurations
const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: imageFilter
}).single('avatar');

const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: documentFilter
}).single('document');

const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: videoFilter
}).single('video');

const uploadCourseContent = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: courseContentFilter
}).array('materials', 10); // Max 10 files

const uploadQuestionImage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: imageFilter
}).single('questionImage');

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field'
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Middleware to clean up files on error
const cleanupFiles = async (req, res, next) => {
  // Store original json method
  const originalJson = res.json;
  
  // Override json method to cleanup files on error
  res.json = function(data) {
    if (!data.success && req.file) {
      // Delete uploaded file on error
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    if (!data.success && req.files) {
      // Delete multiple uploaded files on error
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  uploadAvatar,
  uploadDocument,
  uploadVideo,
  uploadCourseContent,
  uploadQuestionImage,
  handleMulterError,
  cleanupFiles
};