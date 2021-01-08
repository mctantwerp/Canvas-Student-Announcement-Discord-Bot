module.exports = {
  
  commands: ["poll"],
  expectedArgs: [],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 0,

  callback: async (message, arguments, text) => {
    console.log("Poll command executed! ")
    //add thumbs reaction to a posted message so it looks like a poll
    const addReactions = (message) => {
      
      message.react("👍");

      setTimeout(() => {
        message.react("👎");
      }, 750);
      
    };

    await message.delete();

    //fetch the latest posted message
    const fetched = await message.channel.messages.fetch({ limit: 1 });
    if (fetched && fetched.first()) {
      addReactions(fetched.first());
    }
  },
  permissions: [], //check command-base.js
  requiredRoles: [],
};
