const config = require('./config');
const mysql = require('mysql');

// db est l'équivalent du PDO que vous aviez utilisé en PHP
const db = mysql.createConnection({
    host: config.mysqlHost, // notez comment on utilise le config que l'on a requiré
    port: config.mysqlPort,
    user: config.mysqlLogin,
    password: config.mysqlPassword,
    database: config.mysqlDatabase
});
db.connect();

module.exports = db;