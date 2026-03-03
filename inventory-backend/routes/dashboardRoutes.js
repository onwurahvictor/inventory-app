// routes/dashboardRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getDashboardStats,
  getRecentActivity,
  getLowStockItems,
  getCategoryDistribution,
  getMonthlyTrends,
  getAlertsSummary
} from '../controllers/dashboardController.js';

const router = express.Router();

// Protect all dashboard routes
router.use(protect);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/low-stock', getLowStockItems);
router.get('/category-distribution', getCategoryDistribution);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/alerts-summary', getAlertsSummary);

// Admin only routes
router.get('/admin/stats', restrictTo('admin'), getDashboardStats);

export default router;