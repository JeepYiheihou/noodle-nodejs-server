"use strict";

const constants = require("./../../utils/constants");
const CONTENT_MYSQL_DB_HOST_IP = constants.CONTENT_MYSQL_DB_HOST_IP;
const CONTENT_MYSQL_DB_PORT = constants.CONTENT_MYSQL_DB_PORT;
const CONTENT_MYSQL_DB_USER_NAME = constants.CONTENT_MYSQL_DB_USER_NAME;
const CONTENT_MYSQL_DB_PASSWORD = constants.CONTENT_MYSQL_DB_PASSWORD;
const CONTENT_MYSQL_DB_DATABASE_NAME = constants.CONTENT_MYSQL_DB_DATABASE_NAME;

// Initiate mysql client
const mysql = require("mysql2");

const dbConn = mysql.createConnection({
  host: CONTENT_MYSQL_DB_HOST_IP,
  port: CONTENT_MYSQL_DB_PORT,
  user: CONTENT_MYSQL_DB_USER_NAME,
  password: CONTENT_MYSQL_DB_PASSWORD,
  database: CONTENT_MYSQL_DB_DATABASE_NAME
});

dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Content database connected!");
});

module.exports = dbConn;
