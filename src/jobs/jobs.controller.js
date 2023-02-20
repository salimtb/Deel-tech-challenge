'use strict';

const express = require('express');
const service = require('./jobs.service');

const router = express.Router();

async function getUserUnpaidJobs(req, res) {
  const { id: profileId } = req.profile;

  try {
    const jobs = await service.getUserUnpaidJobs(profileId);
    if (!jobs) return res.status(404).end();
    res.json(jobs);
  } catch (error) {
    if (error.code) {
      res.status(error.code).end(error.message);
    }
    res.status(500).end('internal server error');
  }
}

async function payJob(req, res) {
  const { id: userId } = req.profile;
  const { job_id: jobId } = req.params;

  try {
    const jobs = await service.payJob(jobId, userId);
    if (!jobs) return res.status(404).end();
    res.json(jobs);
  } catch (error) {
    if (error.code) {
      res.status(error.code).end(error.message);
    }
    res.status(500).end('internal server error');
  }
}

router.get('/unpaid', getUserUnpaidJobs).post('/:job_id/pay', payJob);

module.exports = router;
