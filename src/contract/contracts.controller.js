'use strict';

const express = require('express');
const service = require('./contracts.service');

const router = express.Router();

/**
 * Find contract by Id for a specific profile
 * @param {object} - Request
 * @return {object} - response
 */
async function getContractById(req, res) {
  const { id } = req.params;
  const { id: profileId } = req.profile;

  try {
    const contract = await service.getContractById(id, profileId);
    if (!contract) return res.status(404).end();
    res.json(contract);
  } catch (error) {
    res.status(500).end();
  }
}

async function getNonTerminatedUserContracts(req, res) {
  const { id: userId } = req.profile;

  if (!userId) {
    res.status(400).end('bad request, userId is mandatory');
  }
  try {
    const contract = await service.getNonTerminatedUserContracts(userId);
    if (!contract) return res.status(404).end();
    res.json(contract);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}

router.get('/:id', getContractById);
router.get('/', getNonTerminatedUserContracts);

module.exports = router;
