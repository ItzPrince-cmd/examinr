const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Batch name is required'],
    trim: true,
    maxlength: [100, 'Batch name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Teacher Information
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  assistantTeachers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  
  // Subject and Category
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Geography']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  
  // Schedule Information
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    classDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    classTime: {
      hour: {
        type: Number,
        min: 0,
        max: 23
      },
      minute: {
        type: Number,
        min: 0,
        max: 59
      }
    },
    duration: {
      type: Number, // in minutes
      default: 60
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Enrollment Information
  enrollment: {
    maxStudents: {
      type: Number,
      default: 50,
      min: 1
    },
    enrolledStudents: [{
      student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'completed', 'dropped'],
        default: 'active'
      }
    }],
    requiresApproval: {
      type: Boolean,
      default: false
    },
    enrollmentDeadline: Date,
    price: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    }
  },
  
  // Live Sessions
  liveSessions: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 60
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    meetingId: String,
    meetingPassword: String,
    startedAt: Date,
    endedAt: Date,
    recording: {
      url: String,
      duration: Number,
      size: Number
    },
    attendance: [{
      student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      joinedAt: Date,
      leftAt: Date,
      duration: Number // in minutes
    }]
  }],
  
  // Assignments and Tests
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quiz'
    },
    submissions: [{
      student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      submittedAt: Date,
      score: Number,
      feedback: String
    }]
  }],
  
  // Resources
  resources: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Announcements
  announcements: [{
    title: String,
    content: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  
  // Status and Settings
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  settings: {
    allowRecording: {
      type: Boolean,
      default: true
    },
    allowChat: {
      type: Boolean,
      default: true
    },
    allowScreenShare: {
      type: Boolean,
      default: true
    },
    allowStudentMic: {
      type: Boolean,
      default: false
    },
    allowStudentVideo: {
      type: Boolean,
      default: false
    },
    autoRecord: {
      type: Boolean,
      default: false
    }
  },
  
  // Performance Metrics
  metrics: {
    averageAttendance: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    studentSatisfaction: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  
  // SEO and Discovery
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
batchSchema.index({ teacher: 1, status: 1 });
batchSchema.index({ code: 1 });
batchSchema.index({ 'enrollment.enrolledStudents.student': 1 });
batchSchema.index({ subject: 1, level: 1 });
batchSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

// Virtual for current enrollment count
batchSchema.virtual('currentEnrollment').get(function() {
  return this.enrollment.enrolledStudents.filter(e => e.status === 'active').length;
});

// Virtual for available slots
batchSchema.virtual('availableSlots').get(function() {
  const activeStudents = this.enrollment.enrolledStudents.filter(e => e.status === 'active').length;
  return this.enrollment.maxStudents - activeStudents;
});

// Virtual to check if batch is full
batchSchema.virtual('isFull').get(function() {
  return this.availableSlots <= 0;
});

// Virtual to check if batch is ongoing
batchSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         now >= this.schedule.startDate && 
         now <= this.schedule.endDate;
});

// Methods
batchSchema.methods.enrollStudent = async function(studentId) {
  // Check if already enrolled
  const existingEnrollment = this.enrollment.enrolledStudents.find(
    e => e.student.toString() === studentId.toString()
  );
  
  if (existingEnrollment) {
    if (existingEnrollment.status === 'active') {
      throw new Error('Student is already enrolled');
    }
    // Reactivate if previously dropped
    existingEnrollment.status = 'active';
    existingEnrollment.enrolledAt = new Date();
  } else {
    // Check if batch is full
    if (this.isFull) {
      throw new Error('Batch is full');
    }
    
    // Add new enrollment
    this.enrollment.enrolledStudents.push({
      student: studentId,
      status: 'active'
    });
  }
  
  return this.save();
};

batchSchema.methods.unenrollStudent = async function(studentId) {
  const enrollment = this.enrollment.enrolledStudents.find(
    e => e.student.toString() === studentId.toString()
  );
  
  if (!enrollment) {
    throw new Error('Student is not enrolled');
  }
  
  enrollment.status = 'dropped';
  return this.save();
};

batchSchema.methods.getNextSession = function() {
  const now = new Date();
  return this.liveSessions
    .filter(session => session.scheduledDate > now && session.status === 'scheduled')
    .sort((a, b) => a.scheduledDate - b.scheduledDate)[0];
};

batchSchema.methods.generateBatchCode = async function() {
  const prefix = this.subject.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  this.code = `${prefix}-${random}`;
  
  // Ensure uniqueness
  let attempts = 0;
  while (attempts < 10) {
    const existing = await this.constructor.findOne({ code: this.code });
    if (!existing) break;
    
    this.code = `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    attempts++;
  }
};

// Pre-save hook
batchSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    await this.generateBatchCode();
  }
  next();
});

// Static methods
batchSchema.statics.getActiveByTeacher = async function(teacherId) {
  return this.find({
    teacher: teacherId,
    status: { $in: ['active', 'paused'] }
  }).populate('category enrollment.enrolledStudents.student');
};

batchSchema.statics.getEnrolledByStudent = async function(studentId) {
  return this.find({
    'enrollment.enrolledStudents': {
      $elemMatch: {
        student: studentId,
        status: 'active'
      }
    },
    status: { $in: ['active', 'paused'] }
  }).populate('teacher category');
};

module.exports = mongoose.model('Batch', batchSchema);