const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  
  // Categorization
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  subcategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    required: true,
    default: 'all_levels'
  },
  
  // Instructor Information
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  coInstructors: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['co_instructor', 'teaching_assistant', 'guest_lecturer']
    },
    permissions: [{
      type: String,
      enum: ['manage_content', 'grade_assignments', 'manage_students', 'view_analytics']
    }]
  }],
  
  // Course Content Structure
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    duration: Number, // in minutes
    lessons: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment', 'live_session', 'resource'],
        required: true
      },
      content: {
        // For video lessons
        video: {
          url: String,
          duration: Number, // in seconds
          thumbnailUrl: String,
          captions: [{
            language: String,
            url: String
          }],
          quality: [{
            resolution: String,
            url: String
          }]
        },
        // For text lessons
        text: {
          content: String,
          estimatedReadTime: Number // in minutes
        },
        // For resources
        resources: [{
          title: String,
          type: {
            type: String,
            enum: ['pdf', 'document', 'spreadsheet', 'presentation', 'code', 'other']
          },
          url: String,
          fileSize: Number,
          downloadable: {
            type: Boolean,
            default: true
          }
        }]
      },
      quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
      },
      assignment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assignment'
      },
      order: {
        type: Number,
        required: true
      },
      isFree: {
        type: Boolean,
        default: false
      },
      isPublished: {
        type: Boolean,
        default: false
      },
      prerequisites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course.modules.lessons'
      }],
      estimatedDuration: Number // in minutes
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    lockedUntil: Date,
    prerequisites: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Course.modules'
    }]
  }],
  
  // Course Settings
  settings: {
    enrollmentType: {
      type: String,
      enum: ['open', 'approval_required', 'invite_only', 'paid'],
      default: 'open'
    },
    maxStudents: {
      type: Number,
      default: -1 // -1 for unlimited
    },
    allowLateEnrollment: {
      type: Boolean,
      default: true
    },
    certificateEnabled: {
      type: Boolean,
      default: true
    },
    certificateTemplate: {
      type: mongoose.Schema.ObjectId,
      ref: 'CertificateTemplate'
    },
    completionCriteria: {
      minProgress: {
        type: Number,
        default: 80,
        min: 0,
        max: 100
      },
      requireAllAssignments: {
        type: Boolean,
        default: true
      },
      requireAllQuizzes: {
        type: Boolean,
        default: true
      },
      minQuizScore: {
        type: Number,
        default: 70,
        min: 0,
        max: 100
      }
    },
    pacing: {
      type: String,
      enum: ['self_paced', 'instructor_paced', 'scheduled'],
      default: 'self_paced'
    },
    discussionEnabled: {
      type: Boolean,
      default: true
    },
    announcementsEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['free', 'one_time', 'subscription'],
      default: 'free'
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    discountedAmount: Number,
    discountEndDate: Date,
    subscriptionPlans: [{
      name: String,
      interval: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly']
      },
      amount: Number,
      features: [String]
    }]
  },
  
  // Course Metadata
  metadata: {
    language: {
      type: String,
      default: 'en'
    },
    duration: {
      type: Number, // Total duration in hours
      required: true
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    totalAssignments: {
      type: Number,
      default: 0
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    prerequisites: [String],
    objectives: [String],
    targetAudience: [String],
    requirements: [String]
  },
  
  // Media
  media: {
    thumbnail: {
      url: String,
      publicId: String
    },
    coverImage: {
      url: String,
      publicId: String
    },
    promoVideo: {
      url: String,
      duration: Number,
      thumbnailUrl: String
    }
  },
  
  // Statistics
  statistics: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    revenue: {
      total: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    }
  },
  
  // Publishing Status
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'unpublished', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: Date,
  unpublishedAt: Date,
  
  // Visibility
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted', 'organization'],
    default: 'public'
  },
  
  // Schedule (for scheduled courses)
  schedule: {
    startDate: Date,
    endDate: Date,
    enrollmentStartDate: Date,
    enrollmentEndDate: Date,
    timezone: {
      type: String,
      default: 'UTC'
    },
    sessions: [{
      title: String,
      date: Date,
      duration: Number, // in minutes
      type: {
        type: String,
        enum: ['lecture', 'lab', 'discussion', 'exam', 'other']
      },
      isRecorded: {
        type: Boolean,
        default: true
      },
      meetingUrl: String,
      recordingUrl: String
    }]
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
  },
  
  // Reviews and Ratings
  reviews: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: {
      type: String,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    },
    helpful: {
      count: {
        type: Number,
        default: 0
      },
      users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }]
    },
    reported: {
      isReported: {
        type: Boolean,
        default: false
      },
      reasons: [String],
      reportedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }]
    },
    instructorResponse: {
      comment: String,
      respondedAt: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }],
  
  // Related Courses
  relatedCourses: [{
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    },
    relationship: {
      type: String,
      enum: ['prerequisite', 'next_level', 'similar', 'bundle']
    }
  }],
  
  // Compliance and Accreditation
  compliance: {
    accreditation: {
      isAccredited: {
        type: Boolean,
        default: false
      },
      body: String,
      certificateNumber: String,
      validUntil: Date
    },
    cpd: {
      enabled: {
        type: Boolean,
        default: false
      },
      points: Number,
      category: String
    },
    accessibility: {
      wcagLevel: {
        type: String,
        enum: ['A', 'AA', 'AAA']
      },
      features: [String]
    }
  },
  
  // Integration
  integrations: {
    lms: {
      enabled: Boolean,
      type: String,
      externalId: String,
      syncEnabled: Boolean,
      lastSynced: Date
    },
    zoom: {
      enabled: Boolean,
      accountId: String,
      defaultSettings: mongoose.Schema.Types.Mixed
    }
  },
  
  // Custom Fields
  customFields: [{
    name: String,
    value: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'date', 'array', 'object']
    }
  }],
  
  // Analytics Settings
  analytics: {
    trackProgress: {
      type: Boolean,
      default: true
    },
    trackEngagement: {
      type: Boolean,
      default: true
    },
    shareWithStudents: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ 'pricing.type': 1, status: 1 });
