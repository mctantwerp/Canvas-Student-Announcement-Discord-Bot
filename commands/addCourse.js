const { number } = require("assert-plus");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const { prefix } = require("../config.json");

const urlCourse = process.env.CANVAS_API_COURSE_URL;

const meta = {

  Authorization: "Bearer " + process.env.CANVAS_TOKEN,

};

/* https://www.sqlitetutorial.net/sqlite-nodejs/connect/ */
module.exports = {
  commands: ["addCourse", "ac"],
  expectedArgs: ["<CourseID>"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: (message, arguments, text) => {
    
    console.log("AddCourse command executed! ")
    const content = Number(arguments[0]);
    const dbPath = path.resolve(__dirname, "db/memory.db");

    if (Number.isInteger(content)) {

    //api request to get the course that is entered in as argument and enter it tp the table watchlist with the channel id

    axios.get(urlCourse.replace('[courseid]', JSON.stringify(content))).then(function (response) {
      
        const data = response.data;
        const status = response.status;

        console.log(data);
        console.log(message.channel.id);
        console.log(status);
            
        //check if request is oke
        if (status === 200) {
          //return confirmation that cours is added to watchlist
          message.channel.send(
            data.name + "  has been added to watch list for channel : **" +  message.channel.name + "**");

          //open db 
          let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
              if (err) {
                
                console.error(err.message);
                
              }
              
              console.log("Connected to the memory database.");
              
            }
          );

          db.serialize(() => {
            //Insert course id and channel id to watchlist
            db.run(`INSERT INTO watchlist (channel_id, course_id) VALUES (` + message.channel.id + `,` + data.id + `)`, (err, row) => {
                if (err) {
                  
                  console.error(err.message);
                  
                }

                console.log("Your record had been pushed to the DB succesfully!");

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
        message.channel.send("The course: **" + content + "** can not be found!");
        
      });
    }if (isNaN(content)) {

      message.reply(`Incorrect syntax! Use ${prefix}addCourses <courseID>. Why the hell did u type "` + arguments[0] + `"`);
      
    }
  },
  permissions: [],
  requiredRoles: [],
};
