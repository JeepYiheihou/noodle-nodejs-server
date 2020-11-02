"use strict";

const constants = require("../constants");
const USER_REDIS_TOKEN_TTL = constants.USER_REDIS_TOKEN_TTL;

var rand = function() {
  return Math.random().toString(36).substr(2);
};

exports.generate = function() {
  return rand() + rand();
};

exports.makeJSON = function(token) {
  return { "token": token, "ttl": USER_REDIS_TOKEN_TTL };
}
