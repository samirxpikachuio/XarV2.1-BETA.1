// database/databases/sqliteDatabase.ts

import { Database as SQLiteDatabase } from 'bun:sqlite';
import type { Config } from '../config';
import type { DatabaseInterface, TableType } from '../database';

export class SqliteDatabase implements DatabaseInterface {
  private sqliteDb: SQLiteDatabase;

  constructor(config: Config) {
    this.sqliteDb = new SQLiteDatabase('database.sqlite');
    this.init();
  }

  private init() {
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY, 
        firstName TEXT, 
        lastName TEXT, 
        username TEXT, 
        isBot INTEGER, 
        avatarUrl TEXT, 
        exp INTEGER DEFAULT 0, 
        money INTEGER DEFAULT 0, 
        joinedAt TEXT, 
        settings TEXT DEFAULT '{}',
        ban TEXT DEFAULT '{}'
      );
      CREATE TABLE IF NOT EXISTS threads (
        threadId INTEGER PRIMARY KEY, 
        title TEXT, 
        prefix TEXT, 
        threadImage TEXT, 
        threadAdmins TEXT DEFAULT '[]',
        members TEXT DEFAULT '[]',
        count TEXT DEFAULT '[]',
        settings TEXT DEFAULT '{}',
        games TEXT DEFAULT '{}',
        createdAt TEXT
      );
    `);
  }

  async getData(table: TableType, id: number): Promise<any> {
    const result = this.sqliteDb.prepare(`SELECT * FROM ${table} WHERE ${table === 'users' ? 'userId' : 'threadId'} = ?`).get(id);
    if (!result) return null;

    if (table === 'users') {
      result.settings = JSON.parse(result.settings);
      result.ban = JSON.parse(result.ban);
    } else {
      result.threadAdmins = JSON.parse(result.threadAdmins);
      result.members = JSON.parse(result.members);
      result.count = JSON.parse(result.count);
      result.settings = JSON.parse(result.settings);
      result.games = JSON.parse(result.games);
    }

    return result;
  }

  async setData(table: TableType, id: number, data: any): Promise<void> {
    const tableColumns = table === 'users'
      ? 'userId, firstName, lastName, username, isBot, avatarUrl, exp, money, joinedAt, settings, ban'
      : 'threadId, title, prefix, threadImage, threadAdmins, members, count, settings, games, createdAt';

    const columnCount = table === 'users' ? 11 : 10;
    const placeholders = Array(columnCount).fill('?').join(', ');

    const values = table === 'users'
      ? [
          id,
          data.firstName || null,
          data.lastName || null,
          data.username || null,
          data.isBot !== undefined ? Number(data.isBot) : null,
          data.avatarUrl || null,
          data.exp !== undefined ? Number(data.exp) : 0,            
          data.money !== undefined ? Number(data.money) : 0,        
          data.joinedAt || null,
          JSON.stringify(data.settings || {}),                     
          JSON.stringify(data.ban || {})                       
        ]
      : [
          id,
          data.title || null,
          data.prefix || null,
          data.threadImage || null,
          JSON.stringify(data.threadAdmins || []),                  
          JSON.stringify(data.members || []),                      
          JSON.stringify(data.count || []),
          JSON.stringify(data.settings || {}),                     
          JSON.stringify(data.games || {}),                        
          data.createdAt || null
        ];

    this.sqliteDb.prepare(
      `INSERT OR REPLACE INTO ${table} (${tableColumns}) VALUES (${placeholders})`
    ).run(...values);
  }

  async deleteData(table: TableType, id: number): Promise<void> {
    this.sqliteDb.prepare(`DELETE FROM ${table} WHERE ${table === 'users' ? 'userId' : 'threadId'} = ?`).run(id);
  }

  async getAllData(table: TableType): Promise<any[]> {
    const results = this.sqliteDb.prepare(`SELECT * FROM ${table}`).all();
    return results.map(result => {
      if (table === 'users') {
        result.settings = JSON.parse(result.settings);
        result.ban = JSON.parse(result.ban);
      } else {
        result.threadAdmins = JSON.parse(result.threadAdmins);
        result.members = JSON.parse(result.members);
        result.count = JSON.parse(result.count);
        result.settings = JSON.parse(result.settings);
        result.games = JSON.parse(result.games);
      }
      return result;
    });
  }

  async deleteAllData(table: TableType): Promise<void> {
    this.sqliteDb.prepare(`DELETE FROM ${table}`).run();
  }

  async exists(table: TableType, id: number): Promise<boolean> {
    const result = this.sqliteDb.prepare(`SELECT 1 FROM ${table} WHERE ${table === 'users' ? 'userId' : 'threadId'} = ?`).get(id);
    return !!result;
  }

  async create(table: TableType, id: number): Promise<void> {
    const emptyData = table === 'users'
      ? { userId: id, settings: '{}', ban: '{}' }
      : { threadId: id, threadAdmins: '[]', members: '[]', count: '[]', settings: '{}', games: '{}' };

    await this.setData(table, id, emptyData);
  }

  async refresh(table: TableType, id: number): Promise<void> {
    await this.getData(table, id);
  }

  async removeKey(table: TableType, id: number, key: string): Promise<void> {
    const data = await this.getData(table, id);
    if (data && data[key] !== undefined) {
      delete data[key];
      await this.setData(table, id, data);
    }
  }
}