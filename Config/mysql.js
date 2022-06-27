const mysql = require("mysql");


const db = mysql.createPool({
    host: "localhost",
    user: "zero",
    password: "Zero!@#123",
    database: "avery_rfid"
  });


  const miQuery = async (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      });
    });
}

const miQueryScalar = async (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          result.forEach((v) => {
            for (var prop in v) resolve(v[prop]);
          })
        }
      });
    });
}
  
module.exports = {db, miQuery, miQueryScalar}