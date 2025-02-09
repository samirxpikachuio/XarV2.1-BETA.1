import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { loadFile, loadAll, unload, installCmd, load } from "../../server/loader/loadCommands";

export const XarV2 = {
  config: {
    name: "cmd",
    aliases: ["cm"],
    version: "1.0",
    author: "Assistant",
    countDown: 5,
    role: 2,
    description: "Manage bot commands - install, load, unload, and load all",
    category: "system",
    guide: "{pn} <install|load|unload|loadall> [command name or URL]",
    usePrefix: true
  },
  onStart: async ({ api, event, args, message, cmd }) => {
    const action = args[0]?.toLowerCase();
    const commandName = args[1];

    switch (action) {
      case "install":
        if (args.length < 3) {
          return message.reply("Please provide both filename and code/URL for installation.");
        }
        const fileName = args[1];
        const input = args.slice(2).join(" ");
        const result = await installCmd(fileName, input, api);
        return message.reply(result);

      case "load":
        if (!commandName) {
          return message.reply("Please specify a command name to load.");
        }
        const loadResult = await load(commandName, api);
        return message.reply(loadResult);

      case "unload":
        if (!commandName) {
          return message.reply("Please specify a command name to unload.");
        }
        const unloaded = unload(commandName, api);
        return message.reply(unloaded ? `Command ${commandName} unloaded successfully.` : `Failed to unload ${commandName}.`);

      case "loadall":
        const count = loadAll(api);
        return message.reply(count);

      default:
        return message.reply("Invalid action. Use install, load, unload, or loadall.");
    }
  }
};