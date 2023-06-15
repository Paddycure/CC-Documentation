const mysql = require("mysql");
const dbConfig = {
    host: "34.101.248.81",
    user: "tes",
    password: "password",
    database: "paddy_cure",
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