"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
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
