"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message, statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(res, error, statusCode = 400) {
        const response = {
            success: false,
            error,
        };
        return res.status(statusCode).json(response);
    }
    static paginated(res, data, page, limit, total, statusCode = 200) {
        const response = {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
        return res.status(statusCode).json(response);
    }
}
exports.ResponseUtil = ResponseUtil;