courseSchema.index({ 'statistics.averageRating': -1 });
courseSchema.index({ 'statistics.totalEnrollments': -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ slug: 1 });

// Virtual for is free
courseSchema.virtual('isFree').get(function() {
  return this.pricing.type === 'free' || this.pricing.amount === 0;
});

// Virtual for has discount
courseSchema.virtual('hasDiscount').get(function() {
  return this.pricing.discountedAmount && 
         this.pricing.discountEndDate && 
         this.pricing.discountEndDate > new Date();
});

// Virtual for current price
courseSchema.virtual('currentPrice').get(function() {
  if (this.isFree) return 0;
  if (this.hasDiscount) return this.pricing.discountedAmount;
  return this.pricing.amount;
});

// Pre-save middleware
courseSchema.pre('save', function(next) {
  // Generate slug from title
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
  
  // Calculate totals
  if (this.isModified('modules')) {
    let totalLessons = 0;
    let totalQuizzes = 0;
    let totalAssignments = 0;
    let totalDuration = 0;
    
    this.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (lesson.type === 'quiz') totalQuizzes++;
        if (lesson.type === 'assignment') totalAssignments++;
        totalDuration += lesson.estimatedDuration || 0;
      });
    });
    
    this.metadata.totalLessons = totalLessons;
    this.metadata.totalQuizzes = totalQuizzes;
    this.metadata.totalAssignments = totalAssignments;
    this.metadata.duration = Math.ceil(totalDuration / 60); // Convert to hours
  }
  
  // Update average rating
  if (this.isModified('reviews')) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.statistics.averageRating = this.reviews.length > 0 
      ? totalRating / this.reviews.length 
      : 0;
    this.statistics.totalRatings = this.reviews.length;
    this.statistics.totalReviews = this.reviews.filter(r => r.comment).length;
  }
  
  next();
});

