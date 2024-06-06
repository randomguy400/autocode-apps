const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const invite = await lib.discord.guilds['@0.1.3'].invites.list({
  guild_id: `806515698041749594`
});

console.log(invite)