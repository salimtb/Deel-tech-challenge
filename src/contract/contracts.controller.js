'use strict';

const express = require('express');
const service = require('./contracts.service');

const router = express.Router();

async function getContractById(req, res) {
  const { id } = req.params;
  const { id: profileId } = req.profile;

  try {
    const contract = await service.getContractById(id, profileId);
    if (!contract) return res.status(404).end();
    res.json(contract);
  } catch (error) {
    if (error.code) {
      res.status(error.code).end(error.message);
    }
    res.status(500).end('internal server error');
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
    if (error.code) {
      res.status(error.code).end(error.message);
    }
    res.status(500).end('internal server error');
  }
}

router.get('/:id', getContractById);
router.get('/', getNonTerminatedUserContracts);

module.exports = router;
