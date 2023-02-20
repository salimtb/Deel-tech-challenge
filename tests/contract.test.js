const agent = require('./config/setupTests');
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
        profile_id: 1,
      })
      .get('/contracts/test');
    expect(res.status).toEqual(404);
  });

  it('should return contracts for given user', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .get('/contracts');
    expect(res.status).toEqual(200);
    expect(res).toMatchObject({
      status: 200,
      body: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          terms: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          ContractorId: expect.any(Number),
          ClientId: expect.any(Number),
        }),
      ]),
    });
  });
});
