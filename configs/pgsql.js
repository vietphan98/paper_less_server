const Pool = require("pg").Pool;

const db = new Pool({
    user : "zero",
    password : "Zero!@#123",
    host : "Zeros.asia",
    port: 5432,
    database: "Zero"
})
module.exports = db