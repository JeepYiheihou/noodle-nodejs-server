"use strict";

const constants = require("./../../utils/constants");
const USER_MYSQL_DB_TABLE_NAME = constants.USER_MYSQL_DB_TABLE_NAME;
const USER_REDIS_TOKEN_TTL = constants.USER_REDIS_TOKEN_TTL;

const dbConn = require("./../db_configs/user_sql_config");
const redisClient = require("./../db_configs/user_redis_config");

const genericQueryHandler = require("./../../utils/models/generic_query_handler");
const queryHandler = genericQueryHandler.queryHandler;
const sendErr = genericQueryHandler.sendErr;
const sendRes = genericQueryHandler.sendRes;
const sendResInsertId = genericQueryHandler.sendResInsertId;

// User object definition
var User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.password = user.password;
  this.createdTime = user.createdTime;
  this.role = user.role;
  this.status = user.status;
  this.gender = user.gender;
  this.email = user.email;
  this.phone = user.phone;
}

User.create = function(newUser, result) {
  const query = `INSERT INTO ${USER_MYSQL_DB_TABLE_NAME} SET ? `;
  dbConn.query(query, newUser, queryHandler(result, sendErr, sendResInsertId));
};

User.findAll = function(result) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

User.findById = function (id, result) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

User.findByName = function(name, result) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE name="${name}"`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

User.update = function(id, user, result) {
  const query = `UPDATE ${USER_MYSQL_DB_TABLE_NAME} SET ? WHERE id=${id}`;
  dbConn.query(query, user, queryHandler(result, sendErr, sendRes));
};

User.delete = function(id, result) {
  const query = `DELETE FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, queryHandler(result, sendErr, sendRes));
};

User.getToken = function(id, result) {
  redisClient.get(id, queryHandler(result, sendErr, sendRes));
}

User.setToken = function(id, token, result) {
  redisClient.set(id, token, "EX", USER_REDIS_TOKEN_TTL, queryHandler(result, sendErr, sendRes));
}

module.exports = User;
