import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/api-response";
import { UserRepository } from "../repositories/user.repository";
import { JwtUtil } from "../utils/jwt";

const userRepository = new UserRepository();
// for user detail now can be accessed in req.user
export const authorizedMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            const cookieToken = (req as Request & { cookies?: { accessToken?: string } }).cookies?.accessToken;
            const token = authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : cookieToken;

            if (!token)
                throw new HttpException(401, "Token missing");
            const decoded = JwtUtil.verifyAccessToken(token) as Record<string, any>;
            if (!decoded || !decoded.id)
                throw new HttpException(401, "Invalid token");
            const user = await userRepository.findById(decoded.id);
            if (!user)
                throw new HttpException(401, "User not found");

            // NOTE: Disabled for testing. Re-enable after SMTP email verification is working.
            // if (!user.emailVerified) {
            //     throw new HttpException(403, "Please verify your email before accessing this resource");
            // }

            if (typeof decoded.tokenVersion === "number" && user.tokenVersion !== decoded.tokenVersion) {
                throw new HttpException(401, "Token has been invalidated");
            }

            req.user = user; // attach user to request object for downstream use
            return next(); // entry ahead
        } catch (e: Error | unknown | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Unauthorized",
                e.status || 401
            );
        }
    }

export const isAdmin =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user)
                throw new HttpException(401, "User not found");
            if (req.user.role !== 'ADMIN')
                throw new HttpException(401, "No admin previlage");
            return next();
        } catch (e: Error | unknown | any) {
            return ApiResponseHelper.error(
                res, e?.message || 'Unauthorized', e.status || 401
            )
        }
    }
