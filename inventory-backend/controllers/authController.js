import User from '../models/User.js';
import emailService from '../services/emailService.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    const user = await User.create({ name, userName, email, password });

    emailService.sendWelcomeEmail(user).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          role: user.role,
          token: user.generateAuthToken()
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          userName: user.userName,
          email: user.email,
          role: user.role,
          token: user.generateAuthToken()
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// @desc    Get user settings
// @route   GET /api/auth/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: { settings: user.getSettings() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get settings' });
  }
};

// @desc    Update user settings
// @route   PATCH /api/auth/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const allowedSettings = [
      'emailNotifications', 'pushNotifications', 'lowStockAlerts',
      'priceChangeAlerts', 'weeklyReports', 'showEmail', 'activityTracking',
      'dataSharing', 'twoFactorAuth', 'autoLogout', 'sessionLimit',
      'language', 'timezone', 'dateFormat', 'theme'
    ];

    const updates = {};
    allowedSettings.forEach(setting => {
      if (req.body[setting] !== undefined) {
        updates[setting] = req.body[setting];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: { settings: user.getSettings() } });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// @desc    Update user profile
// @route   PATCH /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio, userName, department } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (userName) updates.userName = userName;
    if (department !== undefined) updates.department = department;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Change password
// @route   PATCH /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully', token: user.generateAuthToken() });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });

    await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful', token: user.generateAuthToken() });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

// @desc    Get user activity
// @route   GET /api/auth/activity
// @access  Private
export const getUserActivity = async (req, res) => {
  try {
    const Activity = (await import('../models/Activity.js')).default;
    const activities = await Activity.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, data: { activity: activities } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get activity' });
  }
};

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

// @desc    Get single user (admin)
// @route   GET /api/auth/users/:id
// @access  Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// @desc    Upload avatar
// @route   POST /api/auth/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    res.json({ success: true, message: 'Avatar upload endpoint ready' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
};