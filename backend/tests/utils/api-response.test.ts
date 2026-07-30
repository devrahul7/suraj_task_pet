import { Response } from 'express';
import { ApiResponseHelper } from '../../src/utils/api-response';

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

describe('ApiResponseHelper', () => {
  describe('success', () => {
    it('should send a 200 with success: true and the provided data', () => {
      const res = mockRes();
      ApiResponseHelper.success(res as Response, { id: 1 }, 200, 'OK');
      expect(res.status).toHaveBeenCalledWith(200);
      const body = res.json.mock.calls[0][0];
      expect(body.success).toBe(true);
      expect(body.data).toEqual({ id: 1 });
      expect(body.message).toBe('OK');
      expect(body.status).toBe(200);
    });

    it('should default to status 200 and message "Success"', () => {
      const res = mockRes();
      ApiResponseHelper.success(res as Response, 'hello');
      expect(res.status).toHaveBeenCalledWith(200);
      const body = res.json.mock.calls[0][0];
      expect(body.message).toBe('Success');
      expect(body.success).toBe(true);
    });

    it('should include meta when provided', () => {
      const res = mockRes();
      const meta = { page: 2, limit: 10, total: 42 };
      ApiResponseHelper.success(res as Response, [], 200, 'OK', meta);
      const body = res.json.mock.calls[0][0];
      expect(body.meta).toEqual(meta);
    });

    it('should send a 201 for created resources', () => {
      const res = mockRes();
      ApiResponseHelper.success(res as Response, { id: 99 }, 201, 'Created');
      expect(res.status).toHaveBeenCalledWith(201);
      const body = res.json.mock.calls[0][0];
      expect(body.status).toBe(201);
    });
  });

  describe('error', () => {
    it('should send success: false with the given message and status', () => {
      const res = mockRes();
      ApiResponseHelper.error(res as Response, 'Not found', 404);
      expect(res.status).toHaveBeenCalledWith(404);
      const body = res.json.mock.calls[0][0];
      expect(body.success).toBe(false);
      expect(body.message).toBe('Not found');
      expect(body.status).toBe(404);
    });

    it('should default to status 500 and message "Error"', () => {
      const res = mockRes();
      ApiResponseHelper.error(res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      const body = res.json.mock.calls[0][0];
      expect(body.message).toBe('Error');
      expect(body.success).toBe(false);
    });
  });
});
