const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.utils.kv['@0.1.16'].clear({
  key: `806515698041749594_834811886251278426_roles`
});