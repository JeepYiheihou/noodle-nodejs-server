"use strict";

const User = require("../../user/models/user_model");

exports.checkToken = function(req, res, callback) {
  // TODO: a backdoor to always whitelist user with name "admin".
  if (req.query.name === "admin") {
    callback(req, res);
    return;
  }
  if (!req.query.id || !req.query.token) {
    res.status(400).send({ error: true, message: "Please provide an id and token" });
    return;
  }
  User.getToken(req.query.id, function(err, token) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (token === req.query.token) {
        callback(req, res);
      } else {
        res.status(400).send({ error: true, message: "Invalid token." });
      }
    }
  });
};
