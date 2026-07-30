"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHelper = void 0;
// Consistent API
const res_example = {
    "status": 200,
    "data": {
    // .. data
    },
    "message": "Success",
    "meta": {
        // pagination, etc
        "page": 1,
        "limit": 10,
        "total": 100
    }
};
class ApiResponseHelper {
    static success(res, data, status = 200, message = "Success", meta) {
        const response = {
            status,
            data,
            message,
            success: true,
            meta
        };
        return res.status(status).json(response);
    }
    static error(res, message = "Error", status = 500) {
        const response = {
            status,
            message,
            success: false
        };
        return res.status(status).json(response);
    }
}
exports.ApiResponseHelper = ApiResponseHelper;
