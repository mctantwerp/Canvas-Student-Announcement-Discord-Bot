const Discord = require("discord.js");
const { prefix } = require("../config.json");

module.exports = {

  commands: ["help", "h"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments, text) => {
    console.log("Help command executed! ")
    //simple help msg to show the available commands
    const embed = new Discord.MessageEmbed() // Ver 12.2.0 of Discord.js
      .setTitle("Canvas help")
      .setDescription("List of commands that can be used for now.")
      .setThumbnail("https://scontent-bru2-1.xx.fbcdn.net/v/t1.0-9/46488296_2389319437749114_6505762562989096960_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=a58UoF9Yv_cAX-4H65n&_nc_ht=scontent-bru2-1.xx&oh=c1b0d140980bd3dc2a474ec029a01170&oe=5FF9B2D6")
      .setAuthor("NxT Media Technologie", "https://play-lh.googleusercontent.com/2_M-EEPXb2xTMQSTZpSUefHR3TjgOCsawM3pjVG47jI-BrHoXGhKBpdEHeLElT95060B=s180", "https://canvas.kdg.be")
      .addField(
        "Commands: ",
        `**${prefix}watchlist:** courses that are being watched \r\n**${prefix}courses:** All available courses\r\n**${prefix}addcourse <CourseID>:** Add a course to the watchlist\r\n**${prefix}remove <CourseID>:** remove a course from the watchlist\r\n**${prefix}poll:** make a poll\r\n**${prefix}ping:** PONG`,
        false
      )
      .setColor("#FF0000");

    message.channel.send(embed);
    
  },
  permissions: [], //check command-base.js
  requiredRoles: [],
};
