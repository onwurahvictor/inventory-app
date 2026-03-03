import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function createDevTransporter() {
  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('\n📧 Ethereal Email Credentials:');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('Preview URL: https://ethereal.email\n');
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Failed to create ethereal account:', error);
    throw error;
  }
}

// Use this in development
let transporter;

if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
  console.log('🔧 Using Ethereal for development emails');
  transporter = await createDevTransporter();
} else {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export default transporter;