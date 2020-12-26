"use strict";

const constants = require("../../utils/constants");
const USER_REDIS_HOST_IP = constants.USER_REDIS_HOST_IP;
const USER_REDIS_HOST_PORT = constants.USER_REDIS_HOST_PORT;

/* Initiate redis client */
const redis = require("redis");

const client = redis.createClient({
  host: USER_REDIS_HOST_IP,
  port: USER_REDIS_HOST_PORT
});

client.on("error", function(error) {
  console.log(error);
})

client.on("connect", function() {
  console.log("Redis cache connected!")
})

module.exports = client;
