# Security Implementation Guide for Examinr

## Overview

This document outlines the comprehensive security measures implemented in the Examinr backend to protect against common web vulnerabilities and ensure data protection.

## Security Layers

### 1. HTTPS and SSL/TLS
- **Production Environment**: Automatic HTTPS redirect
- **Headers**: Strict-Transport-Security (HSTS) enabled
- **Configuration**: Trust proxy enabled for reverse proxy setups

### 2. Security Headers (Helmet.js)
- **Content-Security-Policy**: Restricts resource loading
- **X-Frame-Options**: DENY - Prevents clickjacking
- **X-Content-Type-Options**: nosniff - Prevents MIME sniffing
- **X-XSS-Protection**: Enhanced XSS protection
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts browser features

### 3. Rate Limiting
Multiple rate limiters for different endpoints:
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes (failed attempts only)
- **Password Reset**: 3 requests per hour
- **File Upload**: 20 requests per hour
- **Payment**: 10 requests per hour
- **API Key Generation**: 5 requests per 24 hours

### 4. CORS Configuration
- Whitelist-based origin validation
- Configurable allowed origins via environment variables
- Credentials support enabled
- Production domains automatically included

### 5. Input Validation & Sanitization
- **MongoDB Injection Prevention**: express-mongo-sanitize
- **XSS Protection**: xss-clean middleware
- **HTTP Parameter Pollution**: hpp protection
- **Request Size Limits**: Configurable max request size
- **File Upload Restrictions**: 
  - Max file size: 5MB (configurable)
  - Allowed MIME types whitelist
  - Max 5 files per request

### 6. Authentication & Authorization
- **JWT Tokens**: 
  - Access Token: 15-minute expiry
  - Refresh Token: 7-day expiry
  - Secure token generation and validation
- **Password Security**:
  - bcrypt with 10 rounds
  - Password history tracking
  - Complexity requirements enforced
- **Session Management**:
  - Secure session cookies
  - MongoDB session store
  - Session expiry and rotation

### 7. CSRF Protection
- **Double Submit Cookie Pattern**: Stateless CSRF protection
- **Token Generation**: Cryptographically secure tokens
- **Automatic Token Rotation**: New token on each request
- **Excluded Paths**: Webhooks and health checks

### 8. API Key Authentication
- **Webhook Security**: API key required for webhook endpoints
- **Timing-Safe Comparison**: Prevents timing attacks
- **Key Hashing**: SHA-256 hashed keys
- **Multiple Keys Support**: Comma-separated keys in environment

### 9. Error Handling
- **Development**: Detailed error information
- **Production**: Generic error messages
- **No Sensitive Data Leakage**: Stack traces hidden in production
- **Structured Error Responses**: Consistent error format

### 10. Logging & Monitoring
- **Winston Logger**: Multiple log levels and transports
- **Security Event Logging**:
  - Failed authentication attempts
  - Rate limit violations
  - CSRF token failures
  - Suspicious input patterns
  - API key usage
- **Log Files**:
  - combined.log: All logs
  - error.log: Error logs only
  - payment.log: Payment transactions
  - access.log: HTTP access logs

### 11. Data Encryption
- **AES-256-GCM**: For sensitive data encryption
- **Password Hashing**: bcrypt
- **Token Generation**: Crypto.randomBytes
- **Signature Verification**: HMAC-SHA256

### 12. Environment Configuration
All sensitive data stored in environment variables:
- Database credentials
- JWT secrets
- API keys
- Email credentials
- Payment gateway keys

## Security Checklist

### Pre-Deployment
- [ ] Generate strong, unique secrets for all keys
- [ ] Configure ALLOWED_ORIGINS for production domains
- [ ] Set NODE_ENV=production
- [ ] Configure Redis for session storage (recommended)
- [ ] Review and update rate limiting thresholds
- [ ] Enable email verification
- [ ] Configure webhook API keys
- [ ] Set up SSL certificates

### Post-Deployment
- [ ] Monitor security logs regularly
- [ ] Review rate limit violations
- [ ] Check for suspicious patterns
- [ ] Update dependencies regularly
- [ ] Perform security audits
- [ ] Test CSRF protection
- [ ] Verify HTTPS redirect
- [ ] Test API key authentication

## Security Headers Example

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-xxx'...
```

## Best Practices

1. **Regular Updates**: Keep all dependencies updated
2. **Least Privilege**: Grant minimum required permissions
3. **Input Validation**: Never trust user input
4. **Output Encoding**: Encode all output
5. **Secure Defaults**: Default to secure configurations
6. **Defense in Depth**: Multiple security layers
7. **Security Monitoring**: Active monitoring and alerting
8. **Incident Response**: Have a plan for security incidents

## Vulnerability Reporting

If you discover a security vulnerability, please email security@examinr.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Compliance

This implementation follows:
- OWASP Top 10 security practices
- PCI DSS requirements (for payment processing)
- GDPR guidelines (for data protection)
- Industry best practices for web application security