const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const service = require('feathers-mongoose');
const bodyParser = require('body-parser');
const lib = require('../../src');
const test = require('ava');
const db = require('./db');
const amqp = require('./amqp');
const app = feathers();

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .use('/posts', service({
    Model: db.model('post')
  }));

module.exports = { app, test, amqp, lib };
