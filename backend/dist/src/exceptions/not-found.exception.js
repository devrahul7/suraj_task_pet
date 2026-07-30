"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const http_exception_1 = require("./http-exception");
class NotFoundException extends http_exception_1.HttpException {
    constructor(message = 'Requested Entity Resource Matrix Not Found') {
        super(404, message);
    }
}
exports.NotFoundException = NotFoundException;
