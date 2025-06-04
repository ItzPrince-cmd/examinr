const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr');
    console.log('Connected to MongoDB');
    
    const admin = await User.findOne({ email: 'admin@examinr.com' }).select('+password');
    
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found');
    console.log('Email:', admin.email);
    console.log('Password hash:', admin.password);
    
    // Test password comparison
    const testPassword = 'TestPass123!';
    console.log('\nTesting password:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('Direct bcrypt comparison:', isMatch);
    
    const isMatchMethod = await admin.comparePassword(testPassword);
    console.log('Using comparePassword method:', isMatchMethod);
    
    // Let's also create a new hash and compare
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('\nNew hash for TestPass123!:', newHash);
    const newMatch = await bcrypt.compare(testPassword, newHash);
    console.log('New hash comparison:', newMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyAdminPassword();