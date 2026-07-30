import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/api-response";

export const roleMiddleware =
  (...roles: ("USER" | "ADMIN")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpException(401, "Unauthorized");
      }

      if (!roles.includes(req.user.role)) {
        throw new HttpException(403, "Forbidden");
      }

      next();
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Forbidden",
        e.status || 403
      );
    }
  };