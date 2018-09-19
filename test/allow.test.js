const { test, app, lib, amqp } = require('./test-env');

const text = 'reply';

const exchange = 'create';

test.serial('allow', async(t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true,
    services: ['posts']
  }));

  // Only posts is allowed. Therefore replies should not publish

  await amqp.assertQueue('replies.created', exchange, 'replies.created');
  await app.service('replies').create({ text });

  let res = await amqp.fastConsume('replies.created');
  t.is(res.length, 0);

  // Now posts should publish

  await amqp.assertQueue('posts.created', exchange, 'posts.created');
  await app.service('posts').create({ text });

  res = await amqp.fastConsume('posts.created');
  t.is(res[0].data.text, text);
});
