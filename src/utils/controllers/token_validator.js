"use strict";

const User = require("../../user/models/user_model");

exports.checkToken = async function(req, res) {

  var testMode = false
  process.argv.forEach((val, index) => {
    if (val === "--noodle-test-mode-enabled") { testMode = true; }
  });

  /* This is the cheat token only in test mode. */
  if (testMode && req.query.token === "ThisIsTheTokenThatAlwaysWorks") {
    return true;
  }

  if (!req.query.id || !req.query.token) {
    res.status(400).send({ error: true, message: "Please provide an id and token." });
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
