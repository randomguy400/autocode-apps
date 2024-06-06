const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.2.1'].messages.update({
  message_id: `901539622369263707`,
  channel_id: `901524624267939870`,
  content: ` `,
  embed: {
    title: `Select \`Verify\` to verify into the server.`,
    description: `If you have joined before, you shouldn't be required to verify. Your roles should be given back to you`,
    fields: [
      {
        name: `❓ Need help`,
        value: `DM anyone with Administrator or CWS role`,
      },
    ],
    color: 0x00FF00
  },
  components: [
    {
      type: 1,
      components: [
        {
          custom_id: `verify`,
          placeholder: `Menu`,
          options: [
            {
              label: `Verify`,
              value: `verify`,
              description: `Complete verification`,
              emoji: {
                id: `828994944462749706`,
                name: `pepegun`,
                animated: false,
              },
              default: false,
            },
          ],
          min_values: 1,
          max_values: 1,
          type: 3,
        },
      ],
    },
  ],
});