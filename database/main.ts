import { loadConfig, Config } from './config';
import { Database } from './database';

async function main() {
  const config: Config = await loadConfig();
  const database = new Database(config);

  // Adding data for 'users' table
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe123',
    isBot: false,
    avatarUrl: 'https://example.com/avatar.jpg',
    exp: 100,
    money: 200,
    joinedAt: new Date().toISOString(),  // Use current date and time
    settings: {
      theme: 'dark',
      notifications: true,
    },
    ban: null  // No ban applied
  };

  await database.setData('users', 1, userData);
  const user = await database.getData('users', 1);
  console.log('User:', user);

  // Adding data for 'threads' table
  const threadData = {
    title: 'General Discussion',
    prefix: 'gen',
    threadImage: 'https://example.com/threadImage.jpg',
    threadAdmins: ['admin1', 'admin2'],
    members: ['user1', 'user2', 'user3'],
    count: '10',
    settings: {
      isPublic: true,
      maxMembers: 100,
    },
    games: ['chess', 'checkers'],
    createdAt: new Date().toISOString()  // Use current date and time
  };

  await database.setData('threads', 1, threadData);
  const thread = await database.getData('threads', 1);
  console.log('Thread:', thread);
}

main().catch(console.error);
