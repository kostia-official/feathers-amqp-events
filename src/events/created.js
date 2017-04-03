module.exports = (service, publish) => {
  service.after({
    create(hook) {
      const routingKey = hook.path + '.created';

      publish(routingKey, { data: hook.result });
      return hook;
    }
  });
};
