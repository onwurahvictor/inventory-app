import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required']
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
  description: {
    type: String,
    required: [true, 'Alert description is required']
  },
  type: {
    type: String,
    enum: ['critical', 'warning', 'info', 'success'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  itemName: String,
  category: {
    type: String,
    ref: 'Category'
  },
  categoryName: String,
  currentStock: Number,
  minimumStock: Number,
  oldPrice: Number,
  newPrice: Number,
  quantity: Number,
  expirationDate: Date,
  read: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
alertSchema.index({ type: 1, read: 1, resolved: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ item: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;