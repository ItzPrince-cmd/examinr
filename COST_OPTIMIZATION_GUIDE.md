# Examinr Cost Optimization Guide

This guide provides strategies to minimize costs while maintaining high performance for the Examinr platform.

## 1. Storage Cost Optimization

### S3 Storage Classes
```javascript
// Use Intelligent-Tiering for automatic cost optimization
const storageClass = {
  frequent: 'STANDARD',           // Hot data (< 30 days)
  infrequent: 'STANDARD_IA',     // Accessed monthly
  archive: 'GLACIER_IR',         // Accessed quarterly  
  deepArchive: 'DEEP_ARCHIVE'    // Yearly access
};
```

### Alternative Storage Providers (Lower Cost)
1. **Backblaze B2**: $0.005/GB vs S3's $0.023/GB
2. **Wasabi**: $0.0059/GB with no egress fees
3. **MinIO**: Self-hosted S3-compatible storage

### Image Optimization
- WebP conversion reduces size by 25-35%
- Progressive JPEG for faster perceived loading
- Lazy loading for images below the fold
- CDN caching with long TTL (1 year)

## 2. Database Cost Optimization

### MongoDB Atlas Optimization
```javascript
// Use shared clusters for development
const clusterTiers = {
  dev: 'M0',      // Free tier (512MB)
  staging: 'M2',  // $9/month (2GB)
  prod: 'M10'     // $57/month (10GB)
};
```

### Data Archival Strategy
```javascript
// Archive old quiz attempts after 6 months
const archivalPolicy = {
  quizAttempts: {
    active: '6 months',
    archive: 'S3 Glacier',
    delete: '2 years'
  }
};
```

### Index Optimization
- Remove unused indexes (saves storage)
- Use compound indexes efficiently
- Partial indexes for filtered queries

## 3. Caching Strategy

### Redis Memory Optimization
```javascript
// Intelligent TTL based on access patterns
const ttlStrategy = {
  hotData: 300,      // 5 minutes
  warmData: 3600,    // 1 hour
  coldData: 86400    // 24 hours
};
```

### Cache Warming
- Pre-load frequently accessed questions
- Cache popular search queries
- Use cache tags for efficient invalidation

## 4. CDN and Bandwidth Optimization

### Cloudflare (Free Tier)
- Unlimited bandwidth
- Global CDN
- DDoS protection
- SSL certificates

### Compression
```javascript
// Enable gzip/brotli compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

## 5. Compute Optimization

### Serverless for Variable Load
- AWS Lambda for image processing
- Vercel/Netlify for frontend hosting
- MongoDB Atlas Functions for data processing

### Container Optimization
```dockerfile
# Multi-stage builds reduce image size
FROM node:16-alpine AS builder
# Build stage
FROM node:16-alpine
# Only copy necessary files
```

## 6. Cost Monitoring

### AWS Cost Explorer Tags
```javascript
const resourceTags = {
  Environment: 'production',
  Service: 'examinr',
  CostCenter: 'education',
  Owner: 'team-name'
};
```

### Alerts and Budgets
- Set up billing alerts at 50%, 80%, 100%
- Use AWS Budgets for cost tracking
- Monitor unusual spikes

## 7. Development Cost Optimization

### Local Development
```yaml
# docker-compose.yml for local services
services:
  mongodb:
    image: mongo:5
  redis:
    image: redis:7-alpine
  minio:
    image: minio/minio  # S3-compatible local storage
```

### Staging Environment
- Use spot instances (up to 90% discount)
- Schedule auto-shutdown during off-hours
- Smaller instance sizes

## 8. Scaling Strategy

### Horizontal Scaling Triggers
```javascript
const scalingPolicy = {
  cpu: {
    scaleUp: 70,    // Scale up at 70% CPU
    scaleDown: 30   // Scale down at 30% CPU
  },
  response: {
    scaleUp: 1000,  // Scale up if response > 1s
    scaleDown: 200  // Scale down if response < 200ms
  }
};
```

### Database Scaling
- Read replicas for heavy read workloads
- Sharding for 1M+ users
- Connection pooling to reduce overhead

## 9. Free Tier Maximization

### Service Limits (Monthly)
- **MongoDB Atlas M0**: 512MB storage
- **AWS S3**: 5GB storage, 20K requests
- **Cloudflare**: Unlimited bandwidth
- **SendGrid**: 100 emails/day
- **Vercel**: 100GB bandwidth

## 10. Cost Estimation

### Per User Cost Breakdown (10K users)
```
Storage (S3):         $5/month   (100GB)
Database (Atlas):     $57/month  (M10 tier)
Redis (ElastiCache):  $15/month  (t3.micro)
CDN (Cloudflare):     $0/month   (free tier)
Compute (EC2):        $30/month  (t3.small)
Backup Storage:       $2/month   (Glacier)
------------------------
Total:                $109/month
Per User:             $0.011/month
```

### Scale Pricing (Estimated)
- 1K users: ~$50/month
- 10K users: ~$109/month  
- 100K users: ~$500/month
- 1M users: ~$2,000/month

## 11. Implementation Checklist

- [ ] Enable S3 Intelligent-Tiering
- [ ] Set up lifecycle policies for old data
- [ ] Implement image optimization pipeline
- [ ] Configure Redis eviction policies
- [ ] Enable compression on all endpoints
- [ ] Set up cost monitoring alerts
- [ ] Implement caching strategy
- [ ] Use CDN for static assets
- [ ] Archive old quiz attempts
- [ ] Monitor and optimize indexes

## 12. Emergency Cost Reduction

If costs spike unexpectedly:

1. **Immediate Actions**
   - Enable S3 request metrics
   - Check for infinite loops/retries
   - Review CloudWatch logs
   - Temporarily disable non-critical features

2. **Quick Wins**
   - Reduce backup frequency
   - Lower cache TTLs
   - Disable development environments
   - Compress existing S3 objects

3. **Long-term Solutions**
   - Migrate to cheaper regions
   - Negotiate enterprise discounts
   - Consider reserved instances
   - Implement request throttling

## 13. Monitoring Commands

```bash
# Check S3 usage
aws s3 ls --summarize --human-readable --recursive s3://examinr-storage

# MongoDB storage stats
mongo --eval "db.stats()"

# Redis memory info
redis-cli info memory

# Docker resource usage
docker stats
```

## Summary

By implementing these optimization strategies, Examinr can handle 10,000+ concurrent users for approximately $100-150/month, with costs scaling linearly. The key is intelligent caching, efficient storage tiering, and maximizing free tiers where possible.