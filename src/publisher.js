const amqp = require('amqplib');
const retry = require('bluebird-retry');
const debug = require('debug')('amqp:events:publish');

let instance;

module.exports = async ({ url, exchange, retryOptions }) => {
  instance = await connect(url, retryOptions);

  await instance.channel.assertExchange(exchange, 'topic', { durable: true });

  return async (routingKey, body) => {
    try {
      const message = new Buffer(JSON.stringify(body));
      instance.channel.publish(exchange, routingKey, message, { persistent: true });
      debug('published', { exchange, routingKey, body });
    } catch (err) {
      debug(err);
    }
  };
};

function connect(url, retryOptions) {
  return retry(async () => {
    const connection = await amqp.connect(url).catch(err => debug(err.message));
    const channel = await connection.createChannel();

    connection.on('error', async (err) => {
      debug('connection error', err);
      instance = await connect(url, retryOptions);
    });
    connection.on('close', async () => {
      debug('connection was closed');
      instance = await connect(url, retryOptions);
    });

    debug('connected');
    return { connection, channel };
  }, Object.assign({ max_tries: 1000, interval: 500, backoff: 1.1 }, retryOptions));
}
