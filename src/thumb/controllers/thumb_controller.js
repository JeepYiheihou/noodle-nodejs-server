"use strict";

const fs = require("fs");
const path = require("path");

const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

function _get(req, res) {
  const thumbName = req.params.thumbPath;
  const filePath = path.resolve(__dirname + `/../../../../thumbs/${thumbName}`);
  res.sendFile(filePath);
}

exports.get = function(req, res) {
  checkToken(req, res, _get);
}
