"use strict";
// import dotenv from "dotenv";
// dotenv.config();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.EMAIL_FROM = exports.SMTP_PASSWORD = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.OPENAI_MODEL = exports.SECRET_KEY = exports.MONGODB_URI = exports.MOCK_DB = exports.PORT = void 0;
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
const environment_1 = require("./environment");
exports.PORT = environment_1.config.port;
exports.MOCK_DB = process.env.MOCK_DB || "mock";
exports.MONGODB_URI = environment_1.config.mongoUri;
exports.SECRET_KEY = environment_1.config.jwtSecret;
exports.OPENAI_MODEL = environment_1.config.openaiModel;
exports.SMTP_HOST = environment_1.config.smtpHost;
exports.SMTP_PORT = environment_1.config.smtpPort;
exports.SMTP_USER = environment_1.config.smtpUser;
exports.SMTP_PASSWORD = environment_1.config.smtpPassword;
exports.EMAIL_FROM = environment_1.config.emailFrom;
exports.FRONTEND_URL = environment_1.config.frontendUrl;
