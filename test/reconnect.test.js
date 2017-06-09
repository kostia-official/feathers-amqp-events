const { test, app, lib, amqp } = require('./test-env');
const sh = require('shelljs');
const { timeout } = require('node-helpers');

const text = 'post';

const queue = 'posts.created';
const key = 'posts.created';
const exchange = 'create';

function stopRabbitMQ() {
  sh.exec('sudo rabbitmqctl stop_app && sudo rabbitmqctl reset');
}

function startRabbitMQ() {
  sh.exec('sudo rabbitmqctl start_app');
}

test('reconnect', async (t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true
  }));

  await timeout(2000);
  stopRabbitMQ();
  await timeout(5000);
  startRabbitMQ();

  await amqp.assertQueue(queue, exchange, key);
  await app.service('posts').create({ text });

  const res = await amqp.fastConsume(queue);
  t.is(res[0].data.text, text);
});
