"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSeedAdmin = autoSeedAdmin;
const user_model_1 = __importDefault(require("../models/user.model"));
const user_type_1 = require("../types/user.type");
const hash_1 = require("./hash");
async function autoSeedAdmin() {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@petey.com').toLowerCase();
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'PetEy Admin';
        const hashedPassword = await hash_1.HashUtil.hash(adminPassword);
        const existingAdmin = await user_model_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            existingAdmin.role = user_type_1.UserRole.ADMIN;
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log(`[AutoSeed] Updated existing admin "${adminEmail}" password to "${adminPassword}".`);
            return;
        }
        await user_model_1.default.create({
            fullName: adminName,
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: user_type_1.UserRole.ADMIN,
            emailVerified: true,
        });
        console.log(`[AutoSeed] Created Admin user: ${adminEmail}`);
    }
    catch (error) {
        console.error(`[AutoSeed] Failed to seed admin user: ${error.message}`);
    }
}
