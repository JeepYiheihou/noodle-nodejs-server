"use strict";

const constants = require("./../../utils/constants");
const CONTENT_DB_TABLE_NAME = constants.CONTENT_DB_TABLE_NAME;

var dbConn = require("./../db_configs/content_sql_config");

// Content object definition
var Content = function(content) {
  this.id = content.id;
  this.creater = content.creater;
  this.createdTime = content.createdTime;
  this.type = content.type;
  this.thumbUrl = content.thumbUrl;
  this.realUrl = content.realUrl;
  this.width = content.width;
  this.height = content.height;
  this.length = content.length;
}

Content.create = function(newContent, result) {
  const query = `INSERT INTO ${CONTENT_DB_TABLE_NAME} SET ? `;
  dbConn.query(query, newContent, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

Content.findAll = function(result) {
  const query = `SELECT * FROM ${CONTENT_DB_TABLE_NAME}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Content.findByRange = function(start, end, result) {
  const query = `SELECT * FROM ${CONTENT_DB_TABLE_NAME} \
                 ORDER BY id DESC LIMIT ${start},${end - start}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  })
}

Content.findById = function (id, result) {
  const query = `SELECT * FROM ${CONTENT_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Content.update = function(id, content, result) {
  const query = `UPDATE ${CONTENT_DB_TABLE_NAME} SET ? `;
  dbConn.query(query, content, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Content.delete = function(id, result) {
  const query = `DELETE FROM ${CONTENT_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Content;
