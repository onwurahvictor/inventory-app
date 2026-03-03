import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  // For development - mock transporter if no credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not found. Using mock email transporter.');
    
    // Mock transporter for development
    return {
      sendMail: async (options) => {
        console.log('📧 MOCK EMAIL:');
        console.log('From:', options.from);
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html || options.text);
        console.log('--- Email not actually sent (missing credentials) ---');
        return { messageId: 'mock-email-id' };
      },
      verify: async () => true
    };
  }

  // Real transporter with credentials
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Only for development
    }
  });
};

const transporter = createTransporter();

// Verify connection configuration
transporter.verify()
  .then(() => console.log('✅ Email server is ready to send messages'))
  .catch((error) => console.error('❌ Email transporter configuration error:', error));

export default transporter;