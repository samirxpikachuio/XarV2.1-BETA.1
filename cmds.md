# Command Structure Guide

This document provides a guide on how to create commands for the XarV2.1 Telegram bot, including the structure and necessary components.

## Command Structure

Each command is defined as an exported object with the following properties:

### Configuration Object
- **name**: The name of the command (e.g., "cmd").
- **aliases**: An array of alternative names for the command (e.g., ["cm"]).
- **version**: The version of the command (e.g., "1.0").
- **author**: The author of the command (e.g., "Assistant").
- **countDown**: The cooldown time in seconds before the command can be used again (e.g., 5).
- **role**: The user role required to execute the command (e.g., 0 for all users).
- **description**: A brief description of what the command does (e.g., "Manage bot commands").
- **category**: The category under which the command falls (e.g., "system").
- **guide**: A string that describes how to use the command, including any parameters (e.g., "{pn} <install|load|unload> [command name]").
- **usePrefix**: A boolean indicating whether the command requires a prefix (e.g., true).

### onStart Function
The `onStart` function is an asynchronous function that handles the command's functionality. It receives an object with the following properties:
- **api**: The API object for sending messages and interacting with the Telegram API.
- **event**: The event object containing information about the incoming message.
- **message**: The message object for replying to the user.
- **args**: An array of arguments passed to the command.
- **other dependencies**: Any other dependencies required for the command's functionality.

### Example Command
Here is an example of a simple command structure:

```javascript
export const XarV2 = {
  config: {
    name: "example",
    aliases: ["ex"],
    version: "1.0",
    author: "Your Name",
    countDown: 5,
    role: 0,
    description: "An example command.",
    category: "utility",
    guide: "{pn} [args]",
    usePrefix: true
  },
  onStart: async ({ api, event, message, args }) => {
    // Command functionality goes here
    await message.reply("This is an example command!");
  }
};
```

## Creating New Commands
To create a new command:
1. Create a new JavaScript file in the `scripts/cmds/` directory.
2. Define the command configuration object as shown above.
3. Implement the `onStart` function to handle the command's functionality.
4. Export the command object.
