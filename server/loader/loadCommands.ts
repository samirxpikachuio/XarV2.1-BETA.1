import { XarV, logger } from "../global";
declare module "../global" {
  interface XarV {
    onReply: Map<any, any>;
  }
}
import { readdirSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { handleStart } from "./handler/onStart";
import { handleReply } from "./handler/onReply";
import { handleCallback } from "./handler/onCallback";
import { handleChat } from "./handler/onChat";
import { config } from '../../database/database';

declare global {
  var XarV2: {
    onReply: Map<any, any>;
  };
  var cmds: Map<string, any>;
  var XarV: {
    commands: any;
    aliases: any;
    commandFilesPath: any;
    onReply: Map<any, any>;
  };
}

if (!global.XarV) {
  global.XarV = {
    commands: new Map(),
    aliases: new Map(),
    commandFilesPath: [],
    onReply: new Map()
  };
}

global.cmds = new Map();

let errors = 0;
let loadedCommands = 0;
const failedCommands: string[] = [];
const commandNames = new Set<string>();

const scriptsPath = join(import.meta.dir, "..", "..", "scripts", "cmds");

export const loadAll = (bot: any) => {
  try {
    XarV.commands.clear();
    XarV.aliases.clear();
    global.cmds.clear();
    commandNames.clear();

    loadedCommands = 0;
    errors = 0;
    failedCommands.length = 0;

    loadCommands(bot);

    let statusMessage = `Reloaded all the files.\n`;
    statusMessage += `✅ | Successfully loaded commands.\n`;
    if (failedCommands.length > 0) {
      statusMessage += `❌ | Failed to load ${failedCommands.length} commands: ${failedCommands.join(", ")}\n`;
    }

    return statusMessage;
  } catch (error) {
    console.error("Error reloading all files:", error);
    return `Error occurred while reloading files: ${error}`;
  }
};

export const loadCommands = (bot: any) => {
  try {
    const commandFiles = readdirSync(scriptsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      if (!config.skip.commands.includes(file)) {
        loadFile(join(scriptsPath, file), bot);
      } else {
        console.log(`✅ | Skipping command: ${file}`);
      }
    }
    if (failedCommands.length > 0) {
      console.log(`Failed commands: ${failedCommands.join(", ")}`);
    }

    setupEventHandlers(bot);
  } catch (error) {
    console.error("Error loading commands:", error);
  }
};

export const loadFile = async (filePath: string, bot: any) => {
  try {
    const { XarV2: command } = await import(filePath);
    if (command && command.config) {
      if (command.onStart) {
        XarV.commands.set(command.config.name, command);
        command.config.aliases.forEach((alias: string) => XarV.aliases.set(alias, command.config.name));
        XarV.commandFilesPath.push({ filePath, commandName: [command.config.name, ...command.config.aliases] });
      }
      if (command.onChat) {
        XarV.commands.set(command.config.name, command);
      }
      global.cmds.set(command.config.name, command);
      commandNames.add(command.config.name);
      loadedCommands++;
      let loadconmmandname = command.config.name;
      console.log(`✅ | Loaded command: ${loadconmmandname}`);
    }
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error);
    errors++;
    failedCommands.push(filePath);
  }
};

export const unload = (commandName: string, bot: any) => {
  const command = XarV.aliases.get(commandName);
  if (command) {
    XarV.commands.delete(commandName);
    XarV.aliases.forEach((cmd: string, alias: string) => {
      if (cmd === commandName) XarV.aliases.delete(alias);
    });
    XarV.commandFilesPath = XarV.commandFilesPath.filter((cmd: { commandName: string[] }) => !cmd.commandName.includes(commandName));
    global.cmds.delete(commandName);
    commandNames.delete(commandName);
    return true;
  }
  return false;
};

export const installCmd = async (fileName: string, input: string, bot: any) => {
  try {
    let content: string;
    if (input.startsWith('http')) {
      const response = await fetch(input);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      content = await response.text();
    } else {
      content = input;
    }

    const filePath = join(scriptsPath, fileName);
    writeFileSync(filePath, content);
    await loadFile(filePath, bot);
    return `Installed and loaded command as ${fileName}`;
  } catch (error) {
    console.error(`Error installing command:`, error);
    return `Failed to install command`;
  }
};

export const load = async (commandName: string, bot: any) => {
  const commandFiles = readdirSync(scriptsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = join(scriptsPath, file);
    try {
      const fileContent = readFileSync(filePath, 'utf8');
      if (fileContent.includes(`name: "${commandName}"`)) {
        await loadFile(filePath, bot);
        return `Command ${commandName} loaded successfully.`;
      }
    } catch (error) {
      console.error(`Error checking file ${filePath}:`, error);
    }
  }
  return `Command ${commandName} not found in any file.`;
};

function setupEventHandlers(bot: any) {
  bot.removeAllListeners('message');
  bot.removeAllListeners('photo');
  bot.removeAllListeners('video');
  bot.removeAllListeners('audio');
  bot.removeAllListeners('document');
  bot.removeAllListeners('sticker');
  bot.removeAllListeners('new_chat_members');
  bot.removeAllListeners('left_chat_member');
  bot.removeAllListeners('callback_query');

  bot.on("message", async (msg: any) => {
    await handleChat(bot, msg);
    const messageText = msg.text ? msg.text.trim() : "";
    const prefix = bot.prefix || "/";
    const [cmdText, ...args] = messageText.split(/\s+/);
    let commandName = cmdText;
    let usePrefix = true;
    if (await handleReply(bot, msg)) {
      return;
    }
    if (cmdText.startsWith(prefix)) {
      commandName = cmdText.slice(prefix.length);
    } else {
      usePrefix = false;
    }
    const command = XarV.commands.get(commandName) || XarV.commands.get(XarV.aliases.get(commandName));
    if (!command) {
      if (usePrefix || messageText === prefix) {
        bot.sendMessage(msg.chat.id, `The command you are using does not exist, type ${prefix}help to see all available commands`);
      }
      return;
    }
    if (command.config.usePrefix !== false && !usePrefix) {
      bot.sendMessage(msg.chat.id, `The command you are using does not exist, type ${prefix}help to see all available commands`);
      return;
    }
    await handleStart(bot, msg, commandName, args);
  });

  bot.on("photo", async (msg: any) => await handleChat(bot, msg));
  bot.on("video", async (msg: any) => await handleChat(bot, msg));
  bot.on("audio", async (msg: any) => await handleChat(bot, msg));
  bot.on("document", async (msg: any) => await handleChat(bot, msg));
  bot.on("sticker", async (msg: any) => await handleChat(bot, msg));
  bot.on("new_chat_members", async (msg: any) => await handleChat(bot, msg));
  bot.on("left_chat_member", async (msg: any) => await handleChat(bot, msg));
  bot.on("callback_query", async (msg: any) => await handleCallback(bot, msg));
}

