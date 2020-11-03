"use strict";

const Content = require("../models/content_model");
const genericCtrHandler = require("../../utils/controllers/generic_controller_handler");
const ctrHandler = genericCtrHandler.ctrHandler;
const sendErr = genericCtrHandler.sendErr;
const sendData = genericCtrHandler.sendData;
const sendMessage = genericCtrHandler.sendMessage;
const sendMessageAndData = genericCtrHandler.sendMessageAndData;

const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

// ======================== Private APIs ========================

function _create(req, res) {
  const newContent = new Content(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." });
  } else {
    const message = "Content added successfully!";
    Content.create(newContent, ctrHandler(res,sendErr, sendMessageAndData(message)));
  }
}

function _findAll(req, res) {
  Content.findAll(ctrHandler(res, sendErr, sendData));
}

function _findByRange(req, res) {
  Content.findByRange(req.query.start, req.query.end, ctrHandler(res, sendErr, sendData));
}

function _findById(req, res) {
  Content.findById(req.params.id, ctrHandler(res, sendErr, sendData));
}

function _update(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." })
  } else {
    const message = "Content successfully updated.";
    Content.update(req.params.id, new Content(req.body), ctrHandler(res, sendErr, sendMessage(message)));
  }
}

function _delete(req, res) {
  const message = "Content successfully deleted.";
  Content.delete(req.params.id, ctrHandler(res, sendErr, sendMessage(message)));
}

// ======================== Public APIs ========================

// Define create API behavior.
// Token is required.
exports.create = function(req, res) {
  checkToken(req, res, _create);
};

// Define findAll API behavior.
// Token is required.
exports.findAll = function(req, res) {
  checkToken(req, res, _findAll);
};

// Define findByRange API behavior.
// Token is required.
exports.findByRange = function(req, res) {
  checkToken(req, res, _findByRange);
};

// Define findById API behavior.
// Token is required.
exports.findById = function(req, res) {
  checkToken(req, res, _findById);
};

// Define update API behavior.
// Token is required.
exports.update = function(req, res) {
  checkToken(req, res, _update);
};

// Define delete API behavior.
// Token is required.
exports.delete = function(req, res) {
  checkToken(req, res, _delete);
};
