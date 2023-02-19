const app = require('../src/webserver');
const request = require('supertest');
const agent = request.agent(app);

describe('contractsController', () => {
  it('should not return run request without auth', async () => {
    const res = await agent.get('/contracts/1');
    expect(res.status).toEqual(401);
  });

  it('should return contract by ID', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .get('/contracts/1');
    expect(res.status).toEqual(200);
  });

  it('should return not found', async () => {
    const res = await agent
      .set({
        profile_id: 2,
      })
      .get('/contracts/1');
    expect(res.status).toEqual(404);
  });
});
