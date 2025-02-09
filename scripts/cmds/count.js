export const XarV2 = {
  config: {
    name: "count",
    aliases: ["msgcount", "messages"],
    version: "1.0",
    author: "Assistant",
    countDown: 3,
    role: 1,
    description: "Shows how many messages a user has sent in this thread",
    category: "Thread",
    guide: "{pn} [username]",
    usePrefix: true
  },

  onStart: async({ message, args, event, threadModel }) => {
    const threadId = event.chat.id.toString();  
    const threadData = await threadModel.get(threadId);  

    if (!threadData || !threadData.count) {
      return message.reply("No data found for this thread.");
    }

    const username = args.length > 0 ? args.join(" ") : null;

    if (username) {
      const userCount = threadData.count.find(user => user.username.toLowerCase() === username.toLowerCase());
      if (userCount) {
        return message.reply(`${userCount.username} has sent ${userCount.count} messages in this thread.`);
      } else {
        return message.reply(`No message count found for the user "${username}".`);
      }
    } else {
      const currentUserCount = threadData.count.find(user => user.senderID === event.from.id);
      if (currentUserCount) {
        return message.reply(`You have sent ${currentUserCount.count} messages in this thread.`);
      } else {
        return message.reply("You have not sent any messages in this thread.");
      }
    }
  }
};
