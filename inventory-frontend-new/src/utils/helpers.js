/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Calculate time ago from date
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }

  return seconds <= 10 ? 'just now' : `${seconds} seconds ago`;
};

/**
 * Generate random SKU
 */
export const generateSKU = (prefix = 'ITEM') => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${randomNum}-${timestamp}`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate inventory value
 */
export const calculateInventoryValue = (items = []) => {
  return items.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
};

/**
 * Get status based on quantity
 */
export const getStockStatus = (quantity, minimumStock = 5) => {
  if (quantity === 0) {
    return { status: 'out-of-stock', label: 'Out of Stock', color: '#ef4444' };
  }

  if (quantity <= minimumStock) {
    return { status: 'low-stock', label: 'Low Stock', color: '#f59e0b' };
  }

  return { status: 'in-stock', label: 'In Stock', color: '#10b981' };
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Sanitize input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Generate pagination metadata
 */
export const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * Send response with pagination
 */
export const sendPaginatedResponse = (res, data, pagination) => {
  res.json({
    success: true,
    ...pagination,
    data,
  });
};
