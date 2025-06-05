const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

async function checkSubjects() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr';
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully\n');

    // 1. Get unique subjects
    const uniqueSubjects = await Question.distinct('subject');
    console.log('Unique subject values in database:');
    uniqueSubjects.forEach(subject => {
      console.log(`  - ${subject}`);
    });

    // 2. Count questions with ObjectId subjects vs enum subjects
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    const objectIdSubjects = uniqueSubjects.filter(s => objectIdPattern.test(s));
    const enumSubjects = uniqueSubjects.filter(s => !objectIdPattern.test(s));
    
    console.log(`\nObjectId subjects found: ${objectIdSubjects.length}`);
    console.log(`Enum subjects found: ${enumSubjects.length}`);
    
    // Count for each subject type
    const subjectCounts = {};
    for (const subject of uniqueSubjects) {
      subjectCounts[subject] = await Question.countDocuments({ subject });
    }
    
    console.log('\nQuestion count by subject:');
    Object.entries(subjectCounts).forEach(([subject, count]) => {
      const isObjectId = objectIdPattern.test(subject);
      console.log(`  ${subject} (${isObjectId ? 'ObjectId' : 'Enum'}): ${count} questions`);
    });
    
    const totalObjectIdQuestions = objectIdSubjects.reduce((sum, s) => sum + subjectCounts[s], 0);
    const totalEnumQuestions = enumSubjects.reduce((sum, s) => sum + subjectCounts[s], 0);
    
    console.log(`\nTotal questions with ObjectId subjects: ${totalObjectIdQuestions}`);
    console.log(`Total questions with enum subjects: ${totalEnumQuestions}`);

    // 3. Sample questions with different subject types
    console.log('\nSample questions with ObjectId subjects:');
    const objectIdSubjectQuestions = await Question.find({
      subject: { $in: objectIdSubjects }
    }).limit(3).select('title subject chapter topic');
    
    objectIdSubjectQuestions.forEach(q => {
      console.log(`  - ${q.title}: subject=${q.subject}`);
    });

    console.log('\nSample questions with enum subjects:');
    const enumSubjectQuestions = await Question.find({
      subject: { $in: ['physics', 'chemistry', 'mathematics', 'biology'] }
    }).limit(3).select('title subject chapter topic');
    
    enumSubjectQuestions.forEach(q => {
      console.log(`  - ${q.title}: subject=${q.subject}`);
    });

    // 4. Check if there's a Category collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    const categoryCollection = collections.find(col => col.name === 'categories');
    
    if (categoryCollection) {
      console.log('\n\nCategory collection exists!');
      const Category = require('../models/Category');
      
      // Get categories that match the ObjectId subjects - already defined above
      
      if (objectIdSubjects.length > 0) {
        console.log('\nLooking up categories for ObjectId subjects:');
        for (const subjectId of objectIdSubjects) {
          try {
            const category = await Category.findById(subjectId);
            if (category) {
              console.log(`  ${subjectId} => ${category.name || 'No name'}`);
            }
          } catch (err) {
            console.log(`  ${subjectId} => Not found`);
          }
        }
      }
    }

    // 5. Check what the actual enum values should be according to the schema
    console.log('\n\nExpected subject enum values from schema:');
    const subjectEnum = Question.schema.path('subject').enumValues;
    console.log(subjectEnum);

    // 6. Recommend fix
    console.log('\n\nRecommendation:');
    if (totalObjectIdQuestions > 0) {
      console.log('It appears that some questions have ObjectId references for subjects instead of enum values.');
      console.log('This might be because:');
      console.log('1. The schema was changed from referencing a Category model to using enum values');
      console.log('2. Questions were imported with category IDs instead of subject names');
      console.log('\nTo fix this, you would need to:');
      console.log('1. Map the ObjectId subjects to their corresponding enum values');
      console.log('2. Update the questions with the correct enum values');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the check
checkSubjects();