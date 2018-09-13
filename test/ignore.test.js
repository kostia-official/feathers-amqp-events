const { test, app, lib, amqp } = require('./test-env');

const text = 'reply';

const queue = 'replies.created';
const key = 'replies.created';
const exchange = 'create';

test.serial('ignore', async(t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true,
    ignoreServices: ['replies']
  }));

  await amqp.assertQueue(queue, exchange, key);
  await app.service('replies').create({ text });

  const res = await amqp.fastConsume(queue);
  t.is(res.length, 0);
});
