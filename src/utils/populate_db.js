"use strict";

// A tricky script to populate large amount of data to databases.

const constants = require("./constants");
const CONTENT_DB_HOST_IP = constants.CONTENT_DB_HOST_IP;
const CONTENT_DB_PORT = constants.CONTENT_DB_PORT;
const CONTENT_DB_USER_NAME = constants.CONTENT_DB_USER_NAME;
const CONTENT_DB_PASSWORD = constants.CONTENT_DB_PASSWORD;
const CONTENT_DB_DATABASE_NAME = constants.CONTENT_DB_DATABASE_NAME;
const CONTENT_DB_TABLE_NAME = constants.CONTENT_DB_TABLE_NAME;

const Content = require("../models/content_model");

// Initiate mysql client
const mysql = require("mysql2");

const dbConn = mysql.createConnection({
  host: CONTENT_DB_HOST_IP,
  port: CONTENT_DB_PORT,
  user: CONTENT_DB_USER_NAME,
  password: CONTENT_DB_PASSWORD,
  database: CONTENT_DB_DATABASE_NAME
});


const newContent = new Content({
  creater: 1,
  createdTime: "2020-10-30",
  type: "video/mp4",
  thumbUrl: "sample.mp4",
  realUrl: "sample.mp4",
  width: 3840,
  height: 2160,
  length: 54
});

dbConn.connect(function(err) {
  if (err) throw err;
  for (var i = 0; i < 1000; i++) {
    const query = `INSERT INTO ${CONTENT_DB_TABLE_NAME} SET ? `;
    dbConn.query(query, newContent, function(err, res) {
      if (err) {
        console.log(query);
        console.log(err);
      } else {
        console.log(res.insertId);
      }
    });
  };
});
