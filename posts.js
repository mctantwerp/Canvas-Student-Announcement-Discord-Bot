const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const path = require("path");

const urlCourses = process.env.CANVAS_API_COURSES_URL;

const meta = {

  Authorization: "Bearer " + process.env.CANVAS_TOKEN,

};

const dbPath = path.resolve(__dirname, "./commands/db/memory.db");

module.exports = function () {

  //Runned once when server is started 
  var oneTimeCall = (function () {
    
    var executed = false;
    
    return function () {
      if (!executed) {
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
          if (err) {

            console.error(err.message);

          }
          
          console.log("Connected to the memory database.");
          
        });

        //get all available courses that can be watched for announcements
        console.log("Yeet");
        axios.get(urlCourses).then(function (response) {
        console.log("Yeet2");
            const data = response.data;
            const status = response.status;
            //check if request is oke  
            if (status === 200) {
              db.serialize(() => {
                
                //drop current table courses so new can be made and it wil always be up to date
                db.run(`DROP TABLE courses`, (err, row) => {
                  if (err) {
                    
                    console.error(err.message);
                    
                  }

                  console.log("Table is dropped!");

                });
                
                //Make a new table courses
                db.run(`CREATE TABLE courses (course_name TEXT, course_id INTEGER, posted_at REAL, id INTEGER, PRIMARY KEY(id AUTOINCREMENT))`, (err) => {
                    if (err) {
                      
                      console.error(err.message);

                    }
                    
                    console.log("Table has been succesfully created!");
                    
                  }
                );

                data.forEach((element) => {
                  //Insert data into table courses 
                  //we used DATETIME('now') so it wont error at the very first post of announcements
                  db.run(`INSERT INTO courses (course_name, course_id, posted_at) VALUES (` + JSON.stringify(element.name) + `,` + element.id + `, DATETIME('now'))`, (err, row) => {
                      if (err) {
                        
                        console.error(err.message);
                        
                      }

                      console.log("Your records had been pushed to the DB succesfully!");
                      
                    }
                  );
                });
              });
            }
          })
          

          .catch(function (error) {
            console.log(error);
          });
          
          db.close((err) => {
            if (err) {

              return console.error(err.message);
              
            }

            console.log("Close the database connection.");

          });

        executed = true;
        
      }
    };
  })();

  oneTimeCall();
};
