import { Request, Response } from 'express';
import { errorMiddleware } from '../../src/middlewares/error.middleware';
import { HttpException } from '../../src/exceptions/http-exception';

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

describe('errorMiddleware', () => {
  it('should use the HttpException status when given one', () => {
    const err = new HttpException(404, 'Pet not found');
    const res = mockRes();
    errorMiddleware(err, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].message).toBe('Pet not found');
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });

  it('should default to 500 for generic Error', () => {
    const err = new Error('Something went wrong');
    const res = mockRes();
    errorMiddleware(err, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should use a fallback message when error.message is empty', () => {
    const err = new Error('');
    const res = mockRes();
    errorMiddleware(err, {} as Request, res as Response, jest.fn());
    const body = res.json.mock.calls[0][0];
    expect(body.message).toBeTruthy();
  });
});
