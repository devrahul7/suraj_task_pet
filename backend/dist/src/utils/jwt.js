"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtil {
    static ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'petey_access_secret_matrix_2026';
    static REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'petey_refresh_secret_matrix_2026';
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.ACCESS_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.REFRESH_SECRET);
    }
}
exports.JwtUtil = JwtUtil;
