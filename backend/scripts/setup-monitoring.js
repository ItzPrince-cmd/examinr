#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔔 Setting up Security Monitoring for Examinr...\n');

// Create monitoring configuration
const monitoringConfig = {
  alerts: {
    email: {
      enabled: process.env.ENABLE_EMAIL_ALERTS === 'true',
      recipients: process.env.ALERT_EMAILS?.split(',') || ['admin@examinr.com'],
      smtp: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    },
    slack: {
      enabled: process.env.ENABLE_SLACK_ALERTS === 'true',
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: process.env.SLACK_CHANNEL || '#security-alerts'
    },
    sms: {
      enabled: process.env.ENABLE_SMS_ALERTS === 'true',
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      recipients: process.env.ALERT_PHONES?.split(',') || []
    }
  },
  thresholds: {
    failedLogins: parseInt(process.env.FAILED_LOGIN_THRESHOLD) || 5,
    rateLimitViolations: parseInt(process.env.RATE_LIMIT_THRESHOLD) || 10,
    errorRate: parseFloat(process.env.ERROR_RATE_THRESHOLD) || 0.05,
    responseTime: parseInt(process.env.RESPONSE_TIME_THRESHOLD) || 1000
  },
  monitoring: {
    sentry: {
      enabled: !!process.env.SENTRY_DSN,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 0.1
    },
    newRelic: {
      enabled: !!process.env.NEW_RELIC_LICENSE_KEY,
      appName: 'Examinr Backend',
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY
    },
    datadog: {
      enabled: !!process.env.DATADOG_API_KEY,
      apiKey: process.env.DATADOG_API_KEY,
      appKey: process.env.DATADOG_APP_KEY
    }
  }
};

// Create monitoring setup script
const setupScript = `
# Monitoring Setup Guide for Examinr

## 1. Application Performance Monitoring (APM)

### Sentry Setup (Error Tracking)
1. Create account at https://sentry.io
2. Create new project for Node.js
3. Copy DSN and add to .env: SENTRY_DSN=your-dsn-here
4. Install Sentry: npm install @sentry/node @sentry/tracing

### New Relic Setup (Performance Monitoring)
1. Create account at https://newrelic.com
2. Create new application
3. Copy license key and add to .env: NEW_RELIC_LICENSE_KEY=your-key
4. Install New Relic: npm install newrelic

### Datadog Setup (Infrastructure Monitoring)
1. Create account at https://www.datadoghq.com
2. Get API and App keys
3. Add to .env: DATADOG_API_KEY=your-key, DATADOG_APP_KEY=your-app-key

## 2. Alert Notifications

### Email Alerts (SendGrid/SMTP)
Add to .env:
ENABLE_EMAIL_ALERTS=true
ALERT_EMAILS=admin@example.com,security@example.com
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key

### Slack Alerts
1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Add to .env:
ENABLE_SLACK_ALERTS=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_CHANNEL=#security-alerts

### SMS Alerts (Twilio)
1. Create Twilio account: https://www.twilio.com
2. Get credentials and phone number
3. Add to .env:
ENABLE_SMS_ALERTS=true
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
ALERT_PHONES=+1234567890,+0987654321

## 3. Log Management

### ELK Stack (Elasticsearch, Logstash, Kibana)
- Use Docker Compose for local setup
- Use managed services like Elastic Cloud for production

### CloudWatch (AWS)
- Use winston-cloudwatch transport
- Configure IAM role with CloudWatch permissions

### Loggly/Papertrail
- Cloud-based log management
- Easy integration with Winston

## 4. Uptime Monitoring

### UptimeRobot
1. Create account at https://uptimerobot.com
2. Add monitor for: https://api.examinr.com/health
3. Set check interval: 5 minutes
4. Configure alerts

### Pingdom
- More advanced uptime monitoring
- Global monitoring locations
- Detailed performance metrics

## 5. Security Monitoring

### OWASP ZAP (Security Scanning)
- Run regular security scans
- Integrate with CI/CD pipeline

### Snyk (Dependency Scanning)
- Monitor for vulnerable dependencies
- Automated PR creation for fixes

## 6. Custom Dashboards

### Grafana Setup
1. Install Grafana
2. Connect data sources (Prometheus, InfluxDB)
3. Import dashboard templates
4. Create custom panels for:
   - Request rate
   - Error rate
   - Response time
   - Authentication metrics
   - Security alerts

## 7. Alerting Rules

Configure alerts for:
- High error rate (> 5%)
- Slow response time (> 1s average)
- Failed login attempts (> 5 from same IP)
- Rate limit violations
- Security violations (XSS, SQL injection attempts)
- Server resources (CPU > 80%, Memory > 90%)
- Database connection failures

## 8. Regular Tasks

### Daily
- Review security alerts
- Check error rates
- Monitor performance metrics

### Weekly
- Review security logs
- Update dependencies
- Run security scans

### Monthly
- Generate security reports
- Review and update alerting thresholds
- Audit user access logs
- Update security documentation
`;

