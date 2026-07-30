import { Request, Response } from "express";
import { UserService } from "../../services/user.service";
import { UserRepository } from "../../repositories/user.repository";
import { ApiResponseHelper } from "../../utils/api-response";
import { HttpException } from "../../exceptions/http-exception";
import User from "../../models/user.model";

const userService = new UserService();
const userRepository = new UserRepository();

export class AdminUserManagementController {
  /**
   * GET /api/v1/admin/users-management?role=USER&status=active&search=keyword
   * Get users with filtering and search
   */
  async getUsersWithFilters(req: Request, res: Response) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
      const role = req.query.role as string | undefined;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const skip = (page - 1) * limit;
      const query: any = {};

      if (role) query.role = role;
      if (status === "suspended") query.isSuspended = true;
      if (status === "active") query.isSuspended = false;
      if (search) {
        query.$or = [
          { fullName: new RegExp(search, "i") },
          { username: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(query),
      ]);

      return ApiResponseHelper.success(
        res,
        users,
        200,
        "Users retrieved successfully",
        { page, limit, total }
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  /**
   * PATCH /api/v1/admin/users-management/:id/suspend
   * Suspend a user account
   */
  async suspendUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const user = await userRepository.findById(id);
      if (!user) {
        throw new HttpException(404, "User not found");
      }
      if (user.role === "ADMIN") {
        throw new HttpException(403, "Cannot suspend an admin user");
      }

      const updated = await userRepository.update(id, {
        isSuspended: true,
        suspensionReason: reason,
        suspendedAt: new Date(),
        tokenVersion: (user.tokenVersion ?? 0) + 1,
      } as any);

      return ApiResponseHelper.success(
        res,
        updated,
        200,
        "User suspended successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  /**
   * PATCH /api/v1/admin/users-management/:id/activate
   * Activate (unsuspend) a user account
   */
  async activateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userRepository.findById(id);
      if (!user) {
        throw new HttpException(404, "User not found");
      }

      const updated = await userRepository.update(id, {
        isSuspended: false,
        suspensionReason: null,
        suspendedAt: null,
      } as any);

      return ApiResponseHelper.success(
        res,
        updated,
        200,
        "User activated successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  /**
   * GET /api/v1/admin/users-management/stats
   * Get detailed user statistics including suspended count
   */
  async getUserManagementStats(req: Request, res: Response) {
    try {
      const [total, admins, users, suspended, active, verified, unverified] =
        await Promise.all([
          User.countDocuments(),
          User.countDocuments({ role: "ADMIN" }),
          User.countDocuments({ role: "USER" }),
          User.countDocuments({ isSuspended: true } as any),
          User.countDocuments({ isSuspended: false } as any),
          User.countDocuments({ emailVerified: true }),
          User.countDocuments({ emailVerified: false }),
        ]);

      return ApiResponseHelper.success(
        res,
        {
          total,
          admins,
          users,
          suspended,
          active,
          verified,
          unverified,
        },
        200,
        "User management statistics retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }
}
