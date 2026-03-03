// utils/activityLogger.js
import Activity from '../models/Activity.js';

export const logActivity = async (userId, userName, type, action, description, req) => {
  try {
    // Ensure we have a valid userName
    const safeUserName = userName || 'Unknown User';
    
    console.log('Logging activity:', {
      userId,
      userName: safeUserName,
      type,
      action
    });

    await Activity.create({
      user: userId,
      userName: safeUserName,
      type: type,
      action: action,
      description: description || '',
      ip: req?.ip || req?.connection?.remoteAddress || 'Unknown',
      userAgent: req?.get('user-agent') || 'Unknown'
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - just log the error so it doesn't break the main flow
  }
};