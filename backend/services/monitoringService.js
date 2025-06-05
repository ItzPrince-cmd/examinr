const os = require('os');
const { promisify } = require('util');
const logger = require('../utils/logger');
const cacheService = require('./cacheService');
const { getConnectionStats } = require('../config/database');
const AWS = require('aws-sdk');

class MonitoringService {
  constructor() {
    this.isEnabled = process.env.ENABLE_MONITORING === 'true';
    this.interval = parseInt(process.env.MONITORING_INTERVAL) || 300000; // 5 minutes
    this.metricsHistory = [];
    this.maxHistorySize = 288; // 24 hours of 5-minute intervals
    this.intervalId = null;
    this.cloudWatch = null;
    this.alerts = new Map();
    
    // Thresholds for alerts
    this.thresholds = {
      cpu: 80, // %
      memory: 85, // %
      diskSpace: 90, // %
      dbConnections: 90, // % of pool
      cacheHitRate: 70, // %
      responseTime: 1000, // ms
      errorRate: 5, // %
      storageUsage: 80 // % of quota
    };
  }

  async initialize() {
    if (!this.isEnabled) {
      logger.info('Monitoring service is disabled');
      return;
    }

    try {
      // Initialize CloudWatch for AWS monitoring
      if (process.env.AWS_ACCESS_KEY_ID) {
        this.cloudWatch = new AWS.CloudWatch({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        });
      }

      // Start collecting metrics
      this.startMonitoring();

      logger.info('Monitoring service initialized');
    } catch (error) {
      logger.error('Failed to initialize monitoring service:', error);
    }
  }

