// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const guild_id = context.params.event.guild_id;

const roles = context.params.event.roles;
const welcome_channel = process.env.welcome_channel;
const user_id = context.params.event.user.id;

// Query for the user
let finduser = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_${user_id}_roles`
});

// Check if they left the server
let check_leave = await lib.utils.kv['@0.1.16'].get({
  key: `${guild_id}_leave`
});

if(check_leave) {
  if (check_leave.includes(user_id)) return
}


if(roles.length) {
  let mentionable = []
  for (let i = 0; i < roles.length; i++) {
    let id = roles[i]
    mentionable.push(`<@&${id}>`)
  }
  await lib.utils.kv['@0.1.16'].set({
    key: `${guild_id}_${user_id}_roles`,
    value: mentionable
  });
  let rolekey = await lib.utils.kv['@0.1.16'].get({
    key: `${guild_id}_${user_id}_roles`
  });
}

else {
  
  await lib.utils.kv['@0.1.16'].set({
    key: `${guild_id}_${user_id}_roles`,
    value: `none`
  });
}