const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
let mongoUri = 'mongodb://localhost:27017/rccg_schedule';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    mongoUri = match[1].trim();
  }
}

console.log('\n🔍 Checking MongoDB connection...\n');

async function checkConnection() {
  try {
    // Try to connect with timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    const state = mongoose.connection.readyState;
    
    if (state === 1) {
      console.log('✅ MongoDB connected successfully!');
      console.log(`📍 Database: ${mongoose.connection.db?.databaseName || 'connected'}`);
      console.log(`🔗 URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
      await mongoose.disconnect();
      process.exit(0);
    } else {
      console.log('❌ MongoDB connection failed');
      console.log(`📊 Connection state: ${state}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error(`   ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('\n💡 Tips:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your connection string in .env.local');
    console.log('   3. Verify network connectivity');
    console.log(`   4. Current URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    process.exit(1);
  }
}

checkConnection();