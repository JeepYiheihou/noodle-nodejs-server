"use strict";

const constants = require("../../src/utils/constants");
const USER_MYSQL_DB_TABLE_NAME = constants.USER_MYSQL_DB_TABLE_NAME;
const CONTENT_MYSQL_DB_TABLE_NAME = constants.CONTENT_MYSQL_DB_TABLE_NAME;

const userConnPool = require("../../src/user/db_configs/user_sql_config");
const userConnPoolPromise = userConnPool.promise();

const contentConnPool = require("../../src/content/db_configs/content_sql_config");
const contentConnPoolPromise = contentConnPool.promise();

exports.resetUserDbAutoIncrement = async function() {
  try {
    const query = `ALTER TABLE ${USER_MYSQL_DB_TABLE_NAME} AUTO_INCREMENT=20`;
    await userConnPoolPromise.query(query);
  } catch(err) {
    throw err;
  }
};

exports.resetContentDbAutoIncrement = async function() {
  try {
    const query = `ALTER TABLE ${CONTENT_MYSQL_DB_TABLE_NAME} AUTO_INCREMENT=5500`;
  } catch(err) {
    throw err;
  }
};
