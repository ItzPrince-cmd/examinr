const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const fs = require('fs').promises;
const path = require('path');
const AWS = require('aws-sdk');
const cron = require('node-cron');
const logger = require('../utils/logger');
const storageService = require('./storageService');

class BackupService {
  constructor() {
    this.isInitialized = false;
    this.backupJobs = new Map();
    this.s3 = null;
    
    // Backup configuration
    this.config = {
      enabled: process.env.BACKUP_ENABLED === 'true',
      schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
      localPath: process.env.BACKUP_PATH || './backups',
      s3Bucket: process.env.BACKUP_S3_BUCKET || 'examinr-backups',
      compression: true,
      encrypt: true,
      includeRedis: true,
      includeUploads: true
    };
  }

  async initialize() {
    if (!this.config.enabled) {
      logger.info('Backup service is disabled');
      return;
    }

    try {
      // Initialize S3 client for backup storage
      this.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_S3_ENDPOINT
      });

      // Create local backup directory
      await fs.mkdir(this.config.localPath, { recursive: true });

      // Schedule automated backups
      this.scheduleBackups();

      this.isInitialized = true;
      logger.info('Backup service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize backup service:', error);
      throw error;
    }
  }

  // Schedule automated backups
  scheduleBackups() {
    // Schedule MongoDB backup
    const mongoBackupJob = cron.schedule(this.config.schedule, async () => {
      logger.info('Starting scheduled MongoDB backup');
      await this.backupMongoDB();
    });
    this.backupJobs.set('mongodb', mongoBackupJob);

    // Schedule Redis backup (every 6 hours)
    const redisBackupJob = cron.schedule('0 */6 * * *', async () => {
      if (this.config.includeRedis) {
        logger.info('Starting scheduled Redis backup');
        await this.backupRedis();
      }
    });
    this.backupJobs.set('redis', redisBackupJob);

    // Schedule cleanup of old backups
    const cleanupJob = cron.schedule('0 3 * * *', async () => {
      logger.info('Starting backup cleanup');
      await this.cleanupOldBackups();
    });
    this.backupJobs.set('cleanup', cleanupJob);

    logger.info('Backup schedules created');
  }

  // Backup MongoDB database
  async backupMongoDB(options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `mongodb-backup-${timestamp}`;
    const localPath = path.join(this.config.localPath, backupName);

    try {
      logger.info(`Starting MongoDB backup: ${backupName}`);

      // Extract connection details from MongoDB URI
      const mongoUri = process.env.MONGODB_URI;
      const uriParts = this.parseMongoUri(mongoUri);

      // Create mongodump command
      let dumpCommand = `mongodump --uri="${mongoUri}" --out="${localPath}"`;
      
      // Add additional options
      if (options.collections) {
        dumpCommand += ` --collection=${options.collections.join(',')}`;
      }
      if (this.config.compression) {
        dumpCommand += ' --gzip';
      }

      // Execute mongodump
      const { stdout, stderr } = await execAsync(dumpCommand);
      if (stderr && !stderr.includes('done dumping')) {
        throw new Error(stderr);
      }

      logger.info('MongoDB dump completed successfully');

      // Create tar archive
      const archivePath = `${localPath}.tar.gz`;
      await execAsync(`tar -czf ${archivePath} -C ${this.config.localPath} ${backupName}`);
      
      // Remove uncompressed backup
      await execAsync(`rm -rf ${localPath}`);

      // Upload to S3
      const s3Key = `mongodb/${backupName}.tar.gz`;
      await this.uploadToS3(archivePath, s3Key);

      // Store backup metadata
      await this.storeBackupMetadata({
        type: 'mongodb',
        name: backupName,
        timestamp: new Date(timestamp),
        size: (await fs.stat(archivePath)).size,
        s3Key,
        status: 'completed',
        collections: options.collections || 'all'
      });

      // Remove local file after successful upload
      if (!options.keepLocal) {
        await fs.unlink(archivePath);
      }

      logger.info(`MongoDB backup completed: ${backupName}`);
      return { success: true, backupName, s3Key };

    } catch (error) {
      logger.error('MongoDB backup failed:', error);
      
      // Store failed backup metadata
      await this.storeBackupMetadata({
        type: 'mongodb',
        name: backupName,
        timestamp: new Date(),
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  // Backup Redis data
  async backupRedis() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `redis-backup-${timestamp}`;
    const localPath = path.join(this.config.localPath, `${backupName}.rdb`);

    try {
      logger.info(`Starting Redis backup: ${backupName}`);

      // Trigger Redis BGSAVE
      const redis = require('./cacheService').client;
      if (!redis) {
        throw new Error('Redis client not available');
      }

      await promisify(redis.bgsave).bind(redis)();
      
      // Wait for background save to complete
      let saving = true;
      while (saving) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const info = await promisify(redis.info).bind(redis)('persistence');
        saving = info.includes('rdb_bgsave_in_progress:1');
      }

      // Copy RDB file to backup location
      const rdbPath = '/var/lib/redis/dump.rdb'; // Default Redis dump location
      await execAsync(`cp ${rdbPath} ${localPath}`);

      // Compress the backup
      const archivePath = `${localPath}.gz`;
      await execAsync(`gzip -c ${localPath} > ${archivePath}`);
      await fs.unlink(localPath);

      // Upload to S3
      const s3Key = `redis/${backupName}.rdb.gz`;
      await this.uploadToS3(archivePath, s3Key);

      // Store backup metadata
      await this.storeBackupMetadata({
        type: 'redis',
        name: backupName,
        timestamp: new Date(),
        size: (await fs.stat(archivePath)).size,
        s3Key,
        status: 'completed'
      });

      // Remove local file
      await fs.unlink(archivePath);

      logger.info(`Redis backup completed: ${backupName}`);
      return { success: true, backupName, s3Key };

    } catch (error) {
      logger.error('Redis backup failed:', error);
      
      await this.storeBackupMetadata({
        type: 'redis',
        name: backupName,
        timestamp: new Date(),
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  // Backup uploaded files
  async backupUploads(options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `uploads-backup-${timestamp}`;
    const localPath = path.join(this.config.localPath, `${backupName}.tar.gz`);

    try {
      logger.info(`Starting uploads backup: ${backupName}`);

      const uploadsPath = process.env.LOCAL_UPLOAD_PATH || './uploads';
      
      // Create tar archive of uploads
      await execAsync(`tar -czf ${localPath} -C ${path.dirname(uploadsPath)} ${path.basename(uploadsPath)}`);

      // Upload to S3
      const s3Key = `uploads/${backupName}.tar.gz`;
      await this.uploadToS3(localPath, s3Key);

      // Store backup metadata
      await this.storeBackupMetadata({
        type: 'uploads',
        name: backupName,
        timestamp: new Date(),
        size: (await fs.stat(localPath)).size,
        s3Key,
        status: 'completed'
      });

      // Remove local file
      if (!options.keepLocal) {
        await fs.unlink(localPath);
      }

      logger.info(`Uploads backup completed: ${backupName}`);
      return { success: true, backupName, s3Key };

    } catch (error) {
      logger.error('Uploads backup failed:', error);
      throw error;
    }
  }

  // Create full system backup
  async createFullBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `full-backup-${timestamp}`;

    try {
      logger.info(`Starting full system backup: ${backupId}`);

      const results = {
        backupId,
        timestamp: new Date(),
        components: {}
      };

      // Backup MongoDB
      try {
        const mongoResult = await this.backupMongoDB({ keepLocal: false });
        results.components.mongodb = mongoResult;
      } catch (error) {
        results.components.mongodb = { success: false, error: error.message };
      }

      // Backup Redis
      if (this.config.includeRedis) {
        try {
          const redisResult = await this.backupRedis();
          results.components.redis = redisResult;
        } catch (error) {
          results.components.redis = { success: false, error: error.message };
        }
      }

      // Backup uploads
      if (this.config.includeUploads) {
        try {
          const uploadsResult = await this.backupUploads();
          results.components.uploads = uploadsResult;
        } catch (error) {
          results.components.uploads = { success: false, error: error.message };
        }
      }

      // Store full backup metadata
      await this.storeBackupMetadata({
        type: 'full',
        backupId,
        timestamp: results.timestamp,
        components: results.components,
        status: 'completed'
      });

      logger.info('Full system backup completed', results);
      return results;

    } catch (error) {
      logger.error('Full system backup failed:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreFromBackup(backupInfo) {
    try {
      logger.info(`Starting restore from backup: ${backupInfo.name}`);

      // Download backup from S3
      const localPath = path.join(this.config.localPath, path.basename(backupInfo.s3Key));
      await this.downloadFromS3(backupInfo.s3Key, localPath);

      switch (backupInfo.type) {
        case 'mongodb':
          await this.restoreMongoDB(localPath, backupInfo);
          break;
        
        case 'redis':
          await this.restoreRedis(localPath, backupInfo);
          break;
        
        case 'uploads':
          await this.restoreUploads(localPath, backupInfo);
          break;
        
        default:
          throw new Error(`Unknown backup type: ${backupInfo.type}`);
      }

      // Clean up local file
      await fs.unlink(localPath);

      logger.info(`Restore completed successfully: ${backupInfo.name}`);
      return { success: true };

    } catch (error) {
      logger.error('Restore failed:', error);
      throw error;
    }
  }

  // Restore MongoDB from backup
  async restoreMongoDB(archivePath, backupInfo) {
    const extractPath = path.join(this.config.localPath, 'restore-temp');

    try {
      // Extract archive
      await execAsync(`mkdir -p ${extractPath}`);
      await execAsync(`tar -xzf ${archivePath} -C ${extractPath}`);

      // Find the backup directory
      const files = await fs.readdir(extractPath);
      const backupDir = files.find(f => f.includes('mongodb-backup'));
      if (!backupDir) {
        throw new Error('Backup directory not found in archive');
      }

      const dumpPath = path.join(extractPath, backupDir);

      // Restore using mongorestore
      const mongoUri = process.env.MONGODB_URI;
      const restoreCommand = `mongorestore --uri="${mongoUri}" --drop ${dumpPath}`;

      const { stdout, stderr } = await execAsync(restoreCommand);
      if (stderr && !stderr.includes('done')) {
        throw new Error(stderr);
      }

      // Clean up
      await execAsync(`rm -rf ${extractPath}`);

      logger.info('MongoDB restore completed successfully');

    } catch (error) {
      // Clean up on error
      await execAsync(`rm -rf ${extractPath}`).catch(() => {});
      throw error;
    }
  }

  // Restore Redis from backup
  async restoreRedis(archivePath, backupInfo) {
    try {
      // Extract backup
      const rdbPath = archivePath.replace('.gz', '');
      await execAsync(`gunzip -c ${archivePath} > ${rdbPath}`);

      // Stop Redis temporarily
      await execAsync('redis-cli SHUTDOWN NOSAVE');

      // Replace dump file
      const targetPath = '/var/lib/redis/dump.rdb';
      await execAsync(`cp ${rdbPath} ${targetPath}`);
      await execAsync(`chown redis:redis ${targetPath}`);

      // Restart Redis
      await execAsync('systemctl start redis');

      // Clean up
      await fs.unlink(rdbPath);

      logger.info('Redis restore completed successfully');

    } catch (error) {
      // Try to restart Redis on error
      await execAsync('systemctl start redis').catch(() => {});
      throw error;
    }
  }

  // Restore uploads from backup
  async restoreUploads(archivePath, backupInfo) {
    try {
      const uploadsPath = process.env.LOCAL_UPLOAD_PATH || './uploads';
      
      // Backup current uploads
      const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await execAsync(`mv ${uploadsPath} ${uploadsPath}-backup-${backupTimestamp}`);

      // Extract new uploads
      await execAsync(`tar -xzf ${archivePath} -C ${path.dirname(uploadsPath)}`);

      logger.info('Uploads restore completed successfully');

    } catch (error) {
      throw error;
    }
  }

  // Upload file to S3
  async uploadToS3(localPath, s3Key) {
    const fileStream = require('fs').createReadStream(localPath);
    const fileStats = await fs.stat(localPath);

    const params = {
      Bucket: this.config.s3Bucket,
      Key: s3Key,
      Body: fileStream,
      ContentLength: fileStats.size,
      ServerSideEncryption: 'AES256',
      StorageClass: 'STANDARD_IA', // Infrequent Access for cost savings
      Metadata: {
        'backup-date': new Date().toISOString(),
        'backup-size': fileStats.size.toString()
      }
    };

    return await this.s3.upload(params).promise();
  }

  // Download file from S3
  async downloadFromS3(s3Key, localPath) {
    const params = {
      Bucket: this.config.s3Bucket,
      Key: s3Key
    };

    const data = await this.s3.getObject(params).promise();
    await fs.writeFile(localPath, data.Body);
  }

  // Clean up old backups
  async cleanupOldBackups() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      // List all backups
      const params = {
        Bucket: this.config.s3Bucket,
        MaxKeys: 1000
      };

      const objects = await this.s3.listObjectsV2(params).promise();
      const toDelete = [];

      for (const obj of objects.Contents || []) {
        if (new Date(obj.LastModified) < cutoffDate) {
          toDelete.push({ Key: obj.Key });
        }
      }

      if (toDelete.length > 0) {
        // Delete old backups
        const deleteParams = {
          Bucket: this.config.s3Bucket,
          Delete: {
            Objects: toDelete,
            Quiet: true
          }
        };

        await this.s3.deleteObjects(deleteParams).promise();
        logger.info(`Cleaned up ${toDelete.length} old backups`);
      }

      // Clean up local backups
      const localFiles = await fs.readdir(this.config.localPath);
      for (const file of localFiles) {
        const filePath = path.join(this.config.localPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
        }
      }

    } catch (error) {
      logger.error('Backup cleanup failed:', error);
    }
  }

  // List available backups
  async listBackups(options = {}) {
    try {
      const params = {
        Bucket: this.config.s3Bucket,
        Prefix: options.type ? `${options.type}/` : '',
        MaxKeys: options.limit || 100
      };

      const objects = await this.s3.listObjectsV2(params).promise();
      const backups = [];

      for (const obj of objects.Contents || []) {
        const parts = obj.Key.split('/');
        const type = parts[0];
        const name = parts[parts.length - 1];

        backups.push({
          type,
          name,
          s3Key: obj.Key,
          size: obj.Size,
          lastModified: obj.LastModified,
          storageClass: obj.StorageClass
        });
      }

      // Sort by date descending
      backups.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

      return backups;

    } catch (error) {
      logger.error('Failed to list backups:', error);
      throw error;
    }
  }

  // Verify backup integrity
  async verifyBackup(backupInfo) {
    try {
      logger.info(`Verifying backup: ${backupInfo.name}`);

      // Download backup header to verify
      const params = {
        Bucket: this.config.s3Bucket,
        Key: backupInfo.s3Key,
        Range: 'bytes=0-1024' // Read first 1KB
      };

      const data = await this.s3.getObject(params).promise();
      
      // Check if it's a valid gzip file
      const magic = data.Body.slice(0, 2);
      if (magic[0] !== 0x1f || magic[1] !== 0x8b) {
        throw new Error('Invalid backup file format');
      }

      // Get full object metadata
      const headParams = {
        Bucket: this.config.s3Bucket,
        Key: backupInfo.s3Key
      };

      const metadata = await this.s3.headObject(headParams).promise();
      
      return {
        valid: true,
        size: metadata.ContentLength,
        lastModified: metadata.LastModified,
        encryption: metadata.ServerSideEncryption,
        storageClass: metadata.StorageClass
      };

    } catch (error) {
      logger.error('Backup verification failed:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Store backup metadata in database
  async storeBackupMetadata(metadata) {
    try {
      // Store in MongoDB for tracking
      const Backup = require('../models/Backup');
      await Backup.create(metadata);
    } catch (error) {
      logger.error('Failed to store backup metadata:', error);
    }
  }

  // Parse MongoDB URI
  parseMongoUri(uri) {
    const match = uri.match(/mongodb(?:\+srv)?:\/\/(?:([^:]+):([^@]+)@)?([^\/]+)(?:\/([^?]+))?/);
    if (!match) {
      throw new Error('Invalid MongoDB URI');
    }

    return {
      username: match[1],
      password: match[2],
      host: match[3],
      database: match[4]
    };
  }

  // Get backup statistics
  async getBackupStats() {
    try {
      const backups = await this.listBackups();
      const stats = {
        total: backups.length,
        byType: {},
        totalSize: 0,
        oldestBackup: null,
        newestBackup: null
      };

      for (const backup of backups) {
        stats.byType[backup.type] = (stats.byType[backup.type] || 0) + 1;
        stats.totalSize += backup.size;

        if (!stats.oldestBackup || backup.lastModified < stats.oldestBackup.lastModified) {
          stats.oldestBackup = backup;
        }
        if (!stats.newestBackup || backup.lastModified > stats.newestBackup.lastModified) {
          stats.newestBackup = backup;
        }
      }

      return stats;

    } catch (error) {
      logger.error('Failed to get backup stats:', error);
      throw error;
    }
  }

  // Stop all backup jobs
  stopAllJobs() {
    for (const [name, job] of this.backupJobs) {
      job.stop();
      logger.info(`Stopped backup job: ${name}`);
    }
    this.backupJobs.clear();
  }
}

// Create singleton instance
const backupService = new BackupService();

module.exports = backupService;