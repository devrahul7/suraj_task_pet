"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.UpdatePasswordDto = exports.UpdateUserDto = exports.RefreshTokenDto = exports.LoginUserDto = exports.CreateUserDto = void 0;
const zod_1 = require("zod");
const user_type_1 = require("../types/user.type");
/**
 * Create User
 */
exports.CreateUserDto = user_type_1.UserSchema.pick({
    fullName: true,
    username: true,
    email: true,
    password: true,
    phoneNumber: true,
    profileImage: true,
}).partial({
    phoneNumber: true,
    profileImage: true,
});
/**
 * Login
 */
exports.LoginUserDto = user_type_1.UserSchema.pick({
    email: true,
    password: true,
});
/**
 * Refresh Token
 */
exports.RefreshTokenDto = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1).optional(),
});
/**
 * Update Profile
 * Password is updated through a separate endpoint.
 */
exports.UpdateUserDto = user_type_1.UserSchema.pick({
    fullName: true,
    username: true,
    email: true,
    phoneNumber: true,
    profileImage: true,
    address: true,
    location: true,
    preferences: true,
    favorites: true,
}).partial();
/**
 * Change Password
 */
exports.UpdatePasswordDto = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
/**
 * Forgot Password
 */
exports.ForgotPasswordDto = zod_1.z.object({
    email: zod_1.z.string().email(),
});
/**
 * Reset Password
 */
exports.ResetPasswordDto = zod_1.z.object({
    token: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6),
});
/**
 * Verify Email
 */
exports.VerifyEmailDto = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
