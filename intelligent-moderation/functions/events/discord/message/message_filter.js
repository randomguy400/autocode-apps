const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const event = context.params.event 
const content = event.content
const key = process.env

const helpers = require('../../../../helpers/mod.js')

const user_id = event.author.id;

const promotion_channels = key.promotion_channel.split(', ')

// Discord invites

const discord_invites = [
'discord.gg/',
'discordapp.com/invite/', 
'discord.com/invite/', 
'discord.st/', 
"disli.st", 
'discord.gd', 
'disboard.org/server/', 
'discordlist.io/servers/', 
'discord-server.com/', 
'disforge.com/server/', 
'discord.me/'
];

const banned_words = [
  'fuck',
  'bitch' 
  //etc
]

const banned_links = [
  // Add your banned links here
]

let banned_message = false
let message = false

const invites_regex = new RegExp(discord_invites.join('|'), 'gi');
const words_regex = new RegExp(banned_words.join('|'), 'gi');
const links_regex = new RegExp(banned_links.join('|'), 'gi');

if(content.match(words_regex)){
  banned_message = true
  message = 'Posting prohibited words is not allowed'
}

else if (content.match(invites_regex)) {
  const channel = await lib.discord.channels['@0.2.1'].retrieve({
    channel_id: event.channel_id
  });
  
  let allowed = false
  if(promotion_channels = ''){
    allowed = true
  }
  else if(!promotion_channels.includes(channel.name)){
    allowed = true
  }
  if(allowed = true) {
    banned_message = true
    message = 'Discord Invites are not allowed in this channel. Post them in <#840622866965594122>'
  }
}

else if (content.match(links_regex)) {
  banned_message = true
  message = 'This link is banned'
}

if(banned_message === true && message) {
  
  const guild = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: context.params.event.guild_id
  });
  
  let roles = await lib.discord.guilds['@0.1.0'].roles.list({
    guild_id: context.params.event.guild_id
  });
  
  const owner = guild.owner_id
  
  if(user_id === owner) return
  
  await lib.discord.channels['@0.2.1'].messages.destroy({
    message_id: event.id,
    channel_id: event.channel_id
  });
  
  let permissions = false
  
  let authorRoles = roles.filter((role) => {
    return context.params.event.member.roles.indexOf(role.id) > -1
  });
  
  for (let i = 0; i < authorRoles.length ; i++) {
    let role = authorRoles[i];
    permissions = role.permission_names.includes('ADMINISTRATOR');
    if(permissions) return
  }
  
  let args = {
    type: `Auto-warned`,
    reason: message,
    user_id,
    content,
    server_name: guild.name
  }
  
  await helpers.warn(event, args)
  
}