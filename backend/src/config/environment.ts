import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  openaiApiKey: string;
  openaiModel: string;
  nodeEnv: string;
  allowedOrigins: string[];
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  frontendUrl: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flutter-adoption',
  jwtSecret: process.env.JWT_ACCESS_SECRET || 'suraj919007',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').split(','),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'PetEy <no-reply@petey.local>',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
