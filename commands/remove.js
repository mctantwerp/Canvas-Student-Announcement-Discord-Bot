const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/* https://www.sqlitetutorial.net/sqlite-nodejs/connect/ */
module.exports = {
  
  commands: ["remove", "rm"],
  expectedArgs: ["<CourseID>"],
  permissionError: "You Have no permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: (message, arguments, text) => {
    console.log("Remove command executed! ")
    const content = arguments[0];
    const dbPath = path.resolve(__dirname, "db/memory.db");

    //open DB connection
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        
        console.error(err.message);
        
      }
      
      console.log("Connected to the memory database.");
      
    });

    db.serialize(() => {
      //delete requested record from watchlist
      db.run(`DELETE FROM watchlist WHERE course_id=?`, content, (err, row) => {
        if (err) {
          
          console.error(err.message);
          
        }
        
        message.channel.send("Your record has been deleted from the watchlist!");
        
      });
    });

    // close the database connection
    db.close((err) => {
      if (err) {

        return console.error(err.message);

      }

      console.log("Close the database connection.");
      
    });
  },
  permissions: [],
  requiredRoles: [],
};
