const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const quizData = {
      ...req.body,
      createdBy: req.userId,
      status: 'draft'
    };

    // Validate question IDs
    if (quizData.questions && quizData.questions.length > 0) {
      const questionIds = quizData.questions.map(q => q.question);
      const validQuestions = await Question.find({
        _id: { $in: questionIds },
        status: 'published'
      }).select('_id points');

      if (validQuestions.length !== questionIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some questions are invalid or not published'
        });
      }

      // Calculate total points
      quizData.scoring.totalPoints = quizData.questions.reduce(
        (sum, q) => sum + (q.points || 10), 0
      );
    }

    const quiz = await Quiz.create(quizData);
    
    await quiz.populate('category', 'name icon');
    await quiz.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      quiz,
      message: 'Quiz created successfully'
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quiz'
    });
  }
};

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      difficulty,
      search,
      status = 'active',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    // Only show active quizzes to students
    if (!['admin', 'superadmin', 'teacher'].includes(req.user?.role)) {
      query.status = 'active';
      query.$or = [
        { 'availability.startDate': { $lte: new Date() } },
        { 'availability.startDate': { $exists: false } }
      ];
      query.$and = [
        { $or: [
          { 'availability.endDate': { $gte: new Date() } },
          { 'availability.endDate': { $exists: false } }
        ]}
      ];
    } else if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const quizzes = await Quiz.find(query)
      .populate('category', 'name icon')
      .populate('createdBy', 'firstName lastName')
      .select('-questions') // Don't send questions in list view
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    // Get user's attempt count for each quiz
    if (req.user) {
      const quizIds = quizzes.map(q => q._id);
      const attempts = await QuizAttempt.aggregate([
        {
          $match: {
            quiz: { $in: quizIds },
            user: mongoose.Types.ObjectId(req.userId)
          }
        },
        {
          $group: {
            _id: '$quiz',
            attemptCount: { $sum: 1 },
            bestScore: { $max: '$score.percentage' }
          }
        }
      ]);

      // Add attempt info to quizzes
      const attemptMap = {};
      attempts.forEach(a => {
        attemptMap[a._id.toString()] = {
          attemptCount: a.attemptCount,
          bestScore: a.bestScore
        };
      });

      quizzes.forEach(quiz => {
        quiz._doc.userAttempts = attemptMap[quiz._id.toString()] || {
          attemptCount: 0,
          bestScore: null
        };
      });
    }

    res.json({
      success: true,
      quizzes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes'
    });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
      .populate('category', 'name icon')
      .populate('createdBy', 'firstName lastName email')
      .populate({
        path: 'questions.question',
        select: '-performance -editHistory' // Don't send sensitive data
      });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if quiz is available
    const now = new Date();
    const isAvailable = quiz.status === 'active' &&
      (!quiz.availability.startDate || quiz.availability.startDate <= now) &&
      (!quiz.availability.endDate || quiz.availability.endDate >= now);

    if (!isAvailable && !['admin', 'superadmin', 'teacher'].includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not available'
      });
    }

    // Get user's attempts
    let userAttempts = null;
    if (req.user) {
      userAttempts = await QuizAttempt.find({
        quiz: quizId,
        user: req.userId
      })
        .select('attemptNumber status startedAt submittedAt score')
        .sort('-startedAt');
    }

    // Remove correct answers if quiz settings don't allow showing them
    if (!quiz.questionSettings.showCorrectAnswers && req.user?.role === 'student') {
      quiz.questions.forEach(q => {
        if (q.question.type === 'multiple_choice' || q.question.type === 'true_false') {
          q.question.options.forEach(opt => {
            delete opt.isCorrect;
          });
        }
      });
    }

    res.json({
      success: true,
      quiz,
      userAttempts,
      canAttempt: checkCanAttempt(quiz, userAttempts)
    });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz'
    });
  }
};

