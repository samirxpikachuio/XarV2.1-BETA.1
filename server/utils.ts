// utils.ts

import { config } from '../database/database';
import { userModel } from '../models/userModel';
import { threadModel } from '../models/threadModel';

export async function isWhitelisted(userId: number, chatId: number): Promise<boolean> {
  if (!config.whitelist.enable) return true;
  return config.whitelist.IDS.includes(userId) || config.whitelist.groups.includes(chatId);
}

export async function isApproved(chatId: number): Promise<boolean> {
  if (!config.Approval.enable) return true;
  return config.Approval.ThreadList.includes(chatId);
}

export async function isBanned(userId: number, chatId: number): Promise<boolean> {
  const user = await userModel.get(userId);
  const thread = await threadModel.get(chatId);
  return config.banned.listuser.includes(userId) || config.banned.listGroup.includes(chatId) ||
         (user && user.ban && user.ban.isBanned) || (thread && thread.ban && thread.ban.isBanned);
}

export async function banUser(userId: number): Promise<void> {
  await userModel.update(userId, { ban: { isBanned: true, reason: "Banned by admin" } });
  config.banned.listuser.push(userId);
}

export async function banGroup(chatId: number): Promise<void> {
  await threadModel.update(chatId, { ban: { isBanned: true, reason: "Banned by admin" } });
  config.banned.listGroup.push(chatId);
}

export async function unbanUser(userId: number): Promise<void> {
  await userModel.update(userId, { ban: { isBanned: false, reason: "" } });
  config.banned.listuser = config.banned.listuser.filter(id => id !== userId);
}

export async function unbanGroup(chatId: number): Promise<void> {
  await threadModel.update(chatId, { ban: { isBanned: false, reason: "" } });
  config.banned.listGroup = config.banned.listGroup.filter(id => id !== chatId);
}