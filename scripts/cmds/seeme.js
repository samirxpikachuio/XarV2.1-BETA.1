export const XarV2 = {
  config: {
    name: "seeme",
    aliases: ["showpic"],
    version: "1.2",
    author: "Assistant",
    countDown: 5,
    role: 0,
    description: "Ask to see a random picture",
    category: "testing",
    guide: "{pn}seeme",
    usePrefix: true
  },
  onStart: async ({ api, event, message }) => {
    const buttons = [
      [{ text: "Yes", callback_data: "seeme:yes" }],
      [{ text: "No", callback_data: "seeme:no" }]
    ];

    await message.send("Do you want to see a picture?", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  },
  onCallback: async ({ api, event, message, args }) => {
    const answer = args[0];

    if (answer === 'yes') {
     
      const uniqueUrl = `https://picsum.photos/200/300?random=${Date.now()}`;

      await api.sendPhoto(event.message.chat.id, uniqueUrl, {
        caption: "Here's a random picture for you!"
      });

      await api.answerCallbackQuery(event.id, { text: "Sending the picture!" });
    } else {
      await api.answerCallbackQuery(event.id, { text: "Okay, maybe next time!" });
    }

    await message.edit(event.message.text, {
      reply_markup: { inline_keyboard: [] }
    });
  }
};