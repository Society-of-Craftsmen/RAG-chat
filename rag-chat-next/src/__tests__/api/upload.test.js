import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/upload'; // Update to the actual API route

describe('TEST /api/upload', () => {
  it('error code 405 on GET', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({error : "Method not allowed"});
  });
});