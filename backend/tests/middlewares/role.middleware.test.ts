import { Response } from 'express';
import { roleMiddleware } from '../../src/middlewares/role.middleware';

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
} & Partial<Response>;

function mockRes(): MockResponse {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as MockResponse;
}

function mockNext() {
  return jest.fn();
}

describe('roleMiddleware', () => {
  it('should call next() when the user has a matching role', () => {
    const req: any = { user: { role: 'ADMIN' } };
    const res = mockRes();
    const next = mockNext();
    roleMiddleware('ADMIN')(req, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next() when one of multiple allowed roles matches', () => {
    const req: any = { user: { role: 'USER' } };
    const res = mockRes();
    const next = mockNext();
    roleMiddleware('USER', 'ADMIN')(req, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when the user role is not in the allowed list', () => {
    const req: any = { user: { role: 'USER' } };
    const res = mockRes();
    const next = mockNext();
    roleMiddleware('ADMIN')(req, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });

  it('should return 401 when req.user is missing', () => {
    const req: any = {};
    const res = mockRes();
    const next = mockNext();
    roleMiddleware('ADMIN')(req, res as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
