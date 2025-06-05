const mongoose = require('mongoose');
const Question = require('../models/Question');
const Category = require('../models/Category');
require('dotenv').config();

async function fixSubjectReferences() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully\n');

    // Get the mapping of ObjectIds to category names
    const categoryMapping = {
      '683c832e2f2d6bd4b816fa2d': 'mathematics',
      '683c832e2f2d6bd4b816fa3b': 'physics', // Science category - assuming physics
      '683c832f2f2d6bd4b816fa74': 'physics'  // English category - will need manual review
    };

    // First, let's verify the categories
    console.log('Verifying categories in database:');
    for (const [objectId, expectedName] of Object.entries(categoryMapping)) {
      try {
        const category = await Category.findById(objectId);
        if (category) {
          console.log(`  ${objectId} => ${category.name} (mapped to: ${expectedName})`);
        } else {
          console.log(`  ${objectId} => Not found in categories`);
        }
      } catch (err) {
        console.log(`  ${objectId} => Error: ${err.message}`);
      }
    }

    // Count questions with ObjectId subjects
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const questionsWithObjectIds = await Question.find({
      subject: { $regex: objectIdPattern }
    });

    console.log(`\nFound ${questionsWithObjectIds.length} questions with ObjectId subjects`);

    // Update questions in batches
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const question of questionsWithObjectIds) {
      const mappedSubject = categoryMapping[question.subject];
      
      if (mappedSubject) {
        try {
          // Update the question
          await Question.findByIdAndUpdate(question._id, {
            subject: mappedSubject
          });
          updatedCount++;
          
          if (updatedCount % 10 === 0) {
            console.log(`  Updated ${updatedCount} questions...`);
          }
        } catch (error) {
          errorCount++;
          errors.push({
            questionId: question._id,
            title: question.title,
            error: error.message
          });
        }
      } else {
        errorCount++;
        errors.push({
          questionId: question._id,
          title: question.title,
          error: `No mapping found for subject: ${question.subject}`
        });
      }
    }

    console.log('\n--- Update Summary ---');
    console.log(`Total questions with ObjectId subjects: ${questionsWithObjectIds.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach(err => {
        console.log(`  - Question ${err.questionId} (${err.title}): ${err.error}`);
      });
    }

    // Verify the fix
    console.log('\n--- Verifying Fix ---');
    const remainingObjectIdQuestions = await Question.countDocuments({
      subject: { $regex: objectIdPattern }
    });
    console.log(`Questions still with ObjectId subjects: ${remainingObjectIdQuestions}`);

    // Count by subject after fix
    const subjectCounts = await Question.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nQuestion count by subject after fix:');
    subjectCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id || 'null'}: ${count} questions`);
    });

    // Check if all subjects are now valid enums
    const validSubjects = ['physics', 'chemistry', 'mathematics', 'biology'];
    const invalidSubjects = subjectCounts.filter(s => s._id && !validSubjects.includes(s._id));
    
    if (invalidSubjects.length > 0) {
      console.log('\nWarning: Found subjects that are not in the valid enum list:');
      invalidSubjects.forEach(({ _id, count }) => {
        console.log(`  ${_id}: ${count} questions`);
      });
    } else {
      console.log('\n✓ All subjects are now valid enum values!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the fix
fixSubjectReferences();