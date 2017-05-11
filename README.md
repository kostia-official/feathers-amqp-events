# FeathersJS AMQP events

[![Greenkeeper badge](https://badges.greenkeeper.io/kozzztya/feathers-amqp-events.svg)](https://greenkeeper.io/)

Publish service events with using AMQP protocol.

## Usage

```js
const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const services = require('./services');
const amqpEvents = require('feathers-amqp-events');
const app = feathers();

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(services())
  .configure(amqpEvents({
    amqp: {
      url: 'amqp://localhost', // url to your RabbitMQ connection
      exchange: 'my-app'       // all events will be published to this exchange
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
