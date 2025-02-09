// onChat.ts
import { XarV } from "../../global";
import { messageUtils } from "../../custom/messageUtils";
import { userModel } from '../../../models/userModel';
import { threadModel } from '../../../models/threadModel';

export const handleChat = async (bot: any, event: any) => {
  const utils = messageUtils(bot, event);

  for (const [commandName, command] of XarV.commands.entries()) {
    if (command.onChat) {
      try {
        const shouldContinue = await command.onChat({
          api: bot,
          message: utils,
          event: event,
          threadsData: threadModel,
          threadModel,
          usersData: userModel,
          userModel,
          XarV2: global.XarV2,
        });

        if (shouldContinue === false) {
          break;
        }
      } catch (error) {
        console.error(`Error executing onChat for command "${commandName}":`, error);
      }
    }
  }
};
/*
// NSFW filter example:
export const XarV2 = {
  config: {
    name: "nsfwFilter",
    version: "1.0",
    author: "Your Name",
    cooldowns: 5,
    role: 0,
    shortDescription: "Filter NSFW words",
    longDescription: "Bans users who use NSFW words in chat",
    category: "moderation",
  },
  onChat: async function ({ api, message, event, userModel }) {
    if (event.text) {
      const nsfwWords = ["nsfw1", "nsfw2", "nsfw3"]; // Add your list of NSFW words
      if (nsfwWords.some(word => event.text.toLowerCase().includes(word))) {
        await api.banChatMember(event.chat.id, event.from.id);
        message.reply("User banned for using NSFW language.");
        return false; // Stop processing other commands
      }
    }
    return true; // Continue processing other commands
  }
};
*/