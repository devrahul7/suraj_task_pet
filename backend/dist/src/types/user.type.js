"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.UserSchema = exports.UserPreferencesSchema = void 0;
const zod_1 = require("zod");
/**
 * User Preferences
 * Used by the AI recommendation engine
 */
exports.UserPreferencesSchema = zod_1.z.object({
    petType: zod_1.z.array(zod_1.z.string()).default([]),
    size: zod_1.z.array(zod_1.z.enum([
        "SMALL",
        "MEDIUM",
        "LARGE",
    ])).default([]),
    age: zod_1.z.string().nullable().optional(),
    activityLevel: zod_1.z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]).nullable().optional(),
    experience: zod_1.z.enum([
        "BEGINNER",
        "INTERMEDIATE",
        "EXPERIENCED",
    ]).nullable().optional(),
    hasChildren: zod_1.z.boolean().default(false),
    hasOtherPets: zod_1.z.boolean().default(false),
});
/**
 * User Schema
 */
exports.UserSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    username: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phoneNumber: zod_1.z.string().nullable().optional(),
    profileImage: zod_1.z.string().nullable().optional(),
    address: zod_1.z.string().max(200).nullable().optional(),
    location: zod_1.z.string().max(100).nullable().optional(),
    role: zod_1.z.enum([
        "USER",
        "ADMIN",
    ]).default("USER").optional(),
    preferences: exports.UserPreferencesSchema.optional(),
    favorites: zod_1.z.array(zod_1.z.string()).default([]).optional(),
    tokenVersion: zod_1.z.number().int().nonnegative().default(0).optional(),
    refreshTokenHash: zod_1.z.string().nullable().optional(),
    refreshTokenExpiresAt: zod_1.z.coerce.date().nullable().optional(),
    resetPasswordToken: zod_1.z.string().nullable().optional(),
    resetPasswordExpiresAt: zod_1.z.coerce.date().nullable().optional(),
    emailVerified: zod_1.z.boolean().default(false).optional(),
    emailVerificationToken: zod_1.z.string().nullable().optional(),
    emailVerificationExpiresAt: zod_1.z.coerce.date().nullable().optional(),
});
exports.UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
};
