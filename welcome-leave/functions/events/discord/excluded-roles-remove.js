//excluded-roles-remove
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const helpers = require('../../../helpers/excluded-roles.js');
let role = context.params.event.data.options[0].value;
const guild_id = context.params.event.guild_id;
const user_id = context.params.event.member.user.id;
const channel_id = context.params.event.channel_id;

if(!context.params.event.member.permission_names.includes('ADMINISTRATOR')) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id,
    content: `<@!${user_id}>`,
    embed: {
      description: `You can't use this command`,
      color: 0xFF0000,
      footer: {
        text: `sticky-roles`
      }
    }
  });
  return
}

await helpers.remove(user_id, role, guild_id, channel_id)