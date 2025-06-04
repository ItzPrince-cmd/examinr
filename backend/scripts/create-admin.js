const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr');
    console.log('Connected to MongoDB');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@examinr.com' });
    
    if (!adminExists) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@examinr.com',
        password: 'TestPass123!',  // User model will hash this automatically
        role: 'admin',
        accountStatus: {
          isActive: true,
          isEmailVerified: true,
          isProfileComplete: true
        }
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@examinr.com');
      console.log('🔑 Password: TestPass123!');
    } else {
      console.log('ℹ️  Admin user already exists!');
      console.log('📧 Email: admin@examinr.com');
      console.log('🔑 Password: TestPass123!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();