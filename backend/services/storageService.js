const AWS = require('aws-sdk');
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

class StorageService {
  constructor() {
    // Initialize S3 client with cost-optimized settings
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT, // For S3-compatible services like Backblaze B2, Wasabi
      s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', // For non-AWS S3
      signatureVersion: 'v4'
    });

    // Configure buckets
    this.buckets = {
      images: process.env.S3_BUCKET_IMAGES || 'examinr-images',
      documents: process.env.S3_BUCKET_DOCUMENTS || 'examinr-documents',
      temp: process.env.S3_BUCKET_TEMP || 'examinr-temp',
      backups: process.env.S3_BUCKET_BACKUPS || 'examinr-backups'
    };

    // CDN configuration
    this.cdnUrl = process.env.CDN_URL || `https://${this.buckets.images}.s3.amazonaws.com`;
    
    // Storage classes for cost optimization
    this.storageClasses = {
      frequent: 'STANDARD',
      infrequent: 'STANDARD_IA',
      archive: 'GLACIER',
      deepArchive: 'DEEP_ARCHIVE'
    };

    // Local temp directory
    this.tempDir = path.join(__dirname, '..', '..', 'temp');
    this.ensureDirectoryExists(this.tempDir);
  }

  /**
   * Upload image with optimization and multiple formats
   * @param {Buffer|String} file - File buffer or path
   * @param {Object} options - Upload options
   * @returns {Object} - Upload result with URLs
   */
  async uploadImage(file, options = {}) {
    const {
      filename = this.generateFilename('img'),
      folder = 'questions',
      quality = 85,
      maxWidth = 1920,
      maxHeight = 1080,
      generateWebP = true,
      generateThumbnail = true,
      isPublic = true
    } = options;

    try {
      // Read file if path is provided
      const imageBuffer = Buffer.isBuffer(file) ? file : await fs.promises.readFile(file);
      
      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // Prepare upload promises
      const uploads = [];
      const results = {
        original: null,
        webp: null,
        thumbnail: null,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: imageBuffer.length
        }
      };

      // Optimize and upload original format
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality, progressive: true })
        .toBuffer();

      const originalKey = `${folder}/${filename}.jpg`;
      uploads.push(
        this.uploadToS3(optimizedBuffer, originalKey, 'image/jpeg', isPublic)
          .then(url => { results.original = url; })
      );

      // Generate and upload WebP version
      if (generateWebP) {
        const webpBuffer = await sharp(imageBuffer)
          .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality })
          .toBuffer();

        const webpKey = `${folder}/${filename}.webp`;
        uploads.push(
          this.uploadToS3(webpBuffer, webpKey, 'image/webp', isPublic)
            .then(url => { results.webp = url; })
        );
      }

      // Generate and upload thumbnail
      if (generateThumbnail) {
        const thumbnailBuffer = await sharp(imageBuffer)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 70 })
          .toBuffer();

        const thumbnailKey = `${folder}/thumbnails/${filename}_thumb.jpg`;
        uploads.push(
          this.uploadToS3(thumbnailBuffer, thumbnailKey, 'image/jpeg', isPublic)
            .then(url => { results.thumbnail = url; })
        );
      }

      // Wait for all uploads to complete
      await Promise.all(uploads);

      // Calculate cost estimate
      results.estimatedMonthlyCost = this.calculateStorageCost(results.metadata.size);

      return results;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload PDF document with optimization
   * @param {Buffer|String} file - File buffer or path
   * @param {Object} options - Upload options
   * @returns {Object} - Upload result
   */
  async uploadDocument(file, options = {}) {
    const {
      filename = this.generateFilename('doc'),
      folder = 'documents',
      compress = true,
      encrypt = false,
      isPublic = false
    } = options;

    try {
      let documentBuffer = Buffer.isBuffer(file) ? file : await fs.promises.readFile(file);
      
      // Compress PDF if requested (using ghostscript or similar)
      if (compress && options.type === 'pdf') {
        // Note: Implement PDF compression here
        // documentBuffer = await this.compressPDF(documentBuffer);
      }

      // Encrypt sensitive documents
      if (encrypt) {
        documentBuffer = await this.encryptBuffer(documentBuffer);
      }

      const key = `${folder}/${filename}`;
      const contentType = options.contentType || 'application/pdf';
      
      const url = await this.uploadToS3(
        documentBuffer,
        key,
        contentType,
        isPublic,
        encrypt ? this.storageClasses.frequent : this.storageClasses.infrequent
      );

      return {
        url,
        key,
        size: documentBuffer.length,
        encrypted: encrypt,
        estimatedMonthlyCost: this.calculateStorageCost(documentBuffer.length, 'document')
      };
    } catch (error) {
      console.error('Document upload error:', error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  /**
   * Upload to S3 with retry logic
   * @private
   */
  async uploadToS3(buffer, key, contentType, isPublic = true, storageClass = 'STANDARD', retries = 3) {
    const params = {
      Bucket: this.getBucketForType(contentType),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      StorageClass: storageClass,
      ServerSideEncryption: 'AES256',
      Metadata: {
        uploadDate: new Date().toISOString(),
        appVersion: process.env.APP_VERSION || '1.0.0'
      }
    };

    if (isPublic) {
      params.ACL = 'public-read';
    }

    // Add cache control headers
    if (contentType.startsWith('image/')) {
      params.CacheControl = 'public, max-age=31536000'; // 1 year
    } else if (contentType === 'application/pdf') {
      params.CacheControl = 'public, max-age=86400'; // 1 day
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.s3.upload(params).promise();
        
        // Return CDN URL if available
        if (isPublic && this.cdnUrl) {
          return `${this.cdnUrl}/${key}`;
        }
        
        return result.Location;
      } catch (error) {
        if (attempt === retries) throw error;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Generate presigned URL for private files
   * @param {String} key - S3 object key
   * @param {Number} expiresIn - URL expiration in seconds
   * @returns {String} - Presigned URL
   */
  async generatePresignedUrl(key, expiresIn = 3600) {
    const params = {
      Bucket: this.buckets.documents,
      Key: key,
      Expires: expiresIn
    };

    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Presigned URL generation error:', error);
      throw new Error('Failed to generate download link');
    }
  }

  /**
   * Delete file from S3
   * @param {String} key - S3 object key
   * @param {String} bucket - Bucket name
   */
  async deleteFile(key, bucket = null) {
    try {
      const params = {
        Bucket: bucket || this.buckets.images,
        Key: key
      };

      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  /**
   * Batch delete files
   * @param {Array} keys - Array of S3 object keys
   * @param {String} bucket - Bucket name
   */
  async batchDeleteFiles(keys, bucket = null) {
    if (!keys || keys.length === 0) return true;

    try {
      const params = {
        Bucket: bucket || this.buckets.images,
        Delete: {
          Objects: keys.map(key => ({ Key: key })),
          Quiet: true
        }
      };

      await this.s3.deleteObjects(params).promise();
      return true;
    } catch (error) {
      console.error('Batch delete error:', error);
      return false;
    }
  }

  /**
   * Set lifecycle rules for automatic archival and deletion
   * @param {String} bucket - Bucket name
   */
  async setLifecycleRules(bucket) {
    const rules = [
      {
        ID: 'ArchiveOldQuestionImages',
        Status: 'Enabled',
        Prefix: 'questions/',
        Transitions: [
          {
            Days: 90,
            StorageClass: 'STANDARD_IA'
          },
          {
            Days: 365,
            StorageClass: 'GLACIER'
          }
        ]
      },
      {
        ID: 'DeleteTempFiles',
        Status: 'Enabled',
        Prefix: 'temp/',
        Expiration: {
          Days: 7
        }
      },
      {
        ID: 'DeleteOldThumbnails',
        Status: 'Enabled',
        Prefix: 'thumbnails/',
        Expiration: {
          Days: 180
        }
      }
    ];

    try {
      await this.s3.putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: rules
        }
      }).promise();

      console.log(`Lifecycle rules set for bucket: ${bucket}`);
    } catch (error) {
      console.error('Lifecycle configuration error:', error);
    }
  }

  /**
   * Upload file with multipart for large files
   * @param {String} filePath - Path to large file
   * @param {String} key - S3 object key
   * @param {Object} options - Upload options
   */
  async uploadLargeFile(filePath, key, options = {}) {
    const fileSize = fs.statSync(filePath).size;
    const partSize = 5 * 1024 * 1024; // 5MB parts
    const numParts = Math.ceil(fileSize / partSize);

    if (fileSize < partSize) {
      // Use regular upload for small files
      const buffer = await fs.promises.readFile(filePath);
      return this.uploadToS3(buffer, key, options.contentType || 'application/octet-stream');
    }

    try {
      // Initiate multipart upload
      const multipartParams = {
        Bucket: this.buckets.documents,
        Key: key,
        ContentType: options.contentType || 'application/octet-stream',
        StorageClass: options.storageClass || this.storageClasses.infrequent
      };

      const multipart = await this.s3.createMultipartUpload(multipartParams).promise();
      const uploadId = multipart.UploadId;

      // Upload parts
      const uploadPromises = [];
      for (let i = 0; i < numParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileSize);
        
        uploadPromises.push(
          this.uploadPart(filePath, uploadId, i + 1, start, end, multipartParams.Bucket, key)
        );
      }

      const uploadedParts = await Promise.all(uploadPromises);

      // Complete multipart upload
      const completeParams = {
        Bucket: multipartParams.Bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber)
        }
      };

      const result = await this.s3.completeMultipartUpload(completeParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Multipart upload error:', error);
      throw new Error(`Failed to upload large file: ${error.message}`);
    }
  }

  /**
   * Upload a single part in multipart upload
   * @private
   */
  async uploadPart(filePath, uploadId, partNumber, start, end, bucket, key) {
    const stream = fs.createReadStream(filePath, { start, end: end - 1 });
    
    const params = {
      Bucket: bucket,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: stream
    };

    const result = await this.s3.uploadPart(params).promise();
    
    return {
      ETag: result.ETag,
      PartNumber: partNumber
    };
  }

  /**
   * Calculate storage cost estimate
   * @param {Number} sizeInBytes - File size
   * @param {String} type - Storage type
   * @returns {Number} - Estimated monthly cost in USD
   */
  calculateStorageCost(sizeInBytes, type = 'image') {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    
    // Cost per GB per month (approximate)
    const costs = {
      standard: 0.023,
      infrequent: 0.0125,
      glacier: 0.004,
      deepArchive: 0.00099
    };

    // Estimate based on type
    let costPerGB = costs.standard;
    if (type === 'document') {
      costPerGB = costs.infrequent;
    } else if (type === 'archive') {
      costPerGB = costs.glacier;
    }

    return Number((sizeInGB * costPerGB).toFixed(4));
  }

  /**
   * Get storage usage statistics
   * @param {String} bucket - Bucket name
   * @returns {Object} - Usage statistics
   */
  async getStorageStats(bucket = null) {
    const targetBucket = bucket || this.buckets.images;
    const stats = {
      totalObjects: 0,
      totalSize: 0,
      byType: {},
      byStorageClass: {},
      estimatedMonthlyCost: 0
    };

    try {
      let continuationToken = null;
      
      do {
        const params = {
          Bucket: targetBucket,
          ContinuationToken: continuationToken
        };

        const response = await this.s3.listObjectsV2(params).promise();
        
        response.Contents.forEach(object => {
          stats.totalObjects++;
          stats.totalSize += object.Size;
          
          // Group by file type
          const ext = path.extname(object.Key).toLowerCase();
          stats.byType[ext] = (stats.byType[ext] || 0) + object.Size;
          
          // Group by storage class
          const storageClass = object.StorageClass || 'STANDARD';
          stats.byStorageClass[storageClass] = (stats.byStorageClass[storageClass] || 0) + object.Size;
        });

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      // Calculate costs
      Object.entries(stats.byStorageClass).forEach(([storageClass, size]) => {
        const sizeInGB = size / (1024 * 1024 * 1024);
        let costPerGB = 0.023; // Standard
        
        if (storageClass === 'STANDARD_IA') costPerGB = 0.0125;
        else if (storageClass === 'GLACIER') costPerGB = 0.004;
        else if (storageClass === 'DEEP_ARCHIVE') costPerGB = 0.00099;
        
        stats.estimatedMonthlyCost += sizeInGB * costPerGB;
      });

      stats.totalSizeGB = Number((stats.totalSize / (1024 * 1024 * 1024)).toFixed(2));
      stats.estimatedMonthlyCost = Number(stats.estimatedMonthlyCost.toFixed(2));

      return stats;
    } catch (error) {
      console.error('Storage stats error:', error);
      throw new Error('Failed to get storage statistics');
    }
  }

  /**
   * Clean up orphaned files (files not referenced in database)
   * @param {Function} checkFunction - Function to check if file is referenced
   */
  async cleanupOrphanedFiles(checkFunction) {
    const orphanedFiles = [];
    let continuationToken = null;
    
    try {
      do {
        const params = {
          Bucket: this.buckets.images,
          ContinuationToken: continuationToken
        };

        const response = await this.s3.listObjectsV2(params).promise();
        
        for (const object of response.Contents) {
          const isReferenced = await checkFunction(object.Key);
          if (!isReferenced) {
            orphanedFiles.push(object.Key);
          }
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      // Delete orphaned files in batches
      if (orphanedFiles.length > 0) {
        const batchSize = 1000;
        for (let i = 0; i < orphanedFiles.length; i += batchSize) {
          const batch = orphanedFiles.slice(i, i + batchSize);
          await this.batchDeleteFiles(batch);
        }
      }

      return {
        cleaned: orphanedFiles.length,
        files: orphanedFiles
      };
    } catch (error) {
      console.error('Cleanup error:', error);
      throw new Error('Failed to cleanup orphaned files');
    }
  }

  /**
   * Helper methods
   */
  
  generateFilename(prefix = 'file') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${prefix}_${timestamp}_${random}`;
  }

  getBucketForType(contentType) {
    if (contentType.startsWith('image/')) {
      return this.buckets.images;
    } else if (contentType === 'application/pdf' || contentType.startsWith('application/')) {
      return this.buckets.documents;
    }
    return this.buckets.temp;
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async encryptBuffer(buffer) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32));
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Prepend IV and auth tag to encrypted data
    return Buffer.concat([iv, authTag, encrypted]);
  }

  async decryptBuffer(encryptedBuffer) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32));
    
    // Extract IV, auth tag, and encrypted data
    const iv = encryptedBuffer.slice(0, 16);
    const authTag = encryptedBuffer.slice(16, 32);
    const encrypted = encryptedBuffer.slice(32);
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
  }
}

// Create singleton instance
const storageService = new StorageService();

module.exports = storageService;