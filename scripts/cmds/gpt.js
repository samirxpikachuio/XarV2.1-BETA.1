import axios from 'axios';

const API_URL = 'https://www.samirxpikachu.run.place/gpt';

export const XarV2 = {
  config: {
    name: "gpt",
    aliases: ["chatgpt", "ai"],
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    description: "Chat with GPT AI",
    category: "AI",
    guide: "{pn} [message]",
    usePrefix: true 
  }, 
  onStart: async ({ event, message, args, XarV2 }) => {
    if (args.length === 0) {
      return message.send("Please provide a message after /gpt.");
    }

    const userInput = args.join(" ");
    try {
      const response = await axios.get(API_URL, {
        params: { content: userInput }
      });

      if (response.data.message.status === "success") {
        const aiResponse = response.data.message.content;
        const info = await message.send(aiResponse);

        XarV2.onReply.set(info.message_id, {
          commandName: "gpt",
          type: "reply",
          messageID: info.message_id,
          author: event.from.id,
          link: aiResponse,
        });
      } else {
        await message.send("Sorry, I couldn't process your request.");
      }
    } catch (error) {
      console.error(`Failed to get an answer: ${error.message}`);
      message.send(`An error occurred: ${error.message}`);
    }
  },
  onReply: async ({ message, event, args, Reply }) => {
    const { author, type } = Reply;
    if (author != event.from.id) return;

    if (type == "reply") {
      const reply = args.join(" ");
      try {
        const response = await axios.get(API_URL, {
          params: { content: reply }
        });

        if (response.data.message.status === "success") {
          const aiResponse = response.data.message.content;
          const info = await message.send(aiResponse);

          global.XarV2.onReply.set(info.message_id, {
            commandName: "gpt",
            type: "reply",
            messageID: info.message_id,
            author: event.from.id,
            link: aiResponse
          });
        } else {
          await message.send("Sorry, I couldn't process your request.");
        }
      } catch (error) {
        console.error("Error calling GPT API:", error);
        await message.send("An error occurred while processing your request.");
      }
    }
  }
};







