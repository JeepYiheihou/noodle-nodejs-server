"use strict";

const fs = require("fs");

const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in video part!" });
}

async function _get(req, res) {
  try {
    /* Check token. */
    if (!await checkToken(req, res)) { return; }

    const fileName = req.params.videoPath;
    const filePath = `../videos/${fileName}`;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;

      const chunkSize = (end-start)+1;
      const file = fs.createReadStream(filePath, {start, end});
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

exports.get = function(req, res) {
  _get(req, res);
};
