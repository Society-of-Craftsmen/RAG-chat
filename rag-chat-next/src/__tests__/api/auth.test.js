import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/auth'; // Update to the actual API route

describe('GET /api/auth', () => {
  it('should return status 200 and a message', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toBe({message : "Authentication endpoint"});
  });
});