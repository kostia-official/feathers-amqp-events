module.exports = (service, publish) => {
  service.after({
    remove(hook) {
      const routingKey = hook.path + '.removed';
      publish(routingKey, { data: hook.result });
      return hook;
    }
  });
};
