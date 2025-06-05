const Question = require('../models/Question');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const LatexService = require('../services/latexService');
const ImageService = require('../services/imageService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/questions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|xlsx|xls|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only CSV, Excel, and Word files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Create single question
// @route   POST /api/questions/create
// @access  Private/Teacher/Admin
exports.createQuestion = asyncHandler(async (req, res) => {
  const {
    title,
    text,
    type,
    subject,
    chapter,
    topic,
    subtopic,
    difficulty,
    points,
    negativePoints,
    options,
    numerical,
    solution,
    explanation,
    tags,
    specialCategories,
    imageUrls
  } = req.body;

  // Check for duplicate questions
  const duplicates = await Question.findDuplicates(text, subject, chapter, topic);
  if (duplicates.length > 0 && !req.body.forceSave) {
    return res.status(400).json({
      success: false,
      message: 'Potential duplicate questions found',
      duplicates: duplicates
    });
  }

  // Validate LaTeX syntax if present
  if (text) {
    const latexValidation = LatexService.validateLatex(text);
    if (!latexValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LaTeX syntax in question text',
        errors: latexValidation.errors
      });
    }
  }
  
  // Validate image URLs
  if (imageUrls && imageUrls.length > 0) {
    const imageValidation = ImageService.processQuestionImages({ imageUrls });
    if (!imageValidation.allImagesValid) {
      const invalidImages = imageValidation.imageValidations.filter(v => !v.isValid);
      return res.status(400).json({
        success: false,
        message: 'Invalid image URLs found',
        errors: invalidImages
      });
    }
  }

  // Create question
  const question = await Question.create({
    title,
    text,
    type,
    subject,
    chapter,
    topic,
    subtopic,
    difficulty,
    points,
    negativePoints,
    options,
    numerical,
    solution,
    explanation,
    tags,
    specialCategories,
    imageUrls,
    createdBy: req.user._id,
    status: 'draft'
  });

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: question
  });
});

