const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let start = new Date()

const guild_id = '806515698041749594'

let find_members = await lib.discord.guilds['@0.1.0'].members.list({
  guild_id,
  limit: 100
});

for (let i = 0; i < find_members.length; i++) {
  let user = find_members[i]
  if(user.user.bot !== true) {
    if(!user.roles.length) {
      await lib.utils.kv['@0.1.16'].set({
        key: `${guild_id}_${user.user.id}_roles`,
        value: `none`
      });
    }
    else {
      await lib.utils.kv['@0.1.16'].set({
        key: `${guild_id}_${user.user.id}_roles`,
        value: user.roles
      });
    }
    let result = await lib.utils.kv['@0.1.16'].get({
      key: `${guild_id}_${user.user.id}_roles`
    });
  }
}
  
let finish = new Date()

console.log(`Finished saving members' roles for Random's World in ${finish-start}ms!`)