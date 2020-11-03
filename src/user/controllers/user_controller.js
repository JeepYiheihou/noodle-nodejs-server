"use strict";

const tokenGenerator = require("../../utils/controllers/token_generator");
const genericCtrHandler = require("../../utils/controllers/generic_controller_handler");
const ctrHandler = genericCtrHandler.ctrHandler;
const sendErr = genericCtrHandler.sendErr;
const sendData = genericCtrHandler.sendData;
const sendMessage = genericCtrHandler.sendMessage;
const sendMessageAndData = genericCtrHandler.sendMessageAndData;

const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

const User = require("../models/user_model");

// ======================== Private APIs ========================

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

function _create(req, res) {
  const newUser = new User(req.body);
  console.log(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." });
  } else {
    const message = "User added successfully!";
    User.create(newUser, ctrHandler(res,sendErr, sendMessageAndData(message)));
  }
}

function _findAll(req, res) {
  User.findAll(ctrHandler(res, sendErr, sendData));
}

function _findById(req, res) {
  User.findById(req.params.id, ctrHandler(res, sendErr, sendData));
}

function _update(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." })
  } else {
    const message = "User successfully updated.";
    User.update(req.params.id, new User(req.body),
                ctrHandler(res, sendErr, sendMessage(message)));
  }
}

function _delete(req, res) {
  const message = "User successfully deleted."
  User.delete(req.params.id, ctrHandler(res, sendErr, sendMessage(message)));
}

function _login(req, res) {
  User.findByName(req.body.name, function(err, users) {
    if (err) {
      res.send(err);
    } else {
      if (users && users.length == 1 && req.body.password === users[0].password) {
        const user = users[0];
        var newToken = tokenGenerator.generate();
        User.setToken(user.id, newToken, sendWithToken(res, users, newToken));
      } else {
        res.status(400).send({ error: true, message: "Invalid user or password"});
      }
    }
  });
}

// ======================== Public APIs ========================

// Define create API behavior.
// Token check is not required.
exports.create = function(req, res) {
  _create(req, res);
};

// Define findAll API behavior.
// Token check is required.
exports.findAll = function(req, res) {
  checkToken(req, res, _findAll);
};

// Define findById API behavior.
// Token check is required.
exports.findById = function(req, res) {
  checkToken(req, res, _findById);
};

// Define update API behavior.
// Token check is required.
exports.update = function(req, res) {
  checkToken(req, res, _update);
};


// Define delete API behavior.
// Token check is required.
exports.delete = function(req, res) {
  checkToken(req, res, _delete);
};

// Define login API behavior.
// Token check is not required.
exports.login = function(req, res) {
  _login(req, res);
};
