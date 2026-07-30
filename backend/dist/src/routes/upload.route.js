"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const http_exception_1 = require("../exceptions/http-exception");
const api_response_1 = require("../utils/api-response");
const router = (0, express_1.Router)();
// Single file upload
router.post("/upload", upload_middleware_1.uploads.single("image"), (req, res) => {
    try {
        if (!req.file) {
            throw new http_exception_1.HttpException(400, "No file uploaded");
        }
        req.file.path = "/uploads/" + req.file.filename; // set file path for response
        return api_response_1.ApiResponseHelper.success(res, req.file);
    }
    catch (error) {
        return api_response_1.ApiResponseHelper.error(res, error);
    }
});
exports.default = router;
