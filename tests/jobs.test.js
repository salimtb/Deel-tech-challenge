const app = require('../src/webserver');
const request = require('supertest');
const agent = request.agent(app);

describe('contractsController', () => {
  it('should not return run request without auth', async () => {
    const res = await agent.get('/jobs/unpaid');
    expect(res.status).toEqual(401);
  });

  it('should return unpaid jobs for a user', async () => {
    const res = await agent
      .set({
        profile_id: 4,
      })
      .get('/jobs/unpaid');

    expect(res.status).toEqual(200);
    expect(res).toMatchObject({
      status: 200,
      body: expect.arrayContaining([expect.objectContaining({})]),
    });
  });
});
