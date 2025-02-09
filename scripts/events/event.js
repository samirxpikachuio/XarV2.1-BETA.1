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

    if (event.text) {
      console.log('Text message:', event.text);
    } else if (event.photo) {
      console.log('Photo received');
    } else if (event.video) {
      console.log('Video received');
    } else if (event.audio) {
      console.log('Audio received');
    } else if (event.document) {
      console.log('Document received');
    } else if (event.sticker) {
      console.log('Sticker received');
    } else if (event.new_chat_members) {
      console.log('New chat member(s) added');
    } else if (event.left_chat_member) {
      console.log('Chat member left');
    }

    // Always return true to allow other commands to process
    return true;
  }
};