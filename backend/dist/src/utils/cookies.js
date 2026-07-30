"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieUtil = void 0;
class CookieUtil {
    static baseOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    };
    static setAccessTokenCookie(res, accessToken) {
        res.cookie('accessToken', accessToken, {
            ...this.baseOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
    static setAuthCookies(res, accessToken, refreshToken) {
        res.cookie('accessToken', accessToken, {
            ...this.baseOptions,
            maxAge: 15 * 60 * 1000 // 15 mins
        });
        res.cookie('refreshToken', refreshToken, {
            ...this.baseOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
    static clearAuthCookies(res) {
        res.cookie('accessToken', '', { ...this.baseOptions, maxAge: 0 });
        res.cookie('refreshToken', '', { ...this.baseOptions, maxAge: 0 });
    }
}
exports.CookieUtil = CookieUtil;
