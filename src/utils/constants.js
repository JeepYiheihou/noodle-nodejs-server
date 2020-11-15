"use strict";

const constants = Object.freeze({
  // HTTP route prefixes
  USER_REQUEST_PREFIX: "/api/user/",
  CONTENT_REQUEST_PREFIX: "/api/content/",
  THUMB_REQUEST_PREFIX: "/api/thumb/",
  VIDEO_REQUEST_PREFIX: "/api/video/",

  // User MySql database configs
  USER_MYSQL_DB_HOST_IP: "127.0.0.1",
  USER_MYSQL_DB_PORT: 3306,
  USER_MYSQL_DB_USER_NAME: "admin",
  USER_MYSQL_DB_PASSWORD: "admin",
  USER_MYSQL_DB_DATABASE_NAME: "bigdb",
  USER_MYSQL_DB_TABLE_NAME: "users",
  // User Redis token cache configs
  USER_REDIS_HOST_IP: "127.0.0.1",
  USER_REDIS_HOST_PORT: 6379,
  USER_REDIS_TOKEN_TTL: 1 * 60 * 60,

  // Content My Sql database configs
  CONTENT_MYSQL_DB_HOST_IP: "127.0.0.1",
  CONTENT_MYSQL_DB_PORT: 3306,
  CONTENT_MYSQL_DB_USER_NAME: "admin",
  CONTENT_MYSQL_DB_PASSWORD: "admin",
  CONTENT_MYSQL_DB_DATABASE_NAME: "bigdb",
  CONTENT_MYSQL_DB_TABLE_NAME: "contents"
});

module.exports = constants;
