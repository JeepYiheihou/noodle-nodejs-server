'use strict';

const constants = require('./../utils/constants');
const USER_DB_TABLE_NAME = constants.USER_DB_TABLE_NAME;

const parser = require('./../utils/object_sql_query_parser');
var dbConn = require('./../db_configs/user_db_config');

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
  const query = `INSERT INTO ${USER_DB_TABLE_NAME} set ${newUser}`;
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

User.findById = function (id, result) {
  const query = `SELECT * FROM ${USER_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

User.findByName = function(name, result) {
  const query = `SELECT * FROM ${USER_DB_TABLE_NAME} WHERE name='${name}'`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

User.findAll = function(result) {
  const query = `SELECT * FROM ${USER_DB_TABLE_NAME}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log('Users: ', res);
      result(null, res);
    }
  });
};

User.update = function(id, user, result) {
  const query = `UPDATE ${USER_DB_TABLE_NAME} SET ${parser.parse(user)}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

User.delete = function(id, result) {
  const query = `DELETE FROM ${USER_DB_TABLE_NAME} WHERE id=${id}`;
  dbConn.query(query, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = User;
