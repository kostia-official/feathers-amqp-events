const unhandledRejection = require('unhandled-rejection');
const debug = require('debug');
const map = require('lodash.map');
const includes = require('lodash.includes');
const requireDir = require('require-dir');
const events = requireDir('./events');
const publisher = require('./publisher');

const rejectionEmitter = unhandledRejection();
rejectionEmitter.on('unhandledRejection', debug('amqp:error'));

const defaultOptions = {
  original: false
};

module.exports = (userOptions) => async function () {
  const app = this;
  const opt = { ...defaultOptions, ...userOptions };
  const publish = await publisher(opt.amqp);

  map(app.services, (service, serviceName) => {
    if (userOptions.services && !includes(userOptions.services, serviceName)) {
      debug('amqp:events:publish')(`service '${serviceName}' not selected, not being published.`);
      return service;
    } else
    if (userOptions.ignoreServices && includes(userOptions.ignoreServices, serviceName)) {
      debug('amqp:events:publish')(`service '${serviceName}' ignored, not being published.`);
      return service;
    }
    debug('amqp:events:publish')(`service '${serviceName}' selected, publishing.`);

    map(service._serviceEvents, (eventName) => {
      const event = events[eventName];
      if (event) event(service, publish, opt);
    });
  });
};
