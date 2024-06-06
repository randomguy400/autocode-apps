const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = {
  check: async (user_id) => {
    let user = await lib.utils.kv['@0.1.16'].get({
      key: user_id,
    });
    if (user === 'true') return false;
    else {
      await lib.utils.kv['@0.1.16'].set({
        key: user_id,
        value: `true`,
        ttl: 20,
      });
      return true;
    }
  },
};
