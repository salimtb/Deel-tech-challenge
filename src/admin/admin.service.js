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

module.exports = {
  getBestProfession,
};
