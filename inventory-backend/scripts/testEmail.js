import dotenv from 'dotenv';
import transporter from '../config/email.js';
import emailService from '../services/emailService.js';
import nodemailer from 'nodemailer';

dotenv.config();

async function testEmailConfiguration() {
  console.log('🔧 Testing email configuration...');
  console.log('📧 Email user:', process.env.EMAIL_USER || 'Not configured');
  console.log('📧 Email host:', process.env.EMAIL_HOST || 'Not configured');
  console.log('---');

  try {
    // Test 1: Verify connection
    console.log('Test 1: Verifying email server connection...');
    await transporter.verify();
    console.log('✅ Test 1 passed: Email server connection successful');

    // Test 2: Send test email
    console.log('\nTest 2: Sending test email...');
    const testUser = {
      name: 'Test User',
      email: process.env.TEST_EMAIL || 'onwurahvictor@gmail.com' 
    };

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
      to: testUser.email,
      subject: 'Test Email from Your App',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your application.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Test 2 passed: Test email sent');
    console.log('📨 Message ID:', info.messageId);
    
    // For Ethereal email, show preview URL
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    // Test 3: Test welcome email service
    console.log('\nTest 3: Testing welcome email service...');
    await emailService.sendWelcomeEmail({
      name: 'Test User',
      email: testUser.email
    });
    console.log('✅ Test 3 passed: Welcome email service working');

    console.log('\n🎉 All tests passed! Email configuration is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Authentication failed. Please check:');
      console.error('1. Your email credentials are correct');
      console.error('2. For Gmail, you\'re using an App Password (not your regular password)');
      console.error('3. 2-Factor Authentication is enabled for Gmail');
    } else if (error.code === 'ESOCKET') {
      console.error('\n🔧 Connection failed. Please check:');
      console.error('1. Email host and port are correct');
      console.error('2. Your firewall isn\'t blocking the connection');
    }
  }
}

// Run the test
testEmailConfiguration();