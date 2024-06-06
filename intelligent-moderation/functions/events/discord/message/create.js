const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if(context.params.event.content === 'hi') {
  await lib.discord.channels['@0.2.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `hi to you too!`
  });
}