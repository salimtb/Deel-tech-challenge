'use strict';

const express = require('express');
const service = require('./jobs.service');

const router = express.Router();

async function getUserUnpaidJobs(req, res) {
  const { id: profileId } = req.profile;

  try {
    const jobs = await service.getUserUnpaidJobs(profileId);
    if (!jobs) return res.status(404).end();
    return res.json(jobs);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).end(error.message);
    }
    return res.status(500).end('internal server error');
  }
}

async function payJob(req, res) {
  const { id: userId } = req.profile;
  const { job_id: jobId } = req.params;

  try {
    const payedJob = await service.payJob(jobId, userId);
    res.json(payedJob);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).end(error.message);
    }
    return res.status(500).end('internal server error');
  }
}

router.get('/unpaid', getUserUnpaidJobs).post('/:job_id/pay', payJob);

module.exports = router;
