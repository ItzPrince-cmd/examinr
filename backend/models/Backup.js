const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['mongodb', 'redis', 'uploads', 'full'],
    index: true
  },
  name: {
    type: String,
    required: true
  },
  backupId: {
    type: String,
    sparse: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  size: {
    type: Number
  },
  s3Key: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['started', 'completed', 'failed', 'verified'],
    default: 'started'
  },
  error: {
    type: String
  },
  collections: {
    type: mongoose.Schema.Types.Mixed
  },
  components: {
    type: mongoose.Schema.Types.Mixed
  },
  metadata: {
    duration: Number,
    recordCount: Number,
    compressedSize: Number,
    encryption: String,
    storageClass: String
  },
  verification: {
    verified: Boolean,
    verifiedAt: Date,
    checksum: String
  },
  restoration: {
    restoredAt: Date,
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    targetEnvironment: String
  }
}, {
  timestamps: true
});

// Indexes
backupSchema.index({ type: 1, timestamp: -1 });
backupSchema.index({ status: 1, timestamp: -1 });
backupSchema.index({ s3Key: 1 });

// Methods
backupSchema.methods.markCompleted = async function(additionalData = {}) {
  this.status = 'completed';
  Object.assign(this, additionalData);
  this.metadata.duration = Date.now() - this.timestamp.getTime();
  return await this.save();
};

backupSchema.methods.markFailed = async function(error) {
  this.status = 'failed';
  this.error = error.message || error;
  return await this.save();
};

backupSchema.methods.markVerified = async function(checksum) {
  this.status = 'verified';
  this.verification = {
    verified: true,
    verifiedAt: new Date(),
    checksum
  };
  return await this.save();
};

// Statics
backupSchema.statics.getLatestBackup = async function(type) {
  return await this.findOne({ 
    type, 
    status: { $in: ['completed', 'verified'] } 
  }).sort({ timestamp: -1 });
};

backupSchema.statics.getBackupsByDateRange = async function(startDate, endDate, type = null) {
  const query = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (type) {
    query.type = type;
  }
  
  return await this.find(query).sort({ timestamp: -1 });
};

backupSchema.statics.cleanupOldRecords = async function(daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  return await this.deleteMany({
    timestamp: { $lt: cutoffDate }
  });
};

const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;