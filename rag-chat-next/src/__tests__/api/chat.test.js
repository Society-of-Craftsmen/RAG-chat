import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/chat';

jest.mock('../../../middleware/verifyToken', () => ({
  verifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  },
}));

describe('TEST /api/chat', () => {
  it('error code 405 on GET', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });

  it('error code 401 on Unauthorized request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: 'Unauthorized' });
  });

  it('error code 400 on missing message or userId', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {}
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Message and userId are required" });
  });

  it('success on valid request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {
        message: 'test message',
        userId: 'test-user-id'
      }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveProperty('response');
  });
});