// database/databases/mongodbDatabase.ts

import * as mongoose from 'mongoose';
import { loadConfig } from '../config';
import type { Config } from '../config';

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  isBot: { type: Boolean, default: false },
  avatarUrl: { type: String },
  exp: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  joinedAt: { type: Date },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  ban: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { versionKey: false }); 

const threadSchema = new mongoose.Schema({
  threadId: { type: Number, required: true, unique: true },
  title: { type: String },
  prefix: { type: String },
  threadImage: { type: String },
  threadAdmins: { type: [Number] }, 
  members: { type: [{ id: Number, fullName: String }] }, 
  count: { type: [{ username: String, senderID: Number, count: Number }] },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  games: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false }); 

const User = mongoose.model('User', userSchema);
const Thread = mongoose.model('Thread', threadSchema);

export class MongoDatabase {
  private config!: Config;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.config = await loadConfig(); 

      if (this.config.DATABASE.mongodb.CONNECT_MONGODB) {
        await mongoose.connect(this.config.DATABASE.mongodb.MONGO_URI);
        console.log('MongoDB connected successfully');
      } else {
        console.log('MongoDB connection is disabled in the configuration.');
      }
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  async getData(table: 'users' | 'threads', id: number): Promise<any> {
    if (table === 'users') {
      return await User.findOne({ userId: id }).lean();
    } else {
      return await Thread.findOne({ threadId: id }).lean();
    }
  }

  async setData(table: 'users' | 'threads', id: number, data: any): Promise<void> {
    if (table === 'users') {
      await User.findOneAndUpdate(
        { userId: id },
        { $set: data },
        { upsert: true, new: true }
      );
    } else {
      await Thread.findOneAndUpdate(
        { threadId: id },
        { $set: data },
        { upsert: true, new: true }
      );
    }
  }

  async deleteData(table: 'users' | 'threads', id: number): Promise<void> {
    if (table === 'users') {
      await User.deleteOne({ userId: id });
    } else {
      await Thread.deleteOne({ threadId: id });
    }
  }

  async getAllData(table: 'users' | 'threads'): Promise<any[]> {
    if (table === 'users') {
      return await User.find({}).lean();
    } else {
      return await Thread.find({}).lean();
    }
  }

  async deleteAllData(table: 'users' | 'threads'): Promise<void> {
    if (table === 'users') {
      await User.deleteMany({});
    } else {
      await Thread.deleteMany({});
    }
  }

  // Additional Methods
  async exists(table: 'users' | 'threads', id: number): Promise<boolean> {
    if (table === 'users') {
      return await User.exists({ userId: id }) != null;
    } else {
      return await Thread.exists({ threadId: id }) != null;
    }
  }

  async create(table: 'users' | 'threads', id: number): Promise<void> {
    if (table === 'users') {
      await User.create({ userId: id });
    } else {
      await Thread.create({ threadId: id });
    }
  }

  async refresh(table: 'users' | 'threads', id: number): Promise<void> {
    if (table === 'users') {
      await User.updateOne({ userId: id }, { $set: { updatedAt: new Date() } });
    } else {
      await Thread.updateOne({ threadId: id }, { $set: { updatedAt: new Date() } });
    }
  }

  async removeKey(table: 'users' | 'threads', id: number, key: string): Promise<void> {
    if (table === 'users') {
      await User.updateOne({ userId: id }, { $unset: { [key]: "" } });
    } else {
      await Thread.updateOne({ threadId: id }, { $unset: { [key]: "" } });
    }
  }
}
