import transporter from '../config/email.js';

const emailService = {
  // Send welcome email
  sendWelcomeEmail: async (user) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: user.email,
        subject: 'Welcome to Our App!',
        html: `
          <h1>Welcome ${user.name}!</h1>
          <p>Thank you for registering with us.</p>
          <p>We're excited to have you on board!</p>
          <p>You can now login to your account and start using our services.</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (user, resetToken) => {
    try {
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Your App Team</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      throw error;
    }
  },

  // Send notification email
  sendNotificationEmail: async (user, subject, message) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: user.email,
        subject: subject,
        html: `
          <h1>${subject}</h1>
          <p>Hello ${user.name},</p>
          <p>${message}</p>
          <p>Best regards,<br>Your App Team</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Notification email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending notification email:', error);
      throw error;
    }
  },

  // Send low stock alert
  sendLowStockAlert: async (adminEmails, items) => {
    try {
      const itemsList = items.map(item => `
        <li style="margin-bottom: 10px; padding: 10px; background: #fff3f3; border-left: 4px solid #ff4444;">
          <strong>${item.name}</strong><br>
          Current Stock: ${item.quantity} (Minimum: ${item.minQuantity || 5})<br>
          Category: ${item.category?.name || 'Uncategorized'}
        </li>
      `).join('');

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: Array.isArray(adminEmails) ? adminEmails.join(',') : adminEmails,
        subject: '⚠️ URGENT: Low Stock Alert',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ff4444;">⚠️ Low Stock Alert</h1>
            <p>The following items are running low on stock and need immediate attention:</p>
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
            <p>Please restock these items as soon as possible to avoid inventory issues.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/items?filter=low-stock" 
               style="padding: 10px 20px; background: #ff4444; color: white; text-decoration: none; border-radius: 5px;">
              View Low Stock Items
            </a>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Low stock alert sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending low stock alert:', error);
      throw error;
    }
  },

  // Send item expiry alert
  sendExpiryAlert: async (adminEmails, items) => {
    try {
      const itemsList = items.map(item => {
        const expiryDate = new Date(item.expiryDate).toLocaleDateString();
        const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
          <li style="margin-bottom: 10px; padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107;">
            <strong>${item.name}</strong><br>
            Expires: ${expiryDate} (${daysLeft} days left)<br>
            Current Stock: ${item.quantity}
          </li>
        `;
      }).join('');

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: Array.isArray(adminEmails) ? adminEmails.join(',') : adminEmails,
        subject: '⚠️ Items Expiring Soon',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ffc107;">⚠️ Items Expiring Soon</h1>
            <p>The following items will expire soon:</p>
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
            <p>Please take appropriate action for these items.</p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Expiry alert sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending expiry alert:', error);
      throw error;
    }
  }
};

export default emailService;