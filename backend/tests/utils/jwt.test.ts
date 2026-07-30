import jwt from 'jsonwebtoken';
import { JwtUtil } from '../../src/utils/jwt';

describe('JwtUtil', () => {
  const payload = { id: '507f1f77bcf86cd799439011', role: 'USER' as const };

  describe('generateAccessToken', () => {
    it('should produce a signed JWT string', () => {
      const token = JwtUtil.generateAccessToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should embed the payload id and role', () => {
      const token = JwtUtil.generateAccessToken(payload);
      const decoded = jwt.decode(token) as any;
      expect(decoded.id).toBe(payload.id);
      expect(decoded.role).toBe('USER');
    });
  });

  describe('generateRefreshToken', () => {
    it('should produce a signed JWT string', () => {
      const token = JwtUtil.generateRefreshToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyAccessToken', () => {
    it('should return the decoded payload for a valid token', () => {
      const token = JwtUtil.generateAccessToken(payload);
      const decoded = JwtUtil.verifyAccessToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.role).toBe('USER');
    });

    it('should throw for a token signed with the wrong secret', () => {
      const badToken = jwt.sign(payload, 'wrong-secret');
      expect(() => JwtUtil.verifyAccessToken(badToken)).toThrow();
    });

    it('should throw for a malformed token', () => {
      expect(() => JwtUtil.verifyAccessToken('not-a-token')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should decode a valid refresh token', () => {
      const token = JwtUtil.generateRefreshToken(payload);
      const decoded = JwtUtil.verifyRefreshToken(token);
      expect(decoded.id).toBe(payload.id);
    });

    it('should reject an access token used as refresh token', () => {
      const access = JwtUtil.generateAccessToken(payload);
      expect(() => JwtUtil.verifyRefreshToken(access)).toThrow();
    });
  });
});
