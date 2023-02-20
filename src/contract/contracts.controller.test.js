const { getContractById } = require('./contracts.controller');

describe('contractsController', () => {
  const res = {
    json: () => ({}),
    status: () => ({}),
    end: () => ({}),
  };
  it('should not return run request without auth', async () => {
    const req = {
      params: {
        id: 1,
      },
      profileId: 1,
    };

    const result = await getContractById(req, res);
    expect(result.status).toEqual(401);
  });

  it.skip('should return contract by ID', async () => {
    const res = await agent
      .set({
        profile_id: 1,
      })
      .get('/contracts/1');
    expect(res.status).toEqual(200);
  });

  it.skip('should return not found', async () => {
    const res = await agent
      .set({
        profile_id: 2,
      })
      .get('/contracts/1');
    expect(res.status).toEqual(404);
  });
});
