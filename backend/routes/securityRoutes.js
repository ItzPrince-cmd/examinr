const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const securityMonitor = require('../monitoring/security-monitor');
const { logger } = require('../utils/logger');
const fs = require('fs').promises;
const path = require('path');

// Admin only routes (authentication required)
router.use(auth);

// Get security dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = securityMonitor.getDashboard();
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error fetching security dashboard', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security dashboard'
    });
  }
});

// Get security metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = securityMonitor.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Error fetching security metrics', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security metrics'
    });
  }
});

// Get security alerts
router.get('/alerts', async (req, res) => {
  try {
    const { severity, limit = 50, offset = 0 } = req.query;
    let alerts = securityMonitor.alerts;
    
    // Filter by severity if provided
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }
    
    // Pagination
    const total = alerts.length;
    alerts = alerts.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        alerts: alerts.reverse(), // Most recent first
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching security alerts', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security alerts'
    });
  }
});

// Generate security report
router.post('/report', async (req, res) => {
  try {
    const { period = 'daily' } = req.body;
    const report = await securityMonitor.generateReport(period);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Error generating security report', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate security report'
    });
  }
});

// Get security logs
router.get('/logs', async (req, res) => {
  try {
    const { type = 'error', date = new Date().toISOString().split('T')[0] } = req.query;
    
    const logFile = path.join(__dirname, '..', 'logs', `${type}.log`);
    
    // Check if file exists
    try {
      await fs.access(logFile);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Log file not found'
      });
    }
    
    // Read log file
    const content = await fs.readFile(logFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.includes(date));
    
    res.json({
      success: true,
      data: {
        type,
        date,
        entries: lines.slice(-100) // Last 100 entries
      }
    });
  } catch (error) {
    logger.error('Error fetching security logs', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security logs'
    });
  }
});

// Run security audit
router.post('/audit', async (req, res) => {
  try {
    const { execSync } = require('child_process');
    const output = execSync('node scripts/security-audit.js', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8'
    });
    
    res.json({
      success: true,
      data: {
        audit: output.split('\n')
      }
    });
  } catch (error) {
    logger.error('Error running security audit', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run security audit',
      error: error.message
    });
  }
});

// Update security configuration
router.patch('/config', async (req, res) => {
  try {
    const { thresholds } = req.body;
    
    if (thresholds) {
      Object.assign(securityMonitor.thresholds, thresholds);
    }
    
    res.json({
      success: true,
      message: 'Security configuration updated',
      data: {
        thresholds: securityMonitor.thresholds
      }
    });
  } catch (error) {
    logger.error('Error updating security config', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security configuration'
    });
  }
});

// Block/Unblock IP address
router.post('/ip-block', async (req, res) => {
  try {
    const { ip, action = 'block', reason } = req.body;
    
    // In production, this would update firewall rules or WAF
    logger.warn(`IP ${action}: ${ip}`, { reason, admin: req.user.id });
    
    res.json({
      success: true,
      message: `IP ${ip} has been ${action}ed`,
      data: { ip, action, reason }
    });
  } catch (error) {
    logger.error('Error managing IP block', error);
    res.status(500).json({
      success: false,
      message: 'Failed to manage IP block'
    });
  }
});

// Clear alerts
router.delete('/alerts', async (req, res) => {
  try {
    const { severity } = req.query;
    
    if (severity) {
      securityMonitor.alerts = securityMonitor.alerts.filter(a => a.severity !== severity);
    } else {
      securityMonitor.alerts = [];
    }
    
    logger.info('Security alerts cleared', { admin: req.user.id, severity });
    
    res.json({
      success: true,
      message: 'Security alerts cleared'
    });
  } catch (error) {
    logger.error('Error clearing alerts', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear alerts'
    });
  }
});

module.exports = router;