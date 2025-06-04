#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating secure secrets for Examinr...\n');

// Generate different types of secrets
const secrets = {
  JWT_SECRET: crypto.randomBytes(64).toString('hex'),
  JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('hex'),
  SESSION_SECRET: crypto.randomBytes(64).toString('hex'),
  CSRF_SECRET: crypto.randomBytes(32).toString('hex'),
  ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
  INTERNAL_API_KEY: crypto.randomBytes(32).toString('hex'),
  WEBHOOK_API_KEY_1: crypto.randomBytes(32).toString('hex'),
  WEBHOOK_API_KEY_2: crypto.randomBytes(32).toString('hex'),
  RAZORPAY_WEBHOOK_SECRET: crypto.randomBytes(32).toString('hex')
};

// Display secrets
console.log('Generated Secrets (Copy these to your .env file):\n');
console.log('# Security Secrets (Generated on ' + new Date().toISOString() + ')');
console.log('# ⚠️  IMPORTANT: Never commit these to version control!\n');

for (const [key, value] of Object.entries(secrets)) {
  console.log(`${key}=${value}`);
}

console.log('\n# Webhook API Keys (comma-separated)');
console.log(`WEBHOOK_API_KEYS=${secrets.WEBHOOK_API_KEY_1},${secrets.WEBHOOK_API_KEY_2}`);

// Generate a secure .env.production template
const envProductionTemplate = `# Production Environment Configuration
# Generated on ${new Date().toISOString()}
# ⚠️  NEVER COMMIT THIS FILE TO VERSION CONTROL

# Server Configuration
NODE_ENV=production
PORT=5000
API_URL=https://api.examinr.com
CLIENT_URL=https://examinr.com

# Database (Replace with your production MongoDB URL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/examinr?retryWrites=true&w=majority

# Security Secrets
JWT_SECRET=${secrets.JWT_SECRET}
JWT_REFRESH_SECRET=${secrets.JWT_REFRESH_SECRET}
SESSION_SECRET=${secrets.SESSION_SECRET}
CSRF_SECRET=${secrets.CSRF_SECRET}
ENCRYPTION_KEY=${secrets.ENCRYPTION_KEY}
INTERNAL_API_KEY=${secrets.INTERNAL_API_KEY}
WEBHOOK_API_KEYS=${secrets.WEBHOOK_API_KEY_1},${secrets.WEBHOOK_API_KEY_2}

# Token Expiry
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# CORS (Add your production domains)
ALLOWED_ORIGINS=https://examinr.com,https://www.examinr.com,https://app.examinr.com

# Rate Limiting Whitelist (Add trusted IPs)
RATE_LIMIT_WHITELIST=

# Email Configuration (Replace with your SMTP details)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=Examinr <noreply@examinr.com>

# Razorpay Production (Replace with your keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=${secrets.RAZORPAY_WEBHOOK_SECRET}

# Cloudinary Production (Replace with your keys)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Recommended for production)
REDIS_URL=redis://username:password@redis-server:6379

# File Upload
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=info

# Monitoring (Optional but recommended)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEW_RELIC_LICENSE_KEY=your-new-relic-key

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_SOCIAL_LOGIN=false
ENABLE_EMAIL_VERIFICATION=true
MAINTENANCE_MODE=false
`;

// Save to file
const envPath = path.join(__dirname, '..', '.env.production.template');
fs.writeFileSync(envPath, envProductionTemplate);

console.log(`\n✅ Production environment template saved to: ${envPath}`);
console.log('\n📋 Next Steps:');
console.log('1. Copy the generated secrets to your .env file');
console.log('2. Update .env.production.template with your actual production values');
console.log('3. Rename .env.production.template to .env for production deployment');
console.log('4. Ensure .env is in .gitignore (should already be there)');
console.log('5. Store these secrets securely (password manager, secure vault, etc.)');

// Generate strong passwords for demo/testing
console.log('\n🔑 Sample Strong Passwords for Testing:');
const passwordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
for (let i = 1; i <= 3; i++) {
  let password = '';
  for (let j = 0; j < 16; j++) {
    password += passwordChars[crypto.randomInt(passwordChars.length)];
  }
  console.log(`Test User ${i}: ${password}`);
}

console.log('\n⚠️  Security Reminders:');
console.log('- Never use these test passwords in production');
console.log('- Rotate secrets regularly (every 90 days recommended)');
console.log('- Use different secrets for different environments');
console.log('- Monitor for exposed secrets in your codebase');
console.log('- Enable 2FA on all service accounts');