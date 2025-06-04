#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running Security Audit for Examinr Backend...\n');

const results = {
  passed: [],
  warnings: [],
  failed: []
};

// Check 1: Environment Variables
console.log('1. Checking Environment Variables...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'SESSION_SECRET',
    'MONGODB_URI'
  ];
  
  const missingVars = requiredVars.filter(v => !envContent.includes(`${v}=`));
  
  if (missingVars.length === 0) {
    results.passed.push('✅ All required environment variables are set');
  } else {
    results.failed.push(`❌ Missing environment variables: ${missingVars.join(', ')}`);
  }
  
  // Check for default values
  if (envContent.includes('change-this-in-production')) {
    results.warnings.push('⚠️  Default values found in .env file - update before production');
  }
} else {
  results.failed.push('❌ .env file not found');
}

// Check 2: Dependencies Vulnerabilities
console.log('2. Checking for Known Vulnerabilities...');
try {
  const auditResult = execSync('npm audit --json', { encoding: 'utf-8' });
  const audit = JSON.parse(auditResult);
  
  if (audit.metadata.vulnerabilities.total === 0) {
    results.passed.push('✅ No known vulnerabilities in dependencies');
  } else {
    const { info, low, moderate, high, critical } = audit.metadata.vulnerabilities;
    results.warnings.push(`⚠️  Found ${audit.metadata.vulnerabilities.total} vulnerabilities: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low, ${info} info`);
  }
} catch (error) {
  // npm audit returns non-zero exit code if vulnerabilities found
  try {
    const output = error.stdout.toString();
    const audit = JSON.parse(output);
    const { info, low, moderate, high, critical } = audit.metadata.vulnerabilities;
    
    if (critical > 0 || high > 0) {
      results.failed.push(`❌ Found ${critical} critical and ${high} high vulnerabilities`);
    } else {
      results.warnings.push(`⚠️  Found ${moderate} moderate and ${low} low vulnerabilities`);
    }
  } catch (e) {
    results.warnings.push('⚠️  Could not parse npm audit results');
  }
}

// Check 3: Security Headers Implementation
console.log('3. Checking Security Middleware...');
const serverPath = path.join(__dirname, '..', 'server.js');
const serverContent = fs.readFileSync(serverPath, 'utf-8');

const securityChecks = [
  { name: 'Helmet.js', pattern: /(helmet\(|helmetConfig)/i },
  { name: 'CORS', pattern: /cors\(/i },
  { name: 'Rate Limiting', pattern: /rateLimit/i },
  { name: 'MongoDB Sanitization', pattern: /mongoSanitize/i },
  { name: 'XSS Protection', pattern: /xss/i },
  { name: 'HTTPS Redirect', pattern: /httpsRedirect/i },
  { name: 'CSRF Protection', pattern: /csrf/i }
];

securityChecks.forEach(check => {
  if (check.pattern.test(serverContent)) {
    results.passed.push(`✅ ${check.name} is implemented`);
  } else {
    results.failed.push(`❌ ${check.name} not found in server.js`);
  }
});

// Check 4: File Permissions
console.log('4. Checking File Permissions...');
const sensitiveFiles = ['.env', '.env.production'];
sensitiveFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const mode = (stats.mode & parseInt('777', 8)).toString(8);
    
    if (mode === '600' || mode === '400') {
      results.passed.push(`✅ ${file} has secure permissions (${mode})`);
    } else {
      results.warnings.push(`⚠️  ${file} has permissions ${mode} (recommend 600)`);
    }
  }
});

// Check 5: Error Handling
console.log('5. Checking Error Handling...');
const errorHandlerPath = path.join(__dirname, '..', 'middleware', 'errorHandler.js');
if (fs.existsSync(errorHandlerPath)) {
  const errorContent = fs.readFileSync(errorHandlerPath, 'utf-8');
  
  if (errorContent.includes('process.env.NODE_ENV') && errorContent.includes('production')) {
    results.passed.push('✅ Error handler differentiates between dev/prod');
  } else {
    results.warnings.push('⚠️  Error handler should hide details in production');
  }
}

// Check 6: Authentication Implementation
console.log('6. Checking Authentication...');
const authPath = path.join(__dirname, '..', 'middleware', 'auth.js');
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf-8');
  
  if (authContent.includes('jwt.verify')) {
    results.passed.push('✅ JWT verification implemented');
  }
  
  if (authContent.includes('Bearer')) {
    results.passed.push('✅ Bearer token pattern implemented');
  }
}

// Check 7: Password Requirements
console.log('7. Checking Password Security...');
const userModelPath = path.join(__dirname, '..', 'models', 'User.js');
if (fs.existsSync(userModelPath)) {
  const userContent = fs.readFileSync(userModelPath, 'utf-8');
  
  if (userContent.includes('bcrypt')) {
    results.passed.push('✅ Password hashing with bcrypt');
  }
  
  if (userContent.includes('minlength') && (userContent.includes('8') || userContent.includes('minLength: 8'))) {
    results.passed.push('✅ Minimum password length enforced');
  }
}

// Check 8: Security Documentation
console.log('8. Checking Security Documentation...');
const securityDocPath = path.join(__dirname, '..', 'SECURITY.md');
if (fs.existsSync(securityDocPath)) {
  results.passed.push('✅ Security documentation exists');
} else {
  results.warnings.push('⚠️  SECURITY.md documentation missing');
}

// Generate Report
console.log('\n' + '='.repeat(60));
console.log('SECURITY AUDIT REPORT');
console.log('='.repeat(60) + '\n');

console.log(`✅ PASSED: ${results.passed.length} checks`);
results.passed.forEach(msg => console.log(`   ${msg}`));

if (results.warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS: ${results.warnings.length} issues`);
  results.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (results.failed.length > 0) {
  console.log(`\n❌ FAILED: ${results.failed.length} checks`);
  results.failed.forEach(msg => console.log(`   ${msg}`));
}

// Recommendations
console.log('\n📋 RECOMMENDATIONS:');
console.log('1. Run "npm audit fix" to fix known vulnerabilities');
console.log('2. Set secure file permissions: chmod 600 .env');
console.log('3. Use a secrets management service in production');
console.log('4. Enable application monitoring (Sentry, New Relic)');
console.log('5. Implement automated security scanning in CI/CD');
console.log('6. Regular security updates: npm update');
console.log('7. Implement API versioning for backward compatibility');
console.log('8. Use a Web Application Firewall (WAF) in production');

// Security Score
const total = results.passed.length + results.warnings.length + results.failed.length;
const score = Math.round((results.passed.length / total) * 100);
console.log(`\n🏆 Security Score: ${score}%`);

if (score === 100) {
  console.log('🎉 Excellent! All security checks passed.');
} else if (score >= 80) {
  console.log('👍 Good security posture, but some improvements needed.');
} else if (score >= 60) {
  console.log('⚠️  Fair security, significant improvements recommended.');
} else {
  console.log('🚨 Poor security posture, immediate action required!');
}

// Exit with appropriate code
process.exit(results.failed.length > 0 ? 1 : 0);