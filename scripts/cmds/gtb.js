export const XarV2 = {
  config: {
    name: "guess",
    aliases: ["gtb", "rightbox"],
    version: "1.0",
    author: "Samir Œ",
    countDown: 15,
    role: 0,
    description: "Guess the right box to win!",
    category: "testing",
    guide: "{pn}",
    usePrefix: false
  },
  onStart: async ({ message, event }) => {
    const buttons = [];
    const winningIndex = Math.floor(Math.random() * 6);

    for (let i = 0; i < 6; i++) {
      buttons.push({
        text: `Box ${i + 1}`,
        callback_data: `guess:${i === winningIndex ? 'win' : 'lose'}`
      });
    }

    await message.send("Pick a box!", {
      reply_markup: {
        inline_keyboard: [buttons.slice(0, 3), buttons.slice(3, 6)]
      }
    });
  },
  onCallback: async ({ message, event }) => {
    const [, result] = event.data.split(':');
    const response = result === 'win' ? "You won!" : "Try again!";
    await message.reply(response);
    await message.edit(`${event.message.text}\n\n${response}`);
  }
};
