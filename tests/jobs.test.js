const agent = require('./config/setupTests');

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

  it('should pay a job', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .post('/jobs/1/pay');

    expect(res.status).toEqual(200);
    expect(res.body.paid).toBe(true);
    expect(res.body.paymentDate).not.toBe(null);
  });
});
