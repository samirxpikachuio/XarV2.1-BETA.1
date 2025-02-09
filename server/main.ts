//server/main.ts

import TelegramBot from "node-telegram-bot-api";
import { join } from "path";
import { loadCommands } from "./loader/loadCommands";

import './global.js';
import { userModel } from '../models/userModel';
import { threadModel } from '../models/threadModel';
import type { UserData } from '../models/userModel';
import type { ThreadData } from '../models/threadModel';
import { config } from '../database/database';
import { Database } from '../database/database';

interface TelegramBotWithPrefix extends TelegramBot {
  prefix: string;
}

const token = config.botToken;
if (!token) {
  throw new Error("Bot token is missing in config.json");
}

const prefix = config.botPrefix || "/";
const adminIds = config.ADMIN_IDS || [];
const ownerId = config.OWNER_ID;

const db = Database.getInstance(config);

let bot: TelegramBotWithPrefix = new TelegramBot(token, { polling: true }) as TelegramBotWithPrefix;
bot.prefix = prefix;
(global as any).bot = bot;

loadCommands(bot);


let messageCount: { [userId: number]: number } = {};

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from?.id;

    if (userId === undefined) {

      return;
    }

    await handleUser(userId, msg);

    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
      await handleGroupChat(chatId, userId, msg);
      await updateThreadCount(chatId, userId, msg);
    }

    await handleMessageCount(userId);

  } catch (error) {

  }
});

async function handleUser(userId: number, msg: TelegramBot.Message) {
  const userData: UserData = {
    userId: userId,
    firstName: msg.from?.first_name || '',
    lastName: msg.from?.last_name,
    username: msg.from?.username,
    isBot: msg.from?.is_bot || false,
    languageCode: msg.from?.language_code,
    ban: {},
    settings: {},
    avatarUrl: await getUserAvatar(userId),
    exp: 0,
    money: 0,
    joinedAt: new Date().toISOString()
  };

  const existingUser = await userModel.get(userId);
  if (!existingUser) {
    await userModel.create(userData);
  } else {
    const updatedData = { ...existingUser, ...userData };
    if (JSON.stringify(existingUser) !== JSON.stringify(updatedData)) {
      await userModel.update(userId, updatedData);
    }
  }
}

async function handleGroupChat(chatId: number, userId: number, msg: TelegramBot.Message) {
  let existingThread = await threadModel.get(chatId);
  if (!existingThread) {
    const threadData: ThreadData = {
      threadId: chatId,
      title: msg.chat.title || '',
      prefix: prefix,
      threadImage: await getThreadImage(chatId),
      threadAdmins: [],
      members: [],
      count: [],
      settings: {},
      games: {},
      createdAt: new Date().toISOString()
    };
    await threadModel.create(threadData);
  } else {
    existingThread.title = msg.chat.title || existingThread.title;
    existingThread.threadImage = await getThreadImage(chatId) || existingThread.threadImage;
    await threadModel.update(chatId, existingThread);
  }

  await threadModel.addMember(chatId, userId, `${msg.from?.first_name} ${msg.from?.last_name || ''}`.trim());
}

async function handleMessageCount(userId: number) {
  messageCount[userId] = (messageCount[userId] || 0) + 1;

  if (messageCount[userId] % 100 === 0) {
    const expGain = 10;
    await userModel.incrementExp(userId, expGain);

    const user = await userModel.get(userId);
    if (user) {
      const newExp = user.exp + expGain;
      const newMoney = Math.floor(newExp / 100) * 10;
      await userModel.update(userId, { exp: newExp, money: newMoney });
    }
  }
}

async function getUserAvatar(userId: number): Promise<string> {
  try {
    const userProfile = await bot.getUserProfilePhotos(userId, { limit: 1 });
    if (userProfile.photos.length > 0) {
      const fileId = userProfile.photos[0][0].file_id;
      return fileId;
    }
  } catch (error) {

  }
  return '';
}

async function getThreadImage(chatId: number): Promise<string> {
  try {
    const chat = await bot.getChat(chatId);
    if ('photo' in chat && chat.photo) {
      return chat.photo.big_file_id;
    }
  } catch (error) {

  }
  return '';
}

async function updateThreadCount(chatId: number, userId: number, msg: TelegramBot.Message) {
  let existingThread = await threadModel.get(chatId);
  if (existingThread) {
    if (!existingThread.count) {
      existingThread.count = [];
    }

    const userCountIndex = existingThread.count.findIndex((c: any) => c.senderID === userId);
    if (userCountIndex !== -1) {
      existingThread.count[userCountIndex].count += 1;
    } else {
      existingThread.count.push({ username: msg.from?.username, senderID: userId, count: 1 });
    }

    await threadModel.update(chatId, existingThread);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.emitWarning = (warning, type) => {
  if (type !== 'DeprecationWarning') {
    console.warn(warning);
  }
};

process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}\n${err.stack}`, "red");
});


export type { TelegramBotWithPrefix };

