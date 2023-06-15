const mysql = require("mysql");
const dbConfig = {
    host: "ip address",
    user: "user sql",
    password: "pass",
    database: "database paddy",
  };
  
  const db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
      return;
    }
    console.log("Connected to MySQL database!");
  });
  

  module.exports = db;