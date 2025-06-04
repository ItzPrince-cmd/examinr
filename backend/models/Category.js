const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Hierarchy
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null,
    index: true
  },
  ancestors: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0,
    index: true
  },
  order: {
    type: Number,
    default: 0
  },
  
  // Visual Elements
  icon: {
    type: String,
    default: 'folder'
  },
  image: {
    url: String,
    publicId: String
  },
  color: {
    type: String,
    default: '#1976d2'
  },
  
  // Metadata
  metadata: {
    keywords: [String],
    relatedTerms: [String],
    abbreviation: String,
    alternateNames: [String]
  },
  
  // Statistics
  statistics: {
    totalCourses: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    totalQuizzes: {
      type: Number,
      default: 0
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    popularityScore: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  },
  
  // Display Settings
  display: {
    showInMenu: {
      type: Boolean,
      default: true
    },
    showInFilters: {
      type: Boolean,
      default: true
    },
    featuredInHome: {
      type: Boolean,
      default: false
    },
    featuredOrder: Number
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated'],
    default: 'active',
    index: true
  },
  
  // Access Control
  restrictions: {
    requiresSubscription: {
      type: Boolean,
      default: false
    },
    minimumSubscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise']
    },
    allowedRoles: [{
      type: String,
      enum: ['student', 'teacher', 'admin']
    }],
    ageRestriction: {
      minimum: Number,
      maximum: Number
    }
  },
  
  // Related Categories
  relatedCategories: [{
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    relationshipType: {
      type: String,
      enum: ['similar', 'prerequisite', 'advanced', 'complementary']
    }
  }],
  
  // Custom Properties
  customProperties: [{
    key: String,
    value: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'array', 'object']
    }
  }],
  
  // Audit Trail
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ 'display.showInMenu': 1 });
categorySchema.index({ 'statistics.popularityScore': -1 });

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  if (this.ancestors && this.ancestors.length > 0) {
    return [...this.ancestors, this._id];
  }
  return [this._id];
});

// Virtual for children count
categorySchema.virtual('hasChildren').get(function() {
  return this.constructor.countDocuments({ parent: this._id }) > 0;
});

// Pre-save middleware
categorySchema.pre('save', async function(next) {
  // Generate slug from name
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Update ancestors and level
  if (this.isModified('parent')) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.ancestors = [...parent.ancestors, parent._id];
        this.level = parent.level + 1;
      }
    } else {
      this.ancestors = [];
      this.level = 0;
    }
  }
  
  next();
});

// Post-save middleware to update children if parent changes
categorySchema.post('save', async function(doc) {
  if (doc.wasModified && doc.wasModified('ancestors')) {
    // Update all descendants
    const descendants = await this.constructor.find({ ancestors: doc._id });
    
    for (const descendant of descendants) {
      const ancestorIndex = descendant.ancestors.indexOf(doc._id);
      descendant.ancestors = [
        ...doc.ancestors,
        doc._id,
        ...descendant.ancestors.slice(ancestorIndex + 1)
      ];
      descendant.level = descendant.ancestors.length;
      await descendant.save();
    }
  }
});

// Methods
categorySchema.methods.getChildren = function(includeInactive = false) {
  const query = { parent: this._id };
  if (!includeInactive) {
    query.status = 'active';
  }
  return this.constructor.find(query).sort('order name');
};

categorySchema.methods.getDescendants = async function(includeInactive = false) {
  const query = { ancestors: this._id };
  if (!includeInactive) {
    query.status = 'active';
  }
  return this.constructor.find(query).sort('level order name');
};

categorySchema.methods.getSiblings = function(includeSelf = false) {
  const query = { parent: this.parent };
  if (!includeSelf) {
    query._id = { $ne: this._id };
  }
  return this.constructor.find(query).sort('order name');
};

categorySchema.methods.getBreadcrumb = async function() {
  if (this.ancestors.length === 0) {
    return [this];
  }
  
  const ancestors = await this.constructor.find({
    _id: { $in: this.ancestors }
  }).sort('level');
  
  return [...ancestors, this];
};

