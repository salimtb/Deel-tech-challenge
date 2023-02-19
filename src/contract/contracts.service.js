const { Op } = require('sequelize');
const { Contract } = require('../model');

/**
 * Find contract by Id for a specific profile
 * @param {string} - Contract ID
 * @param {string} - profile ID
 * @return {object} - contract list
 */
async function getContractById(id, profileId) {
  try {
    return Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Find contract by Id for a specific profile
 * @param {string} - Contract ID
 * @return {object} - contracts
 */
async function getNonTerminatedUserContracts(userId) {
  try {
    return Contract.findAll({
      where: {
        [Op.or]: [
          {
            ClientId: userId,
          },
          {
            ContractorId: userId,
          },
        ],
        status: { [Op.ne]: 'terminated' },
      },
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getContractById,
  getNonTerminatedUserContracts,
};
