const { logger } = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

class SecurityMonitor {
  constructor() {
    this.alerts = [];
    this.thresholds = {
      failedLogins: 5,
      rateLimitViolations: 10,
      suspiciousPatterns: 3,
      errorRate: 0.05 // 5%
    };
    this.metrics = {
      requests: { total: 0, failed: 0 },
      authentication: { attempts: 0, failures: 0 },
      rateLimits: { violations: 0 },
      security: { xssAttempts: 0, sqlInjection: 0, pathTraversal: 0 }
    };
    this.resetInterval = null;
  }

  start() {
    // Reset metrics every hour
    this.resetInterval = setInterval(() => {
      this.saveMetrics();
      this.resetMetrics();
    }, 60 * 60 * 1000); // 1 hour

    logger.info('Security monitoring started');
  }

  stop() {
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
    }
    this.saveMetrics();
  }

  // Track request metrics
  trackRequest(req, res) {
    this.metrics.requests.total++;
    
    if (res.statusCode >= 400) {
      this.metrics.requests.failed++;
    }

    // Check error rate
    const errorRate = this.metrics.requests.failed / this.metrics.requests.total;
    if (errorRate > this.thresholds.errorRate) {
      this.createAlert('HIGH_ERROR_RATE', {
        rate: errorRate,
        total: this.metrics.requests.total,
        failed: this.metrics.requests.failed
      });
    }
  }

  // Track authentication attempts
  trackAuthentication(success, userId, ip) {
    this.metrics.authentication.attempts++;
    
    if (!success) {
      this.metrics.authentication.failures++;
      
      // Track failed attempts by IP
      if (!this.failedAttempts) this.failedAttempts = {};
      if (!this.failedAttempts[ip]) this.failedAttempts[ip] = 0;
      this.failedAttempts[ip]++;
      
      // Alert on suspicious activity
      if (this.failedAttempts[ip] >= this.thresholds.failedLogins) {
        this.createAlert('BRUTE_FORCE_ATTEMPT', {
          ip,
          attempts: this.failedAttempts[ip],
          userId
        });
      }
    } else {
      // Reset failed attempts on successful login
      if (this.failedAttempts && this.failedAttempts[ip]) {
        delete this.failedAttempts[ip];
      }
    }
  }

  // Track rate limit violations
  trackRateLimit(ip, endpoint) {
    this.metrics.rateLimits.violations++;
    
    if (!this.rateLimitViolations) this.rateLimitViolations = {};
    if (!this.rateLimitViolations[ip]) this.rateLimitViolations[ip] = 0;
    this.rateLimitViolations[ip]++;
    
    if (this.rateLimitViolations[ip] >= this.thresholds.rateLimitViolations) {
      this.createAlert('EXCESSIVE_RATE_LIMIT_VIOLATIONS', {
        ip,
        violations: this.rateLimitViolations[ip],
        endpoint
      });
    }
  }

  // Track security violations
  trackSecurityViolation(type, details) {
    switch (type) {
      case 'XSS':
        this.metrics.security.xssAttempts++;
        break;
      case 'SQL_INJECTION':
        this.metrics.security.sqlInjection++;
        break;
      case 'PATH_TRAVERSAL':
        this.metrics.security.pathTraversal++;
        break;
    }
    
    this.createAlert('SECURITY_VIOLATION', {
      type,
      ...details
    });
  }

  // Create security alert
  createAlert(type, data) {
    const alert = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      data,
      severity: this.getAlertSeverity(type)
    };
    
    this.alerts.push(alert);
    
    // Log critical alerts
    if (alert.severity === 'CRITICAL') {
      logger.error('CRITICAL SECURITY ALERT', alert);
      this.notifyAdmins(alert);
    } else {
      logger.warn('Security Alert', alert);
    }
    
    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
  }

  // Determine alert severity
  getAlertSeverity(type) {
    const severityMap = {
      'BRUTE_FORCE_ATTEMPT': 'HIGH',
      'SECURITY_VIOLATION': 'CRITICAL',
      'EXCESSIVE_RATE_LIMIT_VIOLATIONS': 'MEDIUM',
      'HIGH_ERROR_RATE': 'MEDIUM',
      'SUSPICIOUS_ACTIVITY': 'HIGH'
    };
    
    return severityMap[type] || 'LOW';
  }

  // Notify administrators
  async notifyAdmins(alert) {
    // In production, this would send emails/SMS/Slack notifications
    try {
      // Log to a separate critical alerts file
      const alertsDir = path.join(__dirname, '..', 'logs', 'security-alerts');
      await fs.mkdir(alertsDir, { recursive: true });
      
      const alertFile = path.join(alertsDir, `alert-${alert.id}.json`);
      await fs.writeFile(alertFile, JSON.stringify(alert, null, 2));
      
      // Here you would integrate with notification services:
      // - Email via SendGrid/AWS SES
      // - SMS via Twilio
      // - Slack webhook
      // - PagerDuty integration
      
    } catch (error) {
      logger.error('Failed to save security alert', error);
    }
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      alerts: this.alerts.slice(-10), // Last 10 alerts
      uptime: process.uptime()
    };
  }

  // Get security dashboard data
  getDashboard() {
    const totalAuth = this.metrics.authentication.attempts || 1;
    const totalReq = this.metrics.requests.total || 1;
    
    return {
      overview: {
        status: this.getSystemStatus(),
        uptime: process.uptime(),
        lastIncident: this.alerts.length > 0 ? this.alerts[this.alerts.length - 1] : null
      },
      metrics: {
        requests: {
          total: this.metrics.requests.total,
          failed: this.metrics.requests.failed,
          errorRate: ((this.metrics.requests.failed / totalReq) * 100).toFixed(2) + '%'
        },
        authentication: {
          total: this.metrics.authentication.attempts,
          failures: this.metrics.authentication.failures,
          successRate: (((totalAuth - this.metrics.authentication.failures) / totalAuth) * 100).toFixed(2) + '%'
        },
        security: {
          violations: Object.values(this.metrics.security).reduce((a, b) => a + b, 0),
          rateLimitViolations: this.metrics.rateLimits.violations
        }
      },
      recentAlerts: this.alerts.slice(-20).reverse()
    };
  }

  // Determine system security status
  getSystemStatus() {
    const recentAlerts = this.alerts.filter(a => 
      new Date() - new Date(a.timestamp) < 3600000 // Last hour
    );
    
    const criticalAlerts = recentAlerts.filter(a => a.severity === 'CRITICAL').length;
    const highAlerts = recentAlerts.filter(a => a.severity === 'HIGH').length;
    
    if (criticalAlerts > 0) return 'CRITICAL';
    if (highAlerts > 2) return 'WARNING';
    if (recentAlerts.length > 10) return 'ELEVATED';
    return 'NORMAL';
  }

  // Save metrics to file
  async saveMetrics() {
    try {
      const metricsDir = path.join(__dirname, '..', 'logs', 'metrics');
      await fs.mkdir(metricsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const metricsFile = path.join(metricsDir, `metrics-${timestamp}.json`);
      
      await fs.writeFile(metricsFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        metrics: this.metrics,
        alerts: this.alerts
      }, null, 2));
      
    } catch (error) {
      logger.error('Failed to save metrics', error);
    }
  }

  // Reset metrics
  resetMetrics() {
    this.metrics = {
      requests: { total: 0, failed: 0 },
      authentication: { attempts: 0, failures: 0 },
      rateLimits: { violations: 0 },
      security: { xssAttempts: 0, sqlInjection: 0, pathTraversal: 0 }
    };
    
    // Clean up old tracking data
    this.failedAttempts = {};
    this.rateLimitViolations = {};
  }

  // Generate security report
  async generateReport(period = 'daily') {
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      summary: this.getDashboard(),
      recommendations: this.getRecommendations()
    };
    
    try {
      const reportsDir = path.join(__dirname, '..', 'logs', 'reports');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const reportFile = path.join(reportsDir, `security-report-${Date.now()}.json`);
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
      
      return report;
    } catch (error) {
      logger.error('Failed to generate security report', error);
      throw error;
    }
  }

  // Get security recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.authentication.failures > 50) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'High number of authentication failures',
        action: 'Consider implementing CAPTCHA or increasing rate limits'
      });
    }
    
    if (this.metrics.rateLimits.violations > 100) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Frequent rate limit violations',
        action: 'Review rate limit thresholds and consider IP-based blocking'
      });
    }
    
    if (Object.values(this.metrics.security).some(v => v > 0)) {
      recommendations.push({
        priority: 'CRITICAL',
        issue: 'Security violation attempts detected',
        action: 'Review logs and consider implementing a Web Application Firewall (WAF)'
      });
    }
    
    return recommendations;
  }
}

// Export singleton instance
module.exports = new SecurityMonitor();