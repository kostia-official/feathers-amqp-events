module.exports = (service, publish) => {
  service.after({
    async remove(hook) {
      const routingKey = hook.path + '.removed';
      await publish(routingKey, { data: hook.result });
      return hook;
    }
  });
};
