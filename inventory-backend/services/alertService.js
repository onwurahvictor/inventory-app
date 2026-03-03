// services/alertService.js
import nodemailer from 'nodemailer';
import Item from '../models/Item.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';

// Configure email transporter with debug mode
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter configuration error:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

// Check for low stock items and send alerts
export const checkLowStockAlerts = async () => {
  try {
    console.log('🔍 Checking for low stock items...');
    
    // Find all items where quantity <= minimumStock
    const lowStockItems = await Item.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    }).populate('category');

    console.log(`Found ${lowStockItems.length} low stock items`);

    if (lowStockItems.length === 0) {
      return { success: true, message: 'No low stock items found' };
    }

    // Get all admin/manager users to notify (with or without lowStockAlerts field set)
    const admins = await User.find({ 
      role: { $in: ['admin', 'manager'] },
      $or: [{ lowStockAlerts: true }, { lowStockAlerts: { $exists: false } }]
    });

    console.log(`📬 Admins to notify: ${admins.length}`);

    if (admins.length === 0) {
      console.log('No admins to notify');
      return { success: true, message: 'No admins to notify' };
    }

    // Create alerts in database (only for new ones)
    const alerts = [];
    for (const item of lowStockItems) {
      const existingAlert = await Alert.findOne({
        itemId: item._id,
        type: item.quantity === 0 ? 'critical' : 'warning',
        resolved: false
      });

      if (!existingAlert) {
        const alert = await Alert.create({
          title: 'Low Stock Alert',
          description: `${item.name} stock is below minimum threshold (${item.quantity} units left, minimum: ${item.minimumStock})`,
          type: item.quantity === 0 ? 'critical' : 'warning',
          user: admins[0]._id, 
          itemId: item._id,
          itemName: item.name,
          category: item.category?.name,
          currentStock: item.quantity,
          minimumStock: item.minimumStock,
          severity: item.quantity === 0 ? 'critical' : 'warning',
          read: false,
          resolved: false
        });
        alerts.push(alert);
      }
    }

    // ✅ FIX: Send email for ALL low stock items, not just newly created alerts
    if (process.env.EMAIL_ENABLED === 'true') {
      console.log('📧 EMAIL_ENABLED is true, sending email...');
      await sendLowStockEmail(lowStockItems, admins);
    } else {
      console.log(`⚠️ Email not sent. EMAIL_ENABLED=${process.env.EMAIL_ENABLED}`);
    }

    return { 
      success: true, 
      message: `Created ${alerts.length} new alerts, notified ${admins.length} admins`,
      alerts 
    };

  } catch (error) {
    console.error('Error checking low stock alerts:', error);
    return { success: false, error: error.message };
  }
};

// Send email notification for low stock items
const sendLowStockEmail = async (lowStockItems, recipients) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email credentials not configured');
      return;
    }

    const emailList = recipients.map(user => user.email).join(', ');
    
    const itemsHtml = lowStockItems.map(item => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.sku || 'N/A'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.category?.name || 'N/A'}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: ${item.quantity === 0 ? '#dc2626' : '#f59e0b'}; font-weight: bold;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.minimumStock}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.location || 'N/A'}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Inventory System" <${process.env.EMAIL_USER}>`,
      to: emailList,
      subject: `⚠️ Low Stock Alert - ${lowStockItems.length} items need attention`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Low Stock Alert</h2>
          <p>The following items are running low on stock:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; border: 1px solid #ddd;">SKU</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Current Stock</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Min Stock</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Location</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/items?filter=low-stock" 
               style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Dashboard
            </a>
          </p>
        </div>
      `
    };

    console.log('📧 Attempting to send email to:', emailList);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check your Gmail App Password.');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed. Check your SMTP host and port.');
    }
  }
};

// Check price changes
export const checkPriceChanges = async (itemId, oldPrice, newPrice) => {
  try {
    const item = await Item.findById(itemId).populate('category');
    if (!item) return;

    await Alert.create({
      title: 'Price Change Alert',
      description: `${item.name} price changed from $${oldPrice} to $${newPrice}`,
      type: 'info',
      itemId: item._id,
      itemName: item.name,
      category: item.category?.name,
      metadata: { oldPrice, newPrice }
    });

  } catch (error) {
    console.error('Error checking price changes:', error);
  }
};

export default {
  checkLowStockAlerts,
  checkPriceChanges
};