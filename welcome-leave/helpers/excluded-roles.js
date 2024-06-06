const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = {
  add: async (user_id, role, guild_id, channel_id) => {
    
    let retrieve = await lib.discord.guilds['@0.1.0'].retrieve({
      guild_id,
    });
    
    var check_role = retrieve.roles.filter(check => (check.id === role));

    if(!check_role.length) {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id,
      content: `<@!${user_id}>`,
      embed: {
        description: `I could not find the specified role in this server`,
        color: 0xFF0000,
        footer: {
          text: `sticky-roles`
        }
      }
    });
    return
    }
    
    if(check_role[0].name === '@everyone'){
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `\`@everyone\` cannot be excluded`,
          color: 0xFF0000,
          footer: {
            text: `sticky-roles`
          }
        }
      });
      return
    }
    
    let find = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    if(!role.includes(`<@&`)){
      role = `<@&${role}>`
    }
    if(find === null) {
      await lib.utils.kv['@0.1.16'].set({
        key: `${guild_id}_excludedroles`,
        value: [role]
      });
    }
    else {
      
      if(find.includes(role)) {
        await lib.discord.channels['@0.2.0'].messages.create({
          channel_id,
          content: `<@!${user_id}>`,
          embed: {
            description: `This role was already added to the exclusion list`,
            color: 0xFF0000,
            footer: {
              text: `sticky-roles`
            }
          }
        });
        return
      }
    
      else {
        find.push(role)
      
        await lib.utils.kv['@0.1.16'].set({
          key: `${guild_id}_excludedroles`,
          value: find
        });
        }
      }
      
      let new_key = await lib.utils.kv['@0.1.16'].get({
        key: `${guild_id}_excludedroles`
      });
      
      new_key = new_key.toString()
      
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id,
      content: `<@!${user_id}>`,
      embed: {
        description: `A role was added to the exclusion list`,
        fields: [
          {
            name: `Role added`,
            value: `${role}`
          },
          {
            name: `Updated list`,
            value: new_key
          }
        ],
        color: 0x00FF00,
        footer: {
          text: `sticky-roles`
        }
      }
    });
  },
  
  
  clear: async (user_id, guild_id, channel_id) => {
    
    let find = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    
    if(find === null) {
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `There are no excluded roles to remove in this guild`,
          color: 0xFF0000,
          footer: {
            text: `sticky-roles`
          }
        }
      });
    }
    else {
      await lib.utils.kv['@0.1.16'].clear({
        key: `${guild_id}_excludedroles`
      });
      
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `The excluded roles list for this server was reset`,
          color: 0x00FF00,
          footer: {
            text: `sticky-roles`
          }
        }
      });
    }
  
  },
  
  list: async (user_id, guild_id, channel_id) => {
    
    let find = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    
    if (find === null ) {
      
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `There are no roles in the sticky roles exclusion list`,
          color: 0xFF0000,
          footer: {
            text: `sticky-roles`
          }
        }
      });
      return
    }
    else {
      let role_list = find.toString()

      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `Here's a full list of roles excluded from sticky roles for this server`,     
          fields: [
            {
              name: `Roles`,
              value: role_list
            },
            {
              name: `ℹ`,
              value: `These roles will not be added back to any user if they rejoin`
            }
          ],
          color: 0x00FF00,
          footer: {
            text: `sticky-roles`
          }
        }
      });
    }
  },
  
  remove: async (user_id, role, guild_id, channel_id) => {
    
    let find = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    
    if(!role.includes(`<@&`)){
      role = `<@&${role}>`
    }
    
    if(find === null) {
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id,
        content: `<@!${user_id}>`,
        embed: {
          description: `There are no excluded roles to remove in this guild`,
          color: 0xFF0000,
          footer: {
            text: `sticky-roles`
          }
        }
      });
      return
    }
    else {
      if(find.length === 1 && find.includes(role)){
        await lib.utils.kv['@0.1.16'].clear({
          key: `${guild_id}_excludedroles`
        });
        find = null
      }
      else{
      
        if(!find.includes(role)) {
          await lib.discord.channels['@0.2.0'].messages.create({
            channel_id,
            content: `<@!${user_id}>`,
            embed: {
              description: `This role was not found in the sticky roles exclusion list`,
              color: 0xFF0000,
              footer: {
                text: `sticky-roles`
              }
            }
          });
          return
        }
      
        for (let i = 0; i < find.length; i++) {
          let roleid = find[i];
          if(roleid === role) {
            const index = find.indexOf(role);
            find.splice(index, 1);
          }
        }
      }
    }

    if(find === null){
      await lib.utils.kv['@0.1.16'].clear({
        key: `${guild_id}_excludedroles`
      });
    }
    else {
      let setvalue = await lib.utils.kv['@0.1.16'].set({
        key: `${guild_id}_excludedroles`,
        value: find
      });

      find = find.toString()
    }
    
    let new_key = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_excludedroles`
    });
    
    if(new_key === null) {
      new_key = `[empty]`
    }
    
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id,
      content: `<@!${user_id}>`,
      embed: {
        description: `A role was removed from the sticky roles exclusion list`,
        fields: [
          {
            name: `Role`,
            value: role
          },
          {
            name: `Updated list`,
            value: new_key
          }
        ],
        color: 0x00FF00,
        footer: {
          text: `sticky-roles`
        }
      }
    });
  }
}