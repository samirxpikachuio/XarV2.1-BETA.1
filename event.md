# Event System Documentation

This document provides an overview of the event system in the XarV2.1 Telegram bot, including event handling processes and available events.

## Event Overview

The event system allows the bot to respond to various user interactions and events. Each event can trigger specific actions or commands.

### Event Structure

Each event is defined as an exported object with the following properties:

- **name**: The name of the event (e.g., "eventLogger").
- **version**: The version of the event (e.g., "1.0").
- **author**: The author of the event (e.g., "Your Name").
- **cooldowns**: The cooldown time in seconds before the event can be processed again.
- **role**: The user role required to trigger the event (e.g., 0 for all users).
- **shortDescription**: A brief description of what the event does.
- **longDescription**: A detailed description of the event's functionality.
- **category**: The category under which the event falls (e.g., "utility").

### Event Handling

The event handling function (e.g., `onChat`) processes incoming events. It receives an object with the following properties:
- **api**: The API object for sending messages and interacting with the Telegram API.
- **message**: The message object for replying to the user.
- **event**: The event object containing information about the incoming event.

### Example Event

Here is an example of an event structure:

```javascript
export const XarV2 = {
  config: {
    name: "eventLogger",
    version: "1.0",
    author: "Your Name",
    cooldowns: 5,
    role: 0,
    shortDescription: "Log all events",
    longDescription: "Logs all incoming events for monitoring purposes",
    category: "utility",
  },
  onChat: async function ({ api, message, event }) {
    console.log('Received event:', event);
    // Additional event handling logic
    return true;
  }
};
```

## Creating New Events

To create a new event:
1. Create a new JavaScript file in the `scripts/events/` directory.
2. Define the event configuration object as shown above.
3. Implement the event handling function to process the event's functionality.
4. Export the event object.
