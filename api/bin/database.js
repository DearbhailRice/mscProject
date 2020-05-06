const mysql = require('mysql');

const conn = mysql.createConnection({
  host: '8889',
  user: 'root',
  password: 'root',
  database: 'msc_project',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

conn.connect(err => {
  if (err) {
    console.log("not connected due to error: " + err);
  } else {
    console.log("connected ! connection id is " + conn.threadId);
  }
});

module.exports = conn;