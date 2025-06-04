const mongoose = require('mongoose');

const studentAnalyticsSchema = new mongoose.Schema({
  // Reference Information
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Overall Performance Metrics
  overallMetrics: {
    totalQuizzesTaken: {
      type: Number,
      default: 0
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    consistencyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    improvementRate: {
      type: Number,
      default: 0 // percentage improvement over time
    },
    lastActivityDate: Date,
    streakDays: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastStreakDate: Date
    }
  },
  
  // Subject-wise Performance
  subjectPerformance: [{
    subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    subjectName: String,
    metrics: {
      quizzesTaken: Number,
      questionsAnswered: Number,
      correctAnswers: Number,
      averageScore: Number,
      averageTime: Number,
      lastAttemptDate: Date,
      improvementRate: Number,
      strongTopics: [String],
      weakTopics: [String]
    },
    proficiencyLevel: {
      type: String,
      enum: ['novice', 'beginner', 'intermediate', 'advanced', 'expert']
    },
    badges: [{
      name: String,
      earnedAt: Date,
      description: String
    }]
  }],
  
  // Learning Progress Tracking
  learningProgress: {
    currentLevel: {
      type: Number,
      default: 1,
      min: 1
    },
    experiencePoints: {
      type: Number,
      default: 0
    },
    nextLevelXP: {
      type: Number,
      default: 100
    },
    completedMilestones: [{
      milestone: String,
      achievedAt: Date,
      reward: String
    }],
    learningPath: [{
      topic: String,
      startedAt: Date,
      completedAt: Date,
      mastery: Number
    }]
  },
  
  // Skill Assessment
  skills: [{
    skillName: String,
    category: String,
    proficiency: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAssessed: Date,
    assessmentCount: Number,
    trend: {
      type: String,
      enum: ['improving', 'stable', 'declining']
    },
    subSkills: [{
      name: String,
      proficiency: Number
    }]
  }],
  
  // Time-based Analytics
  timeAnalytics: {
    averageSessionDuration: Number, // minutes
    preferredStudyTime: {
      hour: Number, // 0-23
      dayOfWeek: [Number] // 0-6
    },
    monthlyStudyTime: [{
      month: Date,
      totalMinutes: Number,
      sessionsCount: Number
    }],
    weeklyPattern: [{
      dayOfWeek: Number,
      averageMinutes: Number,
      frequency: Number
    }],
    productivityScore: {
      morning: Number, // 6-12
      afternoon: Number, // 12-18
      evening: Number, // 18-24
      night: Number // 0-6
    }
  },
  
  // Question Type Performance
  questionTypeMetrics: [{
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'essay', 'short_answer', 'fill_blank', 'matching', 'ordering', 'code']
    },
    metrics: {
      totalAttempted: Number,
      correctAnswers: Number,
      averageTime: Number,
      accuracy: Number,
      confidence: Number
    }
  }],
  
  // Difficulty Analysis
  difficultyMetrics: [{
    level: {
      type: String,
      enum: ['beginner', 'easy', 'medium', 'hard', 'expert']
    },
    metrics: {
      questionsAttempted: Number,
      successRate: Number,
      averageTime: Number,
      improvementRate: Number
    },
    readiness: {
      type: Boolean,
      default: false
    }
  }],
  
  // Learning Behavior Patterns
  behaviorPatterns: {
    studyFrequency: {
      type: String,
      enum: ['daily', 'regular', 'occasional', 'irregular']
    },
    averageQuestionsPerSession: Number,
    reviewFrequency: Number, // How often they review incorrect answers
    hintUsageRate: Number,
    abandonmentRate: Number,
    focusScore: Number, // Based on navigation patterns
    rushingIndicator: Number, // Based on time spent vs average
    guessingRate: Number, // Based on time and pattern analysis
    persistenceScore: Number // Based on retry patterns
  },
  
  // Strengths and Weaknesses
  analysis: {
    strengths: [{
      area: String,
      confidence: Number,
      evidence: [String]
    }],
    weaknesses: [{
      area: String,
      severity: Number,
      suggestedActions: [String]
    }],
    learningStyle: {
      visual: Number,
      auditory: Number,
      kinesthetic: Number,
      reading: Number
    },
    cognitiveProfile: {
      memory: Number,
      comprehension: Number,
      application: Number,
      analysis: Number,
      synthesis: Number,
      evaluation: Number
    }
  },
  
  // Comparative Analytics
  comparativeMetrics: {
    percentileRank: {
      overall: Number,
      bySubject: [{
        subject: String,
        percentile: Number
      }]
    },
    peerComparison: {
      betterThan: Number, // percentage
      averagePeerScore: Number,
      rankInCohort: Number,
      totalInCohort: Number
    },
    globalRank: Number,
    institutionRank: Number
  },
  
  // Predictive Analytics
  predictions: {
    nextQuizScore: {
      predicted: Number,
      confidence: Number,
      factors: [String]
    },
    masteryDate: [{
      topic: String,
      estimatedDate: Date,
      confidence: Number
    }],
    riskOfDropout: {
      probability: Number,
      factors: [String],
      lastCalculated: Date
    },
    recommendedDifficulty: String,
    estimatedStudyTime: Number // Hours needed for next level
  },
  
  // Goals and Achievements
  goals: [{
    title: String,
    description: String,
    targetValue: Number,
    currentValue: Number,
    deadline: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'failed', 'paused']
    },
    createdAt: Date,
    completedAt: Date
  }],
  
  achievements: [{
    type: {
      type: String,
      enum: ['badge', 'certificate', 'milestone', 'streak', 'mastery']
    },
    name: String,
    description: String,
    icon: String,
    earnedAt: Date,
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']
    },
    points: Number
  }],
  
  // Engagement Metrics
  engagement: {
    loginStreak: Number,
    totalLoginDays: Number,
    averageSessionsPerWeek: Number,
    engagementScore: Number,
    motivationLevel: {
      type: String,
      enum: ['very_low', 'low', 'moderate', 'high', 'very_high']
    },
    lastEngagementDrop: Date,
    retentionRisk: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  
  // Recommendation Engine Data
  recommendations: {
    nextTopics: [{
      topic: String,
      reason: String,
      priority: Number,
      estimatedTime: Number
    }],
    studyPlan: [{
      week: Number,
      topics: [String],
      targetHours: Number,
      targetQuizzes: Number
    }],
    resourceSuggestions: [{
      type: String,
      title: String,
      url: String,
      reason: String
    }],
    lastUpdated: Date
  },
  
  // Performance Trends
  trends: {
    weekly: [{
      weekStart: Date,
      averageScore: Number,
      quizzesTaken: Number,
      timeSpent: Number,
      improvement: Number
    }],
    monthly: [{
      month: Date,
      averageScore: Number,
      quizzesTaken: Number,
      questionsAnswered: Number,
      accuracy: Number,
      subjects: [{
        subject: String,
        score: Number
      }]
    }],
    quarterly: [{
      quarter: String,
      year: Number,
      metrics: {
        averageScore: Number,
        totalQuizzes: Number,
        totalTime: Number,
        subjectsStudied: Number,
        overallGrowth: Number
      }
    }]
  },
  
  // Alert and Notification Preferences
  alerts: {
    settings: {
      performanceDrop: Boolean,
      newAchievement: Boolean,
      studyReminder: Boolean,
      goalDeadline: Boolean,
      peerChallenge: Boolean
    },
    history: [{
      type: String,
      message: String,
      sentAt: Date,
      read: Boolean
    }]
  },
  
  // Custom Metrics
  customMetrics: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    category: String,
    lastUpdated: Date
  }],
  
  // Data Quality
  dataQuality: {
    lastCalculated: Date,
    completeness: Number,
    reliability: Number,
    recencyScore: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
studentAnalyticsSchema.index({ student: 1 });
studentAnalyticsSchema.index({ 'overallMetrics.averageScore': -1 });
studentAnalyticsSchema.index({ 'overallMetrics.lastActivityDate': -1 });
studentAnalyticsSchema.index({ 'comparativeMetrics.percentileRank.overall': -1 });
studentAnalyticsSchema.index({ 'engagement.retentionRisk': 1 });
studentAnalyticsSchema.index({ updatedAt: -1 });

// Virtual for performance level
studentAnalyticsSchema.virtual('performanceLevel').get(function() {
  const score = this.overallMetrics.averageScore;
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'satisfactory';
  if (score >= 60) return 'needs_improvement';
  return 'at_risk';
});

// Virtual for study consistency
studentAnalyticsSchema.virtual('isConsistentLearner').get(function() {
  return this.behaviorPatterns.studyFrequency === 'daily' || 
         this.behaviorPatterns.studyFrequency === 'regular';
});

// Methods
studentAnalyticsSchema.methods.updateFromQuizAttempt = async function(attemptId) {
  const QuizAttempt = mongoose.model('QuizAttempt');
  const attempt = await QuizAttempt.findById(attemptId).populate('quiz');
  
  if (!attempt || attempt.user.toString() !== this.student.toString()) {
    throw new Error('Invalid attempt');
  }
  
  // Update overall metrics
  this.overallMetrics.totalQuizzesTaken += 1;
  this.overallMetrics.totalQuestionsAnswered += attempt.answers.length;
  this.overallMetrics.totalCorrectAnswers += attempt.performance.correctAnswers;
  this.overallMetrics.totalTimeSpent += attempt.duration / 60; // Convert to minutes
  
  // Update average score
  const totalScore = this.overallMetrics.averageScore * (this.overallMetrics.totalQuizzesTaken - 1);
  this.overallMetrics.averageScore = (totalScore + attempt.score.percentage) / this.overallMetrics.totalQuizzesTaken;
  
  // Update last activity
  this.overallMetrics.lastActivityDate = new Date();
  
  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastStreak = this.overallMetrics.streakDays.lastStreakDate?.setHours(0, 0, 0, 0);
  
  if (!lastStreak || today - lastStreak === 86400000) { // One day difference
    this.overallMetrics.streakDays.current += 1;
    this.overallMetrics.streakDays.longest = Math.max(
      this.overallMetrics.streakDays.current,
      this.overallMetrics.streakDays.longest
    );
  } else if (today !== lastStreak) {
    this.overallMetrics.streakDays.current = 1;
  }
  this.overallMetrics.streakDays.lastStreakDate = new Date();
  
  // Update subject performance
  const subjectIndex = this.subjectPerformance.findIndex(
    s => s.subject.toString() === attempt.quiz.category.toString()
  );
  
  if (subjectIndex !== -1) {
    const subjectPerf = this.subjectPerformance[subjectIndex];
    subjectPerf.metrics.quizzesTaken += 1;
    subjectPerf.metrics.questionsAnswered += attempt.answers.length;
    subjectPerf.metrics.correctAnswers += attempt.performance.correctAnswers;
    
    const prevAvg = subjectPerf.metrics.averageScore;
    subjectPerf.metrics.averageScore = 
      (prevAvg * (subjectPerf.metrics.quizzesTaken - 1) + attempt.score.percentage) / 
      subjectPerf.metrics.quizzesTaken;
      
    subjectPerf.metrics.lastAttemptDate = new Date();
  } else {
    // Add new subject
    this.subjectPerformance.push({
      subject: attempt.quiz.category,
      metrics: {
        quizzesTaken: 1,
        questionsAnswered: attempt.answers.length,
        correctAnswers: attempt.performance.correctAnswers,
        averageScore: attempt.score.percentage,
        averageTime: attempt.duration / 60,
        lastAttemptDate: new Date()
      }
    });
  }
  
  // Update question type metrics
  for (const answerData of attempt.answers) {
    const typeIndex = this.questionTypeMetrics.findIndex(
      t => t.type === answerData.questionSnapshot.type
    );
    
    if (typeIndex !== -1) {
      const typeMetric = this.questionTypeMetrics[typeIndex];
      typeMetric.metrics.totalAttempted += 1;
      if (answerData.isCorrect) typeMetric.metrics.correctAnswers += 1;
      typeMetric.metrics.accuracy = 
        (typeMetric.metrics.correctAnswers / typeMetric.metrics.totalAttempted) * 100;
    } else {
      this.questionTypeMetrics.push({
        type: answerData.questionSnapshot.type,
        metrics: {
          totalAttempted: 1,
          correctAnswers: answerData.isCorrect ? 1 : 0,
          averageTime: answerData.timeSpent,
          accuracy: answerData.isCorrect ? 100 : 0
        }
      });
    }
  }
  
  await this.save();
};

// Method to calculate improvement rate
studentAnalyticsSchema.methods.calculateImprovementRate = async function(period = 30) {
  const QuizAttempt = mongoose.model('QuizAttempt');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - period);
  
  const attempts = await QuizAttempt.find({
    user: this.student,
    submittedAt: { $gte: cutoffDate },
    status: 'completed'
  }).sort('submittedAt');
  
  if (attempts.length < 2) return 0;
  
  // Split attempts into two halves
  const midPoint = Math.floor(attempts.length / 2);
  const firstHalf = attempts.slice(0, midPoint);
  const secondHalf = attempts.slice(midPoint);
  
  const firstAvg = firstHalf.reduce((sum, a) => sum + a.score.percentage, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, a) => sum + a.score.percentage, 0) / secondHalf.length;
  
  const improvementRate = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  this.overallMetrics.improvementRate = improvementRate;
  await this.save();
  
  return improvementRate;
};