categorySchema.methods.updateStatistics = async function() {
  const Course = mongoose.model('Course');
  const Question = mongoose.model('Question');
  const Quiz = mongoose.model('Quiz');
  
  // Get all descendant categories
  const descendants = await this.getDescendants(true);
  const categoryIds = [this._id, ...descendants.map(d => d._id)];
  
  // Count courses
  this.statistics.totalCourses = await Course.countDocuments({
    category: { $in: categoryIds },
    status: 'published'
  });
  
  // Count questions
  this.statistics.totalQuestions = await Question.countDocuments({
    subject: { $in: categoryIds },
    status: 'published'
  });
  
  // Count quizzes
  this.statistics.totalQuizzes = await Quiz.countDocuments({
    category: { $in: categoryIds },
    status: 'active'
  });
  
  // Calculate average rating from courses
  const courses = await Course.find({
    category: { $in: categoryIds },
    status: 'published'
  }).select('statistics.averageRating statistics.totalEnrollments');
  
  if (courses.length > 0) {
    const totalRating = courses.reduce((sum, course) => sum + course.statistics.averageRating, 0);
    this.statistics.averageRating = totalRating / courses.length;
    
    // Calculate total students (sum of enrollments)
    this.statistics.totalStudents = courses.reduce((sum, course) => sum + course.statistics.totalEnrollments, 0);
  }
  
  // Calculate popularity score
  this.statistics.popularityScore = 
    (this.statistics.totalCourses * 10) +
    (this.statistics.totalStudents * 1) +
    (this.statistics.averageRating * 20);
  
  this.statistics.lastActivityDate = new Date();
  
  await this.save();
  
  return this.statistics;
};

// Static methods
categorySchema.statics.getTree = async function(parentId = null, includeInactive = false) {
  const query = { parent: parentId };
  if (!includeInactive) {
    query.status = 'active';
  }
  
  const categories = await this.find(query).sort('order name');
  
  const tree = [];
  
  for (const category of categories) {
    const node = category.toObject();
    const children = await this.getTree(category._id, includeInactive);
    
    if (children.length > 0) {
      node.children = children;
    }
    
    tree.push(node);
  }
  
  return tree;
};

categorySchema.statics.getFeaturedCategories = function(limit = 8) {
  return this.find({
    status: 'active',
    'display.featuredInHome': true
  })
  .sort('display.featuredOrder order name')
  .limit(limit);
};

categorySchema.statics.getPopularCategories = function(limit = 10) {
  return this.find({
    status: 'active',
    'statistics.totalCourses': { $gt: 0 }
  })
  .sort('-statistics.popularityScore')
  .limit(limit);
};

categorySchema.statics.searchCategories = async function(query, options = {}) {
  const searchQuery = {
    status: 'active',
    $or: [
      { name: new RegExp(query, 'i') },
      { description: new RegExp(query, 'i') },
      { 'metadata.keywords': new RegExp(query, 'i') },
      { 'metadata.alternateNames': new RegExp(query, 'i') }
    ]
  };
  
  if (options.level !== undefined) {
    searchQuery.level = options.level;
  }
  
  if (options.parent !== undefined) {
    searchQuery.parent = options.parent;
  }
  
  return this.find(searchQuery)
    .sort(options.sort || 'order name')
    .limit(options.limit || 20);
};

categorySchema.statics.createPath = async function(pathArray) {
  // Create a category path from an array of names
  let parent = null;
  const created = [];
  
  for (const name of pathArray) {
    let category = await this.findOne({ name, parent });
    
    if (!category) {
      category = await this.create({ name, parent });
    }
    
    created.push(category);
    parent = category._id;
  }
  
  return created;
};

// Instance method to check if a category is ancestor of another
categorySchema.methods.isAncestorOf = async function(categoryId) {
  const category = await this.constructor.findById(categoryId);
  if (!category) return false;
  
  return category.ancestors.includes(this._id);
};

// Instance method to check if a category is descendant of another
categorySchema.methods.isDescendantOf = function(categoryId) {
  return this.ancestors.includes(categoryId);
};

module.exports = mongoose.model('Category', categorySchema);