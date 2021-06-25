require('dotenv').config();
// import mysql
const mysql = require('mysql');

// Create pool
const pool = mysql.createPool({
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10
});

module.exports = pool;