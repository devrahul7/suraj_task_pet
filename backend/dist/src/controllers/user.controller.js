"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const api_response_1 = require("../utils/api-response");
const http_exception_1 = require("../exceptions/http-exception");
const cookies_1 = require("../utils/cookies");
const user_dto_1 = require("../dtos/user.dto");
const userService = new user_service_1.UserService();
class UserController {
    /**
     * Register User
     */
    async registerUser(req, res) {
        try {
            const parsed = user_dto_1.CreateUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const filename = req.file?.filename;
            const user = await userService.registerUser({
                ...parsed.data,
                ...(filename && { profileImage: `/uploads/${filename}` }),
            });
            return api_response_1.ApiResponseHelper.success(res, { user }, 201, "User created successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to register user", e.statusCode || e.status || 400);
        }
    }
    /**
     * Login User
     */
    async loginUser(req, res) {
        try {
            const parsed = user_dto_1.LoginUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const result = await userService.loginUser(parsed.data);
            cookies_1.CookieUtil.setAuthCookies(res, result.accessToken, result.refreshToken);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Login successful");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Login failed", e.status || 500);
        }
    }
    /**
     * Refresh Tokens
     */
    async refreshToken(req, res) {
        try {
            const parsed = user_dto_1.RefreshTokenDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const refreshToken = req.cookies?.refreshToken || parsed.data.refreshToken;
            if (!refreshToken) {
                throw new http_exception_1.HttpException(401, "Refresh token missing");
            }
            const result = await userService.refreshAuthTokens(refreshToken);
            cookies_1.CookieUtil.setAuthCookies(res, result.accessToken, result.refreshToken);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Token refreshed successfully");
        }
        catch (e) {
            if (e?.status === 401) {
                cookies_1.CookieUtil.clearAuthCookies(res);
            }
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to refresh token", e.status || 500);
        }
    }
    /**
     * Update User Profile
     */
    async updateUser(req, res) {
        try {
            if (!req.user) {
                throw new http_exception_1.HttpException(401, "Unauthorized");
            }
            const parsed = user_dto_1.UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const filename = req.file?.filename;
            const updateData = {
                ...parsed.data,
                ...(filename && {
                    profileImage: `/uploads/${filename}`,
                }),
            };
            const user = await userService.updateUser(req.user._id.toString(), updateData);
            return api_response_1.ApiResponseHelper.success(res, user, 200, "Profile updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update profile", e.status || 500);
        }
    }
    /**
     * Change Password
     */
    async updatePassword(req, res) {
        try {
            if (!req.user) {
                throw new http_exception_1.HttpException(401, "Unauthorized");
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                throw new http_exception_1.HttpException(400, "Current password and new password are required.");
            }
            await userService.updatePassword(req.user._id.toString(), currentPassword, newPassword);
            return api_response_1.ApiResponseHelper.success(res, null, 200, "Password updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update password", e.status || 500);
        }
    }
    /**
     * Forgot Password
     */
    async forgotPassword(req, res) {
        try {
            const parsed = user_dto_1.ForgotPasswordDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const result = await userService.forgotPassword(parsed.data.email);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Password reset instructions sent");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to initiate password reset", e.status || 500);
        }
    }
    /**
     * Reset Password
     */
    async resetPassword(req, res) {
        try {
            const parsed = user_dto_1.ResetPasswordDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const result = await userService.resetPassword(parsed.data.token, parsed.data.newPassword);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Password reset successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to reset password", e.status || 500);
        }
    }
    /**
     * Verify Email
     */
    async verifyEmail(req, res) {
        try {
            const parsed = user_dto_1.VerifyEmailDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, parsed.error.issues.map(issue => issue.message).join(", "));
            }
            const result = await userService.verifyEmail(parsed.data.token);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Email verified successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to verify email", e.status || 500);
        }
    }
    /**
     * Current User Profile
     */
    async me(req, res) {
        try {
            if (!req.user) {
                throw new http_exception_1.HttpException(401, "Unauthorized");
            }
            const user = await userService.getProfile(req.user._id.toString());
            return api_response_1.ApiResponseHelper.success(res, user, 200, "Profile fetched successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to fetch profile", e.status || 500);
        }
    }
    /**
     * Get All Users (Admin)
     */
    async getAllUsers(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const users = await userService.getAllUsers(page, limit);
            return api_response_1.ApiResponseHelper.success(res, users.users, 200, "Users fetched successfully", {
                page,
                limit,
                total: users.total,
            });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to fetch users", e.status || 500);
        }
    }
    /**
     * Logout
     */
    async logout(req, res) {
        try {
            if (!req.user) {
                throw new http_exception_1.HttpException(401, "Unauthorized");
            }
            await userService.logoutUser(req.user._id.toString());
            cookies_1.CookieUtil.clearAuthCookies(res);
            return api_response_1.ApiResponseHelper.success(res, null, 200, "Logout successful");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to logout", e.status || 500);
        }
    }
}
exports.UserController = UserController;
