import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Simplified CORS - allow all origins for testing
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/inventory_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// ==================== MODELS ====================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  emailNotifications: { type: Boolean, default: true },
  lowStockAlerts: { type: Boolean, default: true }
}, { timestamps: true });

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryName: String,
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  sku: { type: String, required: true, unique: true },
  location: String,
  minimumStock: { type: Number, default: 5 },
  status: { type: String, default: 'in-stock' }
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: String,
  icon: String
}, { timestamps: true });

const alertSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  itemName: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryName: String,
  currentStock: Number,
  minimumStock: Number,
  read: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const Category = mongoose.model('Category', categorySchema);
const Alert = mongoose.model('Alert', alertSchema);

// ==================== EMAIL SERVICE ====================

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const sendLowStockEmail = async (item, currentStock, minimumStock) => {
  try {
    const users = await User.find({ 
      lowStockAlerts: true,
      emailNotifications: true 
    });

    if (users.length === 0) return;

    const mailOptions = {
      from: '"Inventory System" <noreply@inventory.com>',
      subject: `⚠️ Low Stock Alert: ${item.name}`,
      html: `
        <h2>Low Stock Alert</h2>
        <p><strong>${item.name}</strong> is running low on stock.</p>
        <ul>
          <li>Current Stock: ${currentStock} units</li>
          <li>Minimum Threshold: ${minimumStock} units</li>
          <li>SKU: ${item.sku}</li>
          <li>Location: ${item.location || 'N/A'}</li>
        </ul>
        <p>Please reorder soon to avoid stockout.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/items/${item._id}" style="padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">View Item</a>
      `
    };

    for (const user of users) {
      mailOptions.to = user.email;
      await transporter.sendMail(mailOptions);
      console.log(`Low stock email sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// ==================== MIDDLEWARE ====================

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      data: { user: { ...user.toObject(), password: undefined } }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      data: { user: { ...user.toObject(), password: undefined } }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

// ==================== ITEM ROUTES ====================

app.get('/api/items', auth, async (req, res) => {
  try {
    const items = await Item.find().populate('category').sort('-createdAt');
    res.json({ success: true, data: { items } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/items/low-stock', auth, async (req, res) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    }).populate('category');
    res.json({ success: true, data: { items } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/items', auth, async (req, res) => {
  try {
    const { name, description, category, quantity, price, sku, location, minimumStock } = req.body;

    const existingItem = await Item.findOne({ sku });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with this SKU already exists' });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const item = await Item.create({
      name,
      description,
      category,
      categoryName: categoryDoc.name,
      quantity,
      price,
      sku,
      location,
      minimumStock: minimumStock || 5
    });

    // Check for low stock and create alert
    if (item.quantity <= item.minimumStock) {
      await Alert.create({
        title: 'Low Stock Alert',
        description: `${item.name} is below minimum threshold (${item.quantity} units left)`,
        type: item.quantity <= 2 ? 'critical' : 'warning',
        item: item._id,
        itemName: item.name,
        category: categoryDoc._id,
        categoryName: categoryDoc.name,
        currentStock: item.quantity,
        minimumStock: item.minimumStock
      });

      // Send email
      await sendLowStockEmail(item, item.quantity, item.minimumStock);
    }

    res.status(201).json({ success: true, data: { item } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');

    // Check for low stock
    if (item.quantity <= item.minimumStock) {
      const existingAlert = await Alert.findOne({
        item: item._id,
        type: item.quantity <= 2 ? 'critical' : 'warning',
        resolved: false
      });

      if (!existingAlert) {
        await Alert.create({
          title: 'Low Stock Alert',
          description: `${item.name} is below minimum threshold (${item.quantity} units left)`,
          type: item.quantity <= 2 ? 'critical' : 'warning',
          item: item._id,
          itemName: item.name,
          category: item.category,
          categoryName: item.categoryName,
          currentStock: item.quantity,
          minimumStock: item.minimumStock
        });

        await sendLowStockEmail(item, item.quantity, item.minimumStock);
      }
    }

    res.json({ success: true, data: { item } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/items/:id', auth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    await Alert.deleteMany({ item: req.params.id });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CATEGORY ROUTES ====================

app.get('/api/categories', auth, async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const itemCount = await Item.countDocuments({ category: category._id });
        return { ...category.toObject(), itemCount };
      })
    );

    res.json({ success: true, data: { categories: categoriesWithCount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/categories', auth, async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, color, icon });
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/categories/:id', auth, async (req, res) => {
  try {
    const itemCount = await Item.countDocuments({ category: req.params.id });
    if (itemCount > 0) {
      return res.status(400).json({ message: `Cannot delete category with ${itemCount} items` });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ALERT ROUTES ====================

app.get('/api/alerts', auth, async (req, res) => {
  try {
    const { filter } = req.query;
    const query = { resolved: false };
    
    if (filter === 'unread') query.read = false;
    if (filter === 'critical') query.type = 'critical';
    if (filter === 'warning') query.type = 'warning';

    const alerts = await Alert.find(query)
      .populate('item', 'name sku')
      .populate('category', 'name color')
      .sort('-createdAt');

    res.json({ success: true, data: { alerts } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/alerts/:id/read', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, data: { alert } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/alerts/mark-all-read', auth, async (req, res) => {
  try {
    await Alert.updateMany({ resolved: false }, { read: true });
    res.json({ success: true, message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/alerts/:id/resolve', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.json({ success: true, data: { alert } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/alerts/stats', auth, async (req, res) => {
  try {
    const total = await Alert.countDocuments();
    const unread = await Alert.countDocuments({ read: false });
    const critical = await Alert.countDocuments({ type: 'critical', resolved: false });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = await Alert.countDocuments({
      resolved: true,
      resolvedAt: { $gte: today }
    });

    res.json({
      success: true,
      data: { stats: { total, unread, critical, resolvedToday } }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lowStock = await Item.countDocuments({
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    });
    
    const totalValueResult = await Item.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]);
    const totalValue = totalValueResult[0]?.total || 0;
    
    const activeAlerts = await Alert.countDocuments({ resolved: false });

    const recentItems = await Item.find()
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(5);

    const recentActivity = await Alert.find()
      .sort('-createdAt')
      .limit(5)
      .select('title description type createdAt');

    res.json({
      success: true,
      data: {
        stats: { totalItems, lowStock, totalValue, activeAlerts },
        recentItems,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});