import axios from 'axios';

export const messageUtils = (bot, msg) => {
  const translate = async (text, lang = 'en') => {
    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
      return response.data[0][0][0];
    } catch (err) {
      await bot.sendMessage(msg.chat.id, err.message);
      return null;
    }
  };
  return {
    send: async function(text, options = {}) {
      try {
        if (!text) throw new Error("Must include Body");
        if (typeof options !== 'object') options = {};
        return await bot.sendMessage(msg.chat.id, text, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    reply: async function(text, options = {}) {
      try {
        if (!text) throw new Error("Must include Body");
        if (typeof options !== 'object') options = {};
        options['reply_to_message_id'] = msg.message_id;
        return await bot.sendMessage(msg.chat.id, text, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },

    translate: async function(lang = 'en') {
      try {
        const textToTranslate = msg.reply_to_message ? msg.reply_to_message.text : msg.text;
        const translatedText = await translate(textToTranslate, lang);
        if (translatedText) {
          return await this.reply(translatedText);
        }
        return null;
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    unsend: async function(mid, tid) {
      try {
        return await bot.deleteMessage(tid || msg.chat.id, mid || msg.reply_to_message.message_id);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    edit: async function(text, options = {}) {
      try {
        if (!text) throw new Error("Must include Body");
        if (typeof options !== 'object') options = {};
        return await bot.editMessageText(text, {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          ...options
        });
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    stream: async function(filePathOrUrl, caption = '', options = {}) {
      try {
        if (!filePathOrUrl) throw new Error("Must include file path or URL");
        if (typeof options !== 'object') options = {};

        const isUrl = filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://');
        const source = isUrl ? { url: filePathOrUrl } : { source: filePathOrUrl };

        if (filePathOrUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return await bot.sendPhoto(msg.chat.id, source, { caption, ...options });
        } else if (filePathOrUrl.match(/\.(mp4|avi|mov)$/i)) {
          return await bot.sendVideo(msg.chat.id, source, { caption, ...options });
        } else if (filePathOrUrl.match(/\.(mp3|wav|ogg)$/i)) {
          return await bot.sendAudio(msg.chat.id, source, { caption, ...options });
        } else {
          return await bot.sendDocument(msg.chat.id, source, { caption, ...options });
        }
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendLocation: async function(latitude, longitude, options = {}) {
      try {
        return await bot.sendLocation(msg.chat.id, latitude, longitude, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendContact: async function(phoneNumber, firstName, options = {}) {
      try {
        return await bot.sendContact(msg.chat.id, phoneNumber, firstName, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendPoll: async function(question, options, pollOptions = {}) {
      try {
        return await bot.sendPoll(msg.chat.id, question, options, pollOptions);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendSticker: async function(sticker, options = {}) {
      try {
        return await bot.sendSticker(msg.chat.id, sticker, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendAction: async function(action) {
      try {
        return await bot.sendChatAction(msg.chat.id, action);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    },
    forwardMessage: async function(fromChatId, messageId, options = {}) {
      try {
        return await bot.forwardMessage(msg.chat.id, fromChatId, messageId, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendVenue: async function(latitude, longitude, title, address, options = {}) {
      try {
        return await bot.sendVenue(msg.chat.id, latitude, longitude, title, address, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendMediaGroup: async function(media, options = {}) {
      try {
        return await bot.sendMediaGroup(msg.chat.id, media, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    sendAnimation: async function(animation, options = {}) {
      try {
        return await bot.sendAnimation(msg.chat.id, animation, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    pinChatMessage: async function(messageId, options = {}) {
      try {
        return await bot.pinChatMessage(msg.chat.id, messageId, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    unpinChatMessage: async function(messageId) {
      try {
        return await bot.unpinChatMessage(msg.chat.id, messageId);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    leaveChat: async function() {
      try {
        return await bot.leaveChat(msg.chat.id);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    },
    getChatMember: async function(userId) {
      try {
        return await bot.getChatMember(msg.chat.id, userId);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    },
    getChatMembersCount: async function() {
      try {
        return await bot.getChatMembersCount(msg.chat.id);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    },
    getChatAdministrators: async function() {
      try {
        return await bot.getChatAdministrators(msg.chat.id);
      } catch (err) {
        console.error(err.message);
        return null;
      }
    },
    restrictChatMember: async function(userId, permissions, options = {}) {
      try {
        return await bot.restrictChatMember(msg.chat.id, userId, permissions, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    },
    promoteChatMember: async function(userId, privileges, options = {}) {
      try {
        return await bot.promoteChatMember(msg.chat.id, userId, privileges, options);
      } catch (err) {
        await bot.sendMessage(msg.chat.id, err.message);
        return null;
      }
    }
  };
};