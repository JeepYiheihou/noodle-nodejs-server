"use strict";

const constants = Object.freeze({
  /* nodejs server listening port */
  SERVER_PORT: 3000,

  /* HTTP route prefixes */
  LOGO_REQUEST_PREFIX: "/api/logo",
  USER_REQUEST_PREFIX: "/api/user",
  CONTENT_REQUEST_PREFIX: "/api/content",
  COMMODITY_REQUEST_PREFIX: "/api/commodity",
  THUMB_REQUEST_PREFIX: "/api/thumb",
  VIDEO_REQUEST_PREFIX: "/api/video",

  /* User MySql database configs */
  USER_MYSQL_DB_HOST_IP: "127.0.0.1",
  USER_MYSQL_DB_PORT: 3306,
  USER_MYSQL_DB_USER_NAME: "admin",
  USER_MYSQL_DB_PASSWORD: "admin",
  USER_MYSQL_DB_DATABASE_NAME: "bigdb",
  USER_MYSQL_DB_TABLE_NAME: "users",
  /* User Redis token cache configs */
  USER_REDIS_HOST_IP: "127.0.0.1",
  USER_REDIS_HOST_PORT: 6379,
  USER_REDIS_TOKEN_TTL: 1 * 60 * 60, /* In seconds. So in total 3600s = 1hr. */

  /* Content MySql database configs */
  CONTENT_MYSQL_DB_HOST_IP: "127.0.0.1",
  CONTENT_MYSQL_DB_PORT: 3306,
  CONTENT_MYSQL_DB_USER_NAME: "admin",
  CONTENT_MYSQL_DB_PASSWORD: "admin",
  CONTENT_MYSQL_DB_DATABASE_NAME: "bigdb",
  CONTENT_MYSQL_DB_TABLE_NAME: "contents",

  /* Commodity MySql database configs */
  COMMODITY_MYSQL_DB_HOST_IP: "127.0.0.1",
  COMMODITY_MYSQL_DB_PORT: 3306,
  COMMODITY_MYSQL_DB_USER_NAME: "admin",
  COMMODITY_MYSQL_DB_PASSWORD: "admin",
  COMMODITY_MYSQL_DB_DATABASE_NAME: "bigdb",
  COMMODITY_MYSQL_DB_TABLE_NAME: "commodities",
  COMMODITY_MYSQL_DB_CONTENT_TO_COMMODITY_MAP_TABLE_NAME: "content_commodity_map"
});

module.exports = constants;
