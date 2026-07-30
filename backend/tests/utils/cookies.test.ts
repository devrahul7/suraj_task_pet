import { Response } from 'express';
import { CookieUtil } from '../../src/utils/cookies';

type MockResponse = {
  cookie: jest.Mock;
} & Partial<Response>;

function mockRes(): MockResponse {
  return { cookie: jest.fn() } as unknown as MockResponse;
}

describe('CookieUtil', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('setAccessTokenCookie', () => {
    it('should set an accessToken cookie', () => {
      const res = mockRes();
      CookieUtil.setAccessTokenCookie(res as Response, 'token123');
      expect(res.cookie).toHaveBeenCalledTimes(1);
      const [name, value, options] = res.cookie.mock.calls[0];
      expect(name).toBe('accessToken');
      expect(value).toBe('token123');
      expect(options?.httpOnly).toBe(true);
      expect(options?.maxAge).toBeGreaterThan(0);
    });
  });

  describe('setAuthCookies', () => {
    it('should set both accessToken and refreshToken cookies', () => {
      const res = mockRes();
      CookieUtil.setAuthCookies(res as Response, 'access123', 'refresh456');
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie.mock.calls[0][0]).toBe('accessToken');
      expect(res.cookie.mock.calls[0][1]).toBe('access123');
      expect(res.cookie.mock.calls[1][0]).toBe('refreshToken');
      expect(res.cookie.mock.calls[1][1]).toBe('refresh456');
    });

    it('should give refreshToken a longer maxAge than accessToken', () => {
      const res = mockRes();
      CookieUtil.setAuthCookies(res as Response, 'a', 'r');
      const accessMaxAge = res.cookie.mock.calls[0][2]?.maxAge;
      const refreshMaxAge = res.cookie.mock.calls[1][2]?.maxAge;
      expect(refreshMaxAge).toBeGreaterThan(accessMaxAge!);
    });
  });

  describe('clearAuthCookies', () => {
    it('should set both cookies with maxAge 0', () => {
      const res = mockRes();
      CookieUtil.clearAuthCookies(res as Response);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie.mock.calls[0][2]?.maxAge).toBe(0);
      expect(res.cookie.mock.calls[1][2]?.maxAge).toBe(0);
    });
  });
});
