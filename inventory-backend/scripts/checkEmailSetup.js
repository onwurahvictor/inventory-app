import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const checkEmailSetup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📧 Email Config:');
    console.log(`  EMAIL_ENABLED: ${process.env.EMAIL_ENABLED}`);
    console.log(`  EMAIL_HOST: ${process.env.EMAIL_HOST}`);
    console.log(`  EMAIL_PORT: ${process.env.EMAIL_PORT}`);
    console.log(`  EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`  EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'}`);

    console.log('\n👥 All admin/manager users:');
    const allAdmins = await User.find({ role: { $in: ['admin', 'manager'] } })
      .select('name email role lowStockAlerts');
    
    if (allAdmins.length === 0) {
      console.log('  ❌ No admin or manager users found!');
    } else {
      allAdmins.forEach(u => {
        console.log(`  - ${u.name} (${u.email})`);
        console.log(`    role: ${u.role}`);
        console.log(`    lowStockAlerts: ${u.lowStockAlerts} ${!u.lowStockAlerts ? '⚠️ THIS IS WHY EMAILS ARE NOT SENT!' : '✅'}`);
      });
    }

    console.log('\n👥 Users that WILL receive alerts (lowStockAlerts: true):');
    const eligibleAdmins = await User.find({ 
      role: { $in: ['admin', 'manager'] },
      lowStockAlerts: true 
    }).select('name email role');

    if (eligibleAdmins.length === 0) {
      console.log('  ❌ None! Fix: set lowStockAlerts=true on your admin user in MongoDB.');
    } else {
      eligibleAdmins.forEach(u => console.log(`  ✅ ${u.name} (${u.email})`));
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkEmailSetup();