const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "payment_db",
  password: "babatunde85",
});

module.exports = pool.promise();
