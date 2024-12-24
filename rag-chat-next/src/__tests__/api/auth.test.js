import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/auth'; // Ensure the correct path to your API route

describe('GET /api/auth', () => {
  it('should return status 200 and a message', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200); // Check status code
    expect(res._getJSONData()).toStrictEqual({ message: "Authentication endpoint" }); // Check JSON response
  });
});
