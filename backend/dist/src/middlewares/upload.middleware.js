"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const http_exception_1 = require("../exceptions/http-exception");
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../uploads");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileSuffix = (0, uuid_1.v4)();
        cb(null, fileSuffix + "-" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg") {
        cb(null, true);
    }
    else {
        cb(new http_exception_1.HttpException(400, "Only JPEG, JPG, and PNG files are allowed"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB limit
    },
    fileFilter
});
exports.uploads = {
    single: (fieldName) => exports.upload.single(fieldName),
    array: (fieldName, maxCount) => exports.upload.array(fieldName, maxCount),
    fields: (fieldsArray) => exports.upload.fields(fieldsArray)
};
