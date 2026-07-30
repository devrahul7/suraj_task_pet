import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Requested Entity Resource Matrix Not Found') {
    super(404, message);
  }
}