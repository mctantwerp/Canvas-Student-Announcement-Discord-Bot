module.exports = {
  commands: ["template", "t"],  //- Name and Alias Of your command.
  expectedArgs: ["<arg1> <arg1>"], //- Expected arguments for your command.
  permissionError: "You Have no permissions to run this command", //- The permission error it returns if the person running the command doesn't have the permission to use the command.
  minArgs: 2, //- Minimum required arguments. Example: !template arg1
  maxArgs: 2, //- Maximum required arguments. Example: !template arg1 arg2 arg3
  callback: (message, arguments, text) => { //- This is what is called when u run the command.
    //command
  },
  permissions: ["ADMINISTRATOR"], //- Only allows users with certain permission to run this command. Example: permissions: ["ADMINISTRATOR"]-> This wil only allow server admins.
  requiredRoles: [], //- Only allows users with certain rolls to run this command. Example: requiredRoles: ["Ping"]-> This wil only allow users with role Ping.
};
/* 
validPermissions = [
  "ADMINISTRATOR",
  "CREATE_INSTANT_INVITE",
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "ADD_REACTIONS",
  "VIEW_AUDIT_LOG",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "VIEW_GUILD_INSIGHTS",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "CHANGE_NICKNAME",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "MANAGE_EMOJIS",
]; 
*/