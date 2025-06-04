
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