// Start quiz attempt
const startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;

    const quiz = await Quiz.findById(quizId)
      .populate('questions.question');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if quiz is available
    const now = new Date();
    if (quiz.status !== 'active' ||
        (quiz.availability.startDate && quiz.availability.startDate > now) ||
        (quiz.availability.endDate && quiz.availability.endDate < now)) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not available'
      });
    }

    // Check previous attempts
    const previousAttempts = await QuizAttempt.find({
      quiz: quizId,
      user: userId
    }).sort('-attemptNumber');

    // Check if can attempt
    if (previousAttempts.length >= quiz.attempts.maxAttempts) {
      return res.status(403).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    // Check cooldown period
    if (previousAttempts.length > 0 && quiz.attempts.cooldownPeriod > 0) {
      const lastAttempt = previousAttempts[0];
      const cooldownEnd = new Date(lastAttempt.submittedAt);
      cooldownEnd.setHours(cooldownEnd.getHours() + quiz.attempts.cooldownPeriod);
      
      if (cooldownEnd > now) {
        return res.status(403).json({
          success: false,
          message: `Please wait until ${cooldownEnd.toISOString()} before attempting again`
        });
      }
    }

    // Check for ongoing attempt
    const ongoingAttempt = await QuizAttempt.findOne({
      quiz: quizId,
      user: userId,
      status: 'in_progress'
    });

    if (ongoingAttempt) {
      // Resume ongoing attempt
      return res.json({
        success: true,
        attempt: ongoingAttempt,
        message: 'Resuming ongoing attempt'
      });
    }

    // Prepare questions based on settings
    let attemptQuestions = quiz.questions;
    
    // Randomize questions if enabled
    if (quiz.questionSettings.randomizeQuestions) {
      attemptQuestions = shuffleArray([...quiz.questions]);
    }

    // Select from question pool if enabled
    if (quiz.questionSettings.questionPool.enabled) {
      const poolSize = Math.min(
        quiz.questionSettings.questionPool.selectCount,
        attemptQuestions.length
      );
      attemptQuestions = attemptQuestions.slice(0, poolSize);
    }

    // Create new attempt
    const attempt = await QuizAttempt.create({
      quiz: quizId,
      user: userId,
      attemptNumber: previousAttempts.length + 1,
      status: 'in_progress',
      startedAt: new Date(),
      questions: attemptQuestions.map(q => ({
        question: q.question._id,
        order: q.order,
        points: q.points
      })),
      answers: []
    });

    // Prepare questions for response (remove correct answers)
    const responseQuestions = attemptQuestions.map(q => {
      const question = q.question.toObject();
      
      // Remove correct answer indicators
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        question.options = question.options.map(opt => ({
          id: opt.id,
          text: opt.text
        }));
      }
      
      // Randomize options if enabled
      if (quiz.questionSettings.randomizeOptions && 
          (question.type === 'multiple_choice' || question.type === 'true_false')) {
        question.options = shuffleArray(question.options);
      }
      
      return {
        ...q,
        question
      };
    });

    res.json({
      success: true,
      attempt: {
        _id: attempt._id,
        attemptNumber: attempt.attemptNumber,
        startedAt: attempt.startedAt,
        questions: responseQuestions,
        settings: {
          duration: quiz.timing.duration,
          showTimer: quiz.timing.showTimer,
          allowNavigation: quiz.questionSettings.allowNavigation,
          allowReview: quiz.questionSettings.allowReview
        }
      },
      message: 'Quiz attempt started successfully'
    });
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting quiz attempt'
    });
  }
};

// Submit answer
const submitAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: req.userId,
      status: 'in_progress'
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Active attempt not found'
      });
    }

    // Check if question is part of this attempt
    const questionExists = attempt.questions.some(
      q => q.question.toString() === questionId
    );

    if (!questionExists) {
      return res.status(400).json({
        success: false,
        message: 'Question not part of this attempt'
      });
    }

    // Check if already answered (update if allowed)
    const existingAnswerIndex = attempt.answers.findIndex(
      a => a.question.toString() === questionId
    );

    const answerData = {
      question: questionId,
      answer,
      timeSpent: timeSpent || 0,
      answeredAt: new Date()
    };

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      attempt.answers[existingAnswerIndex] = answerData;
    } else {
      // Add new answer
      attempt.answers.push(answerData);
    }

    // Update navigation data
    attempt.navigation.questionsViewed = attempt.navigation.questionsViewed || [];
    if (!attempt.navigation.questionsViewed.includes(questionId)) {
      attempt.navigation.questionsViewed.push(questionId);
    }

    await attempt.save();

    res.json({
      success: true,
      message: 'Answer saved successfully',
      progress: {
        answered: attempt.answers.length,
        total: attempt.questions.length
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving answer'
    });
  }
};

// Submit quiz attempt
const submitQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeSpent } = req.body;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: req.userId,
      status: 'in_progress'
    }).populate('quiz');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Active attempt not found'
      });
    }

    // Save all answers if provided
    if (answers && Array.isArray(answers)) {
      for (const ans of answers) {
        const existingIndex = attempt.answers.findIndex(
          a => a.question.toString() === ans.questionId
        );
        
        const answerData = {
          question: ans.questionId,
          answer: ans.answer,
          timeSpent: ans.timeSpent || 0,
          answeredAt: new Date()
        };

        if (existingIndex >= 0) {
          attempt.answers[existingIndex] = answerData;
        } else {
          attempt.answers.push(answerData);
        }
      }
    }

    // Calculate score
    const scoringResult = await calculateScore(attempt);
    
    // Update attempt
    attempt.status = 'completed';
    attempt.submittedAt = new Date();
    attempt.timeSpent = timeSpent || 
      Math.floor((attempt.submittedAt - attempt.startedAt) / 1000);
    attempt.score = scoringResult.score;
    attempt.performance = scoringResult.performance;
    attempt.result = {
      passed: scoringResult.score.percentage >= attempt.quiz.scoring.passingScore,
      rank: null // Will be calculated later
    };

    // Add correct answer info to answers
    attempt.answers = scoringResult.detailedAnswers;

    await attempt.save();

    // Update question performance analytics
    await updateQuestionPerformance(attempt);

    // Update user progress
    await updateUserProgress(req.userId, attempt);

    // Send quiz result email
    const EmailService = require('../services/emailService');
    const emailService = new EmailService();
    const user = await User.findById(req.userId);
    await emailService.sendQuizResultEmail(user, attempt.quiz, attempt);

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        score: attempt.score,
        passed: attempt.result.passed,
        timeSpent: attempt.timeSpent,
        performance: attempt.performance
      },
      showAnswers: attempt.quiz.questionSettings.showCorrectAnswers
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz'
    });
  }
};

// Get quiz attempt details
const getQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate('quiz', 'title type questionSettings')
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'answers.question',
        populate: {
          path: 'subject',
          select: 'name'
        }
      });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    // Check access
    const hasAccess = attempt.user._id.toString() === req.userId ||
                     ['admin', 'superadmin', 'teacher'].includes(req.user.role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove correct answers if not allowed
    if (!attempt.quiz.questionSettings.showCorrectAnswers && 
        req.user.role === 'student' && 
        attempt.status === 'completed') {
      attempt.answers.forEach(ans => {
        delete ans.isCorrect;
        delete ans.correctAnswer;
        if (ans.question && ans.question.options) {
          ans.question.options.forEach(opt => {
            delete opt.isCorrect;
          });
        }
      });
    }

    res.json({
      success: true,
      attempt
    });
  } catch (error) {
    console.error('Get quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attempt'
    });
  }
};

// Get user's quiz history
const getUserQuizHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const {
      page = 1,
      limit = 20,
      status,
      quizType,
      sortBy = 'startedAt',
      order = 'desc'
    } = req.query;

    // Check access
    if (userId !== req.userId && !['admin', 'superadmin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const query = { user: userId };
    
    if (status) {
      query.status = status;
    }

    // Get attempts with quiz details
    const attempts = await QuizAttempt.find(query)
      .populate('quiz', 'title type category')
      .populate({
        path: 'quiz',
        populate: {
          path: 'category',
          select: 'name icon'
        }
      })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-answers'); // Don't include detailed answers in list

    const total = await QuizAttempt.countDocuments(query);

    // Get statistics
    const stats = await QuizAttempt.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          completedAttempts: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageScore: {
            $avg: { $cond: [{ $eq: ['$status', 'completed'] }, '$score.percentage', null] }
          },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      attempts,
      statistics: stats[0] || {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        totalTimeSpent: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz history'
    });
  }
};

