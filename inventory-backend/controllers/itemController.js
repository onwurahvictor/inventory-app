// controllers/itemController.js
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import Activity from '../models/Activity.js';
import Alert from '../models/Alert.js';
import alertService from '../services/alertService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
export const createItem = catchAsync(async (req, res, next) => {
  try {
    console.log('📝 Creating item with data:', req.body);
    
    const { name, description, category, quantity, price, sku, location, minimumStock, reorderPoint, unitOfMeasure } = req.body;

    // Validate required fields
    if (!name || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'category', 'quantity', 'price']
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if SKU exists (if provided)
    if (sku) {
      const existingItem = await Item.findOne({ sku });
      if (existingItem) {
        return res.status(400).json({
          success: false,
          error: 'Item with this SKU already exists'
        });
      }
    }

    // Create item
    const item = await Item.create({
      name,
      description: description || '',
      category,
      categoryName: categoryDoc.name,
      quantity: parseInt(quantity) || 0,
      price: parseFloat(price) || 0,
      sku: sku || `${name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      location: location || '',
      minimumStock: minimumStock || 5,
      reorderPoint: reorderPoint || 10,
      unitOfMeasure: unitOfMeasure || 'pieces',
      createdBy: req.user.id
    });

    await item.populate('category', 'name color icon');

    // 🔔 Check if new item is already low stock
    if (item.quantity <= item.minimumStock) {
      console.log('⚠️ New item is below threshold, checking alerts...');
      // Use setTimeout to not block the response
      setTimeout(async () => {
        try {
          await alertService.checkLowStockAlerts();
        } catch (alertError) {
          console.error('Error checking low stock alerts:', alertError);
        }
      }, 100);
    }

    res.status(201).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getAllItems = catchAsync(async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', category, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
      .populate('category', 'name color icon')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      data: { items },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
export const getItem = catchAsync(async (req, res, next) => {
  try {
    console.log('Fetching item with ID:', req.params.id);
    
    const item = await Item.findById(req.params.id)
      .populate('category', 'name color icon')
      .populate('createdBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update item
// @route   PATCH /api/items/:id
// @access  Private
export const updateItem = catchAsync(async (req, res, next) => {
  try {
    console.log('Updating item with ID:', req.params.id);
    console.log('Update data:', req.body);

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Store old values for comparison
    const oldQuantity = item.quantity;
    const oldPrice = item.price;
    const oldMinStock = item.minimumStock;

    // Check for duplicate SKU if SKU is being changed
    if (req.body.sku && req.body.sku !== item.sku) {
      const existingItem = await Item.findOne({ 
        sku: req.body.sku, 
        _id: { $ne: item._id } 
      });
      if (existingItem) {
        return res.status(400).json({
          success: false,
          error: 'SKU already exists'
        });
      }
    }

    // If category is being updated, verify it exists
    if (req.body.category && req.body.category !== item.category.toString()) {
      const categoryDoc = await Category.findById(req.body.category);
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      req.body.categoryName = categoryDoc.name;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    console.log('Item updated successfully:', updatedItem.name);

    // 🔔 Check for low stock after update
    if (oldQuantity !== updatedItem.quantity || oldMinStock !== updatedItem.minimumStock) {
      console.log('⚠️ Stock or threshold changed, checking low stock alerts...');
      
      // Check if item is now below threshold
      if (updatedItem.quantity <= updatedItem.minimumStock) {
        console.log(`🔴 Item ${updatedItem.name} is now below threshold (${updatedItem.quantity} <= ${updatedItem.minimumStock})`);
        
        // Create alert in database immediately
        try {
          await Alert.create({
            title: 'Low Stock Alert',
            description: `${updatedItem.name} stock is below minimum threshold (${updatedItem.quantity} units left, minimum: ${updatedItem.minimumStock})`,
            type: updatedItem.quantity === 0 ? 'critical' : 'warning',
            itemId: updatedItem._id,
            itemName: updatedItem.name,
            category: updatedItem.category?.name,
            currentStock: updatedItem.quantity,
            minimumStock: updatedItem.minimumStock,
            severity: updatedItem.quantity === 0 ? 'critical' : 'warning',
            read: false,
            resolved: false
          });
          console.log('✅ Alert created in database');
        } catch (alertError) {
          console.error('Error creating alert:', alertError);
        }
      }

      // Trigger full alert check (will send emails)
      setTimeout(async () => {
        try {
          await alertService.checkLowStockAlerts();
        } catch (alertError) {
          console.error('Error checking low stock alerts:', alertError);
        }
      }, 100);
    }

    // Check for price change
    if (oldPrice !== updatedItem.price) {
      console.log('💰 Price changed, checking price change alerts...');
      setTimeout(async () => {
        try {
          await alertService.checkPriceChanges(updatedItem._id, oldPrice, updatedItem.price);
        } catch (alertError) {
          console.error('Error checking price changes:', alertError);
        }
      }, 100);
    }

    res.status(200).json({
      success: true,
      data: { item: updatedItem }
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = catchAsync(async (req, res, next) => {
  try {
    console.log('Deleting item with ID:', req.params.id);

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Delete related alerts
    await Alert.deleteMany({ itemId: item._id });

    // Log activity
    await Activity.create({
      user: req.user.id,
      userName: req.user.name || req.user.userName || 'User',
      type: 'delete',
      action: 'Item deleted',
      description: `Deleted item: ${item.name}`,
      targetId: item._id,
      targetType: 'item'
    });

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get low stock items
// @route   GET /api/items/low-stock
// @access  Private
export const getLowStockItems = catchAsync(async (req, res, next) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    })
      .populate('category', 'name color')
      .sort('quantity');

    res.status(200).json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update stock
// @route   PATCH /api/items/:id/stock
// @access  Private
export const updateStock = catchAsync(async (req, res, next) => {
  try {
    const { operation, quantity } = req.body;

    if (!operation || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Operation and quantity are required'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    const oldQuantity = item.quantity;

    switch (operation) {
      case 'add':
        item.quantity += quantity;
        break;
      case 'remove':
        if (item.quantity < quantity) {
          return res.status(400).json({
            success: false,
            error: 'Insufficient stock'
          });
        }
        item.quantity -= quantity;
        break;
      case 'set':
        item.quantity = quantity;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid operation'
        });
    }

    await item.save();

    // 🔔 Check if stock update triggered low stock
    if (oldQuantity !== item.quantity) {
      console.log('⚠️ Stock updated, checking low stock alerts...');
      
      if (item.quantity <= item.minimumStock) {
        console.log(`🔴 Item ${item.name} is now below threshold (${item.quantity} <= ${item.minimumStock})`);
        
        // Create alert in database immediately
        try {
          await Alert.create({
            title: 'Low Stock Alert',
            description: `${item.name} stock is below minimum threshold (${item.quantity} units left, minimum: ${item.minimumStock})`,
            type: item.quantity === 0 ? 'critical' : 'warning',
            itemId: item._id,
            itemName: item.name,
            category: item.category?.name,
            currentStock: item.quantity,
            minimumStock: item.minimumStock,
            severity: item.quantity === 0 ? 'critical' : 'warning',
            read: false,
            resolved: false
          });
          console.log('✅ Alert created in database');
        } catch (alertError) {
          console.error('Error creating alert:', alertError);
        }
      }

      // Trigger full alert check
      setTimeout(async () => {
        try {
          await alertService.checkLowStockAlerts();
        } catch (alertError) {
          console.error('Error checking low stock alerts:', alertError);
        }
      }, 100);
    }

    res.status(200).json({
      success: true,
      data: { 
        item,
        oldQuantity,
        newQuantity: item.quantity
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Force check low stock alerts (admin only)
// @route   POST /api/items/check-alerts
// @access  Private/Admin
export const forceCheckAlerts = catchAsync(async (req, res, next) => {
  try {
    console.log('🔍 Manually triggering low stock check...');
    
    const result = await alertService.checkLowStockAlerts();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Force check alerts error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});