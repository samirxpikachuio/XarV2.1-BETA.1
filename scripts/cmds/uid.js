export const XarV2 = {
  config: {
    name: "uid",
    aliases: ["userinfo", "getuser"],
    version: "1.0",
    author: "testing",
    countDown: 3,
    role: 1,
    description: "Fetches and displays user information based on user ID",
    category: "User",
    guide: "{pn} [user ID]",
    usePrefix: true
  },

  onStart: async ({ message, args, userModel, event }) => {
    

   const userId = event.from.id.toString()
    try {
      const userData = await userModel.get(userId);

      if (!userData) {
        return message.reply(`No user found with ID: ${userId}`);
      }

      const response = `User Information:
ID: ${userData.userId}
Name: ${userData.firstName}
Username: ${userData.username || "N/A"}
Is Bot: ${userData.isBot ? "Yes" : "No"}
Language: ${userData.languageCode || "N/A"}
Banned: ${Object.keys(userData.ban).length > 0 ? "Yes" : "No"}
EXP: ${userData.exp}
Money: ${userData.money}
Joined At: ${userData.joinedAt}`;

      return message.reply(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return message.reply("An error occurred while fetching user data.");
    }
  }
};