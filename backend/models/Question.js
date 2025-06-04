const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    maxlength: [500, 'Question title cannot exceed 500 characters']
  },
  text: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [5000, 'Question text cannot exceed 5000 characters']
  },
  type: {
    type: String,
    required: [true, 'Question type is required'],
    enum: ['multiple_choice', 'true_false', 'essay', 'short_answer', 'fill_blank', 'matching', 'ordering', 'code'],
    index: true
  },
  
  // Category and Classification
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Subject is required'],
    index: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    index: true
  },
  subtopic: String,
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Difficulty and Scoring
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['beginner', 'easy', 'medium', 'hard', 'expert'],
    index: true
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [0, 'Points cannot be negative'],
    default: 1
  },
  negativePoints: {
    type: Number,
    default: 0,
    min: [0, 'Negative points cannot be negative']
  },
  partialCredit: {
    enabled: {
      type: Boolean,
      default: false
    },
    strategy: {
      type: String,
      enum: ['percentage', 'step_based', 'custom'],
      default: 'percentage'
    }
  },
  
  // Question Content Based on Type
  // Multiple Choice & True/False
  options: [{
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [1000, 'Option text cannot exceed 1000 characters']
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    explanation: String,
    media: {
      type: {
        type: String,
        enum: ['image', 'video', 'audio']
      },
      url: String,
      caption: String
    }
  }],
  
  // Essay & Short Answer
  answerGuidelines: {
    minWords: Number,
    maxWords: Number,
    keyPoints: [String],
    rubric: [{
      criteria: String,
      points: Number,
      description: String
    }]
  },
  
  // Fill in the Blank
  blanks: [{
    position: Number,
    correctAnswers: [String], // Multiple correct answers possible
    caseSensitive: {
      type: Boolean,
      default: false
    },
    partialMatch: {
      type: Boolean,
      default: false
    }
  }],
  
  // Matching
  matchingPairs: [{
    left: {
      id: String,
      text: String,
      media: {
        type: String,
        url: String
      }
    },
    right: {
      id: String,
      text: String,
      media: {
        type: String,
        url: String
      }
    }
  }],
  
  // Ordering
  orderingItems: [{
    id: String,
    text: String,
    correctPosition: Number,
    media: {
      type: String,
      url: String
    }
  }],
  
  // Code Questions
  codeQuestion: {
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'swift']
    },
    starterCode: String,
    solution: String,
    testCases: [{
      input: String,
      expectedOutput: String,
      isHidden: {
        type: Boolean,
        default: false
      },
      points: Number
    }],
    timeLimit: Number, // in seconds
    memoryLimit: Number // in MB
  },
  
  // Explanation and Learning
  explanation: {
    text: String,
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'document']
      },
      url: String,
      title: String,
      description: String
    }],
    links: [{
      title: String,
      url: String,
      description: String
    }]
  },
  hint: {
    text: String,
    penaltyPoints: {
      type: Number,
      default: 0
    }
  },
  
  // Media Attachments
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document', 'diagram'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: String, // For Cloudinary
    title: String,
    description: String,
    transcript: String, // For audio/video accessibility
    duration: Number, // For audio/video in seconds
    fileSize: Number, // In bytes
    mimeType: String
  }],
  
  // Usage Statistics
  statistics: {
    timesUsed: {
      type: Number,
      default: 0
    },
    timesAnswered: {
      type: Number,
      default: 0
    },
    timesCorrect: {
      type: Number,
      default: 0
    },
    timesIncorrect: {
      type: Number,
      default: 0
    },
    timesSkipped: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0 // in seconds
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 5
    },
    lastUsed: Date
  },
  
  // Performance Analytics
  performanceData: {
    byDifficulty: [{
      userLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
      },
      correctRate: Number,
      averageTime: Number
    }],
    commonMistakes: [{
      optionId: String,
      frequency: Number,
      percentage: Number
    }],
    discriminationIndex: Number, // How well question distinguishes between high and low performers
    pointBiserialCorrelation: Number // Correlation between question score and total test score
  },
  
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
  previousVersions: [{
    version: Number,
    modifiedAt: Date,
    modifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    changes: String
  }],
  
  // Publishing and Availability
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'published', 'archived', 'deprecated'],
    default: 'draft',
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  
  // Access Control
  visibility: {
    type: String,
    enum: ['public', 'private', 'institution', 'course'],
    default: 'private'
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'use', 'edit']
    }
  }],
  institution: {
    type: mongoose.Schema.ObjectId,
    ref: 'Institution'
  },
  
  // Quality Metrics
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  qualityFactors: {
    clarity: { type: Number, min: 0, max: 10 },
    relevance: { type: Number, min: 0, max: 10 },
    difficulty_accuracy: { type: Number, min: 0, max: 10 },
    discrimination: { type: Number, min: 0, max: 10 }
  },
  
  // Reporting
  flagged: {
    isFlagged: {
      type: Boolean,
      default: false
    },
    reasons: [{
      reason: String,
      reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      reportedAt: Date,
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // SEO and Search
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  metaDescription: String,
  keywords: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
questionSchema.index({ subject: 1, topic: 1 });
questionSchema.index({ difficulty: 1, type: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ 'statistics.timesUsed': -1 });
questionSchema.index({ 'statistics.averageScore': 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ text: 'text', title: 'text', tags: 'text' }); // Text search

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  if (this.statistics.timesAnswered === 0) return 0;
  return (this.statistics.timesCorrect / this.statistics.timesAnswered) * 100;
});

// Virtual for difficulty based on performance
questionSchema.virtual('calculatedDifficulty').get(function() {
  const successRate = this.successRate;
  if (successRate >= 80) return 'easy';
  if (successRate >= 60) return 'medium';
  if (successRate >= 40) return 'hard';
  return 'expert';
});

// Pre-save middleware
questionSchema.pre('save', function(next) {
  // Auto-generate slug from title
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
  
  // Calculate quality score
  if (this.isModified()) {
    let score = 0;
    
    // Check for explanation (20 points)
    if (this.explanation && this.explanation.text) score += 20;
    
    // Check for media (10 points)
    if (this.media && this.media.length > 0) score += 10;
    
    // Check for proper tagging (10 points)
    if (this.tags && this.tags.length >= 3) score += 10;
    
    // Check for hint (10 points)
    if (this.hint && this.hint.text) score += 10;
    
    // Type-specific checks (50 points)
    switch (this.type) {
      case 'multiple_choice':
        if (this.options && this.options.length >= 4) score += 25;
        if (this.options && this.options.every(opt => opt.explanation)) score += 25;
        break;
      case 'essay':
        if (this.answerGuidelines && this.answerGuidelines.rubric) score += 50;
        break;
      case 'code':
        if (this.codeQuestion && this.codeQuestion.testCases && this.codeQuestion.testCases.length >= 3) score += 50;
        break;
      default:
        score += 25; // Base score for other types
    }
    
    this.qualityScore = score;
  }
  
  next();
});

// Method to update statistics after answer
questionSchema.methods.updateStatistics = async function(isCorrect, timeSpent, userId) {
  this.statistics.timesAnswered += 1;
  
  if (isCorrect) {
    this.statistics.timesCorrect += 1;
  } else {
    this.statistics.timesIncorrect += 1;
  }
  
  // Update average time spent
  const currentTotal = this.statistics.averageTimeSpent * (this.statistics.timesAnswered - 1);
  this.statistics.averageTimeSpent = (currentTotal + timeSpent) / this.statistics.timesAnswered;
  
  // Update average score
  const currentScoreTotal = this.statistics.averageScore * (this.statistics.timesAnswered - 1);
  const newScore = isCorrect ? 100 : 0;
  this.statistics.averageScore = (currentScoreTotal + newScore) / this.statistics.timesAnswered;
  
  this.statistics.lastUsed = new Date();
  
  await this.save();
};

// Method to calculate discrimination index
questionSchema.methods.calculateDiscriminationIndex = async function(highPerformers, lowPerformers) {
  // highPerformers and lowPerformers are arrays of user IDs
  // This method should be called after a test is completed
  
  const QuizAttempt = mongoose.model('QuizAttempt');
  
  const highCorrect = await QuizAttempt.countDocuments({
    user: { $in: highPerformers },
    'answers.question': this._id,
    'answers.isCorrect': true
  });
  
  const lowCorrect = await QuizAttempt.countDocuments({
    user: { $in: lowPerformers },
    'answers.question': this._id,
    'answers.isCorrect': true
  });
  
  const discriminationIndex = (highCorrect / highPerformers.length) - (lowCorrect / lowPerformers.length);
  
  this.performanceData.discriminationIndex = discriminationIndex;
  await this.save();
  
  return discriminationIndex;
};

// Static method to find similar questions
questionSchema.statics.findSimilar = async function(questionId, limit = 5) {
  const question = await this.findById(questionId);
  if (!question) return [];
  
  return this.find({
    _id: { $ne: questionId },
    subject: question.subject,
    type: question.type,
    difficulty: question.difficulty,
    status: 'published',
    $or: [
      { topic: question.topic },
      { tags: { $in: question.tags } }
    ]
  })
  .limit(limit)
  .sort('-qualityScore -statistics.averageScore');
};

module.exports = mongoose.model('Question', questionSchema);