"use strict";

const constants = require("../../utils/constants");
const COMMODITY_MYSQL_DB_HOST_IP = constants.COMMODITY_MYSQL_DB_HOST_IP;
const COMMODITY_MYSQL_DB_PORT = constants.COMMODITY_MYSQL_DB_PORT;
const COMMODITY_MYSQL_DB_USER_NAME = constants.COMMODITY_MYSQL_DB_USER_NAME;
const COMMODITY_MYSQL_DB_PASSWORD = constants.COMMODITY_MYSQL_DB_PASSWORD;
const COMMODITY_MYSQL_DB_DATABASE_NAME = constants.COMMODITY_MYSQL_DB_DATABASE_NAME;

/* Initiate mysql client. */
const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: COMMODITY_MYSQL_DB_HOST_IP,
  port: COMMODITY_MYSQL_DB_PORT,
  user: COMMODITY_MYSQL_DB_USER_NAME,
  password: COMMODITY_MYSQL_DB_PASSWORD,
  database: COMMODITY_MYSQL_DB_DATABASE_NAME
}, console.log("Commodity database connected"));

module.exports = pool;
