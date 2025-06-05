const mongoose = require('mongoose');
require('dotenv').config();

async function fixSubjectObjectIds() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully\n');

    // Get direct database access
    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');
    const categoriesCollection = db.collection('categories');

    // Map ObjectIds to proper subject enums
    const categoryMapping = {
      '683c832e2f2d6bd4b816fa2d': 'mathematics',  // Mathematics category
      '683c832e2f2d6bd4b816fa3b': 'physics',      // Science category
      '683c832f2f2d6bd4b816fa74': 'biology'       // English category (needs review)
    };

    // First, verify categories exist
    console.log('Verifying categories:');
    for (const [objectIdStr, subjectEnum] of Object.entries(categoryMapping)) {
      try {
        const category = await categoriesCollection.findOne({ 
          _id: new mongoose.Types.ObjectId(objectIdStr) 
        });
        if (category) {
          console.log(`  ${objectIdStr} => Found: ${category.name} (will map to: ${subjectEnum})`);
        } else {
          console.log(`  ${objectIdStr} => Not found in categories`);
        }
      } catch (err) {
        console.log(`  ${objectIdStr} => Error: ${err.message}`);
      }
    }

    // Find all questions with ObjectId subjects
    console.log('\nFinding questions with ObjectId subjects...');
    
    // Get all distinct subject values
    const distinctSubjects = await questionsCollection.distinct('subject');
    const objectIdSubjects = distinctSubjects.filter(subject => {
      // Check if it's a string that looks like ObjectId or an actual ObjectId
      if (typeof subject === 'string' && /^[0-9a-fA-F]{24}$/.test(subject)) {
        return true;
      }
      if (subject && subject.toString && /^[0-9a-fA-F]{24}$/.test(subject.toString())) {
        return true;
      }
      return false;
    });

    console.log(`Found ${objectIdSubjects.length} ObjectId-like subjects`);

    // Count questions for each ObjectId subject
    for (const subject of objectIdSubjects) {
      const subjectStr = subject.toString();
      const count = await questionsCollection.countDocuments({ subject: subject });
      console.log(`  ${subjectStr}: ${count} questions`);
    }

    // Update questions with ObjectId subjects
    console.log('\nUpdating questions...');
    let totalUpdated = 0;
    let errors = [];

    for (const [objectIdStr, subjectEnum] of Object.entries(categoryMapping)) {
      try {
        // Update by string match
        const result1 = await questionsCollection.updateMany(
          { subject: objectIdStr },
          { $set: { subject: subjectEnum } }
        );
        
        // Update by ObjectId match
        const result2 = await questionsCollection.updateMany(
          { subject: new mongoose.Types.ObjectId(objectIdStr) },
          { $set: { subject: subjectEnum } }
        );
        
        const updated = result1.modifiedCount + result2.modifiedCount;
        totalUpdated += updated;
        
        console.log(`  ${objectIdStr} => ${subjectEnum}: Updated ${updated} questions`);
      } catch (error) {
        errors.push({ objectId: objectIdStr, error: error.message });
      }
    }

    console.log(`\nTotal questions updated: ${totalUpdated}`);

    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(err => {
        console.log(`  - ${err.objectId}: ${err.error}`);
      });
    }

    // Verify the fix
    console.log('\n--- Verifying Fix ---');
    
    // Count by subject after fix
    const subjectCounts = await questionsCollection.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    console.log('\nQuestion count by subject after fix:');
    subjectCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id || 'null'}: ${count} questions`);
    });

    // Check for any remaining ObjectId subjects
    const remainingObjectIds = subjectCounts.filter(s => {
      const subject = s._id;
      if (!subject) return false;
      const subjectStr = subject.toString();
      return /^[0-9a-fA-F]{24}$/.test(subjectStr);
    });

    if (remainingObjectIds.length > 0) {
      console.log('\nWarning: Still found ObjectId subjects:');
      remainingObjectIds.forEach(({ _id, count }) => {
        console.log(`  ${_id}: ${count} questions`);
      });
    } else {
      console.log('\n✓ All ObjectId subjects have been converted to enum values!');
    }

    // Sample some updated questions
    console.log('\nSample of updated questions:');
    const samples = await questionsCollection.find({ 
      subject: { $in: ['mathematics', 'physics', 'biology', 'chemistry'] } 
    }).limit(5).toArray();
    
    samples.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.title}: subject=${doc.subject} (${doc.status})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the fix
fixSubjectObjectIds();