import Category from '../models/Category.js';
import Item from '../models/Item.js';
import Activity from '../models/Activity.js';
import { logActivity } from '../utils/activityLogger.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort('-createdAt')
      .lean();

    // Get item counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const itemCount = await Item.countDocuments({ category: category._id });
        return {
          ...category,
          itemCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        categories: categoriesWithCounts
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Get item count for this category
    const itemCount = await Item.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          itemCount
        }
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }

    // Create category
    const category = await Category.create({
      name,
      description: description || '',
      color: color || '#3b82f6',
      icon: icon || '📦',
      createdBy: req.user.id
    });

    // Log activity
    await logActivity(
      req.user.id,
      req.user.name || req.user.userName || 'User',
      'create',
      'Category created',
      `Created new category: ${category.name}`,
      req
    );

    res.status(201).json({
      success: true,
      data: {
        category
      }
    });

  } catch (error) {
    console.error('Create category error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
};

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Check if category exists
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: category._id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category name already exists'
        });
      }
    }

    // Update category
    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        color: color || category.color,
        icon: icon || category.icon
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await logActivity(
      req.user.id,
      req.user.name || req.user.userName || 'User',
      'update',
      'Category updated',
      `Updated category: ${category.name}`,
      req
    );

    res.status(200).json({
      success: true,
      data: {
        category
      }
    });

  } catch (error) {
    console.error('Update category error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has items
    const itemCount = await Item.countDocuments({ category: category._id });

    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${itemCount} items. Please reassign or delete the items first.`
      });
    }

    await category.deleteOne();

    // Log activity
    await logActivity(
      req.user.id,
      req.user.name || req.user.userName || 'User',
      'delete',
      'Category deleted',
      `Deleted category: ${category.name}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'category',
          as: 'items'
        }
      },
      {
        $project: {
          name: 1,
          color: 1,
          icon: 1,
          itemCount: { $size: '$items' },
          totalValue: {
            $sum: {
              $map: {
                input: '$items',
                as: 'item',
                in: { $multiply: ['$$item.quantity', '$$item.price'] }
              }
            }
          }
        }
      },
      {
        $sort: { itemCount: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category statistics'
    });
  }
};

