"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const api_response_1 = require("../utils/api-response");
const validationMiddleware = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return api_response_1.ApiResponseHelper.error(res, result.error.issues[0]?.message ?? "Validation failed", 400);
    }
    req.body = result.data;
    next();
};
exports.validationMiddleware = validationMiddleware;
