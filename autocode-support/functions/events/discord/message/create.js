// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let code_detect = require('lang-detector')

content = context.params.event.content.toLowerCase()

// Gives a motivational reaction when someone's code works
if(['it works', 'works now', 'it worked'].some(word => content.includes(word)) && content.replace(/[^a-zA-Z]+/g, '').length < 15)
  return await lib.discord.channels['@0.3.0'].messages.reactions.create({
    emoji: `<:firaga:837125081763282955>`,
    message_id: `${context.params.event.id}`,
    channel_id: `${context.params.event.channel_id}`
  });
  
// Checks code is sent in code blocks
else if(await code_detect(content) === 'JavaScript' && content.split(/\r\n|\r|\n/).length > 5 && !content.includes('```') && content)
  return await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ` `,
    embed: {
      title: `Hey there **${context.params.event.author.username}**, use codeblocks like this`,
      description: "",
      color: 0x00FFFF,
      image: {
        url: `https://i.imgur.com/OSy048y.gif`,
        height: 0,
        width: 0
      }
    },
    message_reference: {
      message_id: context.params.event.id
    }
  });
  
// Detect if it's a question
/*
async function validify () {
  if(content.endsWith('?') && ['what', 'how', 'when', 'where', 'why', 'who'].some(word => content.startsWith(word))) 
    return true
  else return false
}

let question = await validify()

if(!question) return
*/
