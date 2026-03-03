// models/Item.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  location: {
    type: String,
    default: ''
  },
  minimumStock: {
    type: Number,
    default: 5,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total value
itemSchema.virtual('totalValue').get(function() {
  return this.quantity * this.price;
});

// Index for search
itemSchema.index({ name: 'text', description: 'text', sku: 'text' });

// ✅ Middleware must come AFTER schema definition
itemSchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    console.log(`⚠️ Quantity changed on "${this.name}": ${this._original?.quantity} → ${this.quantity}`);
    console.trace();
  }
  next();
});

itemSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update?.quantity !== undefined || update?.$set?.quantity !== undefined) {
    console.log(`⚠️ findOneAndUpdate changing quantity:`, JSON.stringify(update));
    console.trace();
  }
  next();
});

const Item = mongoose.model('Item', itemSchema);
export default Item;