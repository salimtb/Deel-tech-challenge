const agent = require('./config/setupTests');

describe('jobsController', () => {
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

  it('should not pay a job if job is not found', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .post('/jobs/100/pay');

    expect(res.status).toEqual(404);
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

  it('should not pay a job if its already payed', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .post('/jobs/1/pay');

    expect(res.status).toEqual(409);
  });
});
