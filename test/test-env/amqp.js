const amqp = require('amqplib');
const { timeout } = require('node-helpers');

let channel;

amqp.assertQueue = async function (queue, exchange, key) {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic');
  await channel.assertQueue(queue);
  await channel.bindQueue(queue, exchange, key);
};

amqp.fastConsume = async function (queue) {
  await timeout(1000);
  const res = [];

  channel.consume(queue, (msg) => {
    res.push(JSON.parse(msg.content));
    channel.ack(msg);
  });

  await timeout(1000);
  return res;
};

module.exports = amqp;
