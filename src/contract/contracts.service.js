const { Op } = require('sequelize');
const { Contract } = require('../model');

/**
 * Find contract by Id for a specific profile
 * @param {id} - Contract ID
 * @return {profileId} - profile ID
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

module.exports = {
  getContractById,
};
