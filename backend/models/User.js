const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
    // Temporarily disabled for testing - uncomment for production
    // validate: {
    //   validator: function(password) {
    //     // At least one uppercase, one lowercase, one number, one special character
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
    //   },
    //   message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    // }
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'superadmin'],
    default: 'student',
    index: true
  },
  permissions: [{
    type: String,
    enum: ['create_course', 'edit_course', 'delete_course', 'create_quiz', 'edit_quiz', 'delete_quiz', 'view_analytics', 'manage_users']
  }],
  
  // Profile Information
  profile: {
    displayName: String,
    avatar: {
      url: String,
      publicId: String // For Cloudinary
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    phone: {
      countryCode: String,
      number: String,
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Education Information (for students)
  education: {
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
    grade: String
  },
  
  // Teaching Information (for teachers)
  teaching: {
    subjects: [String],
    experience: Number, // years
    qualifications: [String],
    specializations: [String],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  
  // Account Status and Verification
  accountStatus: {
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspensionReason: String,
    suspensionDate: Date,
    deletionRequested: {
      type: Boolean,
      default: false
    },
    deletionRequestDate: Date
  },
  
  // Authentication & Security
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  phoneVerificationCode: String,
  phoneVerificationExpire: Date,
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  lastPasswordChange: Date,
  passwordHistory: [{
    password: String,
    changedAt: Date
  }],
  
  // Subscription Information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due', 'trialing'],
      default: 'inactive'
    },
    stripeCustomerId: {
      type: String,
      select: false
    },
    stripeSubscriptionId: {
      type: String,
      select: false
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    trialStart: Date,
    trialEnd: Date,
    features: {
      maxCourses: {
        type: Number,
        default: 3
      },
      maxStudentsPerCourse: {
        type: Number,
        default: 50
      },
      maxQuizzesPerCourse: {
        type: Number,
        default: 10
      },
      analyticsAccess: {
        type: Boolean,
        default: false
      },
      customBranding: {
        type: Boolean,
        default: false
      },
      prioritySupport: {
        type: Boolean,
        default: false
      },
      apiAccess: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Learning Progress (for students)
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessedAt: Date,
    completedAt: Date,
    certificate: {
      issued: {
        type: Boolean,
        default: false
      },
      issuedAt: Date,
      certificateUrl: String
    }
  }],
  
  // Notification Preferences
  notifications: {
    email: {
      courseUpdates: { type: Boolean, default: true },
      quizReminders: { type: Boolean, default: true },
      gradeNotifications: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    push: {
      courseUpdates: { type: Boolean, default: true },
      quizReminders: { type: Boolean, default: true },
      gradeNotifications: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      importantOnly: { type: Boolean, default: true }
    }
  },
  
  // Device Information
  devices: [{
    deviceId: String,
    deviceType: String,
    deviceName: String,
    lastActive: Date,
    pushToken: String
  }],
  
  // API Usage (for premium users)
  apiUsage: {
    apiKey: {
      type: String,
      select: false
    },
    monthlyRequests: {
      type: Number,
      default: 0
    },
    lastResetDate: Date,
    requestLimit: {
      type: Number,
      default: 1000
    }
  },
  
  // Tokens for authentication
  tokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }],
  
  // Referral System
  referral: {
    code: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    referralCount: {
      type: Number,
      default: 0
    },
    referralCredits: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'accountStatus.isActive': 1 });
userSchema.index({ 'enrolledCourses.course': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'referral.code': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for name (alias for fullName for compatibility)
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for account age
userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // in days
});

// Virtual for subscription active status
userSchema.virtual('hasActiveSubscription').get(function() {
  return this.subscription.status === 'active' || this.subscription.status === 'trialing';
});

// Check if profile is complete
userSchema.pre('save', function(next) {
  if (this.isModified('profile') || this.isModified('firstName') || this.isModified('lastName')) {
    const requiredFields = ['firstName', 'lastName', 'profile.dateOfBirth', 'profile.phone.number'];
    const isComplete = requiredFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], this);
      return value !== undefined && value !== null && value !== '';
    });
    this.accountStatus.isProfileComplete = isComplete;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Check password history (prevent reusing last 5 passwords)
    if (this.passwordHistory && this.passwordHistory.length > 0) {
      for (const oldPassword of this.passwordHistory.slice(-5)) {
        const isMatch = await bcrypt.compare(this.password, oldPassword.password);
        if (isMatch) {
          throw new Error('Cannot reuse recent passwords');
        }
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    // Add to password history
    if (!this.passwordHistory) this.passwordHistory = [];
    this.passwordHistory.push({
      password: hashedPassword,
      changedAt: new Date()
    });
    
    // Keep only last 5 passwords in history
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }
    
    this.password = hashedPassword;
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code before saving new user
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.referral.code) {
    this.referral.code = await this.generateUniqueReferralCode();
  }
  next();
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign(
    { 
      _id: this._id.toString(), 
      role: this.role,
      email: this.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

userSchema.methods.generateUniqueReferralCode = async function() {
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const existingUser = await this.constructor.findOne({ 'referral.code': code });
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  return code;
};

userSchema.methods.incrementLoginAttempts = async function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Remove sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  
  delete user.password;
  delete user.passwordHistory;
  delete user.tokens;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.phoneVerificationCode;
  delete user.twoFactorSecret;
  delete user.__v;
  
  return user;
};

// Static Methods
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new Error('Account is locked due to too many failed login attempts');
  }
  
  const isPasswordMatch = await user.comparePassword(password);
  
  if (!isPasswordMatch) {
    await user.incrementLoginAttempts();
    throw new Error('Invalid credentials');
  }
  
  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }
  
  return user;
};

module.exports = mongoose.model('User', userSchema);