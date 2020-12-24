"use strict";

const User = require("../../user/models/user_model");

exports.checkToken = async function(req, res) {
  // TODO: a backdoor to always whitelist user with name "admin".
  if (req.query.name === "admin") {
    return true;
  }
  if (!req.query.id || !req.query.token) {
    res.status(400).send({ error: true, message: "Please provide an id and token" });
    return false;
  }

  try {
    const token = await User.getToken(req.query.id);
    if (token === req.query.token) {
      return true;
    } else {
      res.status(400).send({ error: true, message: "Invalid id or token." });
      return false;
    }
  } catch(err) {
    throw err;
  }
};
