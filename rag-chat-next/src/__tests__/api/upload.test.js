import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/upload';

describe('TEST /api/upload', () => {
  it('error code 405 on GET', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({error : "Method not allowed"});
  });

  it('error code 401 on Unauthorized request', async () => {
    const {req, res} = createMocks({
      method: 'POST',
      headers: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({error : "Unathorized access"});
  });

  it('error code 401 on Invalid token', async () => {
    const {req, res} = createMocks({
      method: 'POST',
      headers: {authorization: 'Bearer token123xyz'},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({error : "Invalid token"});
  });
});