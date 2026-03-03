// scripts/create-user.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
    
    console.log('👤 Creating test user...');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'john@example.com' });
    
    if (existingUser) {
      console.log('❌ User already exists');
      console.log('Email: john@example.com');
      console.log('Name:', existingUser.name);
      console.log('Username:', existingUser.userName);
    } else {
      // Create new user
      const user = await User.create({
        name: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        emailNotifications: true,
        pushNotifications: true,
        lowStockAlerts: true,
        priceChangeAlerts: false,
        weeklyReports: true,
        showEmail: false,
        activityTracking: true,
        dataSharing: false,
        twoFactorAuth: false,
        autoLogout: 30,
        sessionLimit: 3,
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light'
      });
      
      console.log('✅ User created successfully:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Username: ${user.userName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123`);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

createUser();