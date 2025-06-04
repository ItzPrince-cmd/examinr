const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  // Reference Information
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    index: true
  },
  
  // Attempt Information
  attemptNumber: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'submitted', 'graded', 'abandoned', 'disqualified'],
    default: 'not_started',
    index: true
  },
  
  // Timing Information
  startedAt: {
    type: Date,
    index: true
  },
  lastActivityAt: Date,
  submittedAt: Date,
  gradedAt: Date,
  timeSpent: {
    type: Number, // Total time in seconds
    default: 0
  },
  pausedDuration: {
    type: Number, // Total paused time in seconds
    default: 0
  },
  pauses: [{
    startedAt: Date,
    endedAt: Date,
    reason: String
  }],
  
  // Answer Tracking
  answers: [{
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: true
    },
    questionSnapshot: {
      // Store question data at time of attempt for consistency
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    answer: {
      // Flexible to accommodate different question types
      type: mongoose.Schema.Types.Mixed
    },
    answerHistory: [{
      answer: mongoose.Schema.Types.Mixed,
      changedAt: Date
    }],
    isCorrect: Boolean,
    partialScore: {
      type: Number,
      min: 0,
      max: 100
    },
    pointsAwarded: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // Time in seconds
      default: 0
    },
    firstViewedAt: Date,
    answeredAt: Date,
    flagged: {
      type: Boolean,
      default: false
    },
    confidence: {
      type: Number,
      min: 1,
      max: 5
    },
    hintUsed: {
      type: Boolean,
      default: false
    }
  }],
  
  // Navigation Tracking
  navigationLog: [{
    action: {
      type: String,
      enum: ['view_question', 'answer_question', 'change_answer', 'flag_question', 'unflag_question', 'next', 'previous', 'jump_to']
    },
    questionIndex: Number,
    timestamp: Date,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Score Information
  score: {
    raw: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    weighted: {
      type: Number,
      default: 0
    },
    scaled: {
      type: Number,
      default: 0
    },
    bonus: {
      type: Number,
      default: 0
    },
    penalty: {
      type: Number,
      default: 0
    },
    final: {
      type: Number,
      default: 0
    }
  },
  
  // Performance Metrics
  performance: {
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    partialAnswers: {
      type: Number,
      default: 0
    },
    unanswered: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    speed: {
      type: Number // Questions per minute
    },
    efficiency: {
      type: Number // Score per minute
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Section-wise Performance (if quiz has sections)
  sectionPerformance: [{
    section: String,
    questionsAttempted: Number,
    correctAnswers: Number,
    score: Number,
    percentage: Number,
    timeSpent: Number
  }],
  
  // Difficulty-wise Performance
  difficultyPerformance: [{
    difficulty: {
      type: String,
      enum: ['beginner', 'easy', 'medium', 'hard', 'expert']
    },
    questionsAttempted: Number,
    correctAnswers: Number,
    accuracy: Number
  }],
  
  // Type-wise Performance
  typePerformance: [{
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'essay', 'short_answer', 'fill_blank', 'matching', 'ordering', 'code']
    },
    questionsAttempted: Number,
    correctAnswers: Number,
    accuracy: Number,
    averageTimeSpent: Number
  }],
  
  // Proctoring Data
  proctoring: {
    violations: [{
      type: {
        type: String,
        enum: ['tab_switch', 'window_blur', 'copy_attempt', 'paste_attempt', 'right_click', 'print_attempt', 'multiple_faces', 'no_face', 'suspicious_object', 'audio_detected']
      },
      timestamp: Date,
      details: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      screenshot: String
    }],
    recordings: {
      webcam: [{
        url: String,
        startTime: Date,
        endTime: Date
      }],
      screen: [{
        url: String,
        startTime: Date,
        endTime: Date
      }]
    },
    identityVerified: {
      type: Boolean,
      default: false
    },
    verificationMethod: String,
    proctoringScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    suggestions: String,
    reportedIssues: [{
      questionId: mongoose.Schema.ObjectId,
      issue: String,
      description: String
    }],
    submittedAt: Date
  },
  
  // Environment Information
  environment: {
    ipAddress: String,
    userAgent: String,
    browser: {
      name: String,
      version: String
    },
    os: {
      name: String,
      version: String
    },
    device: {
      type: String,
      model: String
    },
    screen: {
      width: Number,
      height: Number
    },
    timezone: String,
    language: String
  },
  
  // Grading Information
  grading: {
    method: {
      type: String,
      enum: ['auto', 'manual', 'hybrid'],
      default: 'auto'
    },
    gradedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    gradingNotes: String,
    manualScores: [{
      question: mongoose.Schema.ObjectId,
      score: Number,
      feedback: String
    }],
    rubricScores: [{
      criteria: String,
      score: Number,
      maxScore: Number,
      comments: String
    }]
  },
  
  // Academic Integrity
  integrity: {
    similarityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    plagiarismDetected: {
      type: Boolean,
      default: false
    },
    suspiciousPatterns: [{
      pattern: String,
      confidence: Number,
      details: String
    }],
    flaggedForReview: {
      type: Boolean,
      default: false
    },
    reviewNotes: String
  },
  
  // Accommodations (for special needs)
  accommodations: {
    extraTime: {
      type: Number, // Extra minutes
      default: 0
    },
    extraTimeReason: String,
    breaks: {
      allowed: Boolean,
      count: Number
    },
    assistiveTechnology: [String],
    modifications: [String]
  },
  
  // Result and Certificate
  result: {
    passed: Boolean,
    rank: Number,
    percentile: Number,
    grade: String,
    gradePoints: Number,
    feedback: String,
    strengths: [String],
    improvements: [String],
    recommendations: [String]
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String,
    url: String,
    verificationCode: String
  },
  
  // Analytics Flags
  analytics: {
    includeInAnalytics: {
      type: Boolean,
      default: true
    },
    anomalyDetected: {
      type: Boolean,
      default: false
    },
    anomalyReasons: [String],
    performanceTag: {
      type: String,
      enum: ['excellent', 'good', 'average', 'below_average', 'poor']
    }
  },
  
  // Metadata
  notes: String,
  tags: [String],
  customData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
quizAttemptSchema.index({ quiz: 1, user: 1 });
quizAttemptSchema.index({ user: 1, status: 1 });
quizAttemptSchema.index({ quiz: 1, status: 1 });
quizAttemptSchema.index({ course: 1, user: 1 });
quizAttemptSchema.index({ submittedAt: -1 });
quizAttemptSchema.index({ 'score.percentage': -1 });
quizAttemptSchema.index({ createdAt: -1 });

// Compound indexes for performance
quizAttemptSchema.index({ quiz: 1, user: 1, attemptNumber: 1 });
quizAttemptSchema.index({ quiz: 1, status: 1, submittedAt: -1 });

// Virtual for duration
quizAttemptSchema.virtual('duration').get(function() {
  if (!this.startedAt || !this.submittedAt) return 0;
  return Math.floor((this.submittedAt - this.startedAt) / 1000) - this.pausedDuration;
});

// Virtual for is passing
quizAttemptSchema.virtual('isPassing').get(function() {
  return this.result && this.result.passed;
});

// Pre-save middleware
quizAttemptSchema.pre('save', async function(next) {
  // Calculate performance metrics
  if (this.isModified('answers')) {
    const totalQuestions = this.answers.length;
    const answered = this.answers.filter(a => a.answer !== null && a.answer !== undefined).length;
    const correct = this.answers.filter(a => a.isCorrect).length;
    const incorrect = this.answers.filter(a => a.isCorrect === false).length;
    const partial = this.answers.filter(a => a.partialScore > 0 && a.partialScore < 100).length;
    
    this.performance.correctAnswers = correct;
    this.performance.incorrectAnswers = incorrect;
    this.performance.partialAnswers = partial;
    this.performance.unanswered = totalQuestions - answered;
    this.performance.completionRate = (answered / totalQuestions) * 100;
    
    if (answered > 0) {
      this.performance.accuracy = (correct / answered) * 100;
    }
    
    // Calculate speed if time data available
    if (this.timeSpent > 0) {
      this.performance.speed = (answered / (this.timeSpent / 60));
      this.performance.efficiency = (this.score.percentage / (this.timeSpent / 60));
    }
  }
  
  // Update last activity
  this.lastActivityAt = new Date();
  
  next();
});

// Methods
quizAttemptSchema.methods.calculateScore = async function() {
  const quiz = await mongoose.model('Quiz').findById(this.quiz);
  if (!quiz) throw new Error('Quiz not found');
  
  let totalScore = 0;
  let maxScore = 0;
  
  for (const answer of this.answers) {
    const questionInQuiz = quiz.questions.find(q => q.question.toString() === answer.question.toString());
    if (!questionInQuiz) continue;
    
    maxScore += questionInQuiz.points;
    
    if (answer.isCorrect) {
      totalScore += questionInQuiz.points;
    } else if (answer.partialScore) {
      totalScore += (questionInQuiz.points * answer.partialScore / 100);
    } else if (!answer.isCorrect && quiz.scoring.negativeMarking.enabled) {
      totalScore -= (questionInQuiz.points * quiz.scoring.negativeMarking.factor);
    }
    
    answer.pointsAwarded = totalScore - (maxScore - questionInQuiz.points);
  }
  
  // Apply late submission penalty if applicable
  if (quiz.availability.lateSubmission.allowed && this.submittedAt > quiz.availability.endDate) {
    const penalty = totalScore * (quiz.availability.lateSubmission.penaltyPercentage / 100);
    this.score.penalty = penalty;
    totalScore -= penalty;
  }
  
  // Calculate different score formats
  this.score.raw = totalScore;
  this.score.percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  this.score.final = Math.max(0, totalScore); // Ensure non-negative
  
  // Determine pass/fail
  this.result.passed = this.score.percentage >= quiz.scoring.passingScore;
  
  await this.save();
  return this.score;
};

// Method to add proctoring violation
quizAttemptSchema.methods.addViolation = function(type, details, severity = 'low') {
  this.proctoring.violations.push({
    type,
    timestamp: new Date(),
    details,
    severity
  });
  
  // Auto-calculate proctoring score
  const severityWeights = { low: 5, medium: 15, high: 30, critical: 50 };
  const totalPenalty = this.proctoring.violations.reduce((sum, v) => sum + severityWeights[v.severity], 0);
  this.proctoring.proctoringScore = Math.max(0, 100 - totalPenalty);
  
  return this.save();
};

// Method to update answer
quizAttemptSchema.methods.updateAnswer = function(questionId, answer) {
  const answerIndex = this.answers.findIndex(a => a.question.toString() === questionId.toString());
  
  if (answerIndex === -1) {
    throw new Error('Question not found in attempt');
  }
  
  const currentAnswer = this.answers[answerIndex];
  
  // Save to history
  if (currentAnswer.answer !== undefined && currentAnswer.answer !== null) {
    currentAnswer.answerHistory.push({
      answer: currentAnswer.answer,
      changedAt: new Date()
    });
  }
  
  // Update answer
  currentAnswer.answer = answer;
  currentAnswer.answeredAt = new Date();
  
  // Log navigation
  this.navigationLog.push({
    action: currentAnswer.answerHistory.length > 0 ? 'change_answer' : 'answer_question',
    questionIndex: answerIndex,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to calculate section performance
quizAttemptSchema.methods.calculateSectionPerformance = async function() {
  const quiz = await mongoose.model('Quiz').findById(this.quiz).populate('questions.question');
  if (!quiz) return;
  
  const sections = {};
  
  for (let i = 0; i < this.answers.length; i++) {
    const answer = this.answers[i];
    const questionInQuiz = quiz.questions[i];
    const section = questionInQuiz.section || 'General';
    
    if (!sections[section]) {
      sections[section] = {
        section,
        questionsAttempted: 0,
        correctAnswers: 0,
        score: 0,
        maxScore: 0,
        timeSpent: 0
      };
    }
    
    if (answer.answer !== null && answer.answer !== undefined) {
      sections[section].questionsAttempted++;
      if (answer.isCorrect) sections[section].correctAnswers++;
      sections[section].score += answer.pointsAwarded || 0;
    }
    
    sections[section].maxScore += questionInQuiz.points;
    sections[section].timeSpent += answer.timeSpent || 0;
  }
  
  this.sectionPerformance = Object.values(sections).map(section => ({
    ...section,
    percentage: section.maxScore > 0 ? (section.score / section.maxScore) * 100 : 0
  }));
  
  await this.save();
};

// Static method to get user's attempt history
quizAttemptSchema.statics.getUserHistory = function(userId, quizId = null) {
  const query = { user: userId };
  if (quizId) query.quiz = quizId;
  
  return this.find(query)
    .populate('quiz', 'title type')
    .sort('-submittedAt')
    .select('quiz attemptNumber status score result submittedAt duration');
};

// Static method to get quiz statistics
quizAttemptSchema.statics.getQuizStatistics = async function(quizId) {
  const attempts = await this.find({ 
    quiz: quizId, 
    status: 'completed'
  });
  
  if (attempts.length === 0) return null;
  
  const scores = attempts.map(a => a.score.percentage);
  const times = attempts.map(a => a.duration);
  
  return {
    totalAttempts: attempts.length,
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    averageTime: times.reduce((a, b) => a + b, 0) / times.length,
    passRate: (scores.filter(s => s >= 70).length / scores.length) * 100, // Assuming 70% pass
    scoreDistribution: {
      '0-20': scores.filter(s => s >= 0 && s < 20).length,
      '20-40': scores.filter(s => s >= 20 && s < 40).length,
      '40-60': scores.filter(s => s >= 40 && s < 60).length,
      '60-80': scores.filter(s => s >= 60 && s < 80).length,
      '80-100': scores.filter(s => s >= 80 && s <= 100).length
    }
  };
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);