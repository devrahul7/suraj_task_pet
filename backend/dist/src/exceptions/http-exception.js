"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
// Exception Handler
class HttpException extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.HttpException = HttpException;
