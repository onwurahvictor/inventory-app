// controllers/alertController.js
import Alert from '../models/Alert.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// Helper query - gets alerts for current user OR system-generated alerts
const alertQuery = (userId) => ({
  $or: [
    { user: userId },
    { user: { $exists: false } },
    { user: null }
  ]
});

export const getAlerts = catchAsync(async (req, res, next) => {
  const alerts = await Alert.find(alertQuery(req.user.id))
    .populate('itemId', 'name sku')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: { alerts }
  });
});

export const getAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.findOne({
    _id: req.params.id,
    ...alertQuery(req.user.id)
  });

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { alert }
  });
});

export const createAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: { alert }
  });
});

export const markAsRead = catchAsync(async (req, res, next) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, ...alertQuery(req.user.id) },
    { read: true },
    { new: true }
  );

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { alert }
  });
});

export const markAllAsRead = catchAsync(async (req, res, next) => {
  await Alert.updateMany(
    alertQuery(req.user.id),
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'All alerts marked as read'
  });
});

export const deleteAlert = catchAsync(async (req, res, next) => {
  const alert = await Alert.findOneAndDelete({
    _id: req.params.id,
    ...alertQuery(req.user.id)
  });

  if (!alert) {
    return next(new AppError('Alert not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Alert deleted successfully'
  });
});

export const deleteAllAlerts = catchAsync(async (req, res, next) => {
  await Alert.deleteMany(alertQuery(req.user.id));

  res.status(200).json({
    success: true,
    message: 'All alerts deleted'
  });
});

export const getAlertStats = catchAsync(async (req, res, next) => {
  const query = alertQuery(req.user.id);

  const total = await Alert.countDocuments(query);
  const unread = await Alert.countDocuments({ ...query, read: false });
  const critical = await Alert.countDocuments({ ...query, type: 'critical', read: false });

  res.status(200).json({
    success: true,
    data: {
      stats: { total, unread, critical }
    }
  });
});