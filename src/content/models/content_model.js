"use strict";

const constants = require("./../../utils/constants");
const CONTENT_MYSQL_DB_TABLE_NAME = constants.CONTENT_MYSQL_DB_TABLE_NAME;

const connPool = require("./../db_configs/content_sql_config");

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

const dbPoolPromise = connPool.promise();

Content.create = async function(newContent) {
  const query = `INSERT INTO ${CONTENT_MYSQL_DB_TABLE_NAME} SET ? `;
  try {
    const rawData = await dbPoolPromise.query(query, newContent);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
};

Content.findAll = async function() {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const contentList = rawData[0];
    return contentList;
  } catch(err) {
    throw err;
  }
};

Content.findByRange = async function(start, end) {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME} \
                 ORDER BY id DESC LIMIT ${start},${end - start + 1}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const contentList = rawData[0];
    return contentList;
  } catch(err) {
    throw err;
  }
}

Content.findById = async function (id) {
  const query = `SELECT * FROM ${CONTENT_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const contentList = rawData[0];
    return contentList;
  } catch(err) {
    throw err;
  }
};

Content.update = async function(id, contentFields) {
  const query = `UPDATE ${CONTENT_MYSQL_DB_TABLE_NAME} SET ? WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query, contentFields);
    const response = rawData[0];
    return response;
  } catch (err) {
    throw err;
  }
};

Content.delete = async function(id) {
  const query = `DELETE FROM ${CONTENT_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
};

module.exports = Content;