  startMonitoring() {
    // Collect metrics immediately
    this.collectMetrics();

    // Set up interval for periodic collection
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, this.interval);
  }

  async collectMetrics() {
    try {
      const timestamp = new Date();
      const metrics = {
        timestamp,
        system: await this.collectSystemMetrics(),
        database: await this.collectDatabaseMetrics(),
        cache: await this.collectCacheMetrics(),
        storage: await this.collectStorageMetrics(),
        application: await this.collectApplicationMetrics()
      };

      // Store metrics
      this.storeMetrics(metrics);

      // Check thresholds and send alerts
      await this.checkThresholds(metrics);

      // Send to CloudWatch if available
      if (this.cloudWatch) {
        await this.sendToCloudWatch(metrics);
      }

      // Log summary
      logger.debug('Metrics collected', {
        cpu: `${metrics.system.cpu.usage.toFixed(2)}%`,
        memory: `${metrics.system.memory.usagePercent.toFixed(2)}%`,
        cacheHitRate: `${metrics.cache.hitRate}%`,
        dbConnections: metrics.database.connections
      });

    } catch (error) {
      logger.error('Failed to collect metrics:', error);
    }
  }

  async collectSystemMetrics() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calculate CPU usage
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total * 100);
    }, 0) / cpus.length;

    // Get disk usage (requires additional system call)
    const diskUsage = await this.getDiskUsage();

    return {
      cpu: {
        count: cpus.length,
        usage: cpuUsage,
        loadAverage: os.loadavg()
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        usagePercent: (usedMemory / totalMemory) * 100
      },
      disk: diskUsage,
      uptime: os.uptime(),
      platform: os.platform(),
      hostname: os.hostname()
    };
  }

  async collectDatabaseMetrics() {
    try {
      const dbStats = getConnectionStats();
      const mongoose = require('mongoose');
      
      // Get collection stats
      const db = mongoose.connection.db;
      const stats = await db.stats();
      
      return {
        connected: dbStats.readyState === 1,
        connections: mongoose.connections.length,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        avgObjSize: stats.avgObjSize,
        objects: stats.objects,
        ...dbStats
      };
    } catch (error) {
      logger.error('Failed to collect database metrics:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  async collectCacheMetrics() {
    const stats = cacheService.getStats();
    const memoryInfo = await cacheService.getMemoryInfo();
    
    return {
      ...stats,
      memory: memoryInfo ? {
        used: parseInt(memoryInfo.used_memory || 0),
        peak: parseInt(memoryInfo.used_memory_peak || 0),
        rss: parseInt(memoryInfo.used_memory_rss || 0),
        fragmentation: parseFloat(memoryInfo.mem_fragmentation_ratio || 0)
      } : null
    };
  }

  async collectStorageMetrics() {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });

      // Get bucket metrics
      const bucketName = process.env.AWS_S3_BUCKET;
      const listParams = {
        Bucket: bucketName,
        MaxKeys: 1000
      };

      let totalSize = 0;
      let objectCount = 0;
      let continuationToken;

      // Count objects and total size
      do {
        if (continuationToken) {
          listParams.ContinuationToken = continuationToken;
        }

        const data = await s3.listObjectsV2(listParams).promise();
        objectCount += data.KeyCount || 0;
        
        if (data.Contents) {
          totalSize += data.Contents.reduce((acc, obj) => acc + obj.Size, 0);
        }

        continuationToken = data.NextContinuationToken;
      } while (continuationToken);

      // Get storage class distribution
      const storageClasses = {};
      const classListParams = {
        Bucket: bucketName,
        MaxKeys: 100
      };

      const sampleData = await s3.listObjectsV2(classListParams).promise();
      if (sampleData.Contents) {
        sampleData.Contents.forEach(obj => {
          storageClasses[obj.StorageClass || 'STANDARD'] = 
            (storageClasses[obj.StorageClass || 'STANDARD'] || 0) + 1;
        });
      }

      return {
        s3: {
          bucket: bucketName,
          objectCount,
          totalSize,
          totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
          totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(2),
          storageClasses,
          averageObjectSize: objectCount > 0 ? (totalSize / objectCount) : 0
        },
        local: await this.getLocalStorageMetrics()
      };

    } catch (error) {
      logger.error('Failed to collect storage metrics:', error);
      return {
        error: error.message
      };
    }
  }

  async collectApplicationMetrics() {
    const processMemory = process.memoryUsage();
    
    return {
      memory: {
        rss: processMemory.rss,
        heapTotal: processMemory.heapTotal,
        heapUsed: processMemory.heapUsed,
        external: processMemory.external,
        arrayBuffers: processMemory.arrayBuffers
      },
      uptime: process.uptime(),
      pid: process.pid,
      version: process.version,
      activeRequests: global.activeRequests || 0,
      totalRequests: global.totalRequests || 0,
      errors: global.errorCount || 0,
      responseTime: global.averageResponseTime || 0
    };
  }

  async getDiskUsage() {
    try {
      const { exec } = require('child_process');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync("df -k / | tail -1 | awk '{print $3,$4,$5}'");
      const [used, available, percentage] = stdout.trim().split(' ');
      
      return {
        used: parseInt(used) * 1024, // Convert to bytes
        available: parseInt(available) * 1024,
        usagePercent: parseInt(percentage)
      };
    } catch (error) {
      logger.error('Failed to get disk usage:', error);
      return {
        error: error.message
      };
    }
  }

  async getLocalStorageMetrics() {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const uploadsPath = process.env.LOCAL_UPLOAD_PATH || './uploads';
      
      let totalSize = 0;
      let fileCount = 0;

      async function calculateDirSize(dirPath) {
        const files = await fs.readdir(dirPath);
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.isDirectory()) {
            await calculateDirSize(filePath);
          } else {
            totalSize += stats.size;
            fileCount++;
          }
        }
      }

      await calculateDirSize(uploadsPath);

      return {
        path: uploadsPath,
        fileCount,
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
      };

    } catch (error) {
      return {
        error: error.message
      };
    }
  }

  storeMetrics(metrics) {
    // Add to history
    this.metricsHistory.push(metrics);

    // Maintain max history size
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }

    // Store in database for long-term analysis
    this.storeMetricsInDB(metrics).catch(error => {
      logger.error('Failed to store metrics in DB:', error);
    });
  }

  async storeMetricsInDB(metrics) {
    try {
      const SystemMetrics = require('../models/SystemMetrics');
      await SystemMetrics.create({
        timestamp: metrics.timestamp,
        cpu: metrics.system.cpu.usage,
        memoryUsage: metrics.system.memory.usagePercent,
        diskUsage: metrics.system.disk.usagePercent,
        dbConnections: metrics.database.connections,
        cacheHitRate: parseFloat(metrics.cache.hitRate),
        s3Storage: metrics.storage.s3?.totalSize || 0,
        activeRequests: metrics.application.activeRequests,
        responseTime: metrics.application.responseTime,
        errors: metrics.application.errors
      });
    } catch (error) {
      // Model might not exist, skip
    }
  }

  async checkThresholds(metrics) {
    const alerts = [];

    // Check CPU usage
    if (metrics.system.cpu.usage > this.thresholds.cpu) {
      alerts.push({
        type: 'cpu',
        severity: 'warning',
        message: `High CPU usage: ${metrics.system.cpu.usage.toFixed(2)}%`,
        value: metrics.system.cpu.usage
      });
    }

    // Check memory usage
    if (metrics.system.memory.usagePercent > this.thresholds.memory) {
      alerts.push({
        type: 'memory',
        severity: 'warning',
        message: `High memory usage: ${metrics.system.memory.usagePercent.toFixed(2)}%`,
        value: metrics.system.memory.usagePercent
      });
    }

    // Check disk usage
    if (metrics.system.disk.usagePercent > this.thresholds.diskSpace) {
      alerts.push({
        type: 'disk',
        severity: 'critical',
        message: `Low disk space: ${metrics.system.disk.usagePercent}% used`,
        value: metrics.system.disk.usagePercent
      });
    }

    // Check cache hit rate
    const cacheHitRate = parseFloat(metrics.cache.hitRate);
    if (cacheHitRate < this.thresholds.cacheHitRate && metrics.cache.total > 100) {
      alerts.push({
        type: 'cache',
        severity: 'info',
        message: `Low cache hit rate: ${cacheHitRate}%`,
        value: cacheHitRate
      });
    }

    // Process alerts
    for (const alert of alerts) {
      await this.handleAlert(alert);
    }
  }

  async handleAlert(alert) {
    const alertKey = `${alert.type}:${alert.severity}`;
    const existingAlert = this.alerts.get(alertKey);

    // Debounce alerts (don't send same alert within 30 minutes)
    if (existingAlert && Date.now() - existingAlert.timestamp < 30 * 60 * 1000) {
      return;
    }

    this.alerts.set(alertKey, {
      ...alert,
      timestamp: Date.now()
    });

    logger.warn('System alert triggered', alert);

    // Send alert notification (implement based on your notification system)
    // await this.sendAlertNotification(alert);
  }

  async sendToCloudWatch(metrics) {
    try {
      const namespace = 'Examinr/Production';
      const timestamp = new Date();

      const params = {
        Namespace: namespace,
        MetricData: [
          {
            MetricName: 'CPUUsage',
            Value: metrics.system.cpu.usage,
            Unit: 'Percent',
            Timestamp: timestamp
          },
          {
            MetricName: 'MemoryUsage',
            Value: metrics.system.memory.usagePercent,
            Unit: 'Percent',
            Timestamp: timestamp
          },
          {
            MetricName: 'CacheHitRate',
            Value: parseFloat(metrics.cache.hitRate),
            Unit: 'Percent',
            Timestamp: timestamp
          },
          {
            MetricName: 'DatabaseConnections',
            Value: metrics.database.connections,
            Unit: 'Count',
            Timestamp: timestamp
          },
          {
            MetricName: 'S3StorageUsed',
            Value: metrics.storage.s3?.totalSize || 0,
            Unit: 'Bytes',
            Timestamp: timestamp
          }
        ]
      };

      await this.cloudWatch.putMetricData(params).promise();
    } catch (error) {
      logger.error('Failed to send metrics to CloudWatch:', error);
    }
  }

  getMetricsHistory(duration = 3600000) { // Default 1 hour
    const cutoff = Date.now() - duration;
    return this.metricsHistory.filter(m => 
      new Date(m.timestamp).getTime() > cutoff
    );
  }

  getLatestMetrics() {
    return this.metricsHistory[this.metricsHistory.length - 1] || null;
  }

  getAverageMetrics(duration = 3600000) {
    const history = this.getMetricsHistory(duration);
    if (history.length === 0) return null;

    const avg = {
      cpu: 0,
      memory: 0,
      cacheHitRate: 0,
      responseTime: 0
    };

    history.forEach(m => {
      avg.cpu += m.system.cpu.usage;
      avg.memory += m.system.memory.usagePercent;
      avg.cacheHitRate += parseFloat(m.cache.hitRate);
      avg.responseTime += m.application.responseTime;
    });

    const count = history.length;
    return {
      cpu: (avg.cpu / count).toFixed(2),
      memory: (avg.memory / count).toFixed(2),
      cacheHitRate: (avg.cacheHitRate / count).toFixed(2),
      responseTime: (avg.responseTime / count).toFixed(2),
      sampleSize: count
    };
  }

  async generateHealthReport() {
    const latest = this.getLatestMetrics();
    const averages = this.getAverageMetrics();
    const alerts = Array.from(this.alerts.values());

    return {
      status: alerts.some(a => a.severity === 'critical') ? 'critical' :
              alerts.some(a => a.severity === 'warning') ? 'warning' : 'healthy',
      timestamp: new Date(),
      current: latest,
      averages,
      alerts: alerts.filter(a => Date.now() - a.timestamp < 3600000), // Last hour
      uptime: {
        system: latest?.system.uptime || 0,
        application: latest?.application.uptime || 0
      },
      storage: {
        s3: latest?.storage.s3 || {},
        local: latest?.storage.local || {}
      }
    };
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Monitoring service stopped');
    }
  }
}

// Create singleton instance
const monitoringService = new MonitoringService();

module.exports = monitoringService;