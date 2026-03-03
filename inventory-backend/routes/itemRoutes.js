import express from 'express';
import { protect } from '../middleware/auth.js';
import { forceCheckAlerts } from '../controllers/itemController.js';
import { restrictTo } from '../middleware/auth.js';
import { validate, createItemValidation, updateItemValidation } from '../middleware/validation.js';
import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,      // Make sure this is imported
  getLowStockItems,
  updateStock
} from '../controllers/itemController.js';

const router = express.Router();

// All item routes are protected
router.use(protect);

// Special routes (no :id parameter)
router.get('/low-stock', getLowStockItems);
router.get('/', getAllItems);
router.post('/', validate(createItemValidation), createItem);

// Routes with :id parameter
router.get('/:id', getItem);
router.patch('/:id', validate(updateItemValidation), updateItem);
router.delete('/:id', deleteItem);  // This should now work

// Admin only route to manually check alerts
router.post('/check-alerts', restrictTo('admin'), forceCheckAlerts);

// Stock update route
router.patch('/:id/stock', updateStock);

export default router;