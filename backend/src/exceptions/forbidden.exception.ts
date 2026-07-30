import { HttpException } from './http-exception';

export class ForbiddenException extends HttpException {
  constructor(message = 'You do not have permission to access this resource') {
    super(403, message);
  }
}
