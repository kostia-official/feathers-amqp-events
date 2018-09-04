module.exports = (service, publish) => {
  service.hooks({
    after: {
      async remove(hook) {
        const routingKey = hook.path + '.removed';
        await publish(routingKey, { data: hook.result });
        return hook;
      }
    }
  });
};
