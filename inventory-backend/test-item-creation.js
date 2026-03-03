// test-item-creation.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const testItemCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
    console.log('✅ Connected to MongoDB');

    // Get a user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      process.exit(1);
    }
    console.log('✅ Found user:', user.email);

    // Get a category
    const category = await Category.findOne();
    if (!category) {
      console.log('❌ No category found. Please create a category first.');
      process.exit(1);
    }
    console.log('✅ Found category:', category.name);

    // Test item creation
    const testItem = {
      name: 'Test Item ' + Date.now(),
      description: 'This is a test item',
      category: category._id,
      quantity: 10,
      price: 99.99,
      sku: 'TEST-' + Date.now().toString().slice(-6),
      location: 'Test Location',
      minimumStock: 5,
      createdBy: user._id
    };

    console.log('\n📝 Creating test item with data:', testItem);

    const item = await Item.create(testItem);
    console.log('✅ Item created successfully!');
    console.log('Item details:', {
      id: item._id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price
    });

    await mongoose.disconnect();
    console.log('\n✅ Test complete');

  } catch (error) {
    console.error('❌ Error:', error);
    if (error.name === 'ValidationError') {
      console.log('Validation errors:');
      Object.keys(error.errors).forEach(field => {
        console.log(`- ${field}: ${error.errors[field].message}`);
      });
    }
  }
};

testItemCreation();