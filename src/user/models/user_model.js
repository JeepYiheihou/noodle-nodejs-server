"use strict";

const { promisify } = require("util");

const constants = require("./../../utils/constants");
const USER_MYSQL_DB_TABLE_NAME = constants.USER_MYSQL_DB_TABLE_NAME;
const USER_REDIS_TOKEN_TTL = constants.USER_REDIS_TOKEN_TTL;

const dbConnPool = require("./../db_configs/user_sql_config");
const redisClient = require("./../db_configs/user_redis_config");

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

const dbPoolPromise = dbConnPool.promise();
const redisGetPromise = promisify(redisClient.get).bind(redisClient);
const redisSetPromise = promisify(redisClient.set).bind(redisClient);


User.create = async function(newUser) {
  const query = `INSERT INTO ${USER_MYSQL_DB_TABLE_NAME} SET ? `;
  try {
    const rawData = await dbPoolPromise.query(query, newUser);
    const response = rawData[0];
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

User.findAll = async function() {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const userList = rawData[0];
    return userList;
  } catch(err) {
    throw err;
  }
};

User.findById = async function (id) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const userList = rawData[0];
    return userList;
  } catch(err) {
    throw err;
  }
};

User.findByName = async function(name) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE name="${name}"`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const userList = rawData[0];
    return userList;
  } catch (err) {
    throw err;
  }
};

User.findByEmail = async function(email) {
  const query = `SELECT * FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE email="${email}"`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const userList = rawData[0];
    return userList;
  } catch (err) {
    throw err;
  }
};

User.update = async function(id, userFields) {
  const query = `UPDATE ${USER_MYSQL_DB_TABLE_NAME} SET ? WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query, userFields);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
};

User.delete = async function(id) {
  const query = `DELETE FROM ${USER_MYSQL_DB_TABLE_NAME} WHERE id=${id}`;
  try {
    const rawData = await dbPoolPromise.query(query);
    const response = rawData[0];
    return response;
  } catch(err) {
    throw err;
  }
};

User.getToken = async function(id) {
  try {
    const token = await redisGetPromise(id);
    return token;
  } catch (err) {
    throw err;
  }
}

User.setToken = async function(id, token) {
  try {
    await redisSetPromise(id, token);
  } catch (err) {
    throw err;
  }
}

module.exports = User;
