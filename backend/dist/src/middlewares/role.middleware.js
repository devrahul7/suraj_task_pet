"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const http_exception_1 = require("../exceptions/http-exception");
const api_response_1 = require("../utils/api-response");
const roleMiddleware = (...roles) => (req, res, next) => {
    try {
        if (!req.user) {
            throw new http_exception_1.HttpException(401, "Unauthorized");
        }
        if (!roles.includes(req.user.role)) {
            throw new http_exception_1.HttpException(403, "Forbidden");
        }
        next();
    }
    catch (e) {
        return api_response_1.ApiResponseHelper.error(res, e.message || "Forbidden", e.status || 403);
    }
};
exports.roleMiddleware = roleMiddleware;
