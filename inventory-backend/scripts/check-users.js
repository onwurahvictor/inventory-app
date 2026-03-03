// scripts/check-users.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
    
    console.log('📊 Users in database:');
    console.log('=====================');
    
    const users = await User.find().select('name userName email role');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Name: ${user.name || 'MISSING'}`);
        console.log(`   Username: ${user.userName || 'MISSING'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Check complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkUsers();