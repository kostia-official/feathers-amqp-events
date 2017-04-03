const { test, app, amqp, lib } = require('./test-env');

const Post = app.service('posts');
const Promise = require('bluebird');

const oldTextPost1 = 'post1';
const oldTextPost2 = 'post2';
const newTextPost1 = 'updatedTextPost1';
const newTextPost2 = 'updatedTextPost2';

const queue = 'patch';
const key = 'posts.updated';
const exchange = 'patch';

test.serial('patch', async(t) => {
  app.configure(lib({
    amqp: { url: 'amqp://localhost', exchange },
    original: true
  }));
  await amqp.assertQueue(queue, exchange, key);

  const post1 = await Post.create({ text: oldTextPost1 });
  const post2 = await Post.create({ text: oldTextPost2 });

  await Promise.all([
    Post.patch(post1._id, { text: newTextPost1 }),
    Post.patch(post2._id, { text: newTextPost2 })
  ]);

  const res = await amqp.fastConsume(queue);
  t.is(res.length, 2);
  res.forEach((item) => {
    if (item.original._id === post1.id) {
      t.is(item.original.text, oldTextPost1);
      t.is(item.data.text, newTextPost1);
    }

    if (item.original._id === post2.id) {
      t.is(item.original.text, oldTextPost2);
      t.is(item.data.text, newTextPost2);
    }
  });
});