// Save configuration
const configPath = path.join(__dirname, '..', 'config', 'monitoring.json');
fs.writeFileSync(configPath, JSON.stringify(monitoringConfig, null, 2));
console.log(`✅ Monitoring configuration saved to: ${configPath}`);

// Save setup guide
const guidePath = path.join(__dirname, '..', 'MONITORING_SETUP.md');
fs.writeFileSync(guidePath, setupScript);
console.log(`✅ Monitoring setup guide saved to: ${guidePath}`);

// Create monitoring dashboard HTML
const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examinr Security Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .metric {
            font-size: 2em;
            font-weight: bold;
            color: #2563eb;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .status.normal { background: #10b981; color: white; }
        .status.elevated { background: #f59e0b; color: white; }
        .status.warning { background: #ef4444; color: white; }
        .status.critical { background: #991b1b; color: white; }
        .alert {
            padding: 12px;
            margin: 8px 0;
            border-radius: 4px;
            border-left: 4px solid;
        }
        .alert.high { border-color: #ef4444; background: #fee2e2; }
        .alert.medium { border-color: #f59e0b; background: #fef3c7; }
        .alert.low { border-color: #3b82f6; background: #dbeafe; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Examinr Security Dashboard</h1>
            <p>Real-time security monitoring and alerts</p>
            <p>Status: <span class="status normal" id="system-status">NORMAL</span></p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>Request Metrics</h3>
                <div class="metric" id="total-requests">0</div>
                <p>Total Requests</p>
                <p>Error Rate: <span id="error-rate">0%</span></p>
            </div>
            
            <div class="card">
                <h3>Authentication</h3>
                <div class="metric" id="auth-attempts">0</div>
                <p>Login Attempts</p>
                <p>Success Rate: <span id="auth-success">100%</span></p>
            </div>
            
            <div class="card">
                <h3>Security Events</h3>
                <div class="metric" id="security-violations">0</div>
                <p>Violations Detected</p>
                <p>Rate Limits: <span id="rate-limits">0</span></p>
            </div>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <h3>Recent Alerts</h3>
            <div id="alerts-container">
                <p style="color: #6b7280;">No recent alerts</p>
            </div>
        </div>
    </div>
    
    <script>
        // This would connect to your real-time monitoring API
        async function updateDashboard() {
            try {
                const response = await fetch('/api/security/dashboard', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                
                if (data.success) {
                    updateMetrics(data.data);
                }
            } catch (error) {
                console.error('Failed to update dashboard:', error);
            }
        }
        
        function updateMetrics(data) {
            // Update status
            document.getElementById('system-status').textContent = data.overview.status;
            document.getElementById('system-status').className = 'status ' + data.overview.status.toLowerCase();
            
            // Update metrics
            document.getElementById('total-requests').textContent = data.metrics.requests.total;
            document.getElementById('error-rate').textContent = data.metrics.requests.errorRate;
            document.getElementById('auth-attempts').textContent = data.metrics.authentication.total;
            document.getElementById('auth-success').textContent = data.metrics.authentication.successRate;
            document.getElementById('security-violations').textContent = data.metrics.security.violations;
            document.getElementById('rate-limits').textContent = data.metrics.security.rateLimitViolations;
            
            // Update alerts
            const alertsContainer = document.getElementById('alerts-container');
            if (data.recentAlerts.length > 0) {
                alertsContainer.innerHTML = data.recentAlerts.slice(0, 5).map(alert => 
                    '<div class="alert ' + alert.severity.toLowerCase() + '">' +
                    '<strong>' + alert.type + '</strong> - ' + 
                    new Date(alert.timestamp).toLocaleString() +
                    '</div>'
                ).join('');
            }
        }
        
        // Update every 30 seconds
        setInterval(updateDashboard, 30000);
        updateDashboard();
    </script>
</body>
</html>`;

// Save dashboard
const dashboardPath = path.join(__dirname, '..', 'public', 'security-dashboard.html');
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
fs.writeFileSync(dashboardPath, dashboardHTML);
console.log(`✅ Security dashboard saved to: ${dashboardPath}`);

// Create systemd service file for Linux deployments
const systemdService = `[Unit]
Description=Examinr Backend Service
After=network.target mongodb.service

[Service]
Type=simple
User=examinr
WorkingDirectory=/opt/examinr/backend
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/examinr/backend/logs /opt/examinr/backend/uploads

# Resource Limits
LimitNOFILE=65535
MemoryLimit=1G
CPUQuota=80%

[Install]
WantedBy=multi-user.target`;

const servicePath = path.join(__dirname, '..', 'examinr.service');
fs.writeFileSync(servicePath, systemdService);
console.log(`✅ Systemd service file saved to: ${servicePath}`);

console.log('\n📊 Monitoring Setup Complete!');
console.log('\nNext Steps:');
console.log('1. Review MONITORING_SETUP.md for detailed setup instructions');
console.log('2. Configure your preferred monitoring services');
console.log('3. Update .env with monitoring credentials');
console.log('4. Deploy the security dashboard to your admin panel');
console.log('5. Set up automated alerts for critical events');
console.log('\n💡 Tip: Start with Sentry for error tracking and UptimeRobot for uptime monitoring');