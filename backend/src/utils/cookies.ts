import { Response, CookieOptions } from 'express';

export class CookieUtil {
  private static readonly baseOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };

  static setAccessTokenCookie(res: Response, accessToken: string): void {
    res.cookie('accessToken', accessToken, {
      ...this.baseOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
  }

  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, {
      ...this.baseOptions,
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      ...this.baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  static clearAuthCookies(res: Response): void {
    res.cookie('accessToken', '', { ...this.baseOptions, maxAge: 0 });
    res.cookie('refreshToken', '', { ...this.baseOptions, maxAge: 0 });
  }
}