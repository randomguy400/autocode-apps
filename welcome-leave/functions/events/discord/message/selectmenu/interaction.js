const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const guild_id = context.params.event.guild_id;
const user_id = context.params.event.member.user.id;
const welcome_channel = process.env.welcome_channel;

const roles = [
  '838000988454387752',
  '870663690582638592',
  '842808548453908480',
  '870672504308518922'
]

let mention = `<@!${user_id}>`

let welcome_list = [
  `${mention} just joined! Welcome.`,
  `👋 Hey there ${mention}`,
  `Greetings ${mention}`,
  `Where did you come from ${mention}?`,
  `${mention} has landed. ✈`,
  `${mention} just arrived`,
  `${mention} joined. Sussy 👀`,
  `Ahh ${mention}. We've been expecting you...`
]

let colours = [
  0x0000FF,
  0xFF0000,
  0xFFFF00,
  0xFF6600,
  0x00FF00,
  0x6600FF,
  0x00FFFF,
  0x800080,
  0x008000,
  0x9400D3,
  0xFF7F50
]

const random = Math.floor(Math.random() * welcome_list.length);
const random_colour = Math.floor(Math.random() * colours.length);
  
  let failed_roles = []
  for (let i = 0; i < roles.length; i++) {
    let role = roles[i]
    try {
      await lib.discord.guilds['@0.1.1'].members.roles.update({
        role_id: role,
        user_id,
        guild_id
      });
    }
    catch (e) {
      failed_roles.push(`<@&${role}>`)
    }
  }
  
  if(failed_roles.length) {
    try {
      await lib.discord.users['@0.1.5'].dms.create({
        recipient_id: context.params.event.member.user.id,
        content: `Error while verifying. Contact a member of staff`
      });
    } catch (e) {
      void(0)
    }
    await lib.discord.channels['@0.2.1'].messages.create({
      channel_id: `863414382264451082`,
      content: ` `,
      content: `Error while verifying **${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}**`,
      embed: {
        description: `Failed to add the following roles:`,
        fields: [
          {
            name: `Role(s)`,
            value: failed_roles.toString()
          }
        ]
      }
    });
    return
  }
  let msg = await lib.discord.channels['@0.2.1'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${user_id}> was verified successfully`
  });
  await lib.discord.channels['@0.1.2'].messages.create({
    channel_id: welcome_channel,
    content: welcome_list[random]
  });
  await lib.utils.kv['@0.1.16'].set({
    key: `${guild_id}_${user_id}_roles`,
    value: `none`
  });
  
  let sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  
  await sleep(3000)
  
  await lib.discord.guilds['@0.1.1'].members.roles.destroy({
    role_id: `901439847208742913`,
    user_id,
    guild_id
  });
  
  await lib.discord.channels['@0.2.1'].messages.destroy({
    message_id: msg.id,
    channel_id: context.params.event.channel_id
  });