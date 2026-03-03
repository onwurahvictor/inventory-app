// routes/authRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getMe,
  getSettings,
  updateSettings,
  updateProfile,
  changePassword,
  getUserActivity,
  deleteAccount,
  getAllUsers,
  getUser,
  uploadAvatar
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.use(protect);

// User routes
router.get('/me', getMe);
router.get('/settings', getSettings);
router.get('/activity', getUserActivity);
router.post('/logout', logout);
router.patch('/profile', updateProfile);
router.patch('/settings', updateSettings);
router.patch('/change-password', changePassword);
router.post('/avatar', uploadAvatar);
router.delete('/account', deleteAccount);

// Admin only routes
router.get('/users', restrictTo('admin'), getAllUsers);
router.get('/users/:id', restrictTo('admin'), getUser);

export default router;