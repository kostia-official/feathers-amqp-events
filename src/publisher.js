const amqp = require('amqplib');
const debug = require('debug')('amqp:events:publish');

module.exports = async(uri, exchange) => {
  const connection = await amqp.connect(uri);
  const channel = await connection.createChannel();

  return async(routingKey, body) => {
    try {
      channel.publish(exchange, routingKey, new Buffer(JSON.stringify(body)));
      debug('published', { exchange, routingKey, body });
    } catch (err) {
      debug(err);
    }
  };
};
