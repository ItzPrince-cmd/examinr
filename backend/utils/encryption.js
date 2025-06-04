const crypto = require('crypto');
const { logger } = require('./logger');

class Encryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.saltLength = 64;
    this.tagPosition = this.saltLength + this.ivLength;
    this.encryptedPosition = this.tagPosition + this.tagLength;
    
    // Get encryption key from environment
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      logger.warn('Encryption key not found in environment variables');
      this.key = crypto.randomBytes(this.keyLength);
    } else {
      this.key = Buffer.from(key, 'hex');
      if (this.key.length !== this.keyLength) {
        throw new Error(`Encryption key must be ${this.keyLength} bytes (${this.keyLength * 2} hex characters)`);
      }
    }
  }

  /**
   * Encrypts text using AES-256-GCM
   * @param {string} text - Text to encrypt
   * @returns {string} - Encrypted text in base64
   */
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const salt = crypto.randomBytes(this.saltLength);
      
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      
      const encrypted = Buffer.concat([
        cipher.update(String(text), 'utf8'),
        cipher.final()
      ]);
      
      const tag = cipher.getAuthTag();
      
      return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    } catch (error) {
      logger.error('Encryption error', { error: error.message });
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts text encrypted with encrypt method
   * @param {string} encryptedText - Encrypted text in base64
   * @returns {string} - Decrypted text
   */
  decrypt(encryptedText) {
    try {
      const buffer = Buffer.from(encryptedText, 'base64');
      
      const salt = buffer.slice(0, this.saltLength);
      const iv = buffer.slice(this.saltLength, this.tagPosition);
      const tag = buffer.slice(this.tagPosition, this.encryptedPosition);
      const encrypted = buffer.slice(this.encryptedPosition);
      
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(tag);
      
      return decipher.update(encrypted) + decipher.final('utf8');
    } catch (error) {
      logger.error('Decryption error', { error: error.message });
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hashes text using SHA-256
   * @param {string} text - Text to hash
   * @returns {string} - Hashed text in hex
   */
  hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generates a random token
   * @param {number} length - Token length in bytes
   * @returns {string} - Random token in hex
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generates a secure random password
   * @param {number} length - Password length
   * @returns {string} - Random password
   */
  generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset[crypto.randomInt(charset.length)];
    }
    
    return password;
  }

  /**
   * Creates a time-limited token
   * @param {any} data - Data to include in token
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {string} - Encrypted token
   */
  createTimeLimitedToken(data, expiresIn = 3600) {
    const expires = Date.now() + (expiresIn * 1000);
    const payload = JSON.stringify({ data, expires });
    return this.encrypt(payload);
  }

  /**
   * Verifies a time-limited token
   * @param {string} token - Encrypted token
   * @returns {any} - Token data if valid, null if expired
   */
  verifyTimeLimitedToken(token) {
    try {
      const payload = JSON.parse(this.decrypt(token));
      
      if (Date.now() > payload.expires) {
        return null;
      }
      
      return payload.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Masks sensitive data for logging
   * @param {string} data - Data to mask
   * @param {number} visibleChars - Number of visible characters at start and end
   * @returns {string} - Masked data
   */
  maskSensitiveData(data, visibleChars = 4) {
    if (!data || data.length <= visibleChars * 2) {
      return '*'.repeat(8);
    }
    
    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const masked = '*'.repeat(Math.max(4, data.length - visibleChars * 2));
    
    return `${start}${masked}${end}`;
  }

  /**
   * Encrypts an object
   * @param {object} obj - Object to encrypt
   * @returns {string} - Encrypted object in base64
   */
  encryptObject(obj) {
    return this.encrypt(JSON.stringify(obj));
  }

  /**
   * Decrypts an object
   * @param {string} encryptedObj - Encrypted object in base64
   * @returns {object} - Decrypted object
   */
  decryptObject(encryptedObj) {
    return JSON.parse(this.decrypt(encryptedObj));
  }

  /**
   * Creates a secure signature for data
   * @param {string} data - Data to sign
   * @param {string} secret - Secret key
   * @returns {string} - Signature in hex
   */
  createSignature(data, secret = null) {
    const key = secret || this.key.toString('hex');
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }

  /**
   * Verifies a signature
   * @param {string} data - Original data
   * @param {string} signature - Signature to verify
   * @param {string} secret - Secret key
   * @returns {boolean} - True if signature is valid
   */
  verifySignature(data, signature, secret = null) {
    const expectedSignature = this.createSignature(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

// Export singleton instance
module.exports = new Encryption();