import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types/express.type';

export class JwtUtil {
  private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'petey_access_secret_matrix_2026';
  private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'petey_refresh_secret_matrix_2026';

  static generateAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
  }

  static verifyAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as IJwtPayload;
  }

  static verifyRefreshToken(token: string): IJwtPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as IJwtPayload;
  }
}