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
    maxlength: [10000, 'Question text cannot exceed 10000 characters']
  },
  // Enhanced LaTeX Support
  latex: {
    original: String, // Original LaTeX code
    rendered: {
      html: String,     // KaTeX rendered HTML
      svg: String,      // SVG representation
      mathml: String    // MathML for accessibility
    },
    containsLatex: {
      type: Boolean,
      default: false
    },
    expressions: [{
      type: {
        type: String,
        enum: ['inline', 'display', 'environment']
      },
      expression: String,
      startIndex: Number,
      endIndex: Number
    }],
    metadata: {
      expressionCount: Number,
      hasDisplay: Boolean,
      hasInline: Boolean,
      hasEnvironments: Boolean,
      isValid: Boolean,
      validationErrors: [String],
      hash: String  // For caching
    },
    searchIndex: String  // Extracted LaTeX for searching
  },
  type: {
    type: String,
    required: [true, 'Question type is required'],
    enum: ['multiple_choice', 'multiple_correct', 'true_false', 'essay', 'short_answer', 'fill_blank', 'matching', 'matrix_match', 'ordering', 'code', 'numerical'],
    index: true
  },
  
  // Enhanced Category and Classification
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['physics', 'chemistry', 'mathematics', 'biology'],
    index: true
  },
  chapter: {
    type: String,
    required: [true, 'Chapter is required'],
    index: true
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    index: true
  },
  subtopic: {
    type: String,
    index: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  // Special categories
  specialCategories: {
    isPYQ: {
      type: Boolean,
      default: false
    },
    pyqYear: String,
    pyqExam: String,
    bookReference: {
      name: String,
      author: String,
      edition: String,
      pageNumber: String
    }
  },
  
  // Enhanced Difficulty and Scoring
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['easy', 'medium', 'hard', 'expert'],
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
  // Multiple Choice & True/False & Multiple Correct
  options: [{
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [2000, 'Option text cannot exceed 2000 characters']
    },
    latex: {
      original: String,
      rendered: String
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    explanation: {
      text: String,
      latex: {
        original: String,
        rendered: String
      }
    },
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
  
  // Matching & Matrix Match
  matchingPairs: [{
    left: {
      id: String,
      text: String,
      latex: {
        original: String,
        rendered: String
      },
      media: {
        type: String,
        url: String
      }
    },
    right: {
      id: String,
      text: String,
      latex: {
        original: String,
        rendered: String
      },
      media: {
        type: String,
        url: String
      }
    }
  }],
  
  // Matrix Match specific
  matrixMatch: {
    rows: [{
      id: String,
      text: String,
      latex: {
        original: String,
        rendered: String
      }
    }],
    columns: [{
      id: String,
      text: String,
      latex: {
        original: String,
        rendered: String
      }
    }],
    correctMatches: [{
      rowId: String,
      columnId: String
    }]
  },
  
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
  
  // Numerical type specific
  numerical: {
    correctAnswer: Number,
    tolerance: {
      type: Number,
      default: 0
    },
    unit: String,
    significantFigures: Number
  },
  
  // Enhanced Explanation and Learning
  explanation: {
    text: String,
    latex: {
      original: String,
      rendered: String
    },
    steps: [{
      order: Number,
      text: String,
      latex: {
        original: String,
        rendered: String
      },
      media: {
        type: String,
        url: String,
        caption: String
      }
    }],
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'document', 'diagram']
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
  
  // Enhanced Solution
  solution: {
    detailed: {
      text: String,
      latex: {
        original: String,
        rendered: String
      }
    },
    brief: String,
    steps: [{
      order: Number,
      text: String,
      latex: {
        original: String,
        rendered: String
      }
    }]
  },
  hint: {
    text: String,
    penaltyPoints: {
      type: Number,
      default: 0
    }
  },
  
  // Media Attachments with Enhanced Support
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
    mimeType: String,
    position: {
      type: String,
      enum: ['question', 'option', 'solution', 'explanation'],
      default: 'question'
    }
  }],
  
  // Image URLs for diagrams
  imageUrls: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    position: {
      type: String,
      enum: ['question', 'solution', 'option_a', 'option_b', 'option_c', 'option_d'],
      default: 'question'
    }
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
  
  // Enhanced Performance Analytics
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
    pointBiserialCorrelation: Number, // Correlation between question score and total test score
    attemptsByExam: [{
      examType: {
        type: String,
        enum: ['jee', 'neet', 'board']
      },
      attempts: Number,
      successRate: Number
    }],
    conceptualErrors: [{
      concept: String,
      frequency: Number
    }]
  },
  
  // Analytics tracking
  analytics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    correctAttempts: {
      type: Number,
      default: 0
    },
    incorrectAttempts: {
      type: Number,
      default: 0
    },
    skipCount: {
      type: Number,
      default: 0
    },
    averageTimeToSolve: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    lastAttemptDate: Date
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
questionSchema.index({ subject: 1, chapter: 1, topic: 1 });
questionSchema.index({ subject: 1, topic: 1, subtopic: 1 });
questionSchema.index({ difficulty: 1, type: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ 'statistics.timesUsed': -1 });
questionSchema.index({ 'statistics.averageScore': 1 });
questionSchema.index({ 'analytics.successRate': -1 });
questionSchema.index({ 'specialCategories.isPYQ': 1 });
questionSchema.index({ 'specialCategories.pyqYear': 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ text: 'text', title: 'text', tags: 'text', 'solution.detailed.text': 'text', 'latex.searchIndex': 'text' }); // Text search including LaTeX

