import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../models/Item.js';
import '../models/Category.js';

dotenv.config();

const checkLowStockItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all items
    const allItems = await Item.find().populate('category', 'name');
    console.log(`\n📦 Total items: ${allItems.length}`);

    // Check each item's minimumStock
    console.log('\n📊 Item Stock Status:');
    console.log('=====================');
    
    allItems.forEach(item => {
      console.log(`\nItem: ${item.name}`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  minimumStock: ${item.minimumStock ?? 'NOT SET!'}`);
      console.log(`  Is low stock: ${item.quantity < (item.minimumStock ?? 0) ? '⚠️ YES' : '✅ No'}`);
    });

    // Find low stock items using correct field name
    const lowStockItems = await Item.find({
      $expr: { $lt: ['$quantity', '$minimumStock'] }
    }).populate('category', 'name');

    console.log('\n🔍 Low Stock Items Found:', lowStockItems.length);
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(item => {
        console.log(`  ⚠️ ${item.name}: ${item.quantity} < ${item.minimumStock}`);
      });
    } else {
      console.log('  No items are below threshold');
    }

    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkLowStockItems();