"use strict";

const tokenGenerator = require("../../utils/controllers/token_generator");
const genericCtrHandler = require("../../utils/controllers/generic_controller_handler");
const ctrHandler = genericCtrHandler.ctrHandler;
const sendErr = genericCtrHandler.sendErr;
const sendData = genericCtrHandler.sendData;
const sendMessage = genericCtrHandler.sendMessage;
const sendMessageAndData = genericCtrHandler.sendMessageAndData;

const User = require("../models/user_model");

// Handler to handle response after token is retrieved.
// If the token is not there, then create one.
function handleGetToken(res, users) {
  return function(err, token) {
    if (err) {
      res.send(err);
    } else {
      const user = users[0];
      if (token) {
        users.push(tokenGenerator.makeJSON(token));
        res.json(users);
      } else {
        res.json({error: true, message: "Token not found."});
      }
    }
  }
}

// Handler to handle response after token is set.
function sendWithToken(res, users, token) {
  return function(err, resFromQuery) {
    if (err) {
      res.send(err);
    } else {
      users.push(tokenGenerator.makeJSON(token));
      res.json(users);
    }
  };
};

// Define create API behavior.
exports.create = function(req, res) {
  const newUser = new User(req.body);
  console.log(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." });
  } else {
    const message = "User added successfully!";
    User.create(newUser, ctrHandler(res,sendErr, sendMessageAndData(message)));
  }
};

// Define findAll API behavior.
exports.findAll = function(req, res) {
  User.findAll(ctrHandler(res, sendErr, sendData));
};

// Define findById API behavior.
exports.findById = function(req, res) {
  User.findById(req.params.id, ctrHandler(res, sendErr, sendData));
};

// Define update API behavior.
exports.update = function(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." })
  } else {
    const message = "User successfully updated.";
    User.update(req.params.id, new User(req.body),
                ctrHandler(res, sendErr, sendMessage(message)));
  }
};

// Define delete API behavior.
exports.delete = function(req, res) {
  const message = "User successfully deleted."
  User.delete(req.params.id, ctrHandler(res, sendErr, sendMessage(message)));
};

// Define login API behavior.
// Note that name and password are in the query field of the req, not params.
// Because the query url comes as "/user/verify?name=foo,password=bar".
exports.login = function(req, res) {
  User.findByName(req.body.name, function(err, users) {
    if (err) {
      res.send(err);
    } else {
      if (users && users.length == 1 && req.body.password === users[0].password) {
        const user = users[0];
        var newToken = tokenGenerator.generate();
        User.setToken(user.id, newToken, sendWithToken(res, users, newToken));
      } else {
        res.send({ error: true, message: "Invalid user or password"});
      }
    }
  });
};
