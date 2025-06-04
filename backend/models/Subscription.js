const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Plan Information
  plan: {
    id: {
      type: String,
      required: true,
      enum: ['free', 'basic', 'premium', 'enterprise', 'custom']
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    interval: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'lifetime'],
      default: 'monthly'
    },
    price: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD',
        uppercase: true
      },
      displayAmount: String // Formatted for display
    }
  },
  
  // Razorpay Integration
  razorpay: {
    customerId: {
      type: String,
      required: true,
      index: true
    },
    subscriptionId: {
      type: String,
      index: true
    },
    planId: String,
    paymentMethodId: String,
    orderId: String,
    
    // Payment Method Details
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'bank_account', 'paypal', 'other']
      },
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number,
      isDefault: {
        type: Boolean,
        default: true
      }
    },
    
    // Customer Portal
    portalSessionId: String,
    portalUrl: String
  },
  
  // Subscription Status
  status: {
    current: {
      type: String,
      enum: ['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'paused'],
      required: true,
      index: true
    },
    previousStatus: String,
    statusChangedAt: Date,
    cancellationReason: String,
    cancellationFeedback: String,
    pauseReason: String,
    pausedUntil: Date
  },
  
  // Billing Cycle
  billing: {
    currentPeriodStart: {
      type: Date,
      required: true
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
      index: true
    },
    nextBillingDate: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    canceledAt: Date,
    endedAt: Date,
    daysUntilDue: {
      type: Number,
      default: 7
    },
    
    // Billing History
    invoices: [{
      invoiceId: String,
      invoiceNumber: String,
      amount: Number,
      currency: String,
      status: {
        type: String,
        enum: ['draft', 'open', 'paid', 'uncollectible', 'void']
      },
      dueDate: Date,
      paidAt: Date,
      invoiceUrl: String,
      pdfUrl: String,
      items: [{
        description: String,
        quantity: Number,
        unitAmount: Number,
        amount: Number
      }]
    }],
    
    // Payment History
    payments: [{
      paymentId: String,
      amount: Number,
      currency: String,
      status: {
        type: String,
        enum: ['succeeded', 'pending', 'failed', 'refunded', 'partially_refunded']
      },
      paymentDate: Date,
      paymentMethod: String,
      refundAmount: Number,
      refundReason: String,
      receiptUrl: String
    }]
  },
  
  // Trial Information
  trial: {
    isOnTrial: {
      type: Boolean,
      default: false
    },
    trialStart: Date,
    trialEnd: Date,
    trialDaysRemaining: Number,
    hasUsedTrial: {
      type: Boolean,
      default: false
    },
    trialExtendedBy: {
      type: Number,
      default: 0
    }
  },
  
  // Discount and Promotions
  discounts: [{
    discountId: String,
    couponCode: String,
    name: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed_amount']
    },
    amount: Number,
    duration: {
      type: String,
      enum: ['forever', 'once', 'repeating']
    },
    durationInMonths: Number,
    appliedAt: Date,
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Feature Access
  features: {
    // Course Access
    courses: {
      maxCourses: {
        type: Number,
        default: -1 // -1 for unlimited
      },
      maxStudentsPerCourse: {
        type: Number,
        default: -1
      },
      canCreatePrivateCourses: {
        type: Boolean,
        default: true
      }
    },
    
    // Quiz Features
    quizzes: {
      maxQuizzesPerCourse: {
        type: Number,
        default: -1
      },
      maxQuestionsPerQuiz: {
        type: Number,
        default: -1
      },
      advancedQuestionTypes: {
        type: Boolean,
        default: true
      },
      aiQuestionGeneration: {
        type: Boolean,
        default: false
      }
    },
    
    // Analytics
    analytics: {
      basicAnalytics: {
        type: Boolean,
        default: true
      },
      advancedAnalytics: {
        type: Boolean,
        default: false
      },
      exportReports: {
        type: Boolean,
        default: false
      },
      realTimeAnalytics: {
        type: Boolean,
        default: false
      }
    },
    
    // Storage
    storage: {
      maxStorage: {
        type: Number,
        default: 1073741824 // 1GB in bytes
      },
      usedStorage: {
        type: Number,
        default: 0
      },
      maxFileSize: {
        type: Number,
        default: 10485760 // 10MB in bytes
      }
    },
    
    // Communication
    communication: {
      emailSupport: {
        type: Boolean,
        default: true
      },
      prioritySupport: {
        type: Boolean,
        default: false
      },
      phoneSupport: {
        type: Boolean,
        default: false
      },
      dedicatedAccountManager: {
        type: Boolean,
        default: false
      }
    },
    
    // Advanced Features
    advanced: {
      customBranding: {
        type: Boolean,
        default: false
      },
      whiteLabel: {
        type: Boolean,
        default: false
      },
      apiAccess: {
        type: Boolean,
        default: false
      },
      webhooks: {
        type: Boolean,
        default: false
      },
      ssoIntegration: {
        type: Boolean,
        default: false
      },
      customDomain: {
        type: Boolean,
        default: false
      }
    },
    
    // Limits
    limits: {
      monthlyActiveStudents: {
        type: Number,
        default: -1
      },
      apiCallsPerMonth: {
        type: Number,
        default: 1000
      },
      exportLimitPerMonth: {
        type: Number,
        default: 10
      }
    }
  },
  
  // Usage Tracking
  usage: {
    currentPeriod: {
      startDate: Date,
      endDate: Date,
      activeStudents: {
        type: Number,
        default: 0
      },
      coursesCreated: {
        type: Number,
        default: 0
      },
      quizzesCreated: {
        type: Number,
        default: 0
      },
      storageUsed: {
        type: Number,
        default: 0
      },
      apiCalls: {
        type: Number,
        default: 0
      },
      exportsGenerated: {
        type: Number,
        default: 0
      }
    },
    
    // Historical Usage
    history: [{
      period: {
        start: Date,
        end: Date
      },
      metrics: {
        activeStudents: Number,
        coursesCreated: Number,
        quizzesCreated: Number,
        storageUsed: Number,
        apiCalls: Number,
        exportsGenerated: Number
      },
      overageCharges: {
        amount: Number,
        items: [{
          item: String,
          quantity: Number,
          unitPrice: Number,
          total: Number
        }]
      }
    }]
  },
  
  // Add-ons
  addOns: [{
    id: String,
    name: String,
    description: String,
    price: {
      amount: Number,
      currency: String,
      interval: String
    },
    features: mongoose.Schema.Types.Mixed,
    activatedAt: Date,
    deactivatedAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Notifications and Alerts
  notifications: {
    paymentReminders: {
      enabled: {
        type: Boolean,
        default: true
      },
      daysBefore: {
        type: Number,
        default: 3
      }
    },
    usageAlerts: {
      enabled: {
        type: Boolean,
        default: true
      },
      thresholds: {
        storage: {
          type: Number,
          default: 80 // percentage
        },
        activeStudents: {
          type: Number,
          default: 90
        },
        apiCalls: {
          type: Number,
          default: 90
        }
      }
    },
    lastNotificationSent: Date
  },
  
  // Referral Information
  referral: {
    referredBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    referralCode: String,
    referralDiscount: {
      amount: Number,
      type: {
        type: String,
        enum: ['percentage', 'fixed_amount']
      },
      appliedAt: Date,
      expiresAt: Date
    },
    referralCredits: {
      type: Number,
      default: 0
    }
  },
  
  // Support and Communication
  support: {
    tickets: [{
      ticketId: String,
      subject: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent']
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed']
      },
      createdAt: Date,
      resolvedAt: Date
    }],
    accountManager: {
      name: String,
      email: String,
      phone: String,
      assignedAt: Date
    }
  },
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['direct', 'affiliate', 'referral', 'promotion', 'sales_team']
    },
    campaign: String,
    salesRep: String,
    notes: String,
    customFields: mongoose.Schema.Types.Mixed
  },
  
  // Compliance and Legal
  compliance: {
    taxExempt: {
      type: Boolean,
      default: false
    },
    taxIds: [{
      type: String,
      value: String,
      country: String
    }],
    invoicePrefix: String,
    termsAcceptedAt: Date,
    termsVersion: String,
    gdprConsent: {
      given: Boolean,
      date: Date,
      ip: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ 'stripe.customerId': 1 });
subscriptionSchema.index({ 'stripe.subscriptionId': 1 });
subscriptionSchema.index({ 'status.current': 1 });
subscriptionSchema.index({ 'billing.currentPeriodEnd': 1 });
subscriptionSchema.index({ 'plan.id': 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.billing.currentPeriodEnd) return 0;
  const now = new Date();
  const end = new Date(this.billing.currentPeriodEnd);
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual for is expired
subscriptionSchema.virtual('isExpired').get(function() {
  return this.billing.currentPeriodEnd < new Date() && 
         this.status.current !== 'active';
});

// Virtual for can access premium features
subscriptionSchema.virtual('hasActiveSubscription').get(function() {
  return ['active', 'trialing'].includes(this.status.current);
});

// Methods
subscriptionSchema.methods.checkFeatureAccess = function(feature) {
  const featurePath = feature.split('.');
  let currentLevel = this.features;
  
  for (const path of featurePath) {
    if (!currentLevel[path]) return false;
    currentLevel = currentLevel[path];
  }
  
  return currentLevel === true || currentLevel > 0;
};

subscriptionSchema.methods.checkUsageLimit = function(metric) {
  const usage = this.usage.currentPeriod[metric];
  const limit = this.features.limits[metric];
  
  if (limit === -1) return { allowed: true, usage, limit: 'unlimited' };
  
  return {
    allowed: usage < limit,
    usage,
    limit,
    remaining: Math.max(0, limit - usage),
    percentageUsed: (usage / limit) * 100
  };
};

subscriptionSchema.methods.incrementUsage = async function(metric, amount = 1) {
  if (!this.usage.currentPeriod[metric] !== undefined) {
    this.usage.currentPeriod[metric] += amount;
    
    // Check if alert threshold reached
    const limit = this.features.limits[metric];
    if (limit > 0) {
      const percentageUsed = (this.usage.currentPeriod[metric] / limit) * 100;
      const threshold = this.notifications.usageAlerts.thresholds[metric];
      
      if (threshold && percentageUsed >= threshold && this.notifications.usageAlerts.enabled) {
        // Trigger usage alert
        this.sendUsageAlert(metric, percentageUsed);
      }
    }
    
    await this.save();
  }
};

subscriptionSchema.methods.calculateOverage = function() {
  const overages = [];
  const limits = this.features.limits;
  const usage = this.usage.currentPeriod;
  
  // Define overage pricing (this should come from a config)
  const overagePricing = {
    activeStudents: 0.50, // per student
    apiCalls: 0.001, // per call
    storageUsed: 0.10 // per GB
  };
  
  for (const [metric, limit] of Object.entries(limits)) {
    if (limit > 0 && usage[metric] > limit) {
      const overage = usage[metric] - limit;
      const unitPrice = overagePricing[metric] || 0;
      
      overages.push({
        item: metric,
        quantity: overage,
        unitPrice,
        total: overage * unitPrice
      });
    }
  }
  
  return {
    hasOverage: overages.length > 0,
    items: overages,
    totalAmount: overages.reduce((sum, item) => sum + item.total, 0)
  };
};

subscriptionSchema.methods.sendUsageAlert = async function(metric, percentage) {
  // This would integrate with your notification service
  console.log(`Usage alert: ${metric} at ${percentage}% for user ${this.user}`);
  this.notifications.lastNotificationSent = new Date();
  await this.save();
};

// Static methods
subscriptionSchema.statics.getExpiringSubscriptions = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    'status.current': 'active',
    'billing.cancelAtPeriodEnd': false,
    'billing.currentPeriodEnd': {
      $gte: new Date(),
      $lte: futureDate
    }
  }).populate('user', 'email firstName lastName');
};

subscriptionSchema.statics.getRevenueMetrics = async function(startDate, endDate) {
  const subscriptions = await this.find({
    'billing.payments.paymentDate': {
      $gte: startDate,
      $lte: endDate
    }
  });
  
  const metrics = {
    totalRevenue: 0,
    recurringRevenue: 0,
    newSubscriptions: 0,
    churnedSubscriptions: 0,
    averageRevenuePerUser: 0,
    revenueByPlan: {}
  };
  
  for (const sub of subscriptions) {
    const periodPayments = sub.billing.payments.filter(p => 
      p.paymentDate >= startDate && 
      p.paymentDate <= endDate && 
      p.status === 'succeeded'
    );
    
    const periodRevenue = periodPayments.reduce((sum, p) => sum + p.amount, 0);
    metrics.totalRevenue += periodRevenue;
    
    if (!metrics.revenueByPlan[sub.plan.id]) {
      metrics.revenueByPlan[sub.plan.id] = 0;
    }
    metrics.revenueByPlan[sub.plan.id] += periodRevenue;
  }
  
  metrics.averageRevenuePerUser = subscriptions.length > 0 
    ? metrics.totalRevenue / subscriptions.length 
    : 0;
  
  return metrics;
};

// Middleware
subscriptionSchema.pre('save', function(next) {
  // Update trial days remaining
  if (this.trial.isOnTrial && this.trial.trialEnd) {
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((this.trial.trialEnd - now) / (1000 * 60 * 60 * 24)));
    this.trial.trialDaysRemaining = daysRemaining;
    
    // End trial if expired
    if (daysRemaining === 0) {
      this.trial.isOnTrial = false;
      this.trial.hasUsedTrial = true;
    }
  }
  
  // Reset usage metrics if new billing period
  if (this.isModified('billing.currentPeriodStart')) {
    // Archive current usage
    this.usage.history.push({
      period: {
        start: this.usage.currentPeriod.startDate,
        end: this.usage.currentPeriod.endDate
      },
      metrics: { ...this.usage.currentPeriod },
      overageCharges: this.calculateOverage()
    });
    
    // Reset current usage
    this.usage.currentPeriod = {
      startDate: this.billing.currentPeriodStart,
      endDate: this.billing.currentPeriodEnd,
      activeStudents: 0,
      coursesCreated: 0,
      quizzesCreated: 0,
      storageUsed: this.usage.currentPeriod.storageUsed, // Storage carries over
      apiCalls: 0,
      exportsGenerated: 0
    };
  }
  
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);