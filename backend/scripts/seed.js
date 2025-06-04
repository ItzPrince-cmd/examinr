require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const StudentAnalytics = require('../models/StudentAnalytics');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Helper function to create a user
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
    accountStatus: {
      isActive: true,
      isEmailVerified: true,
      isProfileComplete: true
    }
  });
  return user.save();
};

// Seed Categories
const seedCategories = async () => {
  console.log('\n📚 Creating categories...');
  
  const categories = [
    { name: 'Mathematics', icon: 'calculate', color: '#2196F3' },
    { name: 'Science', icon: 'science', color: '#4CAF50' },
    { name: 'English', icon: 'menu_book', color: '#FF9800' },
    { name: 'History', icon: 'history_edu', color: '#9C27B0' },
    { name: 'Computer Science', icon: 'computer', color: '#00BCD4' }
  ];

  const createdCategories = {};
  
  for (const categoryData of categories) {
    let category = await Category.findOne({ name: categoryData.name });
    if (!category) {
      category = await Category.create(categoryData);
      console.log(`  ✓ Created category: ${category.name}`);
    } else {
      console.log(`  → Category already exists: ${category.name}`);
    }
    createdCategories[categoryData.name] = category;
  }
  
  return createdCategories;
};

// Seed Teachers
const seedTeachers = async () => {
  console.log('\n👩‍🏫 Creating teacher accounts...');
  
  const teachers = [];
  const teacherData = [
    { firstName: 'Sarah', lastName: 'Johnson', specialization: 'Mathematics' },
    { firstName: 'Michael', lastName: 'Chen', specialization: 'Science' },
    { firstName: 'Emily', lastName: 'Davis', specialization: 'English' },
    { firstName: 'Robert', lastName: 'Williams', specialization: 'History' },
    { firstName: 'Lisa', lastName: 'Anderson', specialization: 'Computer Science' }
  ];

  for (let i = 0; i < teacherData.length; i++) {
    const data = teacherData[i];
    const email = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@examinr.com`;
    
    let teacher = await User.findOne({ email });
    if (!teacher) {
      teacher = await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        role: 'teacher',
        profile: {
          bio: `Experienced ${data.specialization} teacher with over 10 years of teaching experience.`,
          phone: { number: faker.phone.number() }
        },
        teaching: {
          subjects: [data.specialization],
          experience: faker.number.int({ min: 5, max: 20 }),
          qualifications: ['M.Ed', `B.S. in ${data.specialization}`],
          specializations: [data.specialization],
          rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 })
        }
      });
      console.log(`  ✓ Created teacher: ${teacher.fullName} (${email})`);
    } else {
      console.log(`  → Teacher already exists: ${email}`);
    }
    teachers.push(teacher);
  }
  
  return teachers;
};

// Seed Students
const seedStudents = async () => {
  console.log('\n👨‍🎓 Creating student accounts...');
  
  const students = [];
  const existingCount = await User.countDocuments({ role: 'student' });
  
  if (existingCount >= 20) {
    console.log(`  → Already have ${existingCount} students`);
    return User.find({ role: 'student' }).limit(20);
  }
  
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    let student = await User.findOne({ email });
    if (!student) {
      student = await createUser({
        firstName,
        lastName,
        email,
        role: 'student',
        profile: {
          dateOfBirth: faker.date.birthdate({ min: 18, max: 25, mode: 'age' }),
          phone: { number: faker.phone.number() },
          address: {
            city: faker.location.city(),
            state: faker.location.state(),
            country: 'USA'
          }
        },
        education: {
          institution: faker.company.name() + ' University',
          degree: 'Bachelor of Science',
          fieldOfStudy: faker.helpers.arrayElement(['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business']),
          startYear: 2020,
          endYear: 2024
        }
      });
      console.log(`  ✓ Created student: ${student.fullName}`);
      students.push(student);
    }
  }
  
  console.log(`  → Total students created: ${students.length}`);
  return students;
};

// Seed Questions
const seedQuestions = async (categories, teachers) => {
  console.log('\n❓ Creating questions...');
  
  const questions = [];
  const subjects = ['Mathematics', 'Science', 'English'];
  const difficulties = ['beginner', 'easy', 'medium', 'hard', 'expert'];
  
  // Mathematics Questions
  const mathQuestions = [
    {
      title: 'Basic Algebra',
      text: 'What is the value of x in the equation: 2x + 5 = 15?',
      type: 'multiple_choice',
      options: [
        { id: 'a', text: 'x = 5', isCorrect: true },
        { id: 'b', text: 'x = 10', isCorrect: false },
        { id: 'c', text: 'x = 7.5', isCorrect: false },
        { id: 'd', text: 'x = 20', isCorrect: false }
      ],
      topic: 'Algebra',
      points: 5
    },
    {
      title: 'Geometry Basics',
      text: 'What is the area of a circle with radius 5 units? (Use π = 3.14)',
      type: 'short_answer',
      topic: 'Geometry',
      points: 10
    }
  ];

  // Science Questions
  const scienceQuestions = [
    {
      title: 'States of Matter',
      text: 'Water boils at 100°C at sea level.',
      type: 'true_false',
      options: [
        { id: 'true', text: 'True', isCorrect: true },
        { id: 'false', text: 'False', isCorrect: false }
      ],
      topic: 'Physics',
      points: 5
    },
    {
      title: 'Chemical Elements',
      text: 'What is the chemical symbol for Gold?',
      type: 'multiple_choice',
      options: [
        { id: 'a', text: 'Go', isCorrect: false },
        { id: 'b', text: 'Au', isCorrect: true },
        { id: 'c', text: 'Gd', isCorrect: false },
        { id: 'd', text: 'Ag', isCorrect: false }
      ],
      topic: 'Chemistry',
      points: 5
    }
  ];

  // English Questions
  const englishQuestions = [
    {
      title: 'Grammar Basics',
      text: 'Fill in the blank: She _____ to the store yesterday.',
      type: 'fill_blank',
      blanks: [{
        position: 0,
        correctAnswers: ['went', 'walked', 'drove'],
        caseSensitive: false
      }],
      topic: 'Grammar',
      points: 5
    },
    {
      title: 'Essay Writing',
      text: 'Write a short paragraph (100-150 words) about the importance of education in modern society.',
      type: 'essay',
      answerGuidelines: {
        minWords: 100,
        maxWords: 150,
        keyPoints: ['personal development', 'career opportunities', 'social progress']
      },
      topic: 'Writing',
      points: 20
    }
  ];

  const questionTemplates = {
    Mathematics: mathQuestions,
    Science: scienceQuestions,
    English: englishQuestions
  };

  // Create 50 questions total
  let questionCount = await Question.countDocuments();
  const targetCount = 50;
  
  if (questionCount >= targetCount) {
    console.log(`  → Already have ${questionCount} questions`);
    return Question.find().limit(50);
  }

  for (const subject of subjects) {
    const category = categories[subject];
    const teacher = teachers.find(t => t.teaching.subjects.includes(subject));
    const templates = questionTemplates[subject];
    
    for (let i = 0; i < Math.ceil(targetCount / subjects.length); i++) {
      if (questions.length >= targetCount) break;
      
      const template = templates[i % templates.length];
      const difficulty = difficulties[i % difficulties.length];
      
      // Make title unique by adding index
      const uniqueTitle = `${template.title} - ${subject} ${i + 1}`;
      
      const questionData = {
        ...template,
        title: uniqueTitle,
        subject: category._id,
        difficulty,
        createdBy: teacher._id,
        status: 'published',
        tags: [subject.toLowerCase(), template.topic.toLowerCase(), difficulty],
        explanation: {
          text: `This is a ${difficulty} level question about ${template.topic}.`
        },
        metadata: {
          keywords: [subject, template.topic, difficulty]
        }
      };
      
      const question = await Question.create(questionData);
      questions.push(question);
      console.log(`  ✓ Created ${subject} question: ${question.title} (${difficulty})`);
    }
  }
  
  console.log(`  → Total questions created: ${questions.length}`);
  return questions;
};

// Seed Quizzes
const seedQuizzes = async (categories, teachers, questions) => {
  console.log('\n📝 Creating quizzes...');
  
  const quizzes = [];
  const quizTypes = ['practice', 'graded', 'exam'];
  const quizConfigs = [
    { title: 'Math Basics Quiz', subject: 'Mathematics', duration: 30, type: 'practice' },
    { title: 'Science Midterm Exam', subject: 'Science', duration: 60, type: 'exam' },
    { title: 'English Grammar Test', subject: 'English', duration: 45, type: 'graded' },
    { title: 'Quick Math Practice', subject: 'Mathematics', duration: 15, type: 'practice' },
    { title: 'Chemistry Fundamentals', subject: 'Science', duration: 40, type: 'graded' },
    { title: 'Essay Writing Assessment', subject: 'English', duration: 90, type: 'exam' },
    { title: 'Algebra Challenge', subject: 'Mathematics', duration: 20, type: 'practice' },
    { title: 'Physics Concepts', subject: 'Science', duration: 50, type: 'graded' },
    { title: 'Vocabulary Builder', subject: 'English', duration: 25, type: 'practice' },
    { title: 'Final Comprehensive Exam', subject: 'Mathematics', duration: 120, type: 'exam' }
  ];

  for (const config of quizConfigs) {
    const category = categories[config.subject];
    const teacher = teachers.find(t => t.teaching.subjects.includes(config.subject));
    const subjectQuestions = questions.filter(q => 
      q.subject.toString() === category._id.toString()
    );
    
    if (subjectQuestions.length === 0) continue;
    
    const quizQuestions = subjectQuestions
      .slice(0, faker.number.int({ min: 5, max: 10 }))
      .map((q, index) => ({
        question: q._id,
        order: index + 1,
        points: q.points || 10,
        required: true
      }));
    
    const startDate = faker.date.recent({ days: 7 });
    const endDate = faker.date.soon({ days: 30, refDate: startDate });
    
    const quiz = await Quiz.create({
      title: config.title,
      description: `A ${config.type} quiz covering ${config.subject} topics.`,
      category: category._id,
      type: config.type,
      questions: quizQuestions,
      timing: {
        duration: config.duration,
        showTimer: true,
        warningTime: 5
      },
      attempts: {
        maxAttempts: config.type === 'practice' ? 999 : 2,
        cooldownPeriod: config.type === 'exam' ? 24 : 0
      },
      questionSettings: {
        randomizeQuestions: config.type !== 'exam',
        randomizeOptions: true,
        allowNavigation: true,
        allowReview: config.type === 'practice'
      },
      scoring: {
        totalPoints: quizQuestions.reduce((sum, q) => sum + q.points, 0),
        passingScore: 70,
        negativeMarking: {
          enabled: config.type === 'exam',
          factor: 0.25
        }
      },
      availability: {
        startDate,
        endDate
      },
      status: 'active',
      createdBy: teacher._id
    });
    
    quizzes.push(quiz);
    console.log(`  ✓ Created quiz: ${quiz.title} (${config.type}, ${config.duration} min)`);
  }
  
  return quizzes;
};

// Seed Quiz Attempts
const seedQuizAttempts = async (students, quizzes) => {
  console.log('\n📊 Creating quiz attempts...');
  
  const attempts = [];
  
  // Each student attempts 2-5 random quizzes
  for (const student of students.slice(0, 10)) { // Use first 10 students
    const studentQuizzes = faker.helpers.arrayElements(quizzes, { min: 2, max: 5 });
    
    for (const quiz of studentQuizzes) {
      const populatedQuiz = await Quiz.findById(quiz._id).populate('questions.question');
      
      const attemptData = {
        quiz: quiz._id,
        user: student._id,
        attemptNumber: 1,
        status: 'completed',
        startedAt: faker.date.recent({ days: 5 }),
        timeSpent: faker.number.int({ min: 10, max: quiz.timing.duration }) * 60, // in seconds
        answers: []
      };
      
      // Generate answers for each question
      let correctCount = 0;
      for (const quizQuestion of populatedQuiz.questions) {
        const question = quizQuestion.question;
        const isCorrect = faker.datatype.boolean({ probability: 0.7 }); // 70% chance of correct answer
        
        if (isCorrect) correctCount++;
        
        const answer = {
          question: question._id,
          questionSnapshot: question.toObject(),
          isCorrect,
          pointsAwarded: isCorrect ? quizQuestion.points : 0,
          timeSpent: faker.number.int({ min: 30, max: 180 }), // 30s to 3min per question
          answeredAt: faker.date.recent({ days: 5 })
        };
        
        // Add specific answer based on question type
        switch (question.type) {
          case 'multiple_choice':
            answer.answer = isCorrect 
              ? question.options.find(o => o.isCorrect).id
              : faker.helpers.arrayElement(question.options.filter(o => !o.isCorrect)).id;
            break;
          case 'true_false':
            answer.answer = isCorrect 
              ? question.options.find(o => o.isCorrect).id
              : question.options.find(o => !o.isCorrect).id;
            break;
          case 'short_answer':
            answer.answer = isCorrect ? 'Correct answer' : 'Incorrect answer';
            break;
          case 'essay':
            answer.answer = faker.lorem.paragraphs(2);
            answer.partialScore = faker.number.int({ min: 50, max: 100 });
            break;
        }
        
        attemptData.answers.push(answer);
      }
      
      // Calculate score
      attemptData.submittedAt = new Date(attemptData.startedAt.getTime() + attemptData.timeSpent * 1000);
      attemptData.score = {
        raw: attemptData.answers.reduce((sum, a) => sum + a.pointsAwarded, 0),
        percentage: (correctCount / attemptData.answers.length) * 100,
        final: attemptData.answers.reduce((sum, a) => sum + a.pointsAwarded, 0)
      };
      
      attemptData.performance = {
        correctAnswers: correctCount,
        incorrectAnswers: attemptData.answers.length - correctCount,
        unanswered: 0,
        accuracy: (correctCount / attemptData.answers.length) * 100
      };
      
      attemptData.result = {
        passed: attemptData.score.percentage >= quiz.scoring.passingScore
      };
      
      const attempt = await QuizAttempt.create(attemptData);
      attempts.push(attempt);
      console.log(`  ✓ Created attempt: ${student.firstName} took "${quiz.title}" (Score: ${Math.round(attemptData.score.percentage)}%)`);
    }
  }
  
  return attempts;
};

// Seed Student Analytics
const seedStudentAnalytics = async (students, attempts) => {
  console.log('\n📈 Creating student analytics...');
  
  for (const student of students.slice(0, 10)) {
    const studentAttempts = attempts.filter(a => a.user.toString() === student._id.toString());
    
    if (studentAttempts.length === 0) continue;
    
    const analytics = {
      student: student._id,
      overallMetrics: {
        totalQuizzesTaken: studentAttempts.length,
        totalQuestionsAnswered: studentAttempts.reduce((sum, a) => sum + a.answers.length, 0),
        totalCorrectAnswers: studentAttempts.reduce((sum, a) => sum + a.performance.correctAnswers, 0),
        totalTimeSpent: studentAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / 60, // in minutes
        averageScore: studentAttempts.reduce((sum, a) => sum + a.score.percentage, 0) / studentAttempts.length,
        lastActivityDate: new Date()
      },
      learningProgress: {
        currentLevel: faker.number.int({ min: 1, max: 5 }),
        experiencePoints: faker.number.int({ min: 100, max: 5000 })
      },
      behaviorPatterns: {
        studyFrequency: faker.helpers.arrayElement(['daily', 'regular', 'occasional']),
        averageQuestionsPerSession: faker.number.int({ min: 10, max: 30 })
      }
    };
    
    await StudentAnalytics.create(analytics);
    console.log(`  ✓ Created analytics for: ${student.firstName} ${student.lastName}`);
  }
};

// Seed Courses
const seedCourses = async (categories, teachers) => {
  console.log('\n📚 Creating courses...');
  
  const courses = [];
  const courseTemplates = [
    {
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      level: 'beginner',
      duration: 20,
      price: 0
    },
    {
      title: 'Advanced Calculus',
      subject: 'Mathematics',
      level: 'advanced',
      duration: 40,
      price: 99.99
    },
    {
      title: 'General Chemistry',
      subject: 'Science',
      level: 'intermediate',
      duration: 30,
      price: 79.99
    },
    {
      title: 'English Grammar Mastery',
      subject: 'English',
      level: 'all_levels',
      duration: 25,
      price: 59.99
    },
    {
      title: 'Physics for Beginners',
      subject: 'Science',
      level: 'beginner',
      duration: 15,
      price: 0
    }
  ];
  
  for (const template of courseTemplates) {
    const category = categories[template.subject];
    const teacher = teachers.find(t => t.teaching.subjects.includes(template.subject));
    
    const course = await Course.create({
      title: template.title,
      description: faker.lorem.paragraph(),
      category: category._id,
      level: template.level,
      instructor: teacher._id,
      modules: [
        {
          title: 'Introduction',
          description: 'Getting started with the course',
          order: 1,
          lessons: [
            {
              title: 'Welcome to the Course',
              type: 'video',
              order: 1,
              isFree: true,
              isPublished: true,
              estimatedDuration: 10
            },
            {
              title: 'Course Overview',
              type: 'text',
              order: 2,
              isFree: true,
              isPublished: true,
              estimatedDuration: 5
            }
          ],
          isPublished: true
        }
      ],
      metadata: {
        duration: template.duration,
        language: 'en',
        skillLevel: template.level === 'all_levels' ? 'beginner' : template.level,
        objectives: ['Understand core concepts', 'Apply knowledge practically', 'Prepare for advanced topics']
      },
      pricing: {
        type: template.price === 0 ? 'free' : 'one_time',
        amount: template.price,
        currency: 'USD'
      },
      status: 'published',
      publishedAt: faker.date.recent({ days: 30 }),
      statistics: {
        totalEnrollments: faker.number.int({ min: 50, max: 500 }),
        averageRating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 })
      }
    });
    
    courses.push(course);
    console.log(`  ✓ Created course: ${course.title} by ${teacher.firstName} ${teacher.lastName}`);
  }
  
  return courses;
};

// Seed Subscriptions
const seedSubscriptions = async (users) => {
  console.log('\n💳 Creating subscriptions...');
  
  const plans = [
    { id: 'free', name: 'Free Plan', price: 0 },
    { id: 'basic', name: 'Basic Plan', price: 9.99 },
    { id: 'premium', name: 'Premium Plan', price: 29.99 }
  ];
  
  // Assign subscriptions to some users
  const subscribedUsers = faker.helpers.arrayElements(users, { min: 10, max: 15 });
  
  for (const user of subscribedUsers) {
    const plan = faker.helpers.arrayElement(plans);
    
    const subscription = await Subscription.create({
      user: user._id,
      plan: {
        id: plan.id,
        name: plan.name,
        interval: plan.id === 'free' ? 'monthly' : faker.helpers.arrayElement(['monthly', 'yearly']),
        price: {
          amount: plan.price,
          currency: 'USD'
        }
      },
      stripe: {
        customerId: `cus_${faker.string.alphanumeric(14)}`,
        subscriptionId: plan.id !== 'free' ? `sub_${faker.string.alphanumeric(14)}` : null
      },
      status: {
        current: plan.id === 'free' ? 'active' : faker.helpers.arrayElement(['active', 'trialing']),
        statusChangedAt: faker.date.recent({ days: 30 })
      },
      billing: {
        currentPeriodStart: faker.date.recent({ days: 30 }),
        currentPeriodEnd: faker.date.soon({ days: 30 })
      },
      features: {
        courses: {
          maxCourses: plan.id === 'free' ? 3 : plan.id === 'basic' ? 10 : -1
        },
        quizzes: {
          maxQuizzesPerCourse: plan.id === 'free' ? 5 : plan.id === 'basic' ? 20 : -1
        },
        analytics: {
          basicAnalytics: true,
          advancedAnalytics: plan.id === 'premium'
        }
      }
    });
    
    console.log(`  ✓ Created ${plan.name} subscription for: ${user.firstName} ${user.lastName}`);
  }
};

// Main seeding function
const seedDatabase = async () => {
  const args = process.argv.slice(2);
  const forceReset = args.includes('--reset') || args.includes('-r');
  
  console.log('🌱 Starting database seeding...\n');
  
  try {
    await connectDB();
    
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 25 && !forceReset) {
      console.log('⚠️  Database already contains data. Skipping seed to prevent duplicates.');
      console.log(`   Current counts:`);
      console.log(`   - Users: ${userCount}`);
      console.log(`   - Questions: ${await Question.countDocuments()}`);
      console.log(`   - Quizzes: ${await Quiz.countDocuments()}`);
      console.log(`   - Quiz Attempts: ${await QuizAttempt.countDocuments()}`);
      console.log(`   - Courses: ${await Course.countDocuments()}`);
      console.log('\n   To reset and reseed, run: npm run seed -- --reset');
      process.exit(0);
    }
    
    if (forceReset) {
      console.log('🗑️  Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Question.deleteMany({}),
        Quiz.deleteMany({}),
        QuizAttempt.deleteMany({}),
        Course.deleteMany({}),
        StudentAnalytics.deleteMany({}),
        Subscription.deleteMany({})
      ]);
      console.log('✅ Database cleared\n');
    }
    
    // Seed data in order
    const categories = await seedCategories();
    const teachers = await seedTeachers();
    const students = await seedStudents();
    const allUsers = [...teachers, ...students];
    
    const questions = await seedQuestions(categories, teachers);
    const quizzes = await seedQuizzes(categories, teachers, questions);
    const attempts = await seedQuizAttempts(students, quizzes);
    
    await seedStudentAnalytics(students, attempts);
    await seedCourses(categories, teachers);
    await seedSubscriptions(allUsers);
    
    // Summary
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${Object.keys(categories).length}`);
    console.log(`   - Teachers: ${teachers.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - Quizzes: ${quizzes.length}`);
    console.log(`   - Quiz Attempts: ${attempts.length}`);
    console.log(`   - Courses: ${await Course.countDocuments()}`);
    console.log(`   - Subscriptions: ${await Subscription.countDocuments()}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   All passwords: TestPass123!');
    console.log('\n   Sample Teacher Accounts:');
    teachers.slice(0, 3).forEach(t => {
      console.log(`   - ${t.email} (${t.teaching.subjects.join(', ')})`);
    });
    console.log('\n   Sample Student Accounts:');
    students.slice(0, 3).forEach(s => {
      console.log(`   - ${s.email}`);
    });
    
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
seedDatabase();