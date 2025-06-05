const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Question = require('../models/Question');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');
    console.log('Creating indexes for Question collection...');

    // Drop existing indexes except _id
    try {
      await Question.collection.dropIndexes();
      console.log('Dropped existing indexes');
    } catch (error) {
      console.log('No indexes to drop or error dropping indexes:', error.message);
    }

    // Create single field indexes
    const singleFieldIndexes = [
      { subject: 1 },
      { chapter: 1 },
      { topic: 1 },
      { subtopic: 1 },
      { difficulty: 1 },
      { type: 1 },
      { status: 1 },
      { createdBy: 1 },
      { 'statistics.timesUsed': -1 },
      { 'statistics.averageScore': 1 },
      { 'analytics.successRate': -1 },
      { 'specialCategories.isPYQ': 1 },
      { 'specialCategories.pyqYear': 1 },
      { createdAt: -1 }
    ];

    for (const index of singleFieldIndexes) {
      await Question.collection.createIndex(index);
      console.log(`Created index: ${JSON.stringify(index)}`);
    }

    // Create compound indexes
    const compoundIndexes = [
      { subject: 1, chapter: 1, topic: 1 },
      { subject: 1, topic: 1, subtopic: 1 },
      { subject: 1, difficulty: 1, type: 1 },
      { subject: 1, chapter: 1, 'analytics.successRate': -1 },
      { status: 1, subject: 1, difficulty: 1 },
      { tags: 1, status: 1 },
      { 'specialCategories.isPYQ': 1, subject: 1, 'specialCategories.pyqYear': -1 }
    ];

    for (const index of compoundIndexes) {
      await Question.collection.createIndex(index);
      console.log(`Created compound index: ${JSON.stringify(index)}`);
    }

    // Create text index for search
    await Question.collection.createIndex({
      text: 'text',
      title: 'text',
      tags: 'text',
      'solution.detailed.text': 'text'
    });
    console.log('Created text search index');

    // Create unique index for slug (if exists)
    await Question.collection.createIndex(
      { slug: 1 },
      { unique: true, sparse: true }
    );
    console.log('Created unique index for slug');

    // List all indexes
    const indexes = await Question.collection.getIndexes();
    console.log('\nAll indexes created:');
    console.log(JSON.stringify(indexes, null, 2));

    console.log('\n✅ Successfully created all indexes for Question collection');

  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createIndexes();