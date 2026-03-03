// routes/alertRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAlerts,
  getAlert,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  deleteAllAlerts,
  getAlertStats
} from '../controllers/alertController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAlerts)
  .post(createAlert)
  .delete(deleteAllAlerts);

router.get('/stats', getAlertStats);
router.post('/mark-all-read', markAllAsRead);

router.route('/:id')
  .get(getAlert)
  .patch(markAsRead)
  .delete(deleteAlert);

export default router;