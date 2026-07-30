import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/http-exception';
import { ApiResponseHelper } from '../utils/api-response';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error instanceof HttpException ? error.status : 500;

  ApiResponseHelper.error(
    res,
    error.message || 'Fatal Core Layer System Routing Interruption',
    status
  );
}