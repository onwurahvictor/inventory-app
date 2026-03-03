import sendEmail from '../config/email.js';

const emailTemplates = {
  lowStockAlert: (user, item) => ({
    subject: `🚨 Low Stock Alert: ${item.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .item-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Low Stock Alert</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>The following item is running low on stock and requires your attention:</p>

            <div class="alert-box">
              <h3 style="margin-top: 0; color: #dc2626;">ACTION REQUIRED</h3>
              <p>Please consider restocking this item immediately.</p>
            </div>

            <div class="item-details">
              <h3 style="margin-top: 0;">${item.name}</h3>
              <table>
                <tr>
                  <td><strong>SKU:</strong></td>
                  <td>${item.sku}</td>
                </tr>
                <tr>
                  <td><strong>Current Quantity:</strong></td>
                  <td>
                    <span style="color: #dc2626; font-weight: bold;">
                      ${item.quantity} units
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><strong>Minimum Required:</strong></td>
                  <td>${item.minimumStock} units</td>
                </tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>${item.location || 'Not specified'}</td>
                </tr>
              </table>
            </div>

            <a
              href="${process.env.FRONTEND_URL}/items/${item._id}"
              class="button"
            >
              View Item Details
            </a>

            <div class="footer">
              <p>This is an automated alert from your Inventory Management System.</p>
              <p>You can adjust your notification preferences in your account settings.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeEmail: (user) => ({
    subject: 'Welcome to Inventory Management System!',
    html: `...`,
  }),
};

export default emailTemplates;
