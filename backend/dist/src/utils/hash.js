"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUtil = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class HashUtil {
    static SALT_ROUNDS = 10;
    static async hash(plainText) {
        return bcryptjs_1.default.hash(plainText, this.SALT_ROUNDS);
    }
    static async compare(plainText, hashedText) {
        return bcryptjs_1.default.compare(plainText, hashedText);
    }
}
exports.HashUtil = HashUtil;
