// models/threadModel.ts
import { Database } from '../database/database';
import { config } from '../database/database';

const db = Database.getInstance(config);

export interface ThreadData {
  threadId: number;
  title: string;
  prefix: string;
  messageCount: number;
  threadImage: string;
  threadAdmins: number[];
  members: { id: number;          fullName: string }[];
  count: { username: string | undefined; senderID: number;      count: number }[];
  settings: Record<string, any>;
  games: Record<string, any>;
  createdAt: string;
  
}

export const threadModel = {
  async get(threadId: number): Promise<ThreadData | null> {
    try {
      return await db.getData('threads', threadId);
    } catch (error) {
      console.error(`Error fetching thread with ID ${threadId}:`, error);
      return null;
    }
  },

  async getAll(): Promise<ThreadData[]> {
    try {
      return await db.getAllData('threads');
    } catch (error) {
      console.error('Error fetching all threads:', error);
      return [];
    }
  },

  async create(threadData: ThreadData): Promise<ThreadData> {
    try {
      await db.setData('threads', threadData.threadId, threadData);
      return threadData;
    } catch (error) {
      console.error(`Error creating thread with ID ${threadData.threadId}:`, error);
      throw error;
    }
  },

  async update(threadId: number, updates: Partial<ThreadData>): Promise<ThreadData> {
    try {
      const existingData = await this.get(threadId);
      if (!existingData) {
        throw new Error(`Thread with ID ${threadId} not found.`);
      }
      const updatedData = { ...existingData, ...updates };
      await db.setData('threads', threadId, updatedData);
      return updatedData;
    } catch (error) {
      console.error(`Error updating thread with ID ${threadId}:`, error);
      throw error;
    }
  },

  async delete(threadId: number): Promise<void> {
    try {
      await db.deleteData('threads', threadId);
    } catch (error) {
      console.error(`Error deleting thread with ID ${threadId}:`, error);
      throw error;
    }
  },

  async getThreads(threadIds: number[]): Promise<ThreadData[]> {
    try {
      const threads = await Promise.all(
        threadIds.map(id => this.get(id))
      );
      return threads.filter((thread): thread is ThreadData => thread !== null);
    } catch (error) {
      console.error('Error fetching multiple threads:', error);
      throw error;
    }
  },

  async addMember(threadId: number, userId: number, fullName: string): Promise<void> {
    const thread = await this.get(threadId);
    if (!thread) throw new Error(`Thread with ID ${threadId} not found.`);

    if (!thread.members.some(member => member.id === userId)) {
      thread.members.push({ id: userId, fullName });
      await this.update(threadId, { members: thread.members });
    }
  },

  async incrementUserCount(threadId: number, userId: number, username?: string): Promise<void> {
    const thread = await this.get(threadId);
    if (!thread) throw new Error(`Thread with ID ${threadId} not found.`);

    const userCountIndex = thread.count.findIndex(c => c.senderID === userId);
    if (userCountIndex !== -1) {
      thread.count[userCountIndex].count++;
    } else {
      thread.count.push({ username, senderID: userId, count: 1 });
    }

    await this.update(threadId, { count: thread.count });
  }
};
