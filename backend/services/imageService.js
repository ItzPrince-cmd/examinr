const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class ImageService {
  /**
   * Validate image URL
   * @param {string} url - Image URL
   * @returns {object} - Validation result
   */
  static validateImageUrl(url) {
    if (!url) return { isValid: false, error: 'URL is required' };
    
    try {
      const urlObj = new URL(url);
      
      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
      }
      
      // Check for common image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const extension = path.extname(urlObj.pathname).toLowerCase();
      
      if (extension && !validExtensions.includes(extension)) {
        return { isValid: false, error: `Invalid image extension: ${extension}` };
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /localhost/i,
        /127\.0\.0\.1/,
        /192\.168\./,
        /10\.\d+\.\d+\.\d+/,
        /172\.(1[6-9]|2[0-9]|3[0-1])\./
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          return { isValid: false, error: 'URL points to local/private network' };
        }
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
  
  /**
   * Generate unique filename for uploaded images
   * @param {string} originalName - Original filename
   * @returns {string} - Unique filename
   */
  static generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString('hex');
    const extension = path.extname(originalName);
    const basename = path.basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50);
    
    return `${basename}-${timestamp}-${randomString}${extension}`;
  }
  
  /**
   * Create directory if it doesn't exist
   * @param {string} dirPath - Directory path
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  
  /**
   * Get image metadata
   * @param {string} filePath - Path to image file
   * @returns {object} - Image metadata
   */
  static async getImageMetadata(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const extension = path.extname(filePath).toLowerCase();
      
      return {
        size: stats.size,
        extension: extension,
        mimeType: this.getMimeType(extension),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }
  
  /**
   * Get MIME type from extension
   * @param {string} extension - File extension
   * @returns {string} - MIME type
   */
  static getMimeType(extension) {
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp'
    };
    
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
  
  /**
   * Process image URLs in question data
   * @param {object} questionData - Question data containing image URLs
   * @returns {object} - Processed question data
   */
  static processQuestionImages(questionData) {
    const processedData = { ...questionData };
    const imageValidations = [];
    
    // Process main image URLs
    if (processedData.imageUrls && Array.isArray(processedData.imageUrls)) {
      processedData.imageUrls = processedData.imageUrls.map(img => {
        const validation = this.validateImageUrl(img.url);
        imageValidations.push({
          url: img.url,
          position: img.position,
          ...validation
        });
        
        return {
          ...img,
          validated: validation.isValid
        };
      });
    }
    
    // Process option images
    if (processedData.options && Array.isArray(processedData.options)) {
      processedData.options = processedData.options.map(option => {
        if (option.media && option.media.url) {
          const validation = this.validateImageUrl(option.media.url);
          imageValidations.push({
            url: option.media.url,
            position: `option_${option.id}`,
            ...validation
          });
          
          return {
            ...option,
            media: {
              ...option.media,
              validated: validation.isValid
            }
          };
        }
        return option;
      });
    }
    
    // Check if all images are valid
    const hasInvalidImages = imageValidations.some(v => !v.isValid);
    
    return {
      data: processedData,
      imageValidations: imageValidations,
      allImagesValid: !hasInvalidImages
    };
  }
  
  /**
   * Create image placeholder for LaTeX diagrams
   * @param {string} latexCode - LaTeX code for diagram
   * @returns {string} - Placeholder URL
   */
  static createLatexDiagramPlaceholder(latexCode) {
    // In production, this would integrate with a LaTeX rendering service
    // For now, return a placeholder
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
        <rect width="300" height="200" fill="#f0f0f0" stroke="#ccc"/>
        <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">
          LaTeX Diagram
        </text>
      </svg>
    `).toString('base64')}`;
  }
}

module.exports = ImageService;