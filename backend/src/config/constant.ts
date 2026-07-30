// import dotenv from "dotenv";
// dotenv.config();

// export const PORT = process.env.PORT || 8088;
// export const MOCK_DB = process.env.MOCK_DB || "mock";
// export const MONGODB_URI = process.env.MONGODB_URI
//     || "mongodb://localhost:27017/adoption"; //Aafno actual database ko name 
// export const SECRET_KEY = process.env.JWT_ACCESS_SECRET
//     || "suraj919007";
// export const OPENAI_MODEL =
//     process.env.OPENAI_MODEL || "gpt-4.1-mini";

// export const SMTP_HOST = process.env.SMTP_HOST || "";
// export const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
// export const SMTP_USER = process.env.SMTP_USER || "";
// export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
// export const EMAIL_FROM = process.env.EMAIL_FROM || "PetEy <no-reply@petey.local>";
// export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


import { config } from './environment';

export const PORT = config.port;
export const MOCK_DB = process.env.MOCK_DB || "mock";
export const MONGODB_URI = config.mongoUri;
export const SECRET_KEY = config.jwtSecret;
export const OPENAI_MODEL = config.openaiModel;

export const SMTP_HOST = config.smtpHost;
export const SMTP_PORT = config.smtpPort;
export const SMTP_USER = config.smtpUser;
export const SMTP_PASSWORD = config.smtpPassword;
export const EMAIL_FROM = config.emailFrom;
export const FRONTEND_URL = config.frontendUrl;