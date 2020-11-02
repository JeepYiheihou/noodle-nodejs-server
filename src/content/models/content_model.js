"use strict";

const constants = require("./../../utils/constants");
const CONTENT_MYSQL_DB_TABLE_NAME = constants.CONTENT_MYSQL_DB_TABLE_NAME;

const dbConn = require("./../db_configs/content_sql_config");

const genericQueryHandler = require("./../../utils/models/generic_query_handler");
const queryHandler = genericQueryHandler.queryHandler;
const sendErr = genericQueryHandler.sendErr;
const sendRes = genericQueryHandler.sendRes;
const sendResInsertId = genericQueryHandler.sendResInsertId;

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
  const query = `INSERT INTO ${CONTENT_MYSQL_DB_TABLE_NAME} SET ? `;
  dbConn.query(query, newContent, queryHandler(result, sendErr, sendResInsertId));
};

Content.findAll = function(result) {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

Content.findByRange = function(start, end, result) {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME} \
                 ORDER BY id DESC LIMIT ${start},${end - start}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
}

Content.findById = function (id, result) {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

Content.update = function(id, content, result) {
  const query = `UPDATE ${CONTENT_MYSQL_DB_TABLE_NAME} SET ? WHERE id=${id}`;
  dbConn.query(query, content, queryHandler(result, sendErr, sendRes));
};

Content.delete = function(id, result) {
  const query = `DELETE FROM ${CONTENT_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

module.exports = Content;
