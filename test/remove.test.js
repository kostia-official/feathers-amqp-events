const { test, app, amqp, lib } = require('./test-env');

const Post = app.service('posts');

const text = 'text';

const queue = 'posts.removed';
const key = 'posts.removed';
const exchange = 'remove';

test.serial('remove', async(t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true
  }));

  await amqp.assertQueue(queue, exchange, key);

  const post = await Post.create({ text });

  console.log('POST is',post)
  console.log('removing post with ID',post._id)

  await Post.remove(post._id);

  const res = await amqp.fastConsume(queue);
  t.is(res[0].data.text, text);
});
