const Question = require('../models/Question');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const questionData = {
      ...req.body,
      createdBy: req.userId,
      status: 'draft'
    };

    // Validate question structure based on type
    const validationError = validateQuestionStructure(questionData);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const question = await Question.create(questionData);
    
    await question.populate('subject', 'name');
    await question.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      question,
      message: 'Question created successfully'
    });
  } catch (error) {
    console.error('Create question error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A question with this title already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating question'
    });
  }
};

// Get all questions with filters
const getAllQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      subject,
      difficulty,
      topic,
      search,
      status = 'published',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    // Only show published questions to non-admins/teachers
    if (!['admin', 'superadmin', 'teacher'].includes(req.user?.role)) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (subject) {
      query.subject = subject;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
        { 'metadata.keywords': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const questions = await Question.find(query)
      .populate('subject', 'name')
      .populate('createdBy', 'firstName lastName')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions'
    });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId)
      .populate('subject', 'name')
      .populate('createdBy', 'firstName lastName email')
      .populate('lastEditedBy', 'firstName lastName');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check access
    const hasAccess = question.status === 'published' ||
                     question.createdBy._id.toString() === req.user?._id.toString() ||
                     ['admin', 'superadmin', 'teacher'].includes(req.user?.role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question'
    });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { questionId } = req.params;
    const updates = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check ownership
    if (question.createdBy.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate question structure if type is being changed
    if (updates.type || updates.options) {
      const validationError = validateQuestionStructure({
        ...question.toObject(),
        ...updates
      });
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }
    }

    // Update question
    Object.assign(question, updates);
    question.lastEditedBy = req.userId;
    question.editHistory.push({
      editedBy: req.userId,
      editedAt: Date.now(),
      changes: Object.keys(updates).join(', ')
    });
    
    await question.save();
    await question.populate('subject', 'name');
    await question.populate('createdBy', 'firstName lastName');

    res.json({
      success: true,
      question,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question'
    });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check ownership
    if (question.createdBy.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete
    question.isDeleted = true;
    question.deletedAt = Date.now();
    await question.save();

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question'
    });
  }
};

// Bulk import questions
const bulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    // Process each question
    for (let i = 0; i < questions.length; i++) {
      try {
        const questionData = {
          ...questions[i],
          createdBy: req.userId,
          status: 'draft'
        };

        // Validate question structure
        const validationError = validateQuestionStructure(questionData);
        if (validationError) {
          results.failed.push({
            index: i,
            error: validationError,
            data: questions[i]
          });
          continue;
        }

        const question = await Question.create(questionData);
        results.success.push(question._id);
      } catch (error) {
        results.failed.push({
          index: i,
          error: error.message,
          data: questions[i]
        });
      }
    }

    res.json({
      success: true,
      message: `Imported ${results.success.length} questions successfully`,
      results: {
        successful: results.success.length,
        failed: results.failed.length,
        failures: results.failed
      }
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing questions'
    });
  }
};

// Approve/Reject question (admin/teacher)
const reviewQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { status, feedback } = req.body;

    if (!['published', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "published" or "rejected"'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question.status = status;
    question.reviewedBy = req.userId;
    question.reviewedAt = Date.now();
    
    if (feedback) {
      question.reviewFeedback = feedback;
    }

    await question.save();

    res.json({
      success: true,
      question,
      message: `Question ${status} successfully`
    });
  } catch (error) {
    console.error('Review question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing question'
    });
  }
};

// Get questions by topic
const getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const { limit = 10 } = req.query;

    const questions = await Question.find({
      topic: { $regex: topic, $options: 'i' },
      status: 'published'
    })
      .populate('subject', 'name')
      .limit(parseInt(limit))
      .sort('-performance.averageScore');

    res.json({
      success: true,
      topic,
      questions
    });
  } catch (error) {
    console.error('Get questions by topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions'
    });
  }
};

// Generate practice questions
const generatePracticeQuestions = async (req, res) => {
  try {
    const {
      subject,
      topics,
      difficulty,
      count = 10,
      excludeAttempted = true
    } = req.body;

    const query = {
      status: 'published'
    };

    if (subject) {
      query.subject = subject;
    }

    if (topics && topics.length > 0) {
      query.topic = { $in: topics };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Exclude questions user has already attempted
    if (excludeAttempted && req.userId) {
      const QuizAttempt = require('../models/QuizAttempt');
      const attempts = await QuizAttempt.find({
        user: req.userId
      }).select('answers.question');

      const attemptedQuestions = attempts.flatMap(
        attempt => attempt.answers.map(a => a.question)
      );

      query._id = { $nin: attemptedQuestions };
    }

    // Get random questions
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'subject',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' }
    ]);

    res.json({
      success: true,
      questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Generate practice questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating practice questions'
    });
  }
};

// Get question statistics
const getQuestionStatistics = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check ownership
    if (question.createdBy.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get detailed usage statistics
    const QuizAttempt = require('../models/QuizAttempt');
    const attempts = await QuizAttempt.aggregate([
      { $unwind: '$answers' },
      { $match: { 'answers.question': mongoose.Types.ObjectId(questionId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: { $cond: ['$answers.isCorrect', 1, 0] }
          },
          averageTimeSpent: { $avg: '$answers.timeSpent' },
          optionDistribution: { $push: '$answers.answer' }
        }
      }
    ]);

    const stats = attempts[0] || {
      totalAttempts: 0,
      correctAttempts: 0,
      averageTimeSpent: 0,
      optionDistribution: []
    };

    // Calculate option selection frequency for MCQs
    if (question.type === 'multiple_choice' && stats.optionDistribution.length > 0) {
      const optionFrequency = {};
      stats.optionDistribution.forEach(answer => {
        optionFrequency[answer] = (optionFrequency[answer] || 0) + 1;
      });
      stats.optionFrequency = optionFrequency;
    }

    stats.successRate = stats.totalAttempts > 0 
      ? (stats.correctAttempts / stats.totalAttempts * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      question: {
        id: question._id,
        title: question.title,
        type: question.type,
        difficulty: question.difficulty
      },
      statistics: stats
    });
  } catch (error) {
    console.error('Get question statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question statistics'
    });
  }
};

// Helper function to validate question structure
const validateQuestionStructure = (question) => {
  switch (question.type) {
    case 'multiple_choice':
      if (!question.options || question.options.length < 2) {
        return 'Multiple choice questions must have at least 2 options';
      }
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length === 0) {
        return 'Multiple choice questions must have at least one correct answer';
      }
      break;

    case 'true_false':
      if (!question.options || question.options.length !== 2) {
        return 'True/False questions must have exactly 2 options';
      }
      break;

    case 'fill_blank':
      if (!question.blanks || question.blanks.length === 0) {
        return 'Fill in the blank questions must have at least one blank';
      }
      break;

    case 'matching':
      if (!question.matchingPairs || question.matchingPairs.length < 2) {
        return 'Matching questions must have at least 2 pairs';
      }
      break;

    case 'ordering':
      if (!question.orderItems || question.orderItems.length < 2) {
        return 'Ordering questions must have at least 2 items';
      }
      break;

    case 'code':
      if (!question.codeSettings) {
        return 'Code questions must have code settings';
      }
      break;
  }

  return null;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
  reviewQuestion,
  getQuestionsByTopic,
  generatePracticeQuestions,
  getQuestionStatistics
};