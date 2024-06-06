// Authenticating
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Defining lots of ID's
const guild_id = context.params.event.guild_id;
const user_id = context.params.event.user.id;
let welcome_channel = process.env.welcome_channel;

let retrieve = await lib.discord.guilds['@0.1.0'].members.retrieve({
  user_id: user_id,
  guild_id: guild_id,
});

const mention = `<@!${user_id}>`
// Getting their full username
const username = `${retrieve.user.username}#${retrieve.user.discriminator}`

// By default, it will not work for bots. Simply remove this 'if' statement to disable this
if (context.params.event.user.bot) {
  await lib.discord.guilds['@0.1.1'].members.roles.update({
    role_id: `806519409308336138`,
    user_id,
    guild_id
  });
  return
}

// Checking if user is stored on database
let findroles = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_${user_id}_roles`,
});

// Track invites
let invites_list = await lib.discord.guilds['@0.1.0'].invites.list({
  guild_id: context.params.event.guild_id,
});

let invite = null;

for (let i = 0; i < invites_list.length; i++) {
  
  let previous_uses = await lib.utils.kv['@0.1.16'].get({
    key: `${invites_list[i].code}_invite`,
  });
  if (previous_uses + 1 === invites_list[i].uses) {
    invite = {
      inviter: invites_list[i].inviter.id,
      code: invites_list[i].code
      };
      
    await lib.utils.kv['@0.1.16'].set({
      key: `${invites_list[i].code}_invite`,
      value: invites_list[i].uses,
    });
    break;
  }
}

if (invite) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `864970661449302036`,
    content: ``,
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Invite log`,
        description: '',
        color: 0x0008ff,
        fields: [
          {
            name: `Inviter`,
            value: `<@${invite.inviter}>`,
            inline: true,
          },
          {
            name: `Invited`,
            value: username,
            inline: true,
          },
          {
            name: `Invite link`,
            value: `\`https://discord.gg/${invite.code}\``,
            inline: true,
          },
        ],
        timestamp: `${new Date().toISOString()}`, 
      },
    ],
  });
}

// If user is not on database
if (!findroles) {
  await lib.discord.guilds['@0.1.1'].members.roles.update({
    role_id: `901439847208742913`,
    user_id,
    guild_id
  });
  await lib.discord.users['@0.1.5'].dms.create({
    recipient_id: user_id,
    content: ` `,
    embed: {
      description: `Welcome to **Random's World**! Verify yourself in <#901524624267939870>`,
      fields: [
        {
          name: `💬 Need help?`,
          value: `DM anyone with Administrator or CWS role`        
        }
      ]
    }
  });
  return;
}

const welcome2 = [
  `Hey ${mention}! What brings you back?`,
  `${mention} came back!`,
  `${mention} re-entered the house`,
  `${mention} landed! (again)`,
  `Welcome back ${mention}, you sussy baka`,
  `${mention} came again!`
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

const random = Math.floor(Math.random() * welcome2.length);
const random_colour = Math.floor(Math.random() * colours.length);

// Welcoming user back to the server
await lib.discord.channels['@0.1.2'].messages.create({
  channel_id: welcome_channel,
  content: ` `,
  embed: {
    description: welcome2[random],
    color: colours[random_colour]
  }
});

// Removes them from the leave list

let leave = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_leave`,
});

if (leave) {

  let array = leave;

  if (array.includes(user_id)) {

    for (let i = 0; i < array.length; i++) {
      if (array[i] === user_id) {
        array.splice(i, 1);
      }
    }

    if(!array.length) {
      await lib.utils.kv['@0.1.16'].clear({
        key: `${guild_id}_leave`
      });
    }
    else {
      await lib.utils.kv['@0.1.16'].set({
        key: `${guild_id}_leave`,
        value: array
      });
      let get_leave = await lib.utils.kv['@0.1.16'].get({
        key: `${guild_id}_leave`
      });
    }
  }
}

 if (findroles !== `none`) {
  
    let excludeRoles = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    
    if(excludeRoles) {
      findroles = findroles.filter(item => !excludeRoles.includes(item))
      }
      
    if(findroles.length){
      let failedroles = [];
      for (let i = 0; i < findroles.length; i++) {
        let roleid = findroles[i]
        try {
          await lib.discord.guilds['@0.1.0'].members.roles.update({
            role_id: roleid,
            user_id: user_id,
            guild_id: guild_id
          });

        }
        catch (e) {
          failedroles.push(roleid)

        }
      }
      
      
      if(failedroles.length) {

        await lib.discord.channels['@0.2.0'].messages.create({
          channel_id: welcome_channel,
          content: ` `,
          embed: {
            description: `I failed to give **${username}** the following roles.`,
            fields: [
              {
                name: `Roles`,
                value: failedroles.toString()
              }
            ]
          }
        });
      }
      
    }

}
