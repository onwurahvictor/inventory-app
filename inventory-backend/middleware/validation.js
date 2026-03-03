// middleware/validation.js
import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// Create item validation
export const createItemValidation = [
  body('name')
    .notEmpty().withMessage('Item name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID format'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
    .toInt(),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    .toFloat(),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('sku')
    .optional()
    .isString().withMessage('SKU must be a string')
    .trim()
    .isLength({ max: 50 }).withMessage('SKU cannot exceed 50 characters'),
  
  body('location')
    .optional()
    .isString().withMessage('Location must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  
  body('minimumStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer')
    .toInt()
    .default(5),
  
  body('reorderPoint')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder point must be a non-negative integer')
    .toInt()
    .default(10),
  
  body('unitOfMeasure')
    .optional()
    .isString().withMessage('Unit of measure must be a string')
    .trim()
    .isIn(['pieces', 'boxes', 'kg', 'lbs', 'liters', 'gallons', 'meters', 'feet'])
    .withMessage('Invalid unit of measure')
    .default('pieces')
];

// Update item validation
export const updateItemValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID format'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
    .toInt(),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    .toFloat(),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('sku')
    .optional()
    .isString().withMessage('SKU must be a string')
    .trim()
    .isLength({ max: 50 }).withMessage('SKU cannot exceed 50 characters'),
  
  body('location')
    .optional()
    .isString().withMessage('Location must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  
  body('minimumStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer')
    .toInt(),
  
  body('reorderPoint')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder point must be a non-negative integer')
    .toInt(),
  
  body('unitOfMeasure')
    .optional()
    .isString().withMessage('Unit of measure must be a string')
    .trim()
    .isIn(['pieces', 'boxes', 'kg', 'lbs', 'liters', 'gallons', 'meters', 'feet'])
    .withMessage('Invalid unit of measure')
];

// Login validation
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Register validation
export const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('userName')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Update profile validation
export const updateProfileValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('userName')
    .optional()
    .isString().withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .trim(),
  body('location')
    .optional()
    .isString().withMessage('Location must be a string')
    .trim(),
  body('bio')
    .optional()
    .isString().withMessage('Bio must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters')
];

// Update settings validation
export const updateSettingsValidation = [
  body('emailNotifications').optional().isBoolean().withMessage('Email notifications must be a boolean'),
  body('pushNotifications').optional().isBoolean().withMessage('Push notifications must be a boolean'),
  body('lowStockAlerts').optional().isBoolean().withMessage('Low stock alerts must be a boolean'),
  body('priceChangeAlerts').optional().isBoolean().withMessage('Price change alerts must be a boolean'),
  body('weeklyReports').optional().isBoolean().withMessage('Weekly reports must be a boolean'),
  body('twoFactorAuth').optional().isBoolean().withMessage('Two factor auth must be a boolean'),
  body('autoLogout').optional().isInt({ min: 5, max: 240 }).withMessage('Auto logout must be between 5 and 240 minutes'),
  body('sessionLimit').optional().isInt({ min: 1, max: 10 }).withMessage('Session limit must be between 1 and 10'),
  body('language').optional().isIn(['en', 'es', 'fr', 'de', 'zh']).withMessage('Invalid language'),
  body('timezone').optional().isString().withMessage('Timezone must be a string'),
  body('dateFormat').optional().isIn(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).withMessage('Invalid date format'),
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme')
];

// Change password validation
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];