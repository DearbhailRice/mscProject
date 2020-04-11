const mysql = require('mysql');
 //const conn = mariadb.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASS,
// });

 const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bnel_db',
    password: 'bnelpass1221',
 
});

conn.connect(err => {
    if (err) {
      console.log("not connected due to error: " + err);
    } else {
      console.log("connected ! connection id is " + conn.threadId);
    }
  });
  
module.exports = conn;