import { XarV } from "../../global";
import { messageUtils } from "../../custom/messageUtils";
import { userModel } from '../../../models/userModel';
import { threadModel } from '../../../models/threadModel';

const cooldowns = new Map();

export const handleStart = async (bot: any, msg: any, commandName: string, args: string[]) => {
  const command = XarV.commands.get(commandName) || XarV.commands.get(XarV.aliases.get(commandName));
  if (!command) {
    return;
  }

  const now = Date.now();
  const userCooldowns = cooldowns.get(msg.from.id) || {};
  const lastUsed = userCooldowns[command.config.name] || 0;
  const cooldownTime = (command.config.countDown || 5) * 1000;

  if (now - lastUsed < cooldownTime) {
    bot.sendMessage(msg.chat.id, `Please wait ${Math.ceil((cooldownTime - (now - lastUsed)) / 1000)} seconds before using this command again.`);
    return;
  }

  cooldowns.set(msg.from.id, { ...userCooldowns, [command.config.name]: now });

  const utils = messageUtils(bot, msg);
  try {
    await command.onStart({
      api: bot,
      bot,
      args,
      message: utils,
      event: msg,
      msg,
      threadsData: threadModel,
      threadModel,
      usersData: userModel,
      userModel,
      XarV2: global.XarV2
    });
  } catch (error) {
    console.error(`Error executing command "${commandName}":`, error);
    bot.sendMessage(msg.chat.id, `There was an error executing the command "${commandName}".`);
  }
};