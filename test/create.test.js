const { test, app, lib, amqp } = require('./test-env');

const text = 'post';

const queue = 'posts.created';
const key = 'posts.created';
const exchange = 'create';

test.serial('created', async(t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true
  }));

  await amqp.assertQueue(queue, exchange, key);
  await app.service('posts').create({ text });

  const res = await amqp.fastConsume(queue);
  t.is(res[0].data.text, text);
});
