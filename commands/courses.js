const Discord = require("discord.js");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "db/memory.db");
const { prefix } = require("../config.json");

module.exports = {

  commands: ["courses", "cs"],
  expectedArgs: ["<pageNumber>"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 1,
  callback: (message, arguments, text) => {
    console.log("Courses command executed! ")

    let embededFields = 5;
    let page = Number(arguments[0]);
    let skippedMsges = embededFields * page;
    

    //check if argument is a  number
    if (Number.isInteger(page) || arguments.length === 0) {
      
      //open db connection
      let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {

          console.error(err.message);

        }

        console.log("Connected to the memory database.");

      });

      db.serialize( () => {
        //SELECT course name and id from table courses 
        db.all(`SELECT course_name, course_id FROM courses;`, async (err, row) => {
          if (err) {

            console.error(err.message);

          }
          
          //embeded msg of all available courses
          const exampleEmbed = new Discord.MessageEmbed()
            .setAuthor("NxT Media Technologie", "https://play-lh.googleusercontent.com/2_M-EEPXb2xTMQSTZpSUefHR3TjgOCsawM3pjVG47jI-BrHoXGhKBpdEHeLElT95060B=s180", "https://canvas.kdg.be")
            .setColor("#00FFFF")
            .setTitle("Courses available ATM!")
            .setDescription(
              "All the courses that can be added to the watchlist so it can be watched for announcements. There are only " + row.length + " courses that can be added so far.")
            .setThumbnail("https://scontent-bru2-1.xx.fbcdn.net/v/t1.0-9/46488296_2389319437749114_6505762562989096960_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=a58UoF9Yv_cAX-4H65n&_nc_ht=scontent-bru2-1.xx&oh=c1b0d140980bd3dc2a474ec029a01170&oe=5FF9B2D6")
            .setTimestamp();

           //check if arguments is enterd or if arguments = 1 so we know it is on page 1  
          if ( arguments.length === 0 || page === 1) {

            exampleEmbed.setFooter("Page 1" + ` type ${prefix}courses 2 for next page`);

            row.forEach((element) => {

              //only add the first 5 courses to embed msg 
              if (embededFields !== 0) {
                exampleEmbed.addFields({

                  name: element.course_name,
                  value: element.course_id,

                });

                embededFields--;

              }
            });
            
            message.channel.send(exampleEmbed);
            
          }

          //check if arguments is entered or if arguments not = 1 so we know it is on page (arguments[0])
          if (arguments.length !== 0 && page !== 1) {

            exampleEmbed.setFooter("Page " + page + ` type ${prefix}courses ` + (page + 1) + " for next page");
            
            row.forEach((element) => {

              //page system -> skippedMsges = embededFields * page (lets say skippedmsges = 15 (embededFields = 5 * page = 3)) It needs to skip the first 10 msg to show page 3  
              if (skippedMsges <= embededFields) {
                if (embededFields !== 0) {
                  exampleEmbed.addFields({

                    name: element.course_name,
                    value: element.course_id,

                  });

                  embededFields--;

                }
              }
              skippedMsges--;

            });

            message.channel.send(exampleEmbed);

          }
        });
      });

      // close the database connection
      db.close((err) => {
        if (err) {

          return console.error(err.message);

        }

        console.log("Close the database connection.");

      });
    }
    //if entered argument is not a number return error
    if (isNaN(page) && arguments.length !== 0) {

      message.reply(`Incorrect syntax! Use !courses <pageNumber>. Why the hell did u type "` + arguments[0] + `"`);
      
    }
  },
  permissions: [],
  requiredRoles: [],
};
