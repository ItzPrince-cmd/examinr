const mongoose = require('mongoose');

const searchAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchTerm: {
    type: String,
    required: true,
    index: true
  },
  filters: {
    type: Object,
    default: {}
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'superadmin'],
    required: true
  },
  resultCount: {
    type: Number,
    default: 0
  },
  clickedResults: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    position: Number,
    clickedAt: {
      type: Date,
      default: Date.now
    }
  }],
  searchType: {
    type: String,
    enum: ['manual', 'autocomplete', 'filter', 'preset'],
    default: 'manual'
  },
  sessionId: String,
  searchDuration: Number, // Time taken to get results in ms
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes for analytics queries
searchAnalyticsSchema.index({ searchTerm: 1, createdAt: -1 });
searchAnalyticsSchema.index({ userId: 1, createdAt: -1 });
searchAnalyticsSchema.index({ resultCount: 1 });
searchAnalyticsSchema.index({ 'filters.subject': 1 });
searchAnalyticsSchema.index({ 'filters.difficulty': 1 });

// Static method to track search
searchAnalyticsSchema.statics.trackSearch = async function(searchData) {
  try {
    const analytics = new this({
      userId: searchData.userId,
      searchTerm: searchData.searchTerm,
      filters: searchData.filters,
      userRole: searchData.userRole,
      searchType: searchData.searchType || 'manual',
      sessionId: searchData.sessionId
    });
    
    await analytics.save();
    return analytics;
  } catch (error) {
    console.error('Error tracking search:', error);
    return null;
  }
};

// Static method to track autocomplete
searchAnalyticsSchema.statics.trackAutocomplete = async function(term, field, resultCount) {
  try {
    // We'll aggregate autocomplete searches hourly to reduce database load
    const hourStart = new Date();
    hourStart.setMinutes(0, 0, 0);
    
    await this.findOneAndUpdate(
      {
        searchTerm: term,
        searchType: 'autocomplete',
        createdAt: {
          $gte: hourStart,
          $lt: new Date(hourStart.getTime() + 3600000) // 1 hour later
        }
      },
      {
        $inc: { resultCount: 1 },
        $set: { 'filters.field': field }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error tracking autocomplete:', error);
  }
};

// Method to track clicked results
searchAnalyticsSchema.methods.trackClick = async function(questionId, position) {
  this.clickedResults.push({
    questionId,
    position,
    clickedAt: new Date()
  });
  
  await this.save();
};

// Static method to get search insights
searchAnalyticsSchema.statics.getSearchInsights = async function(timeframe = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeframe);
  
  const insights = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        searchType: 'manual'
      }
    },
    {
      $group: {
        _id: null,
        totalSearches: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        avgResultCount: { $avg: '$resultCount' },
        zeroResultSearches: {
          $sum: { $cond: [{ $eq: ['$resultCount', 0] }, 1, 0] }
        },
        popularTerms: {
          $push: {
            term: '$searchTerm',
            count: '$resultCount'
          }
        }
      }
    },
    {
      $project: {
        totalSearches: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        avgResultCount: { $round: ['$avgResultCount', 2] },
        zeroResultSearches: 1,
        zeroResultRate: {
          $multiply: [
            { $divide: ['$zeroResultSearches', '$totalSearches'] },
            100
          ]
        }
      }
    }
  ]);
  
  return insights[0] || {};
};

// Static method to get popular filters
searchAnalyticsSchema.statics.getPopularFilters = async function(limit = 10) {
  const popularFilters = await this.aggregate([
    {
      $match: {
        filters: { $ne: {} }
      }
    },
    {
      $project: {
        filterKeys: { $objectToArray: '$filters' }
      }
    },
    {
      $unwind: '$filterKeys'
    },
    {
      $group: {
        _id: {
          key: '$filterKeys.k',
          value: '$filterKeys.v'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: limit
    }
  ]);
  
  return popularFilters;
};

const SearchAnalytics = mongoose.model('SearchAnalytics', searchAnalyticsSchema);

module.exports = SearchAnalytics;