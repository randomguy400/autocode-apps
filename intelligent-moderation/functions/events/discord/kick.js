const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const helpers = require('../../../../helpers/mod.js')

let cwsRole = '827628160866189313';
let adminRole = '841319543301079040';
let roleManager = '841319078324600903';
let moderatorRole = '806528940122308639';

// Defining each inputted value
let user_id = context.params.event.data.options[0].value;
let reason = context.params.event.data.options[1].value;
let guild_id = context.params.event.guild_id
const event = context.params.event 
let staff_id = context.params.event.member.user.id

// Retrieving user info
let retrieve_user = await lib.discord.guilds['@0.1.0'].members.retrieve({
  user_id: staff_id,
  guild_id
});

let retrieve_guild = await lib.discord.guilds['@0.1.0'].retrieve({
  guild_id
});

// Obtaining their full username
let staff = (retrieve_user.user.username + '#' + retrieve_user.user.discriminator);

if (event.member.roles.includes(cwsRole || adminRole || moderatorRole) || event.member.user.id === retrieve_guild.owner_id || event.permission_names.includes('ADMINISTRATOR')) {
  
  await helpers.kick(event, reason, staff, user_id, staff_id)
}

else {
  let sleep = async (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms || 0);
    });
  };
  
  let msg = await lib.discord.channels['@0.1.0'].messages.create({
    channel_id: event.channel_id,
    content: `<@!${context.params.event.member.user.id}>`,
    embed: {
      description: 'You don\'t have permission to use this',
      color: 0xFF0000
    }
  });
  
  sleep(5000)
  
  await lib.discord.channels['@0.2.1'].messages.destroy({
    message_id: msg.id,
    channel_id: context.params.event.channel_id
  });
}