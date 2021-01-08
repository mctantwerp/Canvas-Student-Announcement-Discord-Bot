const Discord = require("discord.js");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const urlCourses = process.env.CANVAS_API_COURSES_URL;

const meta = {
  
  Authorization: "Bearer " + process.env.CANVAS_TOKEN,
  
};

/* https://www.sqlitetutorial.net/sqlite-nodejs/connect/ */
module.exports = {

  commands: ["watchlist", "wl"],
  expectedArgs: [""],
  permissionError: "You Have no permissions to run this command",
  minArgs: 0,
  maxArgs: 0,
  callback: (message, arguments, text) => {
    console.log("Watchlist command executed! ")
    const dbPath = path.resolve(__dirname, "db/memory.db");
    
    //api request get all courses because sqlite cant realy keep up 
    axios.get(urlCourses).then(function (response) {
      
        const data = response.data;
        const status = response.status;

        if (status === 200) {
          let db = new sqlite3.Database(
            dbPath,
            sqlite3.OPEN_READWRITE,
            (err) => {
              if (err) {

                console.error(err.message);

              }

              console.log("Connected to the memory database.");
              
            }
          );

          db.serialize(() => {
            //select course id and channel id from watchlist and compare them to the api request so we know what is being watched in the current channel  
            db.all(`SELECT channel_id, course_id FROM watchlist;`, (err, row) => {
                if (err) {
                  
                  console.error(err.message);
                  
                }

                const exampleEmbed = new Discord.MessageEmbed()
                  .setAuthor("NxT Media Technologie", "https://play-lh.googleusercontent.com/2_M-EEPXb2xTMQSTZpSUefHR3TjgOCsawM3pjVG47jI-BrHoXGhKBpdEHeLElT95060B=s180", "https://canvas.kdg.be")
                  .setColor("#32a852")
                  .setTitle("Watchlist " + message.channel.name)
                  .setDescription("These are the courses that are being watched on this channel")
                  .setThumbnail("https://scontent-bru2-1.xx.fbcdn.net/v/t1.0-9/46488296_2389319437749114_6505762562989096960_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=a58UoF9Yv_cAX-4H65n&_nc_ht=scontent-bru2-1.xx&oh=c1b0d140980bd3dc2a474ec029a01170&oe=5FF9B2D6")
                  .setTimestamp();

                row.forEach((element) => {
                  if (element.channel_id === message.channel.id) {
                    data.forEach((item) => {
                      if (item.id === element.course_id) {
                        exampleEmbed.addFields({

                          name: item.name,
                          value: element.course_id,

                        });
                      }
                    });
                  }
                });

                message.channel.send(exampleEmbed);

              }
            );
          });

          // close the database connection
          db.close((err) => {
            if (err) {

              return console.error(err.message);

            }

            console.log("Close the database connection.");

          });
        }
      })
      .catch(function (error) {

        console.log(error);

      });
  },
  permissions: [],
  requiredRoles: [],
};