// @desc    Bulk import questions from CSV/Excel
// @route   POST /api/questions/bulk-import
// @access  Private/Admin
exports.bulkImportQuestions = [upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  let questions = [];
  let errors = [];

  try {
    if (fileExt === '.csv') {
      questions = await parseCSV(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      questions = await parseExcel(filePath);
    } else if (fileExt === '.docx') {
      // TODO: Implement Word document parsing
      return res.status(400).json({
        success: false,
        message: 'Word document parsing not yet implemented'
      });
    }

    // Validate and save questions
    const savedQuestions = [];
    const duplicateQuestions = [];
    
    for (let i = 0; i < questions.length; i++) {
      try {
        const questionData = questions[i];
        
        // Check for duplicates
        const duplicates = await Question.findDuplicates(
          questionData.text,
          questionData.subject,
          questionData.chapter,
          questionData.topic
        );
        
        if (duplicates.length > 0 && !req.body.skipDuplicates) {
          duplicateQuestions.push({
            row: i + 2,
            question: questionData,
            duplicates: duplicates
          });
          continue;
        }

        // Validate LaTeX
        if (questionData.text) {
          const latexValidation = LatexService.validateLatex(questionData.text);
          if (!latexValidation.isValid) {
            throw new Error(`LaTeX errors: ${latexValidation.errors.join(', ')}`);
          }
        }

        // Create question
        const question = await Question.create({
          ...questionData,
          createdBy: req.user._id,
          status: 'draft'
        });
        
        savedQuestions.push(question);
      } catch (error) {
        errors.push({
          row: i + 2,
          error: error.message,
          data: questions[i]
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Import completed. ${savedQuestions.length} questions imported successfully.`,
      data: {
        totalProcessed: questions.length,
        successfulImports: savedQuestions.length,
        duplicates: duplicateQuestions.length,
        errors: errors.length,
        savedQuestions: savedQuestions,
        duplicateQuestions: duplicateQuestions,
        errors: errors
      }
    });
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error processing file',
      error: error.message
    });
  }
})];

// @desc    Advanced search with filters
// @route   GET /api/questions/search
// @access  Private/Teacher/Admin/Student
exports.searchQuestions = asyncHandler(async (req, res) => {
  const {
    query,
    subject,
    chapter,
    topic,
    subtopic,
    difficulty,
    type,
    status,
    tags,
    isPYQ,
    pyqYear,
    pyqExam,
    bookReference,
    dateFrom,
    dateTo,
    minDifficulty,
    maxDifficulty,
    minSuccessRate,
    maxSuccessRate,
    operator = 'AND', // AND or OR logic for filters
    cursor, // For cursor-based pagination
    page = 1,
    limit = 20,
    sortBy = 'relevance', // relevance, -createdAt, difficulty, -analytics.timesUsed, etc.
    includeStats = false
  } = req.query;

  // Check cache first
  if (req.app.locals.redis) {
    const cachedResults = await req.app.locals.redis.getCachedSearchResults(req.query);
    if (cachedResults) {
      return res.json(cachedResults);
    }
  }

  // Track search analytics
  const SearchAnalytics = require('../models/SearchAnalytics');
  if (query) {
    await SearchAnalytics.trackSearch({
      userId: req.user._id,
      searchTerm: query,
      filters: req.query,
      userRole: req.user.role
    });
  }

  // Build search query
  let searchQuery = {};
  let searchFilters = [];

  // Text search with score
  let textSearchScore = null;
  if (query) {
    searchQuery.$text = { $search: query };
    textSearchScore = { $meta: "textScore" };
  }

  // Build filter conditions
  if (subject && subject !== 'all') searchFilters.push({ subject });
  if (chapter && chapter !== 'all') searchFilters.push({ chapter });
  if (topic && topic !== 'all') searchFilters.push({ topic });
  if (subtopic && subtopic !== 'all') searchFilters.push({ subtopic });
  
  // Difficulty range or exact match
  if (minDifficulty || maxDifficulty) {
    const difficultyMap = { easy: 1, medium: 2, hard: 3, expert: 4 };
    const difficultyFilter = {};
    if (minDifficulty) difficultyFilter.$gte = difficultyMap[minDifficulty];
    if (maxDifficulty) difficultyFilter.$lte = difficultyMap[maxDifficulty];
    searchFilters.push({ difficultyNumeric: difficultyFilter });
  } else if (difficulty && difficulty !== 'all') {
    if (Array.isArray(difficulty)) {
      searchFilters.push({ difficulty: { $in: difficulty } });
    } else if (difficulty.includes(',')) {
      searchFilters.push({ difficulty: { $in: difficulty.split(',') } });
    } else {
      searchFilters.push({ difficulty });
    }
  }

  // Question type filter
  if (type && type !== 'all') {
    const typeArray = Array.isArray(type) ? type : type.split(',');
    searchFilters.push({ type: { $in: typeArray } });
  }

  // Tags filter with regex for partial matches
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');
    searchFilters.push({
      tags: {
        $in: tagArray.map(tag => new RegExp(tag, 'i'))
      }
    });
  }

  // Special categories
  if (isPYQ === 'true') searchFilters.push({ 'specialCategories.isPYQ': true });
  if (pyqYear) {
    if (pyqYear.includes('-')) {
      const [startYear, endYear] = pyqYear.split('-');
      searchFilters.push({
        'specialCategories.pyqYear': {
          $gte: parseInt(startYear),
          $lte: parseInt(endYear)
        }
      });
    } else {
      searchFilters.push({ 'specialCategories.pyqYear': parseInt(pyqYear) });
    }
  }
  if (pyqExam) searchFilters.push({ 'specialCategories.pyqExam': new RegExp(pyqExam, 'i') });
  if (bookReference) searchFilters.push({ 'specialCategories.bookReference.name': new RegExp(bookReference, 'i') });

  // Date range filter
  if (dateFrom || dateTo) {
    const dateFilter = {};
    if (dateFrom) dateFilter.$gte = new Date(dateFrom);
    if (dateTo) dateFilter.$lte = new Date(dateTo);
    searchFilters.push({ createdAt: dateFilter });
  }

  // Performance filters
  if (minSuccessRate || maxSuccessRate) {
    const successRateFilter = {};
    if (minSuccessRate) successRateFilter.$gte = parseFloat(minSuccessRate);
    if (maxSuccessRate) successRateFilter.$lte = parseFloat(maxSuccessRate);
    searchFilters.push({ 'analytics.successRate': successRateFilter });
  }

  // Add status filter based on user role and request
  if (status && status !== 'all') {
    searchFilters.push({ status });
  } else if (req.user.role === 'student') {
    searchFilters.push({ status: 'published' });
  } else if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    searchFilters.push({
      $or: [
        { status: 'published' },
        { createdBy: req.user._id }
      ]
    });
  }

  // Apply filters with AND/OR logic
  if (searchFilters.length > 0) {
    if (operator === 'OR') {
      searchQuery.$or = searchFilters;
    } else {
      searchQuery.$and = searchFilters;
    }
  }

  // Cursor-based pagination setup
  if (cursor) {
    const decodedCursor = JSON.parse(Buffer.from(cursor, 'base64').toString());
    if (sortBy === '-createdAt') {
      searchQuery.createdAt = { $lt: new Date(decodedCursor.createdAt) };
    } else if (sortBy === 'relevance' && textSearchScore) {
      // For text search relevance, we'll use traditional pagination
    }
  }

  // Build sort options
  let sortOptions = {};
  switch (sortBy) {
    case 'relevance':
      if (textSearchScore) {
        sortOptions = { score: textSearchScore };
      } else {
        sortOptions = { 'analytics.successRate': -1 };
      }
      break;
    case 'difficulty':
      sortOptions = { difficultyNumeric: 1 };
      break;
    case '-difficulty':
      sortOptions = { difficultyNumeric: -1 };
      break;
    case 'usage':
      sortOptions = { 'statistics.timesUsed': -1 };
      break;
    case 'successRate':
      sortOptions = { 'analytics.successRate': -1 };
      break;
    case 'recent':
      sortOptions = { createdAt: -1 };
      break;
    default:
      sortOptions = sortBy;
  }

  // Pagination
  const skip = cursor ? 0 : (page - 1) * limit;
  const queryLimit = parseInt(limit);

  // Build aggregation pipeline for advanced features
  const pipeline = [];

  // Match stage
  if (Object.keys(searchQuery).length > 0) {
    pipeline.push({ $match: searchQuery });
  }

  // Add text score if searching
  if (textSearchScore) {
    pipeline.push({
      $addFields: {
        score: textSearchScore
      }
    });
  }

  // Add difficulty numeric for sorting
  pipeline.push({
    $addFields: {
      difficultyNumeric: {
        $switch: {
          branches: [
            { case: { $eq: ['$difficulty', 'easy'] }, then: 1 },
            { case: { $eq: ['$difficulty', 'medium'] }, then: 2 },
            { case: { $eq: ['$difficulty', 'hard'] }, then: 3 },
            { case: { $eq: ['$difficulty', 'expert'] }, then: 4 }
          ],
          default: 2
        }
      }
    }
  });

  // Sort
  pipeline.push({ $sort: sortOptions });

  // Skip and limit
  if (skip > 0) pipeline.push({ $skip: skip });
  pipeline.push({ $limit: queryLimit + 1 }); // Get one extra for next cursor

  // Project fields
  pipeline.push({
    $project: {
      __v: 0,
      previousVersions: 0
    }
  });

  // Execute aggregation
  const questions = await Question.aggregate(pipeline);

  // Determine if there are more results
  const hasMore = questions.length > queryLimit;
  if (hasMore) {
    questions.pop(); // Remove the extra document
  }

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && questions.length > 0) {
    const lastQuestion = questions[questions.length - 1];
    nextCursor = Buffer.from(JSON.stringify({
      _id: lastQuestion._id,
      createdAt: lastQuestion.createdAt,
      score: lastQuestion.score
    })).toString('base64');
  }

  // Get total count (for traditional pagination)
  const totalCount = await Question.countDocuments(searchQuery);

  // Get aggregated stats if requested
  let stats = null;
  if (includeStats === 'true') {
    const statsAgg = await Question.aggregate([
      { $match: searchQuery },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          byDifficulty: {
            $push: '$difficulty'
          },
          byType: {
            $push: '$type'
          },
          avgSuccessRate: { $avg: '$analytics.successRate' },
          totalAttempts: { $sum: '$analytics.totalAttempts' }
        }
      },
      {
        $project: {
          totalQuestions: 1,
          avgSuccessRate: 1,
          totalAttempts: 1,
          difficultyDistribution: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ['$byDifficulty'] },
                as: 'diff',
                in: {
                  k: '$$diff',
                  v: {
                    $size: {
                      $filter: {
                        input: '$byDifficulty',
                        cond: { $eq: ['$$this', '$$diff'] }
                      }
                    }
                  }
                }
              }
            }
          },
          typeDistribution: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ['$byType'] },
                as: 'type',
                in: {
                  k: '$$type',
                  v: {
                    $size: {
                      $filter: {
                        input: '$byType',
                        cond: { $eq: ['$$this', '$$type'] }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);
    stats = statsAgg[0] || {};
  }

  // Build response
  const response = {
    success: true,
    data: questions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / queryLimit),
      totalItems: totalCount,
      itemsPerPage: queryLimit,
      hasMore,
      nextCursor
    }
  };

  if (stats) {
    response.stats = stats;
  }

  // Cache search results
  if (req.app.locals.redis) {
    await req.app.locals.redis.cacheSearchResults(req.query, response);
  }

  res.json(response);
});

// @desc    Get questions by category
// @route   GET /api/questions/by-category
// @access  Private/Teacher/Admin
exports.getQuestionsByCategory = asyncHandler(async (req, res) => {
  const { subject, chapter, topic, page = 1, limit = 20 } = req.query;

  if (!subject) {
    return res.status(400).json({
      success: false,
      message: 'Subject is required'
    });
  }

  const query = { subject };
  if (chapter) query.chapter = chapter;
  if (topic) query.topic = topic;

  // Add status filter for non-admins
  if (req.user.role !== 'admin') {
    query.status = 'published';
  }

  const skip = (page - 1) * limit;

  const questions = await Question.find(query)
    .sort('-analytics.successRate')
    .limit(limit * 1)
    .skip(skip)
    .select('title text type difficulty points analytics');

  const totalCount = await Question.countDocuments(query);

  // Get category statistics
  const stats = await Question.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        avgDifficulty: { $avg: { $cond: [
          { $eq: ['$difficulty', 'easy'] }, 1,
          { $cond: [
            { $eq: ['$difficulty', 'medium'] }, 2,
            { $cond: [
              { $eq: ['$difficulty', 'hard'] }, 3,
              4
            ]}
          ]}
        ]}},
        avgSuccessRate: { $avg: '$analytics.successRate' },
        totalAttempts: { $sum: '$analytics.totalAttempts' }
      }
    }
  ]);

  res.json({
    success: true,
    data: questions,
    stats: stats[0] || {},
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: limit
    }
  });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Teacher/Admin
exports.updateQuestion = asyncHandler(async (req, res) => {
  let question = await Question.findById(req.params.id);
  
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Check permission
  if (req.user.role !== 'admin' && question.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this question'
    });
  }

  // Validate LaTeX if text is being updated
  if (req.body.text && req.body.text.includes('$')) {
    try {
      validateLatexSyntax(req.body.text);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LaTeX syntax',
        error: error.message
      });
    }
  }

  // Track version history
  if (!question.previousVersions) {
    question.previousVersions = [];
  }
  
  question.previousVersions.push({
    version: question.version || 1,
    modifiedAt: new Date(),
    modifiedBy: req.user._id,
    changes: JSON.stringify(req.body)
  });

  // Update question
  question = await Question.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      lastModifiedBy: req.user._id,
      version: (question.version || 1) + 1
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: question
  });
});

// @desc    Delete question (soft delete)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Soft delete by setting status to archived
  question.status = 'archived';
  await question.save();

  res.json({
    success: true,
    message: 'Question archived successfully'
  });
});

// @desc    Get question performance analytics
// @route   GET /api/questions/analytics/:id
// @access  Private/Teacher/Admin
exports.getQuestionAnalytics = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id)
    .select('title text type difficulty analytics statistics performanceData');
  
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Get detailed attempt data
  const QuizAttempt = require('../models/QuizAttempt');
  const attempts = await QuizAttempt.aggregate([
    {
      $match: {
        'answers.question': question._id
      }
    },
    {
      $unwind: '$answers'
    },
    {
      $match: {
        'answers.question': question._id
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        totalAttempts: { $sum: 1 },
        correctAttempts: {
          $sum: { $cond: ['$answers.isCorrect', 1, 0] }
        },
        avgTimeSpent: { $avg: '$answers.timeSpent' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      question: question,
      monthlyTrends: attempts,
      overallStats: {
        totalAttempts: question.analytics.totalAttempts,
        successRate: question.analytics.successRate,
        averageTimeToSolve: question.analytics.averageTimeToSolve,
        discriminationIndex: question.performanceData.discriminationIndex
      }
    }
  });
});

// @desc    Get search suggestions/autocomplete
// @route   GET /api/questions/search/suggestions
// @access  Private
exports.getSearchSuggestions = asyncHandler(async (req, res) => {
  const { query, field = 'all' } = req.query;

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      suggestions: []
    });
  }

  let suggestions = [];
  
  // Build regex for partial matching
  const regex = new RegExp(query, 'i');

  switch (field) {
    case 'tags':
      // Get unique tags
      const tagResults = await Question.distinct('tags', {
        tags: regex,
        status: 'published'
      });
      suggestions = tagResults.slice(0, 10);
      break;
      
    case 'chapter':
      // Get unique chapters for subject
      const chapterResults = await Question.distinct('chapter', {
        chapter: regex,
        subject: req.query.subject,
        status: 'published'
      });
      suggestions = chapterResults.slice(0, 10);
      break;
      
    case 'topic':
      // Get unique topics for subject and chapter
      const topicQuery = {
        topic: regex,
        status: 'published'
      };
      if (req.query.subject) topicQuery.subject = req.query.subject;
      if (req.query.chapter) topicQuery.chapter = req.query.chapter;
      
      const topicResults = await Question.distinct('topic', topicQuery);
      suggestions = topicResults.slice(0, 10);
      break;
      
    case 'all':
    default:
      // Search across multiple fields
      const [tags, chapters, topics] = await Promise.all([
        Question.distinct('tags', { tags: regex, status: 'published' }).limit(5),
        Question.distinct('chapter', { chapter: regex, status: 'published' }).limit(5),
        Question.distinct('topic', { topic: regex, status: 'published' }).limit(5)
      ]);
      
      suggestions = [
        ...tags.map(t => ({ type: 'tag', value: t })),
        ...chapters.map(c => ({ type: 'chapter', value: c })),
        ...topics.map(t => ({ type: 'topic', value: t }))
      ];
  }

  // Track popular searches
  if (suggestions.length > 0) {
    const SearchAnalytics = require('../models/SearchAnalytics');
    await SearchAnalytics.trackAutocomplete(query, field, suggestions.length);
  }

  res.json({
    success: true,
    suggestions
  });
});

// @desc    Get popular search terms
// @route   GET /api/questions/search/popular
// @access  Private
exports.getPopularSearches = asyncHandler(async (req, res) => {
  const { timeframe = '7d', limit = 10 } = req.query;
  
  // Calculate date range
  const dateMap = {
    '24h': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90
  };
  
  const daysAgo = dateMap[timeframe] || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  const SearchAnalytics = require('../models/SearchAnalytics');
  const popularSearches = await SearchAnalytics.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        resultCount: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: '$searchTerm',
        count: { $sum: 1 },
        avgResultCount: { $avg: '$resultCount' },
        lastSearched: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  res.json({
    success: true,
    timeframe,
    searches: popularSearches
  });
});

// @desc    Get hierarchical category data
// @route   GET /api/questions/categories/hierarchy
// @access  Private
exports.getCategoryHierarchy = asyncHandler(async (req, res) => {
  const { subject } = req.query;

  const pipeline = [
    {
      $match: {
        status: 'published',
        ...(subject && { subject })
      }
    },
    {
      $group: {
        _id: {
          subject: '$subject',
          chapter: '$chapter',
          topic: '$topic'
        },
        count: { $sum: 1 },
        avgDifficulty: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$difficulty', 'easy'] }, then: 1 },
                { case: { $eq: ['$difficulty', 'medium'] }, then: 2 },
                { case: { $eq: ['$difficulty', 'hard'] }, then: 3 },
                { case: { $eq: ['$difficulty', 'expert'] }, then: 4 }
              ],
              default: 2
            }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          subject: '$_id.subject',
          chapter: '$_id.chapter'
        },
        topics: {
          $push: {
            name: '$_id.topic',
            count: '$count',
            avgDifficulty: '$avgDifficulty'
          }
        },
        chapterCount: { $sum: '$count' }
      }
    },
    {
      $group: {
        _id: '$_id.subject',
        chapters: {
          $push: {
            name: '$_id.chapter',
            count: '$chapterCount',
            topics: '$topics'
          }
        },
        subjectCount: { $sum: '$chapterCount' }
      }
    },
    {
      $project: {
        subject: '$_id',
        count: '$subjectCount',
        chapters: 1,
        _id: 0
      }
    },
    {
      $sort: { subject: 1 }
    }
  ];

  const hierarchy = await Question.aggregate(pipeline);

  res.json({
    success: true,
    hierarchy
  });
});

// @desc    Save search filter preset
// @route   POST /api/questions/search/presets
// @access  Private
exports.saveSearchPreset = asyncHandler(async (req, res) => {
  const { name, filters, isDefault = false } = req.body;

  const User = require('../models/User');
  const user = await User.findById(req.user._id);

  if (!user.searchPresets) {
    user.searchPresets = [];
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    user.searchPresets.forEach(preset => {
      preset.isDefault = false;
    });
  }

  user.searchPresets.push({
    name,
    filters,
    isDefault,
    createdAt: new Date()
  });

  await user.save();

  res.json({
    success: true,
    message: 'Search preset saved successfully',
    presets: user.searchPresets
  });
});

// @desc    Get user's search presets
// @route   GET /api/questions/search/presets
// @access  Private
exports.getSearchPresets = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.user._id).select('searchPresets');

  res.json({
    success: true,
    presets: user.searchPresets || []
  });
});

// @desc    Get questions with no search hits
// @route   GET /api/questions/search/unused
// @access  Private/Admin
exports.getUnusedQuestions = asyncHandler(async (req, res) => {
  const { days = 30, page = 1, limit = 20 } = req.query;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

  const skip = (page - 1) * limit;

  // Find questions not used in any quiz attempts recently
  const unusedQuestions = await Question.aggregate([
    {
      $lookup: {
        from: 'quizattempts',
        let: { questionId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$questionId', '$answers.question'] },
                  { $gte: ['$createdAt', cutoffDate] }
                ]
              }
            }
          },
          { $limit: 1 }
        ],
        as: 'recentAttempts'
      }
    },
    {
      $match: {
        recentAttempts: { $size: 0 },
        status: 'published'
      }
    },
    {
      $project: {
        title: 1,
        text: 1,
        subject: 1,
        chapter: 1,
        topic: 1,
        difficulty: 1,
        createdAt: 1,
        'analytics.totalAttempts': 1
      }
    },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  const totalCount = await Question.countDocuments({
    'analytics.lastUsedAt': { $lt: cutoffDate },
    status: 'published'
  });

  res.json({
    success: true,
    data: unusedQuestions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: parseInt(limit)
    }
  });
});

// Helper Functions

// Validate LaTeX syntax (now using LatexService)
function validateLatexSyntax(text) {
  const validation = LatexService.validateLatex(text);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }
}

// Parse CSV file
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const questions = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV columns to question schema
        const question = {
          title: row.Title || row.Question.substring(0, 50) + '...',
          text: row.Question,
          type: mapQuestionType(row.QuestionType),
          subject: row.Subject.toLowerCase(),
          chapter: row.Chapter,
          topic: row.Topic,
          subtopic: row.Subtopic || '',
          difficulty: row.Difficulty.toLowerCase(),
          points: parseInt(row.Points) || 1,
          negativePoints: parseFloat(row.NegativePoints) || 0,
          tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [],
          specialCategories: {}
        };
        
        // Handle different question types
        if (question.type === 'multiple_choice' || question.type === 'multiple_correct') {
          question.options = [];
          const optionColumns = ['OptionA', 'OptionB', 'OptionC', 'OptionD'];
          const correctAnswers = row.CorrectAnswer.split(',').map(a => a.trim());
          
          optionColumns.forEach((col, index) => {
            if (row[col]) {
              question.options.push({
                id: uuidv4(),
                text: row[col],
                isCorrect: correctAnswers.includes(String.fromCharCode(65 + index))
              });
            }
          });
        } else if (question.type === 'numerical') {
          question.numerical = {
            correctAnswer: parseFloat(row.CorrectAnswer),
            tolerance: parseFloat(row.Tolerance) || 0,
            unit: row.Unit || ''
          };
        }
        
        // Add solution
        if (row.Solution) {
          question.solution = {
            detailed: {
              text: row.Solution
            }
          };
        }
        
        // Handle special categories
        if (row.IsPYQ === 'Yes' || row.IsPYQ === 'true') {
          question.specialCategories.isPYQ = true;
          question.specialCategories.pyqYear = row.PYQYear;
          question.specialCategories.pyqExam = row.PYQExam;
        }
        
        if (row.BookReference) {
          question.specialCategories.bookReference = {
            name: row.BookReference
          };
        }
        
        // Add image URLs
        if (row.ImageURL) {
          question.imageUrls = [{
            url: row.ImageURL,
            caption: row.ImageCaption || '',
            position: 'question'
          }];
        }
        
        questions.push(question);
      })
      .on('end', () => resolve(questions))
      .on('error', reject);
  });
}

// Parse Excel file
async function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const questions = [];
  
  // Process each sheet (assume each sheet is a subject)
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    data.forEach(row => {
      // Similar mapping as CSV
      const question = {
        title: row.Title || row.Question.substring(0, 50) + '...',
        text: row.Question,
        type: mapQuestionType(row.QuestionType),
        subject: row.Subject ? row.Subject.toLowerCase() : sheetName.toLowerCase(),
        chapter: row.Chapter,
        topic: row.Topic,
        subtopic: row.Subtopic || '',
        difficulty: row.Difficulty.toLowerCase(),
        points: parseInt(row.Points) || 1,
        negativePoints: parseFloat(row.NegativePoints) || 0,
        tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [],
        specialCategories: {}
      };
      
      // Handle different question types (similar to CSV parsing)
      if (question.type === 'multiple_choice' || question.type === 'multiple_correct') {
        question.options = [];
        const optionColumns = ['OptionA', 'OptionB', 'OptionC', 'OptionD'];
        const correctAnswers = row.CorrectAnswer.split(',').map(a => a.trim());
        
        optionColumns.forEach((col, index) => {
          if (row[col]) {
            question.options.push({
              id: uuidv4(),
              text: row[col],
              isCorrect: correctAnswers.includes(String.fromCharCode(65 + index))
            });
          }
        });
      }
      
      questions.push(question);
    });
  }
  
  return questions;
}

// Map question type from import file to schema
function mapQuestionType(type) {
  const typeMap = {
    'MCQ': 'multiple_choice',
    'Multiple Choice': 'multiple_choice',
    'Multiple Correct': 'multiple_correct',
    'True/False': 'true_false',
    'Numerical': 'numerical',
    'Essay': 'essay',
    'Short Answer': 'short_answer',
    'Fill in the Blank': 'fill_blank',
    'Matching': 'matching',
    'Matrix Match': 'matrix_match'
  };
  
  return typeMap[type] || 'multiple_choice';
}

// Export functions
module.exports = {
  createQuestion: exports.createQuestion,
  bulkImportQuestions: exports.bulkImportQuestions,
  searchQuestions: exports.searchQuestions,
  getQuestionsByCategory: exports.getQuestionsByCategory,
  updateQuestion: exports.updateQuestion,
  deleteQuestion: exports.deleteQuestion,
  getQuestionAnalytics: exports.getQuestionAnalytics,
  getSearchSuggestions: exports.getSearchSuggestions,
  getPopularSearches: exports.getPopularSearches,
  getCategoryHierarchy: exports.getCategoryHierarchy,
  saveSearchPreset: exports.saveSearchPreset,
  getSearchPresets: exports.getSearchPresets,
  getUnusedQuestions: exports.getUnusedQuestions
};