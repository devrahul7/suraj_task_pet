"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authorizedMiddleware = void 0;
const http_exception_1 = require("../exceptions/http-exception");
const api_response_1 = require("../utils/api-response");
const user_repository_1 = require("../repositories/user.repository");
const jwt_1 = require("../utils/jwt");
const userRepository = new user_repository_1.UserRepository();
// for user detail now can be accessed in req.user
const authorizedMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.accessToken;
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : cookieToken;
        if (!token)
            throw new http_exception_1.HttpException(401, "Token missing");
        const decoded = jwt_1.JwtUtil.verifyAccessToken(token);
        if (!decoded || !decoded.id)
            throw new http_exception_1.HttpException(401, "Invalid token");
        const user = await userRepository.findById(decoded.id);
        if (!user)
            throw new http_exception_1.HttpException(401, "User not found");
        // NOTE: Disabled for testing. Re-enable after SMTP email verification is working.
        // if (!user.emailVerified) {
        //     throw new HttpException(403, "Please verify your email before accessing this resource");
        // }
        if (typeof decoded.tokenVersion === "number" && user.tokenVersion !== decoded.tokenVersion) {
            throw new http_exception_1.HttpException(401, "Token has been invalidated");
        }
        req.user = user; // attach user to request object for downstream use
        return next(); // entry ahead
    }
    catch (e) {
        return api_response_1.ApiResponseHelper.error(res, e?.message || "Unauthorized", e.status || 401);
    }
};
exports.authorizedMiddleware = authorizedMiddleware;
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user)
            throw new http_exception_1.HttpException(401, "User not found");
        if (req.user.role !== 'ADMIN')
            throw new http_exception_1.HttpException(401, "No admin previlage");
        return next();
    }
    catch (e) {
        return api_response_1.ApiResponseHelper.error(res, e?.message || 'Unauthorized', e.status || 401);
    }
};
exports.isAdmin = isAdmin;
