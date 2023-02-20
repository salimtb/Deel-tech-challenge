const agent = require('./config/setupTests');

describe('balancesController', () => {
  it('should not return run request without auth', async () => {
    const res = await agent.get('/jobs/unpaid');
    expect(res.status).toEqual(401);
  });

  it('should deposit and increment the balance of the user', async () => {
    const res = await agent
      .post('/balances/deposit/1')
      .set({
        profile_id: 1,
      })
      .send({
        amount: 200,
      });
    expect(res.status).toEqual(200);
    expect(res).toMatchObject({
      status: 200,
      body: expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        profession: expect.any(String),
        balance: expect.any(Number),
        type: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
  });

  it('should not deposit and increment the balance of the user if the amount exceed 25%', async () => {
    const res = await agent
      .post('/balances/deposit/1')
      .set({
        profile_id: 1,
      })
      .send({
        amount: 2000,
      });
    expect(res.status).toEqual(403);
  });
});
