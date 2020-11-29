"use strict";

// A tricky script to populate large amount of data to databases.

const constants = require("./constants");
const CONTENT_MYSQL_DB_HOST_IP = constants.CONTENT_MYSQL_DB_HOST_IP;
const CONTENT_MYSQL_DB_PORT = constants.CONTENT_MYSQL_DB_PORT;
const CONTENT_MYSQL_DB_USER_NAME = constants.CONTENT_MYSQL_DB_USER_NAME;
const CONTENT_MYSQL_DB_PASSWORD = constants.CONTENT_MYSQL_DB_PASSWORD;
const CONTENT_MYSQL_DB_DATABASE_NAME = constants.CONTENT_MYSQL_DB_DATABASE_NAME;
const CONTENT_MYSQL_DB_TABLE_NAME = constants.CONTENT_MYSQL_DB_TABLE_NAME;

const Content = require("../content/models/content_model");

// Initiate mysql client
const mysql = require("mysql2");

const dbConn = mysql.createConnection({
  host: CONTENT_MYSQL_DB_HOST_IP,
  port: CONTENT_MYSQL_DB_PORT,
  user: CONTENT_MYSQL_DB_USER_NAME,
  password: CONTENT_MYSQL_DB_PASSWORD,
  database: CONTENT_MYSQL_DB_DATABASE_NAME
});

/* width by height */
const resolutionMap = {
  1: [1600, 899],
  2: [640, 638],
  3: [972, 1300],
  4: [1000, 684],
  5: [2991, 1682],
  6: [600, 400],
  7: [450, 450],
  8: [550, 738],
  9: [450, 300],
  10: [720, 720]
}

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

function insertIntoDB() {
  dbConn.connect(function(err) {
    if (err) throw err;
    for (var i = 0; i < 5000; i++) {
      const query = `INSERT INTO ${CONTENT_MYSQL_DB_TABLE_NAME} SET ? `;
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
}

/* min is included, max is not */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function updateDB() {
  dbConn.connect(function(err) {
    if (err) throw err;
    for (var i = 0; i < 5000; i++) {
      const index = getRandomInt(1, 11)
      const w = resolutionMap[index][0]
      const h = resolutionMap[index][1]
      const query = `UPDATE ${CONTENT_MYSQL_DB_TABLE_NAME} SET \
                     thumbUrl="sample_${index}.jpg", \
                     width=${w}, \
                     height=${h} \
                     WHERE id=${i+1} `;
      dbConn.query(query, function(err, res) {
        if (err) {
          console.log(query);
          console.log(err);
        } else {
          console.log(res.insertId);
        }
      });
    };
  });
}

updateDB()
