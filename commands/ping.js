module.exports = {
  
  
  commands: ["ping"],
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments, text) => {
    console.log("Ping command executed! ")
    //simple ping pong to check if bot is online 
    message.reply("pong!");
    
  },
  requiredRoles: [],
  permissions: ["ADMINISTRATOR"],
};
