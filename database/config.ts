// database/config.ts
import fs from 'fs/promises';
import path from 'path';

export interface Config {
  botToken: string;
  botPrefix: string;
  DATABASE: {
    sqlite: {
      CONNECT_SQLITE: boolean;
    };
    mongodb: {
      CONNECT_MONGODB: boolean;
      MONGO_URI: string;
    };
    json: {
      CONNECT_JSON: boolean;
    };
  };
  skip: {
    events: string[];
    commands: string[];
  };
}

const configPath = path.join(process.cwd(), 'config.json');  

export async function loadConfig(): Promise<Config> {
  const configData = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(configData);
}
