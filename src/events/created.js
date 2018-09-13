module.exports = (service, publish) => {
  service.hooks({
    after: {
      async create(hook) {
        const routingKey = hook.path + '.created';

        await publish(routingKey, { data: hook.result });
        return hook;
      }
    }
  });
};
