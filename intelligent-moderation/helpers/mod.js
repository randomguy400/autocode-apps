const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const key = process.env

const warns_mute = parseInt(key.warns_mute)
const warns_kick = parseInt(key.warns_kick)
const warns_ban = parseInt(key.warns_ban)

let sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const args = {
  auto: false,
  type: `warn`,
  user_id: `1234`,
  reason: `bad`,
  content: `hi`,
  staff_id: `123`,
  server_name: `Name`
}

class moderation {
  static async mod(event, args, reason, user_id, content, server_name) {
    
    const find = await lib.googlesheets.query['@0.3.0'].select({
      range: `A:F`,
      bounds: 'FULL_RANGE',
      where: [
        {
          'user_id__is': user_id
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      }
    });
    
    let fields
    if(args.auto === true) {
      
      
      fields = [
        {
          name: `❓ Feedback from Auto-Mod`,
          value: reason
        },
        {
          name: `📄 Content blocked`,
          value: `||${args.content}|| in <#${event.channel_id}>`
        }
      ]
    }
    else {
      fields = [
        {
          name: `❓ Reason provided`,
          value: args.reason
        },
        {
          name: `👮‍♂️ Staff member`,
          value: args.staff_id
        }
      ]
    }

    async function warn (event, args) {
      let new_array = []
      
      for (let i = 0; i < find.rows.length; i++) {
        let obj = array[i]
        if(obj.w === true)
        new_array.push(`position:` + i)
      }
    }
    
      fields.push({
        name: `🔢 Total warns`,
        value: new_warns
      })

      let msg = await lib.discord.channels['@0.1.0'].messages.create({
        channel_id: event.channel_id,
        content: ` `,
        embed: {
          description: `<@!${user_id}> was **auto-warned**. They now have \`${new_warns}\` warns`,
          color: 0xFFA500
        },
      })

      try {
      await lib.discord.users['@0.1.4'].dms.create({
        recipient_id: `${user_id}`,
        content: ` `,
        embed: {
          title: `⚡ Moderation Notification | **${server_name}**`,
          description: `You were **auto-warned**`,
          color: 0xFFA500,
          fields,
          timestamp: new Date().toISOString(),
          footer:
            {
              text: `intelligent-moderation by randomguy400`
            }
        },
      })
      } catch(error) {
        void(0)
      }

      await lib.discord.channels['@0.1.0'].messages.create({
        channel_id: `850362767969484800`,
        content: ` `,
        embed: {
          title: `Auto-warned`,
          description: `<@!${user_id}> was **auto-warned**`,
          color: 0xFFA500,
          fields,
          timestamp: new Date().toISOString(),
          footer:
            {
              text: `moderation`
            }
        },
      })
      if(new_warns >= warns_mute) {
        let reason = `Too many violations (reached or exceeded ${warns_mute} warns)`
        await module.exports.mute(event, reason, user_id, content, server_name)
      }
      else if(new_warns >= warns_kick) {
        let reason = `Too many violations (exceeded ${warns_kick} warns)`
        await module.exports.kick(event, reason, user_id, content, server_name)
      }
      else if(new_warns >= warns_ban) {
        let reason = `Too many violations (exceeded ${warns_ban} warns)`
        await module.exports.ban(event, reason, user_id, content, server_name)
      }
      
    sleep(5000)
    
    await lib.discord.channels['@0.2.1'].messages.destroy({
      message_id: msg.id,
      channel_id: event.channel_id
    });
    
  }
  /*
  mod: async (event, reason, user_id, server_name) => {

    let sleep = async (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };
    
    let fields = [
      {
        name: `❓ Feedback from Auto-Mod`,
        value: reason
      },
      {
        name: `📄 Content blocked`,
        value: `||${content}|| in <#${event.channel_id}>`
      }
    ]
    
    let get_user = await lib.discord.guilds['@0.1.0'].members.retrieve({
      user_id,
      guild_id: event.guild_id
    });
    
    let roles = await lib.discord.guilds['@0.1.0'].roles.list({
      guild_id: event.guild_id
    });
    
    let mainRole = roles.find(role => role.name === process.env.main_role);
    let muteRole = roles.find(role => role.name === process.env.mute_role);
    
    try {
      await lib.discord.guilds['@0.1.0'].members.roles.update({
        role_id: muteRole.id,
        user_id,
        guild_id: event.guild_id
      });
      await lib.discord.guilds['@0.1.0'].members.roles.destroy({
        role_id: mainRole.id,
        user_id,
        guild_id: event.guild_id
      });
    } catch (e) {
        if(get_user.user.roles.includes(muteRole.id) && !get_user.user.roles.includes(mainRole.id)) {
          let reason = 'Continuing to break rules, even after mute\n'
          
          await lib.discord.channels['@0.2.1'].messages.create({
            channel_id: event.channel_id,
            content: ` `,
            embed: {
              description: `<@!${user_id}> is already muted. It's kick time 📛`
            }
          });
          await helpers.kick(event, reason, user_id, content, server_name)
          return
          }
          
          else {
            await lib.discord.channels['@0.1.0'].messages.create({
                channel_id: `863414382264451082`,
                content: ` `,
                embed: {
                  title: `Error`,
                  description: `Failed to mute <@!${user_id}> with error code:`,
                  fields: [
                    {
                      name: ` `,
                      value: e.toString()
                    }
                  ]
                },
              })
              return
            }
        }
    let msg = await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: event.channel_id,
      content: ` `,
      embed: {
        description: `<@!${user_id}> was **auto-muted**.`,
        color: 0xFFA500
      },
    })
    
    try {
    await lib.discord.users['@0.1.4'].dms.create({
      recipient_id: `${user_id}`,
      content: ` `,
      embed: {
        title: `⚡ Moderation Notification | **${server_name}**`,
        description: `You were **auto-muted**`,
        color: 0xFFA500,
        fields,
        timestamp: new Date().toISOString(),
        footer:
          {
            text: `moderation`
          }
      },
    })
    } catch(error) {
      void(0)
    }
    
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `850362767969484800`,
      content: ` `,
      embed: {
        title: `Auto-warned`,
        description: `<@!${user_id}> was **auto-muted**`,
        color: 0xFFA500,
        fields,
        timestamp: new Date().toISOString(),
        footer:
          {
            text: `moderation`
          }
      },
    })
    
    sleep(5000)
    
    await lib.discord.channels['@0.2.1'].messages.destroy({
      message_id: msg.id,
      channel_id: event.channel_id
    });
    
  },
  */
};