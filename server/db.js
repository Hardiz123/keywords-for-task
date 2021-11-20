const Pool = require("pg").Pool;


const pool = new Pool({
    user: "postgres",
    password: "hardik",
    host: "localhost",
    port: 5432,
    database: "keywords"
});

module.exports =  pool;