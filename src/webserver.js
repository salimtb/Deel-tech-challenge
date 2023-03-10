const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const http = require('http');

const app = express();
const httpPort = 3001;
const contacts = require('./contract/contracts.controller');
const jobs = require('./jobs/jobs.controller');
const balances = require('./balances/balances.controller');
const admin = require('./admin/admin.controller');

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(getProfile);
app.use('/contracts', contacts);
app.use('/jobs', jobs);
app.use('/balances', balances);
app.use('/admin', admin);

if (process.env.NODE_ENV !== 'test') {
  http.createServer(app).listen(httpPort, () => {
    console.log('http server running');
  });
}

module.exports = app;
