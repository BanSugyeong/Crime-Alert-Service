// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'crimedb'
});

db.connect(err => {
  if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
  }
  console.log('Connected to database as ID ' + db.threadId);
});

module.exports = db;
