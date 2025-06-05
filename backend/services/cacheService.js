const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');
const crypto = require('crypto');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      evictions: 0
    };
    
    // Cache configuration
    this.config = {
      // TTL configurations for different data types
      ttl: {
        question: 3600,        // 1 hour
        quiz: 1800,           // 30 minutes
        user: 300,            // 5 minutes
        session: 86400,       // 24 hours
        analytics: 600,       // 10 minutes
        search: 1800,         // 30 minutes
        leaderboard: 300,     // 5 minutes
        image: 7200,          // 2 hours for image URLs
        default: 3600         // 1 hour
      },
      // Max memory policies
      maxMemory: process.env.REDIS_MAX_MEMORY || '256mb',
      evictionPolicy: 'allkeys-lru'
    };
  }

  async connect() {
    try {
      // Create Redis client with optimized settings
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        // Connection pool and performance settings
        connect_timeout: 5000,
        max_attempts: 10,
        retry_max_delay: 3000,
        enable_offline_queue: true,
        no_ready_check: true,
        socket_keepalive: true,
        socket_initial_delay: 0,
        // Retry strategy
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis connection refused');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      // Promisify all Redis methods we'll use
      this.getAsync = promisify(this.client.get).bind(this.client);
      this.setAsync = promisify(this.client.set).bind(this.client);
      this.setexAsync = promisify(this.client.setex).bind(this.client);
      this.delAsync = promisify(this.client.del).bind(this.client);
      this.existsAsync = promisify(this.client.exists).bind(this.client);
      this.expireAsync = promisify(this.client.expire).bind(this.client);
      this.ttlAsync = promisify(this.client.ttl).bind(this.client);
      this.keysAsync = promisify(this.client.keys).bind(this.client);
      this.flushdbAsync = promisify(this.client.flushdb).bind(this.client);
      this.mgetAsync = promisify(this.client.mget).bind(this.client);
      this.msetAsync = promisify(this.client.mset).bind(this.client);
      this.hgetAsync = promisify(this.client.hget).bind(this.client);
      this.hsetAsync = promisify(this.client.hset).bind(this.client);
      this.hgetallAsync = promisify(this.client.hgetall).bind(this.client);
      this.hincrbyAsync = promisify(this.client.hincrby).bind(this.client);
      this.incrAsync = promisify(this.client.incr).bind(this.client);
      this.decrAsync = promisify(this.client.decr).bind(this.client);
      this.saddAsync = promisify(this.client.sadd).bind(this.client);
      this.smembersAsync = promisify(this.client.smembers).bind(this.client);
      this.sremAsync = promisify(this.client.srem).bind(this.client);
      this.zaddAsync = promisify(this.client.zadd).bind(this.client);
      this.zrangeAsync = promisify(this.client.zrange).bind(this.client);
      this.zrevrangeAsync = promisify(this.client.zrevrange).bind(this.client);
      this.configAsync = promisify(this.client.config).bind(this.client);
      this.scanAsync = promisify(this.client.scan).bind(this.client);

      // Event handlers
      this.client.on('error', (err) => {
        logger.error('Redis error:', err);
        this.stats.errors++;
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis connected');
        this.isConnected = true;
        this.configureRedis();
      });

      this.client.on('ready', () => {
        logger.info('Redis ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      return true;
    } catch (error) {
      logger.error('Failed to initialize Redis:', error);
      this.isConnected = false;
      return false;
    }
  }

  async configureRedis() {
    try {
      // Set max memory and eviction policy
      await this.configAsync('SET', 'maxmemory', this.config.maxMemory);
      await this.configAsync('SET', 'maxmemory-policy', this.config.evictionPolicy);
      logger.info('Redis configured successfully');
    } catch (error) {
      logger.error('Failed to configure Redis:', error);
    }
  }

  // Generate cache key with namespace
  generateKey(namespace, id) {
    return `examinr:${namespace}:${id}`;
  }

  // Hash key for consistent caching
  hashKey(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  // Get with stats tracking
  async get(key, namespace = null) {
    if (!this.isConnected) return null;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    
    try {
      const value = await this.getAsync(fullKey);
      if (value) {
        this.stats.hits++;
        return JSON.parse(value);
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      logger.error('Redis get error:', error);
      this.stats.errors++;
      return null;
    }
  }

  // Set with namespace and TTL
  async set(key, value, options = {}) {
    if (!this.isConnected) return false;
    
    const {
      namespace = null,
      ttl = null,
      dataType = 'default'
    } = options;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    const finalTTL = ttl || this.config.ttl[dataType] || this.config.ttl.default;
    
    try {
      const serialized = JSON.stringify(value);
      await this.setexAsync(fullKey, finalTTL, serialized);
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      this.stats.errors++;
      return false;
    }
  }

  // Delete value from cache
  async delete(key, namespace = null) {
    if (!this.isConnected) return false;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    
    try {
      await this.delAsync(fullKey);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  }

  // Batch get operation
  async mget(keys, namespace = null) {
    if (!this.isConnected) return {};
    
    try {
      const fullKeys = keys.map(key => 
        namespace ? this.generateKey(namespace, key) : key
      );
      
      const values = await this.mgetAsync(fullKeys);
      const result = {};
      
      keys.forEach((key, index) => {
        if (values[index]) {
          result[key] = JSON.parse(values[index]);
          this.stats.hits++;
        } else {
          this.stats.misses++;
        }
      });
      
      return result;
    } catch (error) {
      logger.error('Redis mget error:', error);
      this.stats.errors++;
      return {};
    }
  }

  // Cache warming for frequently accessed data
  async warmCache(dataLoader, keys, options = {}) {
    if (!this.isConnected) return;
    
    try {
      const missingKeys = [];
      
      // Check which keys are missing
      for (const key of keys) {
        const exists = await this.existsAsync(
          options.namespace ? this.generateKey(options.namespace, key) : key
        );
        if (!exists) {
          missingKeys.push(key);
        }
      }
      
      // Load missing data
      if (missingKeys.length > 0) {
        const data = await dataLoader(missingKeys);
        
        // Cache the loaded data
        for (const key of missingKeys) {
          if (data[key]) {
            await this.set(key, data[key], options);
          }
        }
        
        logger.info(`Cache warmed with ${missingKeys.length} keys`);
      }
    } catch (error) {
      logger.error('Cache warming error:', error);
    }
  }

  // Delete all keys matching pattern
  async deletePattern(pattern) {
    if (!this.isConnected) return 0;

    try {
      const keys = await this.keysAsync(pattern);
      if (keys.length > 0) {
        await this.delAsync(keys);
        return keys.length;
      }
      return 0;
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  // Invalidate cache by pattern with namespace
  async invalidate(pattern, namespace = null) {
    if (!this.isConnected) return false;
    
    try {
      const fullPattern = namespace ? 
        `examinr:${namespace}:${pattern}` : 
        pattern;
      
      const deletedCount = await this.deletePattern(fullPattern);
      if (deletedCount > 0) {
        logger.info(`Invalidated ${deletedCount} keys matching pattern: ${fullPattern}`);
      }
      return true;
    } catch (error) {
      logger.error('Redis invalidate error:', error);
      return false;
    }
  }

  // Session management
  async setSession(sessionId, data, ttl = null) {
    return await this.set(sessionId, data, {
      namespace: 'session',
      ttl: ttl || this.config.ttl.session
    });
  }

  async getSession(sessionId) {
    return await this.get(sessionId, 'session');
  }

  async deleteSession(sessionId) {
    return await this.delete(sessionId, 'session');
  }

  async extendSession(sessionId, ttl = null) {
    const key = this.generateKey('session', sessionId);
    return await this.extendTTL(key, ttl || this.config.ttl.session);
  }

  // Rate limiting
  async checkRateLimit(identifier, limit = 100, window = 3600) {
    if (!this.isConnected) return { allowed: true, remaining: limit };
    
    const key = this.generateKey('ratelimit', identifier);
    
    try {
      const current = await this.incrAsync(key);
      
      if (current === 1) {
        await this.expireAsync(key, window);
      }
      
      const ttl = await this.ttlAsync(key);
      const allowed = current <= limit;
      const remaining = Math.max(0, limit - current);
      
      return {
        allowed,
        remaining,
        reset: Date.now() + (ttl * 1000)
      };
    } catch (error) {
      logger.error('Rate limit check error:', error);
      return { allowed: true, remaining: limit };
    }
  }

  // Analytics tracking
  async trackAnalytics(event, data = {}) {
    if (!this.isConnected) return;
    
    try {
      const date = new Date();
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const hourKey = `${dateKey}:${String(date.getHours()).padStart(2, '0')}`;
      
      // Track daily metrics
      await this.hincrbyAsync(`analytics:daily:${dateKey}`, event, 1);
      await this.expireAsync(`analytics:daily:${dateKey}`, 86400 * 7); // Keep for 7 days
      
      // Track hourly metrics
      await this.hincrbyAsync(`analytics:hourly:${hourKey}`, event, 1);
      await this.expireAsync(`analytics:hourly:${hourKey}`, 86400); // Keep for 1 day
      
      // Store event details if provided
      if (Object.keys(data).length > 0) {
        const eventKey = `analytics:event:${event}:${Date.now()}`;
        await this.set(eventKey, data, {
          ttl: 86400 * 30 // Keep event details for 30 days
        });
      }
    } catch (error) {
      logger.error('Analytics tracking error:', error);
    }
  }

  // Get analytics data
  async getAnalytics(type = 'daily', date = null) {
    if (!this.isConnected) return {};
    
    try {
      const targetDate = date || new Date();
      const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
      
      let key;
      if (type === 'hourly') {
        const hourKey = `${dateKey}:${String(targetDate.getHours()).padStart(2, '0')}`;
        key = `analytics:hourly:${hourKey}`;
      } else {
        key = `analytics:daily:${dateKey}`;
      }
      
      return await this.hgetallAsync(key) || {};
    } catch (error) {
      logger.error('Get analytics error:', error);
      return {};
    }
  }

  // Leaderboard management
  async updateLeaderboard(type, userId, score) {
    if (!this.isConnected) return false;
    
    const key = this.generateKey('leaderboard', type);
    
    try {
      await this.zaddAsync(key, score, userId);
      await this.expireAsync(key, this.config.ttl.leaderboard);
      return true;
    } catch (error) {
      logger.error('Leaderboard update error:', error);
      return false;
    }
  }

  async getLeaderboard(type, limit = 10, withScores = true) {
    if (!this.isConnected) return [];
    
    const key = this.generateKey('leaderboard', type);
    
    try {
      const args = withScores ? ['WITHSCORES'] : [];
      const results = await this.zrevrangeAsync(key, 0, limit - 1, ...args);
      
      if (!withScores) {
        return results;
      }
      
      const leaderboard = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboard.push({
          userId: results[i],
          score: parseFloat(results[i + 1]),
          rank: Math.floor(i / 2) + 1
        });
      }
      
      return leaderboard;
    } catch (error) {
      logger.error('Leaderboard fetch error:', error);
      return [];
    }
  }

  // Cache wrapper for async functions with intelligent caching
  async getOrSet(key, fn, options = {}) {
    const {
      namespace = null,
      ttl = null,
      dataType = 'default',
      forceRefresh = false
    } = options;
    
    // Skip cache if force refresh
    if (!forceRefresh) {
      const cached = await this.get(key, namespace);
      if (cached !== null) {
        // Track analytics for cache hit
        await this.trackAnalytics('cache_hit', { key, namespace });
        return cached;
      }
    }
    
    // Track analytics for cache miss
    await this.trackAnalytics('cache_miss', { key, namespace });
    
    // Execute function
    try {
      const result = await fn();
      
      // Cache the result
      await this.set(key, result, { namespace, ttl, dataType });
      
      return result;
    } catch (error) {
      logger.error('Cache getOrSet error:', error);
      throw error;
    }
  }

  // Generate cache key for search queries
  generateSearchKey(params) {
    // Sort keys for consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          acc[key] = params[key];
        }
        return acc;
      }, {});

    return this.hashKey(sortedParams);
  }

  // Cache search results with intelligent TTL
  async cacheSearchResults(params, results) {
    const key = this.generateSearchKey(params);
    
    // Determine TTL based on result count and query complexity
    let ttl = this.config.ttl.search;
    
    if (results.pagination && results.pagination.totalItems > 1000) {
      ttl = 600; // 10 minutes for large result sets
    } else if (params.query && params.query.length > 20) {
      ttl = 180; // 3 minutes for complex queries
    } else if (!params.query && Object.keys(params).length <= 2) {
      ttl = 900; // 15 minutes for simple filter queries
    }

    return await this.set(key, results, {
      namespace: 'search',
      ttl
    });
  }

  // Get cached search results
  async getCachedSearchResults(params) {
    const key = this.generateSearchKey(params);
    return await this.get(key, 'search');
  }

  // Invalidate related caches when questions are updated
  async invalidateQuestionCaches(question) {
    if (!this.isConnected) return;

    try {
      // Clear all search caches that might include this question
      const patterns = [
        'examinr:search:*',
        `examinr:category:${question.subject}:*`,
        `examinr:question:${question._id}`,
        'examinr:suggestions:*',
        'examinr:popular:*',
        'examinr:hierarchy:*'
      ];

      for (const pattern of patterns) {
        await this.deletePattern(pattern);
      }
      
      // Track invalidation event
      await this.trackAnalytics('cache_invalidation', {
        reason: 'question_update',
        questionId: question._id,
        subject: question.subject
      });
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }

  // Image URL caching for CDN
  async cacheImageUrl(imageId, url, ttl = null) {
    return await this.set(imageId, { url, cached: Date.now() }, {
      namespace: 'image',
      ttl: ttl || this.config.ttl.image
    });
  }

  async getCachedImageUrl(imageId) {
    return await this.get(imageId, 'image');
  }

  // Batch operations for performance
  async batchSet(items, options = {}) {
    if (!this.isConnected || items.length === 0) return false;
    
    try {
      const pipeline = this.client.pipeline();
      
      for (const { key, value, ttl } of items) {
        const fullKey = options.namespace ? 
          this.generateKey(options.namespace, key) : key;
        const finalTTL = ttl || options.ttl || this.config.ttl[options.dataType] || this.config.ttl.default;
        
        pipeline.setex(fullKey, finalTTL, JSON.stringify(value));
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error('Batch set error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key, namespace = null) {
    if (!this.isConnected) return false;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    
    try {
      const exists = await this.existsAsync(fullKey);
      return exists === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  // Get remaining TTL for key
  async getTTL(key, namespace = null) {
    if (!this.isConnected) return -2;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    
    try {
      return await this.ttlAsync(fullKey);
    } catch (error) {
      logger.error('Cache TTL error:', error);
      return -2;
    }
  }

  // Extend TTL for key
  async extendTTL(key, ttl, namespace = null) {
    if (!this.isConnected) return false;
    
    const fullKey = namespace ? this.generateKey(namespace, key) : key;
    
    try {
      const result = await this.expireAsync(fullKey, ttl);
      return result === 1;
    } catch (error) {
      logger.error('Cache extend TTL error:', error);
      return false;
    }
  }

  // Clear all cache (use with caution)
  async clearAll() {
    if (!this.isConnected) return false;

    try {
      await this.flushdbAsync();
      logger.warn('All cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  // Clear specific namespace
  async clearNamespace(namespace) {
    return await this.invalidate('*', namespace);
  }

  // Get cache statistics
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      total,
      connected: this.isConnected
    };
  }

  // Reset statistics
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      evictions: 0
    };
  }

  // Health check
  async healthCheck() {
    if (!this.isConnected) return false;
    
    try {
      const testKey = 'health:check';
      const testValue = Date.now().toString();
      
      await this.setAsync(testKey, testValue, 'EX', 10);
      const result = await this.getAsync(testKey);
      await this.delAsync(testKey);
      
      return result === testValue;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }

  // Memory usage info
  async getMemoryInfo() {
    if (!this.isConnected) return null;
    
    try {
      const info = await promisify(this.client.info).bind(this.client)('memory');
      const lines = info.split('\r\n');
      const memoryInfo = {};
      
      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          memoryInfo[key] = value;
        }
      });
      
      return memoryInfo;
    } catch (error) {
      logger.error('Get memory info error:', error);
      return null;
    }
  }

  // Scan keys with pattern (memory efficient for large datasets)
  async scanKeys(pattern = '*', count = 100) {
    if (!this.isConnected) return [];
    
    const keys = [];
    let cursor = '0';
    
    try {
      do {
        const [newCursor, foundKeys] = await this.scanAsync(cursor, 'MATCH', pattern, 'COUNT', count);
        cursor = newCursor;
        keys.push(...foundKeys);
      } while (cursor !== '0');
      
      return keys;
    } catch (error) {
      logger.error('Scan keys error:', error);
      return [];
    }
  }

  // Close Redis connection gracefully
  close() {
    if (this.client) {
      this.client.quit(() => {
        logger.info('Redis connection closed');
        this.isConnected = false;
      });
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Export instance
module.exports = cacheService;