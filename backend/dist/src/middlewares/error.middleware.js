"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const http_exception_1 = require("../exceptions/http-exception");
const api_response_1 = require("../utils/api-response");
function errorMiddleware(error, req, res, next) {
    const status = error instanceof http_exception_1.HttpException ? error.status : 500;
    api_response_1.ApiResponseHelper.error(res, error.message || 'Fatal Core Layer System Routing Interruption', status);
}
