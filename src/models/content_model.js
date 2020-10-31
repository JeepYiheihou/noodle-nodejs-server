'use strict';

const constants = require('./../utils/constants');
const CONTENT_DB_TABLE_NAME = constants.CONTENT_DB_TABLE_NAME;

const parser = require('./../utils/object_sql_query_parser');
var dbConn = require('./../db_configs/content_db_config');

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

Content.create = function (newContent, result) {
  const query = `INSERT INTO ${CONTENT_DB_TABLE_NAME} set ${newContent}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

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

Content.findAll = function(result) {
  const query = `SELECT * FROM ${CONTENT_DB_TABLE_NAME}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log('Contents: ', res);
      result(null, res);
    }
  });
};

Content.update = function(id, content, result) {
  const query = `UPDATE ${CONTENT_DB_TABLE_NAME} SET ${parser.parse(content)}`;
  dbConn.query(query, function(err, res) {
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
