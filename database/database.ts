// database/database.ts

import type { Config } from './config.ts'; 
import { JsonDatabase } from './databases/jsonDatabase.ts';
import { SqliteDatabase } from './databases/sqliteDatabase.ts';
import { MongoDatabase } from './databases/mongodbDatabase.ts';
import fs from 'fs/promises';
import path from "path";

export const config = JSON.parse(await fs.readFile(path.join(import.meta.dir, '..', 'config.json'), 'utf-8'));

export type DatabaseType = 'json' | 'sqlite' | 'mongodb';
export type TableType = 'users' | 'threads';

export interface DatabaseInterface {
  getData(table: TableType, id: number): Promise<any>;
  setData(table: TableType, id: number, data: any): Promise<void>;
  deleteData(table: TableType, id: number): Promise<void>;
  getAllData(table: TableType): Promise<any[]>;
  deleteAllData(table: TableType): Promise<void>;
  exists(table: TableType, id: number): Promise<boolean>;
  create(table: TableType, id: number): Promise<void>;
  refresh(table: TableType, id: number): Promise<void>;
  removeKey(table: TableType, id: number, key: string): Promise<void>;
}

export class Database {
  private static instance: Database;
  private db: DatabaseInterface;

  private constructor(config: Config) {
    this.db = this.createDatabaseInstance(config);
  }

  private createDatabaseInstance(config: Config): DatabaseInterface {
    switch (this.getDatabaseType(config)) {
      case 'json':
        return new JsonDatabase(config);
      case 'sqlite':
        return new SqliteDatabase(config);
      case 'mongodb':
        return new MongoDatabase();
    }
  }

  private getDatabaseType(config: Config): DatabaseType {
    if (config.DATABASE.json.CONNECT_JSON) return 'json';
    if (config.DATABASE.sqlite.CONNECT_SQLITE) return 'sqlite';
    if (config.DATABASE.mongodb.CONNECT_MONGODB) return 'mongodb';
    throw new Error('No database connection specified in config.json');
  }

  public static getInstance(config: Config): Database {
    if (!Database.instance) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  async getData(table: TableType, id: number): Promise<any> { 
    return this.db.getData(table, id);
  }

  async setData(table: TableType, id: number, data: any): Promise<void> {
    return this.db.setData(table, id, data);
  }

  async deleteData(table: TableType, id: number): Promise<void> {
    return this.db.deleteData(table, id);
  }

  async getAllData(table: TableType): Promise<any[]> {
    return this.db.getAllData(table);
  }

  async deleteAllData(table: TableType): Promise<void> {
    return this.db.deleteAllData(table);
  }

  async exists(table: TableType, id: number): Promise<boolean> {
    return this.db.exists(table, id);
  }

  async create(table: TableType, id: number): Promise<void> {
    return this.db.create(table, id);
  }

  async refresh(table: TableType, id: number): Promise<void> {
    return this.db.refresh(table, id);
  }

  async removeKey(table: TableType, id: number, key: string): Promise<void> {
    return this.db.removeKey(table, id, key);
  }
}