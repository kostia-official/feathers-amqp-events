const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const service = require('feathers-mongoose');
const lib = require('../../src');
const test = require('ava');
const db = require('./db');
const amqp = require('./amqp');

const app = express(feathers());

app.use(express.json())
  .use(express.urlencoded({ extended: true }))
  .configure(express.rest())
  .use('/posts', service({
    Model: db.model('post')
  }));

module.exports = { app, test, amqp, lib };
