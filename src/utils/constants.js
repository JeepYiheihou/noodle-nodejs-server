'use strict';

const constants = Object.freeze({
  // HTTP route prefixes
  VIDEO_REQUEST_PREFIX: '/api/video/',
  USER_REQUEST_PREFIX: '/api/user/',
  CONTENT_API_PREFIX: '/api/content/',
  // User database configs
  USER_DB_HOST_IP: '127.0.0.1',
  USER_DB_PORT: 3306,
  USER_DB_USER_NAME: 'admin',
  USER_DB_PASSWORD: 'admin',
  USER_DB_DATABASE_NAME: 'bigdb',
  USER_DB_TABLE_NAME: 'users',
  // Content database configs
  CONTENT_DB_HOST_IP: '127.0.0.1',
  CONTENT_DB_PORT: 3306,
  CONTENT_DB_USER_NAME: 'admin',
  CONTENT_DB_PASSWORD: 'admin',
  CONTENT_DB_DATABASE_NAME: 'bigdb',
  CONTENT_DB_TABLE_NAME: 'contents'
});

module.exports = constants;
