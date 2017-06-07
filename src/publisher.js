const amqp = require('amqplib');
const debug = require('debug')('amqp:events:publish');

module.exports = async ({ uri, exchange }) => {
  let amqp = await connect(uri);

  amqp.connection.on('error', async (err) => {
    debug('connection error', err);
    amqp = await connect(uri);
  });
  amqp.connection.on('close', async () => {
    debug('connection was closed');
    amqp = await connect(uri);
  });

  await amqp.channel.assertExchange(exchange, 'topic', { durable: true });

  return async (routingKey, body) => {
    try {
      const message = new Buffer(JSON.stringify(body));
      amqp.channel.publish(exchange, routingKey, message, { persistent: true });
      debug('published', { exchange, routingKey, body });
    } catch (err) {
      debug(err);
    }
  };
};

async function connect(uri) {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();
  return { connection, channel };
}
