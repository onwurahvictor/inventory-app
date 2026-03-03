// scripts/fix-users.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
    
    console.log('🔧 Fixing users...');
    
    // Find all users missing name or userName
    const users = await User.find({
      $or: [
        { name: { $in: [null, ''] } },
        { userName: { $in: [null, ''] } }
      ]
    });

    console.log(`Found ${users.length} users that need fixing`);

    for (const user of users) {
      console.log(`\nFixing user: ${user.email}`);
      
      // Set name if missing
      if (!user.name) {
        if (user.userName) {
          user.name = user.userName;
        } else {
          user.name = user.email.split('@')[0];
        }
        console.log(`  - Set name to: ${user.name}`);
      }
      
      // Set userName if missing
      if (!user.userName) {
        if (user.name) {
          user.userName = user.name.toLowerCase().replace(/\s+/g, '');
        } else {
          user.userName = user.email.split('@')[0];
        }
        console.log(`  - Set userName to: ${user.userName}`);
      }
      
      await user.save();
      console.log('  ✅ User fixed');
    }

    // Create a test admin user if no users exist
    if (users.length === 0) {
      const adminCount = await User.countDocuments();
      if (adminCount === 0) {
        console.log('\n👤 Creating default admin user...');
        
        const adminUser = await User.create({
          name: 'Admin User',
          userName: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
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
        
        console.log(`✅ Admin user created:`);
        console.log(`   Email: admin@example.com`);
        console.log(`   Password: admin123`);
        console.log(`   Name: ${adminUser.name}`);
        console.log(`   Username: ${adminUser.userName}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Fix complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

fixUsers();