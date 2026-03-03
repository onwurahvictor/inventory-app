// controllers/dashboardController.js
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import Alert from '../models/Alert.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = catchAsync(async (req, res, next) => {
  console.log('📊 Fetching dashboard stats for user:', req.user.id);

  // Get total items count
  const totalItems = await Item.countDocuments();
  
  // Get total value of inventory
  const items = await Item.find();
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Get low stock count (items where quantity <= minimumStock)
  const lowStockItems = await Item.find({
    $expr: { $lte: ["$quantity", "$minimumStock"] }
  });
  const lowStockCount = lowStockItems.length;
  
  // Get out of stock count
  const outOfStockCount = await Item.countDocuments({ quantity: 0 });
  
  // Get categories count
  const categoriesCount = await Category.countDocuments();
  
  // Get active alerts count (unread alerts)
  const activeAlerts = await Alert.countDocuments({ read: false });
  
  // Get recent activities count (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivities = await Activity.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  // Get top 5 categories by item count
  const topCategories = await Item.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } }
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $unwind: {
        path: "$categoryInfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        name: "$categoryInfo.name",
        color: "$categoryInfo.color",
        icon: "$categoryInfo.icon",
        count: 1,
        totalValue: 1
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalItems,
        totalValue,
        lowStockCount,
        outOfStockCount,
        categoriesCount,
        activeAlerts,
        recentActivities
      },
      topCategories
    }
  });
});

// @desc    Get recent activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
export const getRecentActivity = catchAsync(async (req, res, next) => {
  console.log('📝 Fetching recent activity for user:', req.user.id);

  const activities = await Activity.find()
    .populate('user', 'name email avatar')
    .sort('-createdAt')
    .limit(10)
    .lean();

  // Format activities for display
  const formattedActivities = activities.map(activity => ({
    _id: activity._id,
    type: activity.type,
    action: activity.action,
    description: activity.description,
    user: activity.user ? {
      name: activity.user.name,
      email: activity.user.email,
      avatar: activity.user.avatar
    } : { name: activity.userName || 'System' },
    createdAt: activity.createdAt,
    timeAgo: getTimeAgo(activity.createdAt)
  }));

  res.status(200).json({
    success: true,
    data: {
      activities: formattedActivities
    }
  });
});

// @desc    Get low stock items
// @route   GET /api/dashboard/low-stock
// @access  Private
export const getLowStockItems = catchAsync(async (req, res, next) => {
  console.log('⚠️ Fetching low stock items');

  const lowStockItems = await Item.find({
    $expr: { $lte: ["$quantity", "$minimumStock"] }
  })
    .populate('category', 'name color')
    .sort('quantity')
    .limit(10)
    .lean();

  const formattedItems = lowStockItems.map(item => ({
    _id: item._id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    minimumStock: item.minimumStock || 5,
    shortage: Math.max(0, (item.minimumStock || 5) - item.quantity),
    category: item.category,
    price: item.price,
    totalValue: item.quantity * item.price,
    status: item.quantity === 0 ? 'out-of-stock' : 'low-stock'
  }));

  res.status(200).json({
    success: true,
    count: formattedItems.length,
    data: {
      items: formattedItems
    }
  });
});

// @desc    Get category distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private
export const getCategoryDistribution = catchAsync(async (req, res, next) => {
  console.log('📊 Fetching category distribution');

  const distribution = await Item.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } }
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $unwind: {
        path: "$categoryInfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: "$categoryInfo._id",
        name: "$categoryInfo.name",
        color: "$categoryInfo.color",
        icon: "$categoryInfo.icon",
        itemCount: "$count",
        totalQuantity: 1,
        totalValue: 1
      }
    },
    {
      $sort: { itemCount: -1 }
    }
  ]);

  // Calculate totals
  const totalItems = distribution.reduce((sum, cat) => sum + cat.itemCount, 0);
  const totalValue = distribution.reduce((sum, cat) => sum + cat.totalValue, 0);

  // Add percentages
  const distributionWithPercentages = distribution.map(cat => ({
    ...cat,
    percentage: totalItems > 0 ? Math.round((cat.itemCount / totalItems) * 100) : 0,
    valuePercentage: totalValue > 0 ? Math.round((cat.totalValue / totalValue) * 100) : 0
  }));

  res.status(200).json({
    success: true,
    data: {
      distribution: distributionWithPercentages,
      totals: {
        items: totalItems,
        value: totalValue
      }
    }
  });
});

// @desc    Get monthly trends
// @route   GET /api/dashboard/monthly-trends
// @access  Private
export const getMonthlyTrends = catchAsync(async (req, res, next) => {
  console.log('📈 Fetching monthly trends');

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const trends = await Activity.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        type: { $in: ['create', 'update', 'delete'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          type: "$type"
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // Format for chart display
  const months = [];
  const createData = [];
  const updateData = [];
  const deleteData = [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  trends.forEach(trend => {
    const monthYear = `${monthNames[trend._id.month - 1]} ${trend._id.year}`;
    if (!months.includes(monthYear)) {
      months.push(monthYear);
    }

    if (trend._id.type === 'create') {
      createData.push({ month: monthYear, count: trend.count });
    } else if (trend._id.type === 'update') {
      updateData.push({ month: monthYear, count: trend.count });
    } else if (trend._id.type === 'delete') {
      deleteData.push({ month: monthYear, count: trend.count });
    }
  });

  res.status(200).json({
    success: true,
    data: {
      months,
      series: [
        { name: 'Created', data: createData },
        { name: 'Updated', data: updateData },
        { name: 'Deleted', data: deleteData }
      ]
    }
  });
});

// @desc    Get alerts summary
// @route   GET /api/dashboard/alerts-summary
// @access  Private
export const getAlertsSummary = catchAsync(async (req, res, next) => {
  console.log('🔔 Fetching alerts summary');

  const totalAlerts = await Alert.countDocuments();
  const unreadAlerts = await Alert.countDocuments({ read: false });
  const criticalAlerts = await Alert.countDocuments({ type: 'critical', read: false });
  const warningAlerts = await Alert.countDocuments({ type: 'warning', read: false });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alertsToday = await Alert.countDocuments({
    createdAt: { $gte: today }
  });

  // Get recent unread alerts
  const recentAlerts = await Alert.find({ read: false })
    .sort('-createdAt')
    .limit(5)
    .populate('itemId', 'name')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      summary: {
        total: totalAlerts,
        unread: unreadAlerts,
        critical: criticalAlerts,
        warning: warningAlerts,
        today: alertsToday
      },
      recentAlerts: recentAlerts.map(alert => ({
        _id: alert._id,
        title: alert.title,
        description: alert.description,
        type: alert.type,
        itemName: alert.itemId?.name,
        createdAt: alert.createdAt,
        timeAgo: getTimeAgo(alert.createdAt)
      }))
    }
  });
});

// Helper function to get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return new Date(date).toLocaleDateString();
}