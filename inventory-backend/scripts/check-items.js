// scripts/check-items.js
import mongoose from 'mongoose';
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const checkItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
    
    console.log('📦 Checking items in database...');
    console.log('===============================');
    
    // Count total items
    const totalItems = await Item.countDocuments();
    console.log(`Total items: ${totalItems}`);
    
    if (totalItems === 0) {
      console.log('\n❌ No items found in database!');
      console.log('\n💡 You need to create some items first:');
      console.log('1. Go to the Items page in the UI');
      console.log('2. Click "Add New Item" button');
      console.log('3. Fill in the form and submit');
      console.log('\nOr run: node scripts/create-sample-items.js');
      
      // Check if categories exist
      const categories = await Category.countDocuments();
      console.log(`\n📋 Categories found: ${categories}`);
      
      if (categories === 0) {
        console.log('❌ No categories found either!');
        console.log('💡 Create a category first using the Categories page');
      }
      
      process.exit(0);
    }
    
    // Get all items with their details
    const items = await Item.find()
      .populate('category', 'name')
      .lean();
    
    console.log('\n✅ Items found:\n');
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   ID: ${item._id}`);
      console.log(`   SKU: ${item.sku || 'N/A'}`);
      console.log(`   Category: ${item.category?.name || 'Uncategorized'}`);
      console.log(`   Quantity: ${item.quantity}`);
      console.log(`   Price: $${item.price}`);
      console.log('   --------------------');
    });
    
    console.log('\n📝 Valid item URLs:');
    items.forEach(item => {
      console.log(`   http://localhost:5000/api/items/${item._id}`);
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkItems();