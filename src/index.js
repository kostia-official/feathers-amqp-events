const unhandledRejection = require('unhandled-rejection');
const debug = require('debug');
const map = require('lodash.map');
const includes = require('lodash.includes');
const pickBy = require('lodash.pickby');
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

  const servicesToPublish = pickBy(app.services, (service, serviceName) =>
    // Choose to publish service if:
    // 1. the list of allowed services is not provided OR if it is, the service is in the list
    (!userOptions.services  || includes(userOptions.services, serviceName)) &&
    // and
    // 2. if the list of ignored services is not provided or if it is, the service is not there.
    (!userOptions.ignoreServices || !includes(userOptions.ignoreServices, serviceName))
  );

  map(servicesToPublish, (service, serviceName) => {
    debug('amqp:events:publish')(`publishing service '${serviceName}'`);

    map(service._serviceEvents, (eventName) => {
      const event = events[eventName];
      if (event) event(service, publish, opt);
    });
  });
};
