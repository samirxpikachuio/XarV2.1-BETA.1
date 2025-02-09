 import axios from 'axios';

export const XarV2 = {
  config: {
    name: "flux",
    aliases: ["generate", "img"],
    version: "1.0",
    author: "Assistant",
    countDown: 15,
    role: 0,
    description: "Generate an image using AI based on a prompt",
    category: "image",
    guide: "{pn} <prompt>",
    usePrefix: true
  },
  onStart: async({ api, event, args, message, cmd }) => {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage(event.chat.id, "Please provide a prompt for the image generation.");
    }

    await api.sendMessage(event.chat.id, "Generating image, please wait...");

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const response = await axios.get(`https://www.samirxpikachu.run.place/demonic?prompt=${encodedPrompt}&size=1:3`, {
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data);

      return api.sendPhoto(event.chat.id, imageBuffer, {
        caption: "Here's your generated image:"
      });
    } catch (error) {
      console.error("Error generating image:", error);
      return api.sendMessage(event.chat.id, "An error occurred while generating the image. Please try again later.");
    }
  }
};