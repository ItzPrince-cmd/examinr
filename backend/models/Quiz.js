const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Quiz title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    maxlength: [2000, 'Quiz description cannot exceed 2000 characters']
  },
  instructions: {
    type: String,
    maxlength: [5000, 'Instructions cannot exceed 5000 characters']
  },
  
  // Organization
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    index: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Question Management
  questions: [{
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    },
    required: {
      type: Boolean,
      default: true
    },
    section: String, // For grouping questions
    customInstructions: String
  }],
  
  // Question Pool (for randomization)
  questionPool: {
    enabled: {
      type: Boolean,
      default: false
    },
    pools: [{
      name: String,
      description: String,
      questions: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Question'
      }],
      selectCount: Number, // How many to select from this pool
      criteria: {
        difficulty: [String],
        tags: [String],
        type: [String]
      }
    }]
  },
  
  // Quiz Type and Mode
  type: {
    type: String,
    enum: ['practice', 'graded', 'exam', 'survey', 'diagnostic', 'adaptive'],
    required: true,
    default: 'graded'
  },
  mode: {
    type: String,
    enum: ['standard', 'timed_per_question', 'speed_test', 'proctored'],
    default: 'standard'
  },
  
  // Timing Settings
  timing: {
    duration: {
      type: Number, // Total duration in minutes
      required: true,
      min: 1
    },
    perQuestionTime: {
      type: Number, // Time per question in seconds (for timed_per_question mode)
      min: 10
    },
    showTimer: {
      type: Boolean,
      default: true
    },
    warningTime: {
      type: Number, // Minutes before end to show warning
      default: 5
    },
    graceTime: {
      type: Number, // Extra seconds after time expires
      default: 30
    },
    pauseAllowed: {
      type: Boolean,
      default: false
    },
    maxPauses: {
      type: Number,
      default: 0
    }
  },
  
  // Attempt Restrictions
  attempts: {
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1
    },
    cooldownPeriod: {
      type: Number, // Hours between attempts
      default: 0
    },
    showPreviousAttempts: {
      type: Boolean,
      default: false
    },
    keepHighestScore: {
      type: Boolean,
      default: true
    }
  },
  
  // Question Settings
  questionSettings: {
    randomizeQuestions: {
      type: Boolean,
      default: false
    },
    randomizeOptions: {
      type: Boolean,
      default: true
    },
    questionsPerPage: {
      type: Number,
      default: 1,
      min: 1
    },
    allowNavigation: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    showQuestionNumbers: {
      type: Boolean,
      default: true
    },
    mandatoryQuestions: {
      type: Boolean,
      default: false
    }
  },
  
  // Display Settings
  display: {
    showResults: {
      type: String,
      enum: ['immediately', 'after_submission', 'after_review', 'on_date', 'never'],
      default: 'after_submission'
    },
    resultsReleaseDate: Date,
    showScore: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    showExplanations: {
      type: Boolean,
      default: true
    },
    showStatistics: {
      type: Boolean,
      default: false
    },
    showRank: {
      type: Boolean,
      default: false
    },
    certificateEnabled: {
      type: Boolean,
      default: false
    },
    certificateThreshold: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    }
  },
  
  // Scoring Configuration
  scoring: {
    totalPoints: {
      type: Number,
      required: true,
      min: 0
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    scoringMethod: {
      type: String,
      enum: ['sum', 'percentage', 'weighted', 'custom'],
      default: 'percentage'
    },
    negativeMarking: {
      enabled: {
        type: Boolean,
        default: false
      },
      factor: {
        type: Number,
        default: 0.25,
        min: 0,
        max: 1
      }
    },
    partialCredit: {
      type: Boolean,
      default: false
    },
    roundingMethod: {
      type: String,
      enum: ['none', 'round', 'ceil', 'floor'],
      default: 'round'
    }
  },
  
  // Availability and Scheduling
  availability: {
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    lateSubmission: {
      allowed: {
        type: Boolean,
        default: false
      },
      deadline: Date,
      penaltyPercentage: {
        type: Number,
        default: 10,
        min: 0,
        max: 100
      }
    },
    scheduleFor: [{
      group: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group'
      },
      startDate: Date,
      endDate: Date
    }]
  },
  
  // Access Control
  access: {
    requirePassword: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      select: false
    },
    restrictToGroups: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Group'
    }],
    restrictToUsers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    ipRestrictions: [String],
    browserLockdown: {
      type: Boolean,
      default: false
    }
  },
  
  // Proctoring Settings
  proctoring: {
    enabled: {
      type: Boolean,
      default: false
    },
    webcamRequired: {
      type: Boolean,
      default: false
    },
    screenRecording: {
      type: Boolean,
      default: false
    },
    idVerification: {
      type: Boolean,
      default: false
    },
    roomScan: {
      type: Boolean,
      default: false
    },
    preventTabSwitch: {
      type: Boolean,
      default: false
    },
    preventCopyPaste: {
      type: Boolean,
      default: false
    },
    preventRightClick: {
      type: Boolean,
      default: false
    },
    fullScreenRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Feedback and Review
  feedback: {
    allowComments: {
      type: Boolean,
      default: true
    },
    requireFeedback: {
      type: Boolean,
      default: false
    },
    feedbackQuestions: [{
      question: String,
      type: {
        type: String,
        enum: ['text', 'rating', 'multiple_choice']
      },
      options: [String],
      required: Boolean
    }]
  },
  
  // Analytics and Reporting
  analytics: {
    trackTimePerQuestion: {
      type: Boolean,
      default: true
    },
    trackAnswerChanges: {
      type: Boolean,
      default: true
    },
    generateDetailedReport: {
      type: Boolean,
      default: true
    },
    shareAnalytics: {
      withStudents: {
        type: Boolean,
        default: false
      },
      withParents: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Statistics
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    uniqueAttempts: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    highestScore: {
      type: Number,
      default: 0
    },
    lowestScore: {
      type: Number,
      default: 100
    },
    standardDeviation: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    difficultyIndex: {
      type: Number,
      min: 0,
      max: 1
    },
    lastAttemptDate: Date
  },
  
  // Publishing Status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed', 'archived', 'cancelled'],
    default: 'draft',
    index: true
  },
  publishedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  publishedAt: Date,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  changeLog: [{
    version: Number,
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    changes: String
  }],
  
  // Integration
  integrations: {
    lms: {
      enabled: Boolean,
      lmsType: String,
      lmsId: String,
      syncGrades: Boolean
    },
    webhooks: [{
      event: {
        type: String,
        enum: ['attempt_start', 'attempt_submit', 'graded', 'feedback_received']
      },
      url: String,
      secret: String,
      active: Boolean
    }]
  },
  
  // Custom Fields
  customFields: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'date', 'array', 'object']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
quizSchema.index({ course: 1, status: 1 });
quizSchema.index({ category: 1, status: 1 });
quizSchema.index({ 'availability.startDate': 1, 'availability.endDate': 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ type: 1, status: 1 });
quizSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for duration in hours
quizSchema.virtual('durationInHours').get(function() {
  return this.timing.duration / 60;
});

// Virtual for is currently available
quizSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.availability.startDate && 
         now <= this.availability.endDate;
});

// Virtual for question count
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Pre-save middleware
quizSchema.pre('save', async function(next) {
  // Calculate total points
  if (this.isModified('questions')) {
    this.scoring.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  }
  
  // Update status based on dates
  const now = new Date();
  if (this.availability.startDate > now) {
    this.status = 'scheduled';
  } else if (this.availability.endDate < now && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Generate change log entry
  if (!this.isNew && this.isModified()) {
    this.version += 1;
    this.changeLog.push({
      version: this.version,
      changedAt: now,
      changedBy: this.lastModifiedBy,
      changes: 'Quiz updated' // You can make this more detailed
    });
  }
  
  next();
});

// Methods
quizSchema.methods.calculateStatistics = async function() {
  const QuizAttempt = mongoose.model('QuizAttempt');
  
  const attempts = await QuizAttempt.find({ 
    quiz: this._id, 
    status: 'completed' 
  });
  
  if (attempts.length === 0) return;
  
  // Calculate statistics
  const scores = attempts.map(a => a.score.percentage);
  const times = attempts.map(a => a.timeSpent);
  
  this.statistics.totalAttempts = attempts.length;
  this.statistics.uniqueAttempts = [...new Set(attempts.map(a => a.user.toString()))].length;
  this.statistics.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  this.statistics.averageTimeSpent = times.reduce((a, b) => a + b, 0) / times.length;
  this.statistics.highestScore = Math.max(...scores);
  this.statistics.lowestScore = Math.min(...scores);
  this.statistics.passRate = (scores.filter(s => s >= this.scoring.passingScore).length / scores.length) * 100;
  
  // Calculate standard deviation
  const mean = this.statistics.averageScore;
  const squaredDiffs = scores.map(s => Math.pow(s - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
  this.statistics.standardDeviation = Math.sqrt(avgSquaredDiff);
  
  // Calculate completion rate
  const allAttempts = await QuizAttempt.countDocuments({ quiz: this._id });
  this.statistics.completionRate = (attempts.length / allAttempts) * 100;
  
  await this.save();
};

// Method to get next available attempt for a user
quizSchema.methods.getNextAvailableAttempt = async function(userId) {
  const QuizAttempt = mongoose.model('QuizAttempt');
  
  const userAttempts = await QuizAttempt.find({
    quiz: this._id,
    user: userId,
    status: { $ne: 'abandoned' }
  }).sort('-createdAt');
  
  if (userAttempts.length >= this.attempts.maxAttempts) {
    // Check cooldown period
    if (this.attempts.cooldownPeriod > 0) {
      const lastAttempt = userAttempts[0];
      const cooldownEnd = new Date(lastAttempt.submittedAt.getTime() + this.attempts.cooldownPeriod * 60 * 60 * 1000);
      
      if (new Date() < cooldownEnd) {
        return {
          available: false,
          reason: 'cooldown',
          availableAt: cooldownEnd
        };
      }
    } else {
      return {
        available: false,
        reason: 'max_attempts_reached'
      };
    }
  }
  
  return {
    available: true,
    attemptNumber: userAttempts.length + 1
  };
};

// Static method to get upcoming quizzes
quizSchema.statics.getUpcoming = function(userId, limit = 10) {
  const now = new Date();
  
  return this.find({
    status: { $in: ['scheduled', 'active'] },
    'availability.startDate': { $gte: now },
    $or: [
      { 'access.restrictToUsers': userId },
      { 'access.restrictToUsers': { $size: 0 } }
    ]
  })
  .populate('course category')
  .sort('availability.startDate')
  .limit(limit);
};

module.exports = mongoose.model('Quiz', quizSchema);