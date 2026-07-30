"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const zod_1 = require("zod");
const user_service_1 = require("../../services/user.service");
const user_dto_1 = require("../../dtos/user.dto");
const http_exception_1 = require("../../exceptions/http-exception");
const api_response_1 = require("../../utils/api-response");
const user_dto_2 = require("../../dtos/admin/user.dto");
const userService = new user_service_1.UserService();
class AdminUserController {
    /**
     * Get Dashboard Stats
     */
    async getDashboardStats(req, res) {
        try {
            const stats = await userService.getUserStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Dashboard statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve dashboard statistics", e.status || 500);
        }
    }
    /**
     * Create User
     */
    async createUser(req, res) {
        try {
            const parsed = user_dto_1.CreateUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const filename = req.file?.filename;
            const user = await userService.registerUser({
                ...parsed.data,
                ...(filename && {
                    profileImage: `/uploads/${filename}`,
                }),
            });
            return api_response_1.ApiResponseHelper.success(res, user, 201, "User created successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to create user", e.status || 500);
        }
    }
    /**
     * Get All Users
     */
    async getUsers(req, res) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
            const users = await userService.getAllUsers(page, limit);
            return api_response_1.ApiResponseHelper.success(res, users.users, 200, "Users retrieved successfully", {
                page,
                limit,
                total: users.total,
            });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve users", e.status || 500);
        }
    }
    /**
     * Get User By ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "User ID is required");
            }
            const user = await userService.getProfile(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            return api_response_1.ApiResponseHelper.success(res, user, 200, "User retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve user", e.status || 500);
        }
    }
    /**
     * Update User
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "User ID is required");
            }
            const parsed = user_dto_1.UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const filename = req.file?.filename;
            const updateData = {
                ...parsed.data,
                ...(filename && {
                    profileImage: `/uploads/${filename}`,
                }),
            };
            const existingUser = await userService.getProfile(id);
            if (!existingUser) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            const user = await userService.updateUser(id, updateData);
            return api_response_1.ApiResponseHelper.success(res, user, 200, "User updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update user", e.status || 500);
        }
    }
    /**
     * Delete User
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "User ID is required");
            }
            const user = await userService.getProfile(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            await userService.deleteUser(id);
            return api_response_1.ApiResponseHelper.success(res, null, 200, "User deleted successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to delete user", e.status || 500);
        }
    }
    /**
     * Update User Role
     */
    async updateRole(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "User ID is required");
            }
            const parsed = user_dto_2.UpdateUserRoleDto.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const user = await userService.getProfile(id);
            if (!user) {
                throw new http_exception_1.HttpException(404, "User not found");
            }
            const updatedUser = await userService.updateUserRole(id, parsed.data.role);
            return api_response_1.ApiResponseHelper.success(res, updatedUser, 200, "User role updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update role", e.status || 500);
        }
    }
}
exports.AdminUserController = AdminUserController;
