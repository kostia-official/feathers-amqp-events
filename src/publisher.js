const amqp = require('amqplib');
const debug = require('debug')('amqp:events:publish');

module.exports = async(uri, exchange) => {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic', { durable: true });

  return async(routingKey, body) => {
    try {
      const message = new Buffer(JSON.stringify(body));
      channel.publish(exchange, routingKey, message, { persistent: true });
      debug('published', { exchange, routingKey, body });
    } catch (err) {
      debug(err);
    }
  };
};
