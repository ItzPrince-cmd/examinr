require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    
    // Test creating a collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Successfully wrote to database!');
    
    // Clean up
    await testCollection.deleteOne({ test: true });
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();