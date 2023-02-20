const { fn, col } = require('sequelize');
const { Contract, Job, Profile } = require('../model');
const HttpError = require('../errors/httpErrors');

async function depositMoney(clientId, amount) {
  const client = await Profile.findOne({ where: { id: clientId } });
  if (!client || client.type !== 'client') {
    throw new HttpError(404, 'Client not found');
  }

  const result = await Job.findOne({
    attributes: [[fn('SUM', col('price')), 'toPay']],
    raw: true,
    include: [
      {
        attributes: [],
        model: Contract,
        required: true,
        where: { ClientId: client.id },
      },
    ],
    where: {
      paid: null,
    },
    group: ['Contract.ClientId'],
  });
  if (!result || amount > result.toPay * 1.25) {
    throw new HttpError(403, 'Forbidden request, amount exceed 25%');
  }

  await Profile.increment('balance', { by: amount, where: { id: clientId } });
  return Profile.findOne({ where: { id: clientId } });
}

module.exports = {
  depositMoney,
};
