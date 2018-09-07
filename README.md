[![Build Status](https://travis-ci.org/kozzztya/feathers-amqp-events.svg?branch=master)](https://travis-ci.org/kozzztya/feathers-amqp-events)

# FeathersJS AMQP events

Publish service events with using AMQP protocol.
Supports reconnect on lost connection.

## Usage

```js
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const services = require('./services');
const amqpEvents = require('feathers-amqp-events');
const app = express(feathers());

app.use(express.json())
  .use(express.urlencoded({ extended: true }))
  .configure(express.rest())
  .configure(services())
  .configure(amqpEvents({
    amqp: {
      url: 'amqp://localhost', // url to your RabbitMQ connection
      exchange: 'my-app'       // all events will be published to this exchange
      retryOptions: { max_tries: 100, interval: 500 } // bluebird-retry options for reconnect
    },
    original: true             // publish object before update or not
  }));

module.exports = app;
```

## Events

Routing key for every event will looks like `<path>.<event>`. For example:

- posts.created
- posts.updated
- posts.removed
- posts/:id/comments.created
- posts/:id/comments.updated
- posts/:id/comments.removed

## Content

Message content will have following fields:

- data - created, removed or updated object.
- original - object before update.