// Helper functions
const checkCanAttempt = (quiz, userAttempts) => {
  if (!userAttempts || userAttempts.length === 0) return true;
  
  if (userAttempts.length >= quiz.attempts.maxAttempts) return false;
  
  if (quiz.attempts.cooldownPeriod > 0) {
    const lastAttempt = userAttempts[0];
    const cooldownEnd = new Date(lastAttempt.submittedAt);
    cooldownEnd.setHours(cooldownEnd.getHours() + quiz.attempts.cooldownPeriod);
    
    if (cooldownEnd > new Date()) return false;
  }
  
  return true;
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateScore = async (attempt) => {
  const quiz = attempt.quiz;
  const questions = await Question.find({
    _id: { $in: attempt.questions.map(q => q.question) }
  });

  const questionMap = {};
  questions.forEach(q => {
    questionMap[q._id.toString()] = q;
  });

  let totalPoints = 0;
  let earnedPoints = 0;
  let correctAnswers = 0;
  const detailedAnswers = [];

  for (const attemptQuestion of attempt.questions) {
    const question = questionMap[attemptQuestion.question.toString()];
    if (!question) continue;

    const userAnswer = attempt.answers.find(
      a => a.question.toString() === question._id.toString()
    );

    const points = attemptQuestion.points || 10;
    totalPoints += points;

    let isCorrect = false;
    let pointsAwarded = 0;

    if (userAnswer) {
      // Check answer based on question type
      switch (question.type) {
        case 'multiple_choice':
        case 'true_false':
          const correctOption = question.options.find(opt => opt.isCorrect);
          isCorrect = userAnswer.answer === correctOption?.id;
          break;

        case 'short_answer':
          // Simple text matching for now
          isCorrect = question.correctAnswers?.some(
            ans => ans.toLowerCase() === userAnswer.answer?.toLowerCase()
          );
          break;

        case 'fill_blank':
          // Check each blank
          // Implementation depends on answer format
          break;

        // Other question types...
      }

      if (isCorrect) {
        pointsAwarded = points;
        earnedPoints += points;
        correctAnswers++;
      } else if (quiz.scoring.negativeMarking?.enabled && userAnswer.answer) {
        pointsAwarded = -points * quiz.scoring.negativeMarking.factor;
        earnedPoints += pointsAwarded;
      }
    }

    detailedAnswers.push({
      ...userAnswer?.toObject(),
      isCorrect,
      pointsAwarded,
      correctAnswer: question.options?.find(opt => opt.isCorrect)?.id
    });
  }

  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  return {
    score: {
      raw: earnedPoints,
      percentage: Math.max(0, percentage), // Don't go below 0
      final: earnedPoints
    },
    performance: {
      correctAnswers,
      incorrectAnswers: attempt.answers.length - correctAnswers,
      unanswered: attempt.questions.length - attempt.answers.length,
      accuracy: attempt.answers.length > 0 
        ? (correctAnswers / attempt.answers.length) * 100 
        : 0
    },
    detailedAnswers
  };
};

const updateQuestionPerformance = async (attempt) => {
  // Update performance metrics for each question
  for (const answer of attempt.answers) {
    if (!answer.question) continue;

    await Question.findByIdAndUpdate(answer.question, {
      $inc: {
        'performance.totalAttempts': 1,
        'performance.correctAttempts': answer.isCorrect ? 1 : 0,
        'performance.totalTimeSpent': answer.timeSpent || 0
      }
    });
  }
};

const updateUserProgress = async (userId, attempt) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Update quiz statistics
  user.learning.quizStatistics.totalAttempts += 1;
  if (attempt.status === 'completed') {
    user.learning.quizStatistics.completedQuizzes += 1;
    
    // Update average score
    const currentAvg = user.learning.quizStatistics.averageScore || 0;
    const totalCompleted = user.learning.quizStatistics.completedQuizzes;
    user.learning.quizStatistics.averageScore = 
      ((currentAvg * (totalCompleted - 1)) + attempt.score.percentage) / totalCompleted;
  }

  // Update streaks
  const today = new Date().toDateString();
  const lastActivity = user.learning.streaks.lastActivityDate;
  
  if (!lastActivity || lastActivity.toDateString() !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity && lastActivity.toDateString() === yesterday.toDateString()) {
      user.learning.streaks.currentStreak += 1;
      user.learning.streaks.longestStreak = Math.max(
        user.learning.streaks.currentStreak,
        user.learning.streaks.longestStreak
      );
    } else {
      user.learning.streaks.currentStreak = 1;
    }
    
    user.learning.streaks.lastActivityDate = new Date();
  }

  await user.save();
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  startQuizAttempt,
  submitAnswer,
  submitQuizAttempt,
  getQuizAttempt,
  getUserQuizHistory
};