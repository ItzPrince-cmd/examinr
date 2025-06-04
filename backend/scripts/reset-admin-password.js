const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/examinr');
    console.log('Connected to MongoDB');
    
    const admin = await User.findOne({ email: 'admin@examinr.com' });
    
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }
    
    console.log('Admin user found');
    
    // Set the new password - the User model will hash it automatically
    admin.password = 'TestPass123!';
    await admin.save();
    
    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: admin@examinr.com');
    console.log('🔑 Password: TestPass123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAdminPassword();