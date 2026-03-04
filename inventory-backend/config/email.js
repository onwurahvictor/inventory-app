import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not found. Using mock email transporter.');
    return {
      sendMail: async (options) => {
        console.log('📧 MOCK EMAIL:');
        console.log('From:', options.from);
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('--- Email not actually sent (missing credentials) ---');
        return { messageId: 'mock-email-id' };
      },
      verify: async () => true
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return {
    sendMail: async (options) => {
      const { data, error } = await resend.emails.send({
        from: options.from || 'Inventory App <onboarding@resend.dev>',
        to: Array.isArray(options.to) ? options.to : options.to.split(',').map(e => e.trim()),
        subject: options.subject,
        html: options.html || options.text,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Email sent via Resend:', data.id);
      return { messageId: data.id };
    },
    verify: async () => true
  };
};

const transporter = createTransporter();

transporter.verify()
  .then(() => console.log('✅ Email transporter is ready'))
  .catch((error) => console.error('❌ Email transporter error:', error));

export default transporter;