// Compound indexes for common queries
questionSchema.index({ subject: 1, difficulty: 1, type: 1 });
questionSchema.index({ subject: 1, chapter: 1, 'analytics.successRate': -1 });

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

// Method to detect LaTeX in text
questionSchema.methods.detectAndProcessLatex = function(text) {
  if (!text) return { containsLatex: false, original: text, rendered: text };
  
  // Common LaTeX delimiters
  const latexPatterns = [
    /\$\$[\s\S]+?\$\$/g,  // Display math $$...$$
    /\$[^\$]+?\$/g,       // Inline math $...$
    /\\\[[\s\S]+?\\\]/g,  // Display math \[...\]
    /\\\([\s\S]+?\\\)/g,  // Inline math \(...\)
    /\\begin\{[\s\S]+?\\end\{/g  // Environment blocks
  ];
  
  let containsLatex = false;
  for (const pattern of latexPatterns) {
    if (pattern.test(text)) {
      containsLatex = true;
      break;
    }
  }
  
  return {
    containsLatex,
    original: text,
    rendered: text // This will be rendered on frontend with MathJax/KaTeX
  };
};

// Pre-save middleware
questionSchema.pre('save', async function(next) {
  const LatexService = require('../services/latexService');
  
  // Process LaTeX in question text
  if (this.isModified('text')) {
    const latexData = LatexService.prepareLaTeXForStorage(this.text);
    this.latex = {
      ...latexData.metadata,
      original: this.text,
      searchIndex: latexData.searchIndex,
      expressions: LatexService.extractLatexExpressions(this.text)
    };
    
    // Validate LaTeX
    const validation = LatexService.validateLatex(this.text);
    if (!validation.isValid) {
      this.latex.metadata = {
        ...this.latex.metadata,
        isValid: false,
        validationErrors: validation.errors
      };
    }
  }
  
  // Process LaTeX in options
  if (this.isModified('options') && this.options) {
    for (const option of this.options) {
      if (option.text) {
        const optionLatexData = LatexService.prepareLaTeXForStorage(option.text);
        option.latex = {
          original: option.text,
          ...optionLatexData.metadata
        };
      }
      if (option.explanation && option.explanation.text) {
        const explLatexData = LatexService.prepareLaTeXForStorage(option.explanation.text);
        option.explanation.latex = {
          original: option.explanation.text,
          ...explLatexData.metadata
        };
      }
    }
  }
  
  // Process LaTeX in solution
  if (this.solution && this.solution.detailed && this.isModified('solution.detailed.text')) {
    const solutionLatexData = LatexService.prepareLaTeXForStorage(this.solution.detailed.text);
    this.solution.detailed.latex = {
      original: this.solution.detailed.text,
      ...solutionLatexData.metadata
    };
  }
  
  // Process LaTeX in explanation
  if (this.explanation && this.isModified('explanation.text')) {
    const explLatexData = LatexService.prepareLaTeXForStorage(this.explanation.text);
    this.explanation.latex = {
      original: this.explanation.text,
      ...explLatexData.metadata
    };
  }
  
  // Update analytics
  if (this.isModified('statistics')) {
    if (this.statistics.timesAnswered > 0) {
      this.analytics.successRate = (this.statistics.timesCorrect / this.statistics.timesAnswered) * 100;
    }
  }
  
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

// Static method to detect duplicates
questionSchema.statics.findDuplicates = async function(questionText, subject, chapter, topic) {
  const LatexService = require('../services/latexService');
  
  // Use LaTeX service to clean text for comparison
  const cleanText = LatexService.cleanTextForComparison(questionText);
  
  // Find questions with similar text
  const potentialDuplicates = await this.find({
    subject: subject,
    chapter: chapter,
    topic: topic,
    $text: { $search: cleanText }
  })
  .select('text title subject chapter topic difficulty type')
  .limit(10);
  
  // Calculate similarity score
  const duplicates = potentialDuplicates.map(q => {
    const qCleanText = LatexService.cleanTextForComparison(q.text);
    
    // Simple similarity calculation (can be enhanced)
    const similarity = this.calculateSimilarity(cleanText, qCleanText);
    
    return {
      question: q,
      similarity: similarity
    };
  })
  .filter(d => d.similarity > 0.8) // 80% similarity threshold
  .sort((a, b) => b.similarity - a.similarity);
  
  return duplicates;
};

// Helper method to calculate text similarity
questionSchema.statics.calculateSimilarity = function(text1, text2) {
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Static method to search for questions by LaTeX expression
questionSchema.statics.findByLatexExpression = async function(latexExpression, options = {}) {
  const LatexService = require('../services/latexService');
  
  const {
    subject,
    limit = 10,
    exactMatch = false
  } = options;
  
  // Build search query
  const query = {
    'latex.containsLatex': true
  };
  
  if (subject) {
    query.subject = subject;
  }
  
  // Find questions containing LaTeX
  const questions = await this.find(query)
    .select('text title subject chapter topic latex.expressions')
    .limit(limit * 10); // Get more to filter
  
  // Search within LaTeX expressions
  const results = [];
  for (const question of questions) {
    if (question.latex && question.latex.expressions) {
      const matches = LatexService.searchLatexInText(question.text, latexExpression);
      if (matches.length > 0) {
        const maxScore = Math.max(...matches.map(m => m.matchScore));
        if (!exactMatch || maxScore === 1.0) {
          results.push({
            question,
            matches,
            score: maxScore
          });
        }
      }
    }
  }
  
  // Sort by score and limit
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Method to get LaTeX templates for this question's subject
questionSchema.methods.getRelevantLatexTemplates = function() {
  const LatexService = require('../services/latexService');
  
  const subjectMap = {
    'physics': 'physics',
    'chemistry': 'chemistry',
    'mathematics': 'mathematics',
    'biology': 'biology'
  };
  
  const mappedSubject = subjectMap[this.subject] || 'mathematics';
  return LatexService.getLatexTemplate(mappedSubject);
};

module.exports = mongoose.model('Question', questionSchema);