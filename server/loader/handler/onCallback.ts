// onCallback.ts

import { XarV } from "../../global";
import { messageUtils } from "../../custom/messageUtils";
import { userModel } from '../../../models/userModel';
import { threadModel } from '../../../models/threadModel';

export const handleCallback = async (bot: any, callbackQuery: any) => {
  const [commandName] = callbackQuery.data.split(':');
  const command = XarV.commands.get(commandName);

  if (command && command.onCallback) {
    try {
      const utils = messageUtils(bot, callbackQuery.message);
      await command.onCallback({
        api: bot,
        event: callbackQuery,
        message: {
          ...utils,
          send: (text: string, options = {}) => bot.sendMessage(callbackQuery.message.chat.id, text, options),
          reply: (text: string, options = {}) => bot.sendMessage(callbackQuery.message.chat.id, text, { ...options, reply_to_message_id: callbackQuery.message.message_id }),
          edit: (text: string, options = {}) => bot.editMessageText(text, { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id, ...options }),
        },
        args: callbackQuery.data.split(':').slice(1),
        threadsData: threadModel,
        threadModel,
        usersData: userModel,
        userModel,
        XarV2: global.XarV2
      });
    } catch (error) {
      console.error(`Error executing onCallback for command "${commandName}":`, error);
      bot.answerCallbackQuery(callbackQuery.id, { text: "An error occurred while processing your request." });
    }
  } else {
    console.error(`No onCallback handler found for command: ${commandName}`);
    bot.answerCallbackQuery(callbackQuery.id, { text: "Invalid callback query." });
  }
};