// Methods
courseSchema.methods.enrollStudent = async function(studentId) {
  const User = mongoose.model('User');
  const student = await User.findById(studentId);
  
  if (!student) {
    throw new Error('Student not found');
  }
  
  // Check if already enrolled
  const isEnrolled = student.enrolledCourses.some(
    ec => ec.course.toString() === this._id.toString()
  );
  
  if (isEnrolled) {
    throw new Error('Student already enrolled');
  }
  
  // Check enrollment limits
  if (this.settings.maxStudents > 0 && this.statistics.activeStudents >= this.settings.maxStudents) {
    throw new Error('Course is full');
  }
  
  // Add to student's enrolled courses
  student.enrolledCourses.push({
    course: this._id,
    enrolledAt: new Date(),
    progress: 0
  });
  
  await student.save();
  
  // Update course statistics
  this.statistics.totalEnrollments += 1;
  this.statistics.activeStudents += 1;
  
  await this.save();
  
  return true;
};

courseSchema.methods.addReview = async function(studentId, rating, title, comment) {
  // Check if student has already reviewed
  const existingReview = this.reviews.find(
    r => r.student.toString() === studentId.toString()
  );
  
  if (existingReview) {
    throw new Error('You have already reviewed this course');
  }
  
  // Check if student is enrolled
  const User = mongoose.model('User');
  const student = await User.findById(studentId);
  const isEnrolled = student.enrolledCourses.some(
    ec => ec.course.toString() === this._id.toString()
  );
  
  if (!isEnrolled) {
    throw new Error('You must be enrolled to review this course');
  }
  
  // Add review
  this.reviews.push({
    student: studentId,
    rating,
    title,
    comment,
    createdAt: new Date()
  });
  
  await this.save();
  
  return this.reviews[this.reviews.length - 1];
};

// Static methods
courseSchema.statics.getFeatured = function(limit = 10) {
  return this.find({
    status: 'published',
    visibility: 'public',
    'statistics.averageRating': { $gte: 4 },
    'statistics.totalEnrollments': { $gte: 100 }
  })
  .sort('-statistics.averageRating -statistics.totalEnrollments')
  .limit(limit)
  .populate('instructor', 'firstName lastName profile.avatar')
  .populate('category', 'name');
};

courseSchema.statics.getPopular = function(limit = 10) {
  return this.find({
    status: 'published',
    visibility: 'public'
  })
  .sort('-statistics.totalEnrollments -statistics.averageRating')
  .limit(limit)
  .populate('instructor', 'firstName lastName profile.avatar')
  .populate('category', 'name');
};

courseSchema.statics.searchCourses = async function(query, filters = {}) {
  const searchQuery = {
    status: 'published',
    visibility: 'public'
  };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Apply filters
  if (filters.category) searchQuery.category = filters.category;
  if (filters.level) searchQuery.level = filters.level;
  if (filters.price) {
    if (filters.price === 'free') {
      searchQuery['pricing.type'] = 'free';
    } else if (filters.price === 'paid') {
      searchQuery['pricing.type'] = { $ne: 'free' };
    }
  }
  if (filters.rating) {
    searchQuery['statistics.averageRating'] = { $gte: parseFloat(filters.rating) };
  }
  if (filters.duration) {
    const [min, max] = filters.duration.split('-').map(Number);
    searchQuery['metadata.duration'] = { $gte: min, $lte: max };
  }
  
  const courses = await this.find(searchQuery)
    .populate('instructor', 'firstName lastName profile.avatar')
    .populate('category', 'name')
    .sort(filters.sort || '-statistics.totalEnrollments');
  
  return courses;
};

module.exports = mongoose.model('Course', courseSchema);