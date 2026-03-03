// models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    default: 'Unknown User'
  },
  type: {
    type: String,
    enum: {
      values: ['create', 'update', 'delete', 'login', 'logout', 'alert'],
      message: '{VALUE} is not a valid activity type'
    },
    required: [true, 'Activity type is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  ip: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  userAgent: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ userName: 1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;