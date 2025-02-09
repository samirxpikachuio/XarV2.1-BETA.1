
// models/userModel.ts
import { Database } from '../database/database';
import { config } from '../database/database';

const db = Database.getInstance(config);

export interface UserData {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  isBot: boolean;
  languageCode?: string;
  ban: Record<string, any>;
  settings: Record<string, any>;
  avatarUrl: string;
  exp: number;
  money: number;
  joinedAt: string;
  messageCount: number;
}

export const userModel = {
  async get(userId: number): Promise<UserData | null> {
    try {
      return await db.getData('users', userId);
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      return null;
    }
  },

  async create(userData: UserData): Promise<UserData> {
    try {
      await db.setData('users', userData.userId, userData);
      return userData;
    } catch (error) {
      console.error(`Error creating user with ID ${userData.userId}:`, error);
      throw error;
    }
  },

  async update(userId: number, updates: Partial<UserData>): Promise<UserData> {
    try {
      const existingData = await this.get(userId);
      if (!existingData) {
        throw new Error(`User with ID ${userId} not found`);
      }
      const updatedData = { ...existingData, ...updates };
      await db.setData('users', userId, updatedData);
      return updatedData;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },

  async delete(userId: number): Promise<void> {
    try {
      await db.deleteData('users', userId);
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },

  async getAll(): Promise<UserData[]> {
    try {
      return await db.getAllData('users');
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  },

  async deleteAll(): Promise<void> {
    try {
      await db.deleteAllData('users');
    } catch (error) {
      console.error('Error deleting all users:', error);
      throw error;
    }
  },

  async getName(userId: number): Promise<string> {
    const user = await this.get(userId);
    return user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Telegram user';
  },

  async findByName(firstName: string, lastName?: string): Promise<UserData | undefined> {
    const allUsers = await this.getAll();
    return allUsers.find(
      (user) => user.firstName === firstName && user.lastName === lastName
    );
  },

  async findByEmail(email: string): Promise<UserData | undefined> {
    const allUsers = await this.getAll();
    return allUsers.find((user) => user.settings.email === email);
  },

  async incrementExp(userId: number, amount: number): Promise<void> {
    const user = await this.get(userId);
    if (user) {
      user.exp += amount;
      await this.update(userId, { exp: user.exp });
    }
  },

  async updateMoney(userId: number, amount: number): Promise<void> {
    const user = await this.get(userId);
    if (user) {
      user.money += amount;
      await this.update(userId, { money: user.money });
    }
  }
};