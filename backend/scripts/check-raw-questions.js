const mongoose = require('mongoose');
require('dotenv').config();

async function checkRawQuestions() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully\n');

    // Get raw questions from database
    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');
    
    // Count total
    const totalCount = await questionsCollection.countDocuments();
    console.log(`Total questions in collection: ${totalCount}\n`);
    
    // Get aggregated subject counts using raw MongoDB
    const subjectCounts = await questionsCollection.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('Subject counts from raw aggregation:');
    subjectCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count} questions`);
    });
    
    // Sample 10 questions to see raw data
    console.log('\n\nSample of raw question documents:');
    const samples = await questionsCollection.find({}).limit(10).toArray();
    
    samples.forEach((doc, index) => {
      console.log(`\n${index + 1}. Document ID: ${doc._id}`);
      console.log(`   Title: ${doc.title || 'No title'}`);
      console.log(`   Subject: ${doc.subject} (Type: ${typeof doc.subject})`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   Difficulty: ${doc.difficulty}`);
      console.log(`   Type: ${doc.type}`);
      
      // Check if subject looks like an ObjectId
      if (doc.subject && doc.subject.toString().match(/^[0-9a-fA-F]{24}$/)) {
        console.log(`   ⚠️  Subject appears to be an ObjectId!`);
      }
    });
    
    // Check for questions where subject is an ObjectId string
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const questionsWithObjectIdSubjects = await questionsCollection.find({
      subject: { $regex: objectIdPattern }
    }).count();
    
    console.log(`\n\nQuestions with ObjectId-like subject strings: ${questionsWithObjectIdSubjects}`);
    
    // Check distinct subject values and their types
    const distinctSubjects = await questionsCollection.distinct('subject');
    console.log('\nDistinct subject values and analysis:');
    distinctSubjects.forEach(subject => {
      const isObjectIdLike = objectIdPattern.test(subject);
      const isValidEnum = ['physics', 'chemistry', 'mathematics', 'biology'].includes(subject);
      console.log(`  "${subject}"`);
      console.log(`    - Looks like ObjectId: ${isObjectIdLike}`);
      console.log(`    - Valid enum value: ${isValidEnum}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n\nDatabase connection closed');
  }
}

// Run the check
checkRawQuestions();