"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const hash_1 = require("../utils/hash");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_type_1 = require("../types/user.type");
async function seedAdmin() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/adoption';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@petey.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const adminName = process.env.ADMIN_NAME || 'PetEy Admin';
    await mongoose_1.default.connect(mongoUri);
    const existingAdmin = await user_model_1.default.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
        if (existingAdmin.role !== user_type_1.UserRole.ADMIN) {
            existingAdmin.role = user_type_1.UserRole.ADMIN;
            await existingAdmin.save();
            console.log(`Updated existing user "${adminEmail}" to ADMIN role.`);
        }
        else {
            console.log(`Admin user "${adminEmail}" already exists.`);
        }
        await mongoose_1.default.disconnect();
        return;
    }
    const hashedPassword = await hash_1.HashUtil.hash(adminPassword);
    await user_model_1.default.create({
        fullName: adminName,
        username: adminUsername,
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: user_type_1.UserRole.ADMIN,
        emailVerified: true,
    });
    console.log(`Admin user created: ${adminEmail}`);
    console.log(`Default password: ${adminPassword}`);
    await mongoose_1.default.disconnect();
}
seedAdmin().catch((error) => {
    console.error('Failed to seed admin user:', error.message);
    process.exit(1);
});
