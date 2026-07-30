import { HttpException } from './http-exception';

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized Access Matrix Violation') {
    super(401, message);
  }
}