// Method to generate study recommendations
studentAnalyticsSchema.methods.generateRecommendations = async function() {
  const recommendations = {
    nextTopics: [],
    studyPlan: [],
    resourceSuggestions: [],
    lastUpdated: new Date()
  };
  
  // Analyze weak areas
  const weakSubjects = this.subjectPerformance
    .filter(s => s.metrics.averageScore < 70)
    .sort((a, b) => a.metrics.averageScore - b.metrics.averageScore)
    .slice(0, 3);
    
  for (const subject of weakSubjects) {
    recommendations.nextTopics.push({
      topic: subject.subjectName || 'Subject ' + subject.subject,
      reason: `Average score is ${subject.metrics.averageScore.toFixed(1)}%. Improvement needed.`,
      priority: 1,
      estimatedTime: 120 // 2 hours
    });
  }
  
  // Add topics based on difficulty progression
  const currentDifficulty = this.predictions.recommendedDifficulty || 'medium';
  const difficultyProgression = {
    'beginner': 'easy',
    'easy': 'medium',
    'medium': 'hard',
    'hard': 'expert'
  };
  
  if (this.overallMetrics.averageScore > 80) {
    recommendations.nextTopics.push({
      topic: `${difficultyProgression[currentDifficulty]} level questions`,
      reason: 'Ready for more challenging content',
      priority: 2,
      estimatedTime: 90
    });
  }
  
  this.recommendations = recommendations;
  await this.save();
  
  return recommendations;
};

