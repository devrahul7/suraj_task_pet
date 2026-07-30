"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserManagementController = void 0;
const user_service_1 = require("../../services/user.service");
const user_repository_1 = require("../../repositories/user.repository");
const api_response_1 = require("../../utils/api-response");
const http_exception_1 = require("../../exceptions/http-exception");
const user_model_1 = __importDefault(require("../../models/user.model"));
const userService = new user_service_1.UserService();
const userRepository = new user_repository_1.UserRepository();
class AdminUserManagementController {
    /**
     * GET /api/v1/admin/users-management?role=USER&status=active&search=keyword
     * Get users with filtering and search
     */
    async getUsersWithFilters(req, res) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
            const role = req.query.role;
            const status = req.query.status;
            const search = req.query.search;
            const skip = (page - 1) * limit;
            const query = {};
            if (role)
                query.role = role;
            if (status === "suspended")
                query.isSuspended = true;
            if (status === "active")
                query.isSuspended = false;
            if (search) {
                query.$or = [
                    { fullName: new RegExp(search, "i") },
                    { username: new RegExp(search, "i") },
                    { email: new RegExp(search, "i") },
                ];
            }
            const [users, total] = await Promise.all([
                user_model_1.default.find(query)
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                user_model_1.default.countDocuments(query),
            ]);
            return api_response_1.ApiResponseHelper.success(res, users, 200, "Users retrieved successfully", { page, limit, total });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * PATCH /api/v1/admin/users-management/:id/suspend
     * Suspend a user account
     */
    async suspendUser(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const user = await userRepository.findById(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            if (user.role === "ADMIN") {
                throw new http_exception_1.HttpException(403, "Cannot suspend an admin user");
            }
            const updated = await userRepository.update(id, {
                isSuspended: true,
                suspensionReason: reason,
                suspendedAt: new Date(),
                tokenVersion: (user.tokenVersion ?? 0) + 1,
            });
            return api_response_1.ApiResponseHelper.success(res, updated, 200, "User suspended successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * PATCH /api/v1/admin/users-management/:id/activate
     * Activate (unsuspend) a user account
     */
    async activateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userRepository.findById(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            const updated = await userRepository.update(id, {
                isSuspended: false,
                suspensionReason: null,
                suspendedAt: null,
            });
            return api_response_1.ApiResponseHelper.success(res, updated, 200, "User activated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * GET /api/v1/admin/users-management/stats
     * Get detailed user statistics including suspended count
     */
    async getUserManagementStats(req, res) {
        try {
            const [total, admins, users, suspended, active, verified, unverified] = await Promise.all([
                user_model_1.default.countDocuments(),
                user_model_1.default.countDocuments({ role: "ADMIN" }),
                user_model_1.default.countDocuments({ role: "USER" }),
                user_model_1.default.countDocuments({ isSuspended: true }),
                user_model_1.default.countDocuments({ isSuspended: false }),
                user_model_1.default.countDocuments({ emailVerified: true }),
                user_model_1.default.countDocuments({ emailVerified: false }),
            ]);
            return api_response_1.ApiResponseHelper.success(res, {
                total,
                admins,
                users,
                suspended,
                active,
                verified,
                unverified,
            }, 200, "User management statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.AdminUserManagementController = AdminUserManagementController;
