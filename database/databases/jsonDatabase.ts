// database/databases/jsonDatabase.ts

import fs from 'fs/promises';
import path from 'path';
import type { Config } from '../config';

interface DatabaseData {
  [key: number]: any;
}

export class JsonDatabase {
  private dataDir: string;

  constructor(config: Config) {
    this.dataDir = path.join(import.meta.dir, 'data');
    fs.mkdir(this.dataDir, { recursive: true });
  }

  async getData(table: string, id: number): Promise<any> {
    const filePath = path.join(this.dataDir, `${table}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsedData: DatabaseData = JSON.parse(data);
      return parsedData[id] || null;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  async setData(table: string, id: number, data: any): Promise<void> {
    const filePath = path.join(this.dataDir, `${table}.json`);
    let fileData: DatabaseData = {};
    try {
      const existingData = await fs.readFile(filePath, 'utf-8');
      fileData = JSON.parse(existingData);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    fileData[id] = data;
    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
  }

  async deleteData(table: string, id: number): Promise<void> {
    const filePath = path.join(this.dataDir, `${table}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const fileData: DatabaseData = JSON.parse(data);
      delete fileData[id];
      await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }

  async getAllData(table: string): Promise<any[]> {
    const filePath = path.join(this.dataDir, `${table}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsedData: DatabaseData = JSON.parse(data);
      return Object.values(parsedData);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  async deleteAllData(table: string): Promise<void> {
    const filePath = path.join(this.dataDir, `${table}.json`);
    await fs.writeFile(filePath, JSON.stringify({}));
  }

  
  async exists(table: string, id: number): Promise<boolean> {
    const data = await this.getData(table, id);
    return data !== null;
  }

  async create(table: string, id: number): Promise<void> {
    
    await this.setData(table, id, {});
  }

  async refresh(table: string, id: number): Promise<void> {
    
    const existingData = await this.getData(table, id);
    if (existingData) {
      await this.setData(table, id, { ...existingData }); 
    } else {
      await this.create(table, id); 
    }
  }

  async removeKey(table: string, id: number, key: string): Promise<void> {
    const data = await this.getData(table, id);
    if (data) {
      delete data[key];
      await this.setData(table, id, data);
    }
  }
}
