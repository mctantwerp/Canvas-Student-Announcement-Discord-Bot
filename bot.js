const Discord = require("discord.js");
const client = new Discord.Client();
const schedule = require("node-schedule");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const env = require("dotenv").config();
const monitor = require("./monitor");
const courses = require("./posts"); 
const TOKEN = process.env.DISCORD_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  //Check for commands and register 
  const baseFile = "command-base.js";
  const commandBase = require(`./commands/${baseFile}`);

  const readCommands = (dir) => {

    const files = fs.readdirSync(path.join(__dirname, dir));

    for (const file of files) {

      const stat = fs.lstatSync(path.join(__dirname, dir, file));

      if (stat.isDirectory()) {

        readCommands(path.join(dir, file));

      }
      //make sure that DB memory and baseFile wont be seen as a command 
      else if (file !== baseFile && file !== "memory.db") {

        const option = require(path.join(__dirname, dir, file));

        //sent commands to command base with the options that are entered in the custom commands like addcourse.js 
        commandBase(client, option);
        
      }
    }
  };
  readCommands("commands");


  courses(); //Called once to create table for the very first time

  //called every minute to get the announcements from the watchlist DB and post them
  const j = schedule.scheduleJob("*/1 * * * *", function () {
    
    console.log("The answer to life, the universe, and everything!");
    const dbPath = path.resolve(__dirname, "./commands/db/memory.db");

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        
        console.error(err.message);
        
      }
      
      console.log("Connected to the memory database.");
      
    });

    //select channel id and course id from watchlist table so we know what course announcements should be posted on what channel
    db.serialize(() => {
      db.all(`SELECT channel_id, course_id FROM watchlist`, (err, row) => {
        if (err) {

          console.error(err.message);
          
        }

        row.forEach((element) => {
          //if(!isNaN(element)){
            let annURL = process.env.CANVAS_API_ANN_URL.replace(/[courseid]]/g, element.course_id)
            console.log(annURL);
            monitor(client, annURL);
          //}
          
        });
      });
    });

    // close the database connection
    db.close((err) => {
      if (err) {

        return console.error(err.message);

      }

      console.log("Close the database connection.");
      
    });
  });
});

client.login(TOKEN);
