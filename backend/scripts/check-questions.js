const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

async function checkQuestions() {
  try {
    // Connect to MongoDB using the same configuration as the app
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr';
    console.log('Connecting to MongoDB:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully\n');

    // 1. Count total questions
    const totalCount = await Question.countDocuments();
    console.log(`Total questions in database: ${totalCount}`);

    // 2. Count by status
    const statusCounts = await Question.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nQuestions by status:');
    statusCounts.forEach(status => {
      console.log(`  ${status._id || 'undefined'}: ${status.count}`);
    });

    // 3. Count by subject
    const subjectCounts = await Question.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nQuestions by subject:');
    subjectCounts.forEach(subject => {
      console.log(`  ${subject._id || 'undefined'}: ${subject.count}`);
    });

    // 4. Count by difficulty
    const difficultyCounts = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nQuestions by difficulty:');
    difficultyCounts.forEach(difficulty => {
      console.log(`  ${difficulty._id || 'undefined'}: ${difficulty.count}`);
    });

    // 5. Count by type
    const typeCounts = await Question.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nQuestions by type:');
    typeCounts.forEach(type => {
      console.log(`  ${type._id || 'undefined'}: ${type.count}`);
    });

    // 6. Sample a few questions
    if (totalCount > 0) {
      console.log('\n\nSample of questions:');
      console.log('===================');
      
      const sampleQuestions = await Question.find()
        .limit(5)
        .select('title text subject chapter topic difficulty type status createdBy');
      
      sampleQuestions.forEach((q, index) => {
        console.log(`\n${index + 1}. ${q.title || 'Untitled'}`);
        console.log(`   Text: ${q.text ? q.text.substring(0, 100) + '...' : 'No text'}`);
        console.log(`   Subject: ${q.subject} | Chapter: ${q.chapter} | Topic: ${q.topic}`);
        console.log(`   Difficulty: ${q.difficulty} | Type: ${q.type} | Status: ${q.status}`);
        console.log(`   Created by ID: ${q.createdBy || 'Unknown'}`);
      });
    }

    // 7. Check the search query filters that would be applied
    console.log('\n\nChecking search query filters:');
    console.log('==============================');
    
    // Simulate a search query with no filters
    const searchQuery = {};
    const searchFilters = [];
    
    // Add status filter for students (simulating student role)
    searchFilters.push({ status: 'published' });
    
    if (searchFilters.length > 0) {
      searchQuery.$and = searchFilters;
    }
    
    console.log('Search query that would be applied:');
    console.log(JSON.stringify(searchQuery, null, 2));
    
    // Count questions that match this query
    const publishedCount = await Question.countDocuments({ status: 'published' });
    console.log(`\nQuestions matching student view (status='published'): ${publishedCount}`);
    
    // Test the actual aggregation pipeline
    console.log('\n\nTesting aggregation pipeline:');
    console.log('=============================');
    
    const pipeline = [];
    
    // Match stage
    if (Object.keys(searchQuery).length > 0) {
      pipeline.push({ $match: searchQuery });
    }
    
    // Add difficulty numeric for sorting
    pipeline.push({
      $addFields: {
        difficultyNumeric: {
          $switch: {
            branches: [
              { case: { $eq: ['$difficulty', 'easy'] }, then: 1 },
              { case: { $eq: ['$difficulty', 'medium'] }, then: 2 },
              { case: { $eq: ['$difficulty', 'hard'] }, then: 3 },
              { case: { $eq: ['$difficulty', 'expert'] }, then: 4 }
            ],
            default: 2
          }
        }
      }
    });
    
    // Sort
    pipeline.push({ $sort: { 'analytics.successRate': -1 } });
    
    // Limit
    pipeline.push({ $limit: 5 });
    
    // Project fields
    pipeline.push({
      $project: {
        title: 1,
        text: 1,
        subject: 1,
        difficulty: 1,
        type: 1,
        status: 1
      }
    });
    
    console.log('Pipeline stages:');
    pipeline.forEach((stage, index) => {
      console.log(`${index + 1}.`, JSON.stringify(stage, null, 2));
    });
    
    const aggregatedResults = await Question.aggregate(pipeline);
    console.log(`\nAggregation returned ${aggregatedResults.length} results`);
    
    if (aggregatedResults.length > 0) {
      console.log('\nAggregated results:');
      aggregatedResults.forEach((q, index) => {
        console.log(`${index + 1}. ${q.title} (${q.status}) - ${q.subject} - ${q.difficulty}`);
      });
    }

    // 8. Check for any questions without required fields
    console.log('\n\nData integrity check:');
    console.log('====================');
    
    const missingFieldsCounts = await Promise.all([
      Question.countDocuments({ title: { $exists: false } }),
      Question.countDocuments({ text: { $exists: false } }),
      Question.countDocuments({ type: { $exists: false } }),
      Question.countDocuments({ subject: { $exists: false } }),
      Question.countDocuments({ difficulty: { $exists: false } }),
      Question.countDocuments({ status: { $exists: false } })
    ]);
    
    const fields = ['title', 'text', 'type', 'subject', 'difficulty', 'status'];
    fields.forEach((field, index) => {
      if (missingFieldsCounts[index] > 0) {
        console.log(`Questions missing ${field}: ${missingFieldsCounts[index]}`);
      }
    });

    // 9. Check indexes
    console.log('\n\nIndexes on Question collection:');
    console.log('==============================');
    const indexes = await Question.collection.getIndexes();
    Object.entries(indexes).forEach(([name, index]) => {
      console.log(`${name}:`, JSON.stringify(index, null, 2));
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n\nDatabase connection closed');
  }
}

// Run the check
checkQuestions();