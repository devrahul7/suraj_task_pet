import { HttpException } from '../../src/exceptions/http-exception';

describe('HttpException', () => {
  it('should store the status code and message', () => {
    const ex = new HttpException(400, 'Bad request');
    expect(ex.status).toBe(400);
    expect(ex.message).toBe('Bad request');
  });

  it('should be an instance of Error', () => {
    const ex = new HttpException(500, 'Server error');
    expect(ex).toBeInstanceOf(Error);
  });

  it('should work with 401', () => {
    const ex = new HttpException(401, 'Unauthorized');
    expect(ex.status).toBe(401);
  });

  it('should work with 403', () => {
    const ex = new HttpException(403, 'Forbidden');
    expect(ex.status).toBe(403);
  });
});