// Method to calculate peer comparison
studentAnalyticsSchema.methods.calculatePeerComparison = async function() {
  const allStudents = await this.constructor.find({
    'overallMetrics.totalQuizzesTaken': { $gte: 5 } // Minimum attempts for fair comparison
  }).select('student overallMetrics.averageScore');
  
  const scores = allStudents.map(s => s.overallMetrics.averageScore).sort((a, b) => a - b);
  const myScore = this.overallMetrics.averageScore;
  
  const betterThan = scores.filter(s => s < myScore).length;
  const percentile = (betterThan / scores.length) * 100;
  
  this.comparativeMetrics.percentileRank.overall = percentile;
  this.comparativeMetrics.peerComparison = {
    betterThan: percentile,
    averagePeerScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    rankInCohort: scores.length - betterThan,
    totalInCohort: scores.length
  };
  
  await this.save();
  return this.comparativeMetrics;
};

// Static method to identify at-risk students
studentAnalyticsSchema.statics.identifyAtRiskStudents = async function(threshold = 60) {
  return this.find({
    $or: [
      { 'overallMetrics.averageScore': { $lt: threshold } },
      { 'engagement.retentionRisk': 'high' },
      { 'predictions.riskOfDropout.probability': { $gt: 0.7 } }
    ]
  }).populate('student', 'firstName lastName email');
};

// Static method to get top performers
studentAnalyticsSchema.statics.getTopPerformers = async function(limit = 10, subject = null) {
  const query = {};
  const sort = {};
  
  if (subject) {
    query['subjectPerformance.subject'] = subject;
    sort['subjectPerformance.$.metrics.averageScore'] = -1;
  } else {
    sort['overallMetrics.averageScore'] = -1;
  }
  
  return this.find(query)
    .sort(sort)
    .limit(limit)
    .populate('student', 'firstName lastName email profile.avatar');
};

module.exports = mongoose.model('StudentAnalytics', studentAnalyticsSchema);