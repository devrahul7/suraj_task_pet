import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../../services/user.service";
import { CreateUserDto, UpdateUserDto } from "../../dtos/user.dto";
import { HttpException } from "../../exceptions/http-exception";
import { ApiResponseHelper } from "../../utils/api-response";
import { UpdateUserRoleDto } from "../../dtos/admin/user.dto";

const userService = new UserService();

export class AdminUserController {

    /**
     * Get Dashboard Stats
     */
    async getDashboardStats(req: Request, res: Response) {
        try {
            const stats = await userService.getUserStatistics();

            return ApiResponseHelper.success(
                res,
                stats,
                200,
                "Dashboard statistics retrieved successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to retrieve dashboard statistics",
                e.status || 500
            );
        }
    }

    /**
     * Create User
     */
    async createUser(req: Request, res: Response) {
        try {
            const parsed = CreateUserDto.safeParse(req.body);

            if (!parsed.success) {
                throw new HttpException(400, z.prettifyError(parsed.error));
            }

            const filename = (req as any).file?.filename;

            const user = await userService.registerUser({
                ...parsed.data,
                ...(filename && {
                    profileImage: `/uploads/${filename}`,
                }),
            });

            return ApiResponseHelper.success(
                res,
                user,
                201,
                "User created successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to create user",
                e.status || 500
            );
        }
    }

    /**
     * Get All Users
     */
    async getUsers(req: Request, res: Response) {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

            const users = await userService.getAllUsers(page, limit);

            return ApiResponseHelper.success(
                res,
                users.users,
                200,
                "Users retrieved successfully",
                {
                    page,
                    limit,
                    total: users.total,
                }
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to retrieve users",
                e.status || 500
            );
        }
    }

    /**
     * Get User By ID
     */
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new HttpException(400, "User ID is required");
            }

            const user = await userService.getProfile(id);
            if (!user) {
                throw new HttpException(404, "User not found");
            }

            return ApiResponseHelper.success(
                res,
                user,
                200,
                "User retrieved successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to retrieve user",
                e.status || 500
            );
        }
    }

    /**
     * Update User
     */
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new HttpException(400, "User ID is required");
            }

            const parsed = UpdateUserDto.safeParse(req.body);
            if (!parsed.success) {
                throw new HttpException(400, z.prettifyError(parsed.error));
            }

            const filename = (req as any).file?.filename;
            const updateData = {
                ...parsed.data,
                ...(filename && {
                    profileImage: `/uploads/${filename}`,
                }),
            };

            const existingUser = await userService.getProfile(id);
            if (!existingUser) {
                throw new HttpException(404, "User not found");
            }

            const user = await userService.updateUser(id, updateData);

            return ApiResponseHelper.success(
                res,
                user,
                200,
                "User updated successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to update user",
                e.status || 500
            );
        }
    }

    /**
     * Delete User
     */
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new HttpException(400, "User ID is required");
            }

            const user = await userService.getProfile(id);
            if (!user) {
                throw new HttpException(404, "User not found");
            }

            await userService.deleteUser(id);

            return ApiResponseHelper.success(
                res,
                null,
                200,
                "User deleted successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to delete user",
                e.status || 500
            );
        }
    }

    /**
     * Update User Role
     */
    async updateRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new HttpException(400, "User ID is required");
            }


            const parsed = UpdateUserRoleDto.safeParse(req.body);
            if (!parsed.success) {
                throw new HttpException(
                    400,
                    z.prettifyError(parsed.error)
                );
            }

            const user = await userService.getProfile(id);
            if (!user) {
                throw new HttpException(404, "User not found");
            }

            const updatedUser = await userService.updateUserRole(
                id,
                parsed.data.role
            );
            return ApiResponseHelper.success(
                res,
                updatedUser,
                200,
                "User role updated successfully"
            );
        } catch (e: any) {
            return ApiResponseHelper.error(
                res,
                e.message || "Failed to update role",
                e.status || 500
            );
        }
    }
}