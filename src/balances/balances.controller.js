'use strict';

const express = require('express');
const service = require('./balances.service');

const router = express.Router();

async function depositMoney(req, res) {
  const { userId: clientId } = req.params;
  const { amount } = req.body;
  try {
    const deposit = await service.depositMoney(clientId, amount);
    res.json(deposit);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).end(error.message);
    }
    return res.status(500).end('internal server error');
  }
}

router.post('/deposit/:userId', depositMoney);

module.exports = router;
