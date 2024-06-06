const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let user_id = context.params.event.user.id;
let guild_id = context.params.event.guild_id;


let retrieve = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_${user_id}_roles`
});

let leave = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_leave`
});

if(leave) {
  if (leave.includes(user_id)) return;
  
  leave.push(user_id)

  await lib.utils.kv['@0.1.16'].set({
    key: `${guild_id}_leave`,
    value: leave
  });
  return
}

await lib.utils.kv['@0.1.16'].set({
  key: `${guild_id}_leave`,
  value: [user_id]
});