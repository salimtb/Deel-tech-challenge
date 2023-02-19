const { Op } = require('sequelize');
const { Contract, Job } = require('../model');

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

module.exports = {
  getUserUnpaidJobs,
};
