import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  },
  department: {
    type: String,
    enum: ['Inventory Management', 'Warehouse', 'Procurement', 'Logistics', 'Management','Admin', ''],
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // ==================== NOTIFICATION SETTINGS ====================
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  lowStockAlerts: {
    type: Boolean,
    default: true
  },
  priceChangeAlerts: {
    type: Boolean,
    default: false
  },
  weeklyReports: {
    type: Boolean,
    default: true
  },
  
  // ==================== PRIVACY SETTINGS ====================
  showEmail: {
    type: Boolean,
    default: false
  },
  activityTracking: {
    type: Boolean,
    default: true
  },
  dataSharing: {
    type: Boolean,
    default: false
  },
  
  // ==================== ACCOUNT SETTINGS ====================
  twoFactorAuth: {
    type: Boolean,
    default: false
  },
  autoLogout: {
    type: Number,
    default: 30,
    min: [5, 'Auto-logout must be at least 5 minutes'],
    max: [240, 'Auto-logout cannot exceed 240 minutes']
  },
  sessionLimit: {
    type: Number,
    default: 3,
    min: [1, 'Session limit must be at least 1'],
    max: [10, 'Session limit cannot exceed 10']
  },
  
  // ==================== GENERAL SETTINGS ====================
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'zh'],
    default: 'en'
  },
  timezone: {
    type: String,
    enum: [
      'America/New_York', 
      'America/Chicago', 
      'America/Denver', 
      'America/Los_Angeles',
      'Europe/London', 
      'Europe/Paris', 
      'Asia/Tokyo'
    ],
    default: 'America/New_York'
  },
  dateFormat: {
    type: String,
    enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    default: 'MM/DD/YYYY'
  },
  
  // ==================== THEME SETTINGS ====================
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  
  // ==================== OTHER FIELDS ====================
  lastLogin: {
    type: Date
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update passwordChangedAt when password is changed
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      name: this.name,
      userName: this.userName,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Check if password was changed after token issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to get public profile (remove sensitive info)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.__v;
  return userObject;
};

// Method to get settings only
userSchema.methods.getSettings = function() {
  return {
    // Notification Settings
    emailNotifications: this.emailNotifications,
    pushNotifications: this.pushNotifications,
    lowStockAlerts: this.lowStockAlerts,
    priceChangeAlerts: this.priceChangeAlerts,
    weeklyReports: this.weeklyReports,
    
    // Privacy Settings
    showEmail: this.showEmail,
    activityTracking: this.activityTracking,
    dataSharing: this.dataSharing,
    
    // Account Settings
    twoFactorAuth: this.twoFactorAuth,
    autoLogout: this.autoLogout,
    sessionLimit: this.sessionLimit,
    
    // General Settings
    language: this.language,
    timezone: this.timezone,
    dateFormat: this.dateFormat,
    
    // Theme Settings
    theme: this.theme
  };
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userName: 1 });
userSchema.index({ role: 1 });
userSchema.index({ active: 1 });

const User = mongoose.model('User', userSchema);

export default User;