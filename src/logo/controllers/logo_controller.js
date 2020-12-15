"use strict";

const fs = require("fs");
const path = require("path");

function _get(req, res) {
  const logoName = "logo.jpg";
  const filePath = path.resolve(__dirname + `/../../../../logo/${logoName}`);
  res.sendFile(filePath);
}

exports.get = function(req, res) {
  _get(req, res);
}
