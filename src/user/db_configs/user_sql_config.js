"use strict";

const constants = require("./../../utils/constants");
const USER_DB_HOST_IP = constants.USER_DB_HOST_IP;
const USER_DB_PORT = constants.USER_DB_PORT;
const USER_DB_USER_NAME = constants.USER_DB_USER_NAME;
const USER_DB_PASSWORD = constants.USER_DB_PASSWORD;
const USER_DB_DATABASE_NAME = constants.USER_DB_DATABASE_NAME;

// Initiate mysql client
const mysql = require("mysql2");

const dbConn = mysql.createConnection({
  host: USER_DB_HOST_IP,
  port: USER_DB_PORT,
  user: USER_DB_USER_NAME,
  password: USER_DB_PASSWORD,
  database: USER_DB_DATABASE_NAME
});

dbConn.connect(function(err) {
  if (err) throw err;
  console.log("User database connected!");
});

module.exports = dbConn;
