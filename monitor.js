const Discord = require("discord.js");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const meta = {

  Authorization: "Bearer " + process.env.CANVAS_TOKEN,

};

module.exports = (client, courseAnn) => {
  const dbPath = path.resolve(__dirname, "./commands/db/memory.db");

  //Api request to get announcements
  axios.get(courseAnn, /*{ headers: meta }*/).then(function (response) {

    const data = response.data;
    const status = response.status;
    
    //check if request is oke  
    if (status === 200) {
      let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          
          console.error(err.message);
          
        }
      });

      //select posted at and course id from courses table
      db.serialize(() => {
        //Get posted_at, course_id in a array
        db.all(`SELECT posted_at, course_id FROM courses;`, (err, row) => {
          if (err) {
            
            console.error(err.message);
            
          }

          //Reverse JSON data order from API Canvas to show oldest posts first
          var rev = data.reverse();

          //Loop trough dtabase with course with all the API GET results to post on the right channel
          rev.forEach((ann) => {

            row.forEach((course) => {
              if (ann.context_code.replace("course_", "") === JSON.stringify(course.course_id) && course.posted_at < ann.posted_at) {

                
                //Replace default markup html tags of canvas by discord embed syntax
                var message = ann.message
                  .replace(/<strong>/g, "**")
                  .replace(/<\/strong>/g, "**")
                  .replace(/<[^>]+>/g, "")
                  .replace(
                    /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,
                    "(LINK)"
                  )
                  .replace(/\(Links to an external site.\)/g, "");

                  //Build layout of embedded post
                const exampleEmbed = new Discord.MessageEmbed()
                  .setColor("DARK_VIVID_PINK")
                  .setTitle(ann.title)
                  .setURL(ann.url)
                  .setAuthor(
                    ann.author.display_name,
                    ann.author.avatar_image_url, 
                    ann.author.html_url
                  )
                  .setDescription(message.substring(0, 200))
                  .addFields({
                    name: "___________",
                    value: "[Read More](" + ann.url + ")",
                  })
                  .setThumbnail(
                    "https://scontent-bru2-1.xx.fbcdn.net/v/t1.0-9/46488296_2389319437749114_6505762562989096960_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=a58UoF9Yv_cAX-4H65n&_nc_ht=scontent-bru2-1.xx&oh=c1b0d140980bd3dc2a474ec029a01170&oe=5FF9B2D6"
                  )
                  .setTimestamp()
                  .setFooter(
                    "NxT Media Technology",
                    "https://play-lh.googleusercontent.com/2_M-EEPXb2xTMQSTZpSUefHR3TjgOCsawM3pjVG47jI-BrHoXGhKBpdEHeLElT95060B=s180"
                  );

                db.all(
                  `SELECT course_id, channel_id FROM watchlist;`,
                  (err, row) => {
                    if (err) {

                      console.error(err.message);

                    }

                    row.forEach((record) => {
                      if (ann.context_code.replace("course_", "") === JSON.stringify(record.course_id)) {
                        
                        /* channel = client.channels.cache.get(record.channel_id).then(
                          channel.send(exampleEmbed)
                        ) */
                        client.channels.fetch(record.channel_id).then(channel => { channel.send(exampleEmbed) }).catch(error => { console.log(error) });;

                      }
                    });
                  }
                );

                //update DateTime so you have a reference when the last post on discord was posted, prevent posting doubles
                db.run(`UPDATE courses SET posted_at=` + JSON.stringify(ann.posted_at) + ` WHERE course_id = ` + JSON.stringify(course.course_id)), (err, row) => {
                    if (err) {
                      
                      console.error(err.message);
                      
                    }
                    
                    console.log("Your records had been pushed to the DB succesfully!");

                  };
                  
              }
            });
          });
        });
      });
    }
  });
};
