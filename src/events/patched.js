module.exports = (service, publish, opt) => {
  service.before({
    async patch(hook) {
      if (!opt.original) return hook;

      hook.params.original = await this.get(hook.id);
      return hook;
    }
  });

  service.after({
    patch(hook) {
      const routingKey = hook.path + '.updated';
      const original = (opt.original) ? hook.params.original : opt.original;

      publish(routingKey, { data: hook.result, original });

      return hook;
    }
  });
};
