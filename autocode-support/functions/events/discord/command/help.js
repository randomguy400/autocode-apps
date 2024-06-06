// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const question = context.params.event.data.options[0].value.toLowerCase().replace('?', '')
const helper = require('../../../../helpers/limit.js')

let check = await helper.check(context.params.event.member.user.id)

if(!check) return await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
  token: `${context.params.event.token}`,
  content: `<@${context.params.event.member.user.id}> Hold up! You are using this command too often.`
});

let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{}],
  limit: {
    count: 0,
    offset: 0,
  },
});

let results = [];
let phrases = [];


for (let i = 0; i < result.rows.length; i++)
  phrases.push(result.rows[i].fields.phrases.split(', '));
console.log(phrases);
for (let i = 0; i < phrases.length; i++) {
  phrases[i] = phrases[i].filter(item => question.includes(item))
  if(phrases[i].length) results.push(result.rows[i])
}

if (results.length) {
  let embeds = []
  for (let i = 0; i < results.length; i++) {
    if(i === 1 && results.length > 2) {
      embeds.push({
        title: `Q: ${results[i].fields.question}?`,
        description: `A: ${results[i].fields.answer}`,
        fields: [
          {
            name: `🌐 Link`,
            value: results[i].fields.link || 'None provided'
          },
          {
            name: `❓ FAQ link`,
            value: results[i].fields.FAQ || 'None provided'
          }
        ],
        color: 0x00FF00,
        footer: {
          text: `+${results.length - 2} more`
        }
      })
      break
    }
    else
      embeds.push({
      title: `Q: ${results[i].fields.question}?`,
      description: `A: ${results[i].fields.answer}`,
      fields: [
        {
          name: `🌐 Link`,
          value: results[i].fields.link || 'None provided'
        },
        {
          name: `❓ FAQ link`,
          value: results[i].fields.FAQ || 'None provided'
        }
      ],
      color: 0x00FF00
      })
  }
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `<@${context.params.event.member.user.id}>, I found ${results.length} results for \`${question}\``,
    embeds
  });
} 

else
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: ` `,
    embeds: [
      {
        title: `😥 I could not find an answer to your problem. Tips to help you solve it:`,
        description: `⇓`,
        fields: [
          {
            name: `❌ Check the logs of your project for errors`,
            value: `Go to [Your Project] -> View logs (bottom left)`,
          },
          {
            name: `📑 Consult the info channels`,
            value: `Checkout <#936967055587029003>, <#936967093696483361> and <#936967272403197992>`,
          },
          {
            name: `🔎 Search the API documentation.`,
            value: `https://autocode.com/lib`,
          },
          {
            name: `**</>** Looking for existing code that has already been built?`,
            value: `Checkout https://autocode.com/app and https://autocode.com/snippet`,
          },
          {
            name: '`Question reference`',
            value: question
          }
        ],
        color: 0xFF0000
      },
    ],
  });
