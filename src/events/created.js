module.exports = (service, publish) => {
  service.after({
    async create(hook) {
      const routingKey = hook.path + '.created';

      await publish(routingKey, { data: hook.result });
      return hook;
    }
  });
};
