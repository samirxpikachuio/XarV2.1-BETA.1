const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

export const XarV2 = {
    config: {
      name: "autodl",
      aliases: [],
      version: "1.0",
      author: "Samir Œ",
      countDown: 15,
      role: 0,
      description: "Guess the right box to win!",
      category: "game",
      guide: "{pn}",
      usePrefix: false
    },
    onChat: async ({ message, event , api , msg }) => {
    const messageText = event.link_preview_options?.url || event.text || "";

  try {
    if (
      messageText.startsWith("https://vt.tiktok.com") ||
      messageText.startsWith("https://www.tiktok.com/") ||
      messageText.startsWith("https://www.facebook.com") ||
      messageText.startsWith("https://www.instagram.com/") ||
      messageText.startsWith("https://youtu.be/") ||
      messageText.startsWith("https://youtube.com/") ||
      messageText.startsWith("https://x.com/") ||
      messageText.startsWith("https://twitter.com/") ||
      messageText.startsWith("https://vm.tiktok.com") ||
      messageText.startsWith("https://fb.watch")
    ) {
      const chatId = event.chat.id;
      const messageId = event.message_id;

      const wait = await api.sendMessage(chatId, "⏳ Processing your request...", {
        reply_to_message_id: messageId,
      });
      const waitMId = wait.message_id; 
      const videoPath = path.join(__dirname, "tmp", "video.mp4");

      const { data } = await axios.get(
        `${await baseApiUrl()}/alldl?url=${encodeURIComponent(messageText)}`
      );
      const videoBuffer = (
        await axios.get(data.result, { responseType: "arraybuffer" })
      ).data;

      fs.writeFileSync(videoPath, Buffer.from(videoBuffer, "utf-8"));

 await api.deleteMessage(chatId, waitMId);

      await bot.sendVideo(
        chatId,
        videoPath,
        {
          caption: `heres you video ✅`,
          reply_to_message_id: messageId,
        },
        {
          filename: "video.mp4",
          contentType: "video/mp4",
        },
      );

      fs.unlinkSync(videoPath);
    }
  } catch (error) {
    await api.sendMessage(msg.chat.id, `❎ Error: ${error.message}`);
  }
      return true;
  }
  }
