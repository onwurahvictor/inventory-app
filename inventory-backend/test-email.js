// test-email.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmail = async () => {
  console.log('📧 Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);

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

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Inventory System',
      text: 'If you receive this, email is working!',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
    });

    console.log('✅ Test email sent:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 AUTHENTICATION ERROR:');
      console.error('For Gmail, you MUST use an App Password, not your regular password [citation:5].');
      console.error('How to get an App Password:');
      console.error('1. Go to your Google Account → Security');
      console.error('2. Enable 2-Step Verification');
      console.error('3. Go to App Passwords');
      console.error('4. Select "Mail" and "Other" (name it "Inventory App")');
      console.error('5. Copy the 16-character password');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔌 CONNECTION ERROR:');
      console.error('Check if your SMTP host and port are correct [citation:8].');
    }
  }
};

testEmail();