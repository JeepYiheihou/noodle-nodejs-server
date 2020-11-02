"use strict";

const Content = require("../models/content_model");
const genericCtrHandler = require("../../utils/controllers/generic_controller_handler");
const ctrHandler = genericCtrHandler.ctrHandler;
const sendErr = genericCtrHandler.sendErr;
const sendData = genericCtrHandler.sendData;
const sendMessage = genericCtrHandler.sendMessage;
const sendMessageAndData = genericCtrHandler.sendMessageAndData;

// Define create API behavior.
exports.create = function(req, res) {
  const newContent = new Content(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." });
  } else {
    const message = "Content added successfully!";
    Content.create(newContent, ctrHandler(res,sendErr, sendMessageAndData(message)));
  }
};

// Define findAll API behavior.
exports.findAll = function(req, res) {
  Content.findAll(ctrHandler(res, sendErr, sendData));
};

// Define findByRange API behavior.
exports.findByRange = function(req, res) {
  Content.findByRange(req.query.start, req.query.end, ctrHandler(res, sendErr, sendData));
};

// Define findById API behavior.
exports.findById = function(req, res) {
  Content.findById(req.params.id, ctrHandler(res, sendErr, sendData));
};

// Define update API behavior.
exports.update = function(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Please provide all required field." })
  } else {
    const message = "Content successfully updated.";
    Content.update(req.params.id, new Content(req.body), ctrHandler(res, sendErr, sendMessage(message)));
  }
};

// Define delete API behavior.
exports.delete = function(req, res) {
  const message = "Content successfully deleted.";
  Content.delete(req.params.id, ctrHandler(res, sendErr, sendMessage(message)));
};
