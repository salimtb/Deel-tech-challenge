const { fn, col, Op } = require('sequelize');
const { Contract, Job, Profile } = require('../model');
const HttpError = require('../errors/httpErrors');

async function getBestProfession(startDate, endDate) {
  const [result] = await Job.findAll({
    attributes: [[fn('SUM', col('price')), 'totalEarned']],
    include: [
      {
        model: Contract,
        required: true,
        include: [
          {
            model: Profile,
            required: true,
            as: 'Contractor',
          },
        ],
      },
    ],
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paid: true,
    },
    group: ['Contract.ContractorId'],
    order: [[col('totalEarned'), 'DESC']],
    limit: 1,
  });
  if (!result) {
    throw new HttpError(404, 'Client not found');
  }
  return {
    totalEarned: result.dataValues.totalEarned,
    professional: result.dataValues.Contract.Contractor,
  };
}

async function getBestClients(startDate, endDate, limit = 2) {
  const results = await Job.findAll({
    raw: true,
    attributes: [[fn('SUM', col('price')), 'totalPaid']],
    include: [
      {
        model: Contract,
        required: true,
        include: [
          {
            model: Profile,
            required: true,
            as: 'Client',
          },
        ],
      },
    ],
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paid: true,
    },
    group: ['Contract.ClientId'],
    order: [[col('totalPaid'), 'DESC']],
    limit,
  });
  if (!results.length) {
    throw new HttpError(404, 'Client not found');
  }
  return results.map(result => ({
    id: result['Contract.Client.id'],
    paid: result.totalPaid,
    fullName: `${result['Contract.Client.firstName']} ${result['Contract.Client.lastName']}`,
  }));
}

module.exports = {
  getBestProfession,
  getBestClients,
};
