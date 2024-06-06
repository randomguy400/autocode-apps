const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let invites = await lib.discord.guilds['@0.1.3'].invites.list({
  guild_id: `806515698041749594`
});

for (let i = 0; i < invites.length ; i++) {
  await lib.utils.kv['@0.1.16'].set({
    key: `${invites[i].code}_invite`,
    value: invites[i].uses,
  });
  let get = await lib.utils.kv['@0.1.16'].get({
    key: `${invites[i].code}_invite`
  });
  console.log(`Saved key as:`)
  console.log(get);
}