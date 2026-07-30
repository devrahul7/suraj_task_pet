"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const http_exception_1 = require("../exceptions/http-exception");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const constant_1 = require("../config/constant");
const email_service_1 = require("./email.service");
const jwt_1 = require("../utils/jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
const userRepository = new user_repository_1.UserRepository();
const emailService = new email_service_1.EmailService();
class UserService {
    refreshTokenLifetimeMs = 7 * 24 * 60 * 60 * 1000;
    sanitizeUser(user) {
        const plainUser = user.toObject ? user.toObject() : user;
        const { password, refreshTokenHash, refreshTokenExpiresAt, resetPasswordToken, resetPasswordExpiresAt, emailVerificationToken, emailVerificationExpiresAt, ...safeUser } = plainUser;
        return safeUser;
    }
    createTokenPair(user) {
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion ?? 0,
        };
        return {
            accessToken: jwt_1.JwtUtil.generateAccessToken(payload),
            refreshToken: jwt_1.JwtUtil.generateRefreshToken(payload),
        };
    }
    hashToken(token) {
        return crypto_1.default.createHash("sha256").update(token).digest("hex");
    }
    async storeRefreshToken(userId, refreshToken) {
        await userRepository.update(userId, {
            refreshTokenHash: this.hashToken(refreshToken),
            refreshTokenExpiresAt: new Date(Date.now() + this.refreshTokenLifetimeMs),
        });
    }
    /**
     * Register User
     */
    async registerUser(userData) {
        const existingUsername = await userRepository.findByUsername(userData.username);
        if (existingUsername) {
            throw new http_exception_1.HttpException(400, "Username already exists");
        }
        const existingEmail = await userRepository.findByEmail(userData.email);
        if (existingEmail) {
            throw new http_exception_1.HttpException(400, "Email already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const user = await userRepository.create({
            ...userData,
            password: hashedPassword,
            role: "USER",
            favorites: [],
            emailVerified: true,
        });
        return this.sanitizeUser(user);
    }
    /**
     * Login User
     */
    async loginUser(loginData) {
        const identifier = loginData.email.toLowerCase().trim();
        let user = await userRepository.findByEmailWithPassword(identifier);
        if (!user) {
            const byUsername = await userRepository.findByUsername(identifier);
            if (byUsername) {
                user = await user_model_1.default.findById(byUsername._id).select("+password");
            }
        }
        if (!user) {
            throw new http_exception_1.HttpException(400, "Invalid email or password");
        }
        const isValid = await bcryptjs_1.default.compare(loginData.password, user.password);
        if (!isValid) {
            throw new http_exception_1.HttpException(400, "Invalid email or password");
        }
        // NOTE: Disabled for testing. Re-enable after SMTP email verification is working.
        // if (!user.emailVerified) {
        //   throw new HttpException(403, "Please verify your email before logging in");
        // }
        const { accessToken, refreshToken } = this.createTokenPair(user);
        await this.storeRefreshToken(user._id.toString(), refreshToken);
        void emailService
            .sendLoginNotificationEmail({
            fullName: user.fullName,
            email: user.email,
        })
            .catch((error) => {
            console.warn("Login notification email delivery failed.", error);
        });
        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken,
        };
    }
    /**
     * Refresh Auth Tokens
     */
    async refreshAuthTokens(refreshToken) {
        if (!refreshToken) {
            throw new http_exception_1.HttpException(401, "Refresh token missing");
        }
        const decoded = jwt_1.JwtUtil.verifyRefreshToken(refreshToken);
        const refreshTokenHash = this.hashToken(refreshToken);
        const user = await userRepository.findByRefreshToken(refreshTokenHash);
        if (!user) {
            throw new http_exception_1.HttpException(401, "Invalid or expired refresh token");
        }
        if (user._id.toString() !== decoded.id) {
            throw new http_exception_1.HttpException(401, "Invalid refresh token");
        }
        if ((user.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
            throw new http_exception_1.HttpException(401, "Refresh token has been invalidated");
        }
        // NOTE: Disabled for testing. Re-enable after SMTP email verification is working.
        // if (!user.emailVerified) {
        //   throw new HttpException(403, "Please verify your email before accessing this resource");
        // }
        const tokens = this.createTokenPair(user);
        await this.storeRefreshToken(user._id.toString(), tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    /**
     * Update User
     */
    async updateUser(id, updateData) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        if (updateData.email &&
            updateData.email !== user.email) {
            const existing = await userRepository.findByEmail(updateData.email);
            if (existing) {
                throw new http_exception_1.HttpException(400, "Email already exists");
            }
        }
        if (updateData.username &&
            updateData.username !== user.username) {
            const existing = await userRepository.findByUsername(updateData.username);
            if (existing) {
                throw new http_exception_1.HttpException(400, "Username already exists");
            }
        }
        return await userRepository.update(id, updateData);
    }
    /**
     * Update Password
     */
    async updatePassword(id, currentPassword, newPassword) {
        const user = await userRepository.findByIdWithPassword(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValid) {
            throw new http_exception_1.HttpException(400, "Current password is incorrect");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const updatedUser = await userRepository.update(id, {
            password: hashedPassword,
            tokenVersion: (user.tokenVersion ?? 0) + 1,
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });
        if (updatedUser) {
            void emailService
                .sendPasswordChangeEmail({
                fullName: updatedUser.fullName,
                email: updatedUser.email,
            })
                .catch((error) => {
                console.warn("Password change email delivery failed.", error);
            });
        }
        return updatedUser;
    }
    /**
     * Logout User
     */
    async logoutUser(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        await userRepository.update(id, {
            tokenVersion: (user.tokenVersion ?? 0) + 1,
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });
        return {
            message: "Logout successful",
        };
    }
    /**
     * Forgot Password
     */
    async forgotPassword(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return {
                message: "If the email exists, a reset link has been sent.",
            };
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenHash = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
        await userRepository.update(user._id.toString(), {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpiresAt,
        });
        const resetLink = `${constant_1.FRONTEND_URL}/reset-password?token=${resetToken}`;
        void emailService
            .sendPasswordResetEmail({
            fullName: user.fullName,
            email: user.email,
        }, resetLink)
            .catch((error) => {
            console.warn("Password reset email delivery failed.", error);
        });
        return {
            message: "If the email exists, a reset link has been sent.",
        };
    }
    /**
     * Reset Password
     */
    async resetPassword(token, newPassword) {
        const tokenHash = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await userRepository.findByResetPasswordToken(tokenHash);
        if (!user) {
            throw new http_exception_1.HttpException(400, "Invalid or expired reset token");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await userRepository.update(user._id.toString(), {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiresAt: null,
            tokenVersion: (user.tokenVersion ?? 0) + 1,
            refreshTokenHash: null,
            refreshTokenExpiresAt: null,
        });
        return {
            message: "Password reset successfully",
        };
    }
    /**
     * Verify Email
     */
    async verifyEmail(token) {
        const tokenHash = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await userRepository.findByEmailVerificationToken(tokenHash);
        if (!user) {
            throw new http_exception_1.HttpException(400, "Invalid or expired verification token");
        }
        await userRepository.update(user._id.toString(), {
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
        });
        return {
            message: "Email verified successfully",
        };
    }
    async sendVerificationEmail(userId, fullName, email) {
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const verificationTokenHash = crypto_1.default
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");
        const emailVerificationExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await userRepository.update(userId, {
            emailVerificationToken: verificationTokenHash,
            emailVerificationExpiresAt,
        });
        const verificationLink = `${constant_1.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        void emailService
            .sendEmailVerificationEmail({
            fullName,
            email,
        }, verificationLink)
            .catch((error) => {
            console.warn("Email verification delivery failed.", error);
        });
    }
    /**
     * Current User Profile
     */
    async getProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        return this.sanitizeUser(user);
    }
    /**
     * Get User By ID
     */
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        return user;
    }
    /**
     * Get All Users
     */
    async getAllUsers(page = 1, limit = 10) {
        return await userRepository.findAll(page, limit);
    }
    /**
     * Delete User
     */
    async deleteUser(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        await userRepository.delete(id);
        return {
            message: "User deleted successfully",
        };
    }
    /**
     * User Statistics
     */
    async getUserStatistics() {
        const roleStats = await userRepository.countByRole();
        return {
            totalUsers: Object.values(roleStats).reduce((sum, count) => sum + count, 0),
            roleStats,
        };
    }
    // For admin only: Update User Role
    async updateUserRole(id, role) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        return await userRepository.update(id, { role });
    }
}
exports.UserService = UserService;
