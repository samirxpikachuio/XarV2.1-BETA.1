import axios from 'axios';
import util from 'util';

export const XarV2 = {
  config: {
    name: "eval",
    aliases: ["evaluate", "execute"],
    version: "1.0",
    author: "Assistant",
    countDown: 5,
    role: 2, 
    description: "Evaluate and execute JavaScript code",
    category: "System",
    guide: "{pn} [JavaScript code]",
    usePrefix: false
  },
  onStart: async ({ message, args, event, api, msg,  usersData, threadsData, userModel, threadModel, XarV2 }) => {
    const allowedUsers = ["1472439428"];

    if (!allowedUsers.includes(event.from.id.toString())) {
      return message.reply("You don't have permission to use this command.");
    }

    if (args.length === 0) {
      return message.reply("Please provide JavaScript code to evaluate.");
    }

    const code = args.join(" ");
    let result;

    try {
     
      const context = {
        api,
        event,
        message,
        args,
        usersData,
        threadsData,
        userModel,
        threadModel,
        XarV2
      };

      result = await eval(`(async () => { ${code} })()`);
     
    } catch (error) {
        
        console.error("Error during code evaluation:", error);
        return message.reply("An error occurred while evaluating the code.");
      }

  }
};