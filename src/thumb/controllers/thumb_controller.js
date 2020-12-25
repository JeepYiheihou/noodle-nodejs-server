"use strict";

const fs = require("fs");
const path = require("path");

const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in thumb part!" });
}

async function _get(req, res) {
  try {
    /* Check token. */
    if (!await checkToken(req, res)) { return; }

    const thumbName = req.params.thumbPath;
    const filePath = path.resolve(__dirname + `/../../../../thumbs/${thumbName}`);
    res.sendFile(filePath);
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

exports.get = function(req, res) {
  _get(req, res);
}
