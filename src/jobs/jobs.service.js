const { Op } = require('sequelize');
const { Contract, Job, Profile, sequelize } = require('../model');
const HttpError = require('../errors/httpErrors');

/**
 * Find contract by Id for a specific profile
 * @param {string} - Contract ID
 * @return {object} - user
 */
async function getUserUnpaidJobs(userId) {
  return Job.findAll({
    where: {
      [Op.or]: [{ paid: false }, { paid: null }],
    },
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          [Op.or]: [
            {
              ClientId: userId,
            },
            {
              ContractorId: userId,
            },
          ],
          status: 'in_progress',
        },
      },
    ],
  });
}

async function payJob(jobId, clientId) {
  const job = await Job.findOne({
    include: [
      {
        model: Contract,
        required: true,
        where: { ClientId: clientId },
      },
    ],
    where: { id: jobId },
  });

  // job checks
  if (!job) {
    throw new HttpError(404, 'Job not found');
  }

  if (!!job.paid) {
    throw new HttpError(409, 'Job is already paid');
  }

  await sequelize.transaction(async t => {
    // balance check
    const client = await Profile.findByPk(clientId, { transaction: t });

    if (client.balance < job.price) {
      throw new HttpError(400, 'Insufficient funds');
    }

    await Promise.all([
      Job.update({ paid: true, paymentDate: new Date() }, { where: { id: jobId }, transaction: t }),
      Profile.increment('balance', {
        by: job.price,
        where: { id: job.Contract.ContractorId },
        transaction: t,
      }),
      Profile.decrement('balance', {
        by: job.price,
        where: { id: job.Contract.ClientId },
        transaction: t,
      }),
    ]);

    return job;
  });

  // return updated job
  return Job.findOne({
    include: [
      {
        model: Contract,
        required: true,
        where: { ClientId: clientId },
      },
    ],
    where: { id: jobId },
  });
}

module.exports = {
  getUserUnpaidJobs,
  payJob,
};
