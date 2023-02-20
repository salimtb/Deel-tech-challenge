const agent = require('./config/setupTests');

describe('adminController', () => {
  it('should not return run request without auth', async () => {
    const res = await agent.get('/admin/best-profession').query({
      start: '2020-01-15',
      end: '2020-10-15',
    });
    expect(res.status).toEqual(401);
  });

  it('should return the best profession', async () => {
    const res = await agent
      .get('/admin/best-profession')
      .set({
        profile_id: 1,
      })
      .query({
        start: '2020-01-15',
        end: '2020-10-15',
      });
    expect(res.status).toEqual(200);
    expect(res).toMatchObject({
      status: 200,
      body: expect.objectContaining({
        totalEarned: expect.any(Number),
        professional: expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          profession: expect.any(String),
          balance: expect.any(Number),
          type: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      }),
    });
  });

  it('should return not found if start date is supp to endDate', async () => {
    const res = await agent
      .get('/admin/best-profession')
      .set({
        profile_id: 1,
      })
      .query({
        start: '2022-01-15',
        end: '2020-10-15',
      });
    expect(res.status).toEqual(404);
  });

  it('should return the best client', async () => {
    const res = await agent
      .get('/admin/best-clients')
      .set({
        profile_id: 1,
      })
      .query({
        start: '2020-01-15',
        end: '2020-10-15',
      });
    expect(res.status).toEqual(200);
    expect(res).toMatchObject({
      status: 200,
      body: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          paid: expect.any(Number),
          fullName: expect.any(String),
        }),
      ]),
    });
  });

  it('should return not found if start date is supp to endDate', async () => {
    const res = await agent
      .get('/admin/best-clients')
      .set({
        profile_id: 1,
      })
      .query({
        start: '2022-01-15',
        end: '2020-10-15',
      });
    expect(res.status).toEqual(404);
  });
});
