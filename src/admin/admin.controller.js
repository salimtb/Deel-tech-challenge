const express = require('express');
const service = require('./admin.service');

const router = express.Router();

async function getBestProfession(req, res) {
  const { start: startDate, end: endDate } = req.query;

  try {
    const bestProfession = await service.getBestProfession(startDate, endDate);
    return res.json(bestProfession);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).end(error.message);
    }
    return res.status(500).end('internal server error');
  }
}

async function getBestClients(req, res) {
  const { start: startDate, end: endDate, limit = 2 } = req.query;

  try {
    const bestClient = await service.getBestClients(startDate, endDate, limit);
    return res.json(bestClient);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).end(error.message);
    }
    return res.status(500).end('internal server error');
  }
}

router.get('/best-profession', getBestProfession).get('/best-clients', getBestClients);

module.exports = router;
