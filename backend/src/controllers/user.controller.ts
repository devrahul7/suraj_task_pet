import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ApiResponseHelper } from "../utils/api-response";
import { HttpException } from "../exceptions/http-exception";
import { CookieUtil } from "../utils/cookies";
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  RefreshTokenDto,
  ResetPasswordDto,
  UpdateUserDto,
  VerifyEmailDto,
} from "../dtos/user.dto";

const userService = new UserService();

export class UserController {
  /**
   * Register User
   */
  async registerUser(req: Request, res: Response) {
    try {
      const parsed = CreateUserDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const filename = (req as any).file?.filename;

      const user = await userService.registerUser({
        ...parsed.data,
        ...(filename && { profileImage: `/uploads/${filename}` }),
      });

      return ApiResponseHelper.success(
        res,
        { user },
        201,
        "User created successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to register user",
        e.statusCode || e.status || 400
      );
    }
  }

  /**
   * Login User
   */
  async loginUser(req: Request, res: Response) {
    try {
      const parsed = LoginUserDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const result = await userService.loginUser(parsed.data);
      CookieUtil.setAuthCookies(res, result.accessToken, result.refreshToken);

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Login successful"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Login failed",
        e.status || 500
      );
    }
  }

  /**
   * Refresh Tokens
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const parsed = RefreshTokenDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const refreshToken = req.cookies?.refreshToken || parsed.data.refreshToken;

      if (!refreshToken) {
        throw new HttpException(401, "Refresh token missing");
      }

      const result = await userService.refreshAuthTokens(refreshToken);
      CookieUtil.setAuthCookies(res, result.accessToken, result.refreshToken);

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Token refreshed successfully"
      );
    } catch (e: any) {
      if (e?.status === 401) {
        CookieUtil.clearAuthCookies(res);
      }

      return ApiResponseHelper.error(
        res,
        e.message || "Failed to refresh token",
        e.status || 500
      );
    }
  }

  /**
   * Update User Profile
   */
  async updateUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new HttpException(401, "Unauthorized");
      }

      const parsed = UpdateUserDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const filename = (req as any).file?.filename;

      const updateData = {
        ...parsed.data,
        ...(filename && {
          profileImage: `/uploads/${filename}`,
        }),
      };

      const user = await userService.updateUser(
        req.user._id.toString(),
        updateData
      );

      return ApiResponseHelper.success(
        res,
        user,
        200,
        "Profile updated successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to update profile",
        e.status || 500
      );
    }
  }

  /**
   * Change Password
   */
  async updatePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new HttpException(401, "Unauthorized");
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new HttpException(
          400,
          "Current password and new password are required."
        );
      }

      await userService.updatePassword(
        req.user._id.toString(),
        currentPassword,
        newPassword
      );

      return ApiResponseHelper.success(
        res,
        null,
        200,
        "Password updated successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to update password",
        e.status || 500
      );
    }
  }

  /**
   * Forgot Password
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const parsed = ForgotPasswordDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const result = await userService.forgotPassword(parsed.data.email);

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Password reset instructions sent"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to initiate password reset",
        e.status || 500
      );
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const parsed = ResetPasswordDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const result = await userService.resetPassword(
        parsed.data.token,
        parsed.data.newPassword
      );

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Password reset successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to reset password",
        e.status || 500
      );
    }
  }

  /**
   * Verify Email
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      const parsed = VerifyEmailDto.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          parsed.error.issues.map(issue => issue.message).join(", ")
        );
      }

      const result = await userService.verifyEmail(parsed.data.token);

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Email verified successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to verify email",
        e.status || 500
      );
    }
  }

  /**
   * Current User Profile
   */
  async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new HttpException(401, "Unauthorized");
      }

      const user = await userService.getProfile(
        req.user._id.toString()
      );

      return ApiResponseHelper.success(
        res,
        user,
        200,
        "Profile fetched successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to fetch profile",
        e.status || 500
      );
    }
  }

  /**
   * Get All Users (Admin)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const users = await userService.getAllUsers(page, limit);

      return ApiResponseHelper.success(
        res,
        users.users,
        200,
        "Users fetched successfully",
        {
          page,
          limit,
          total: users.total,
        }
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to fetch users",
        e.status || 500
      );
    }
  }

  /**
   * Logout
   */
  async logout(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new HttpException(401, "Unauthorized");
      }

      await userService.logoutUser(req.user._id.toString());
      CookieUtil.clearAuthCookies(res);

      return ApiResponseHelper.success(
        res,
        null,
        200,
        "Logout successful"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to logout",
        e.status || 500
      );
    }
  }
}
