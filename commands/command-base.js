const { prefix } = require("../config.json");

const validatePermissions = (permissions) => {
  const validPermissions = [
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
  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`);
    }
  }
};

module.exports = (client, commandOptions) => {
  //enter the options of your custom commands
  let {
    commands,
    expectedArgs = "",
    permissionError = "You do not have permissions to run this command",
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions;

  //check if commands is a string. if it is a string make an array out of it
  if (commands === "strings") {
    command = [commands];
  }

  //log the custom commands to see if it is accepted
  console.log(`registering command "${commands[0]}"`);

  
  //check if permissions is a string. if it is a string make an array out of it
  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions];
    }

    //check if entered permission = to a valid permission
    validatePermissions(permissions);
  }

  client.on("message", (message) => {
    //get info from the posted msg in discord, like server, content of msg, ...
    const { member, content, guild } = message;


    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`;


      if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {

        //check if user who uses command has permission
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError);
            return;
          }
        }

        //check if user who uses command has the correct role
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          );
          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `You must have the "${requiredRole}" role to use this command.`
            );
            return;
          }
        }

        // Split on any number of spaces
        const arguments = content.split(/[ ]+/);

        // Remove the command which is the first index
        arguments.shift();

        // Ensure we have the correct number of arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {
          message.reply(
            `Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`
          );
          return;
        }

        // Handle the custom command code
        callback(message, arguments, arguments.join(" "), client);
        return;
      }
    }
  });
};
