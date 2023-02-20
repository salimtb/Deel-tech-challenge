const app = require('../../src/webserver');
const request = require('supertest');
const agent = request.agent(app);

module.exports = agent;
