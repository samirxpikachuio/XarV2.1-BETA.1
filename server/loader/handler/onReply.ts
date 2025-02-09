import { XarV } from "../../global";
import { messageUtils } from "../../custom/messageUtils";
import { userModel } from '../../../models/userModel';
import { threadModel } from '../../../models/threadModel';

export const handleReply = async (bot: any, msg: any) => {
  if (msg.reply_to_message) {
    const replyData = global.XarV2.onReply.get(msg.reply_to_message.message_id);
    if (replyData) {
      const command = XarV.commands.get(replyData.commandName);
      if (command && command.onReply) {
        const utils = messageUtils(bot, msg);
        try {
          await command.onReply({
            api: bot,
            args: [msg.text],
            message: utils,
            event: msg,
            threadsData: threadModel,
            threadModel,
            usersData: userModel,
            userModel,
            XarV2: global.XarV2,
            Reply: replyData
          });
        } catch (error) {
          console.error(`Error executing onReply for command "${replyData.commandName}":`, error);
          bot.sendMessage(msg.chat.id, `There was an error processing your reply for the command "${replyData.commandName}".`);
        }
        return true;
      }
    }
  }
  return false;
};