"use strict";

const constants = require("./utils/constants");
const VIDEO_REQUEST_PREFIX = constants.VIDEO_REQUEST_PREFIX;
const USER_REQUEST_PREFIX = constants.USER_REQUEST_PREFIX;
const CONTENT_REQUEST_PREFIX = constants.CONTENT_REQUEST_PREFIX;
const THUMB_REQUEST_PREFIX = constants.THUMB_REQUEST_PREFIX;
const SERVER_PORT = constants.SERVER_PORT;

// Initiate expressjs server
const fs = require("fs");
const express = require("express");
const https = require('https');
const path = require("path");
const app = express();

const privateKey = fs.readFileSync("./src/certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("./src/certs/cert.pem", "utf8");
const credentials = {key: privateKey, cert: certificate};

// JSON parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const contentRoutes = require("./content/routes/content_routes");
const userRoutes = require("./user/routes/user_routes");
const videoRoutes = require("./video/routes/video_routes");
const thumbRoutes = require("./thumb/routes/thumb_routes");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Attach routers.
app.use(VIDEO_REQUEST_PREFIX, videoRoutes);
app.use(USER_REQUEST_PREFIX, userRoutes);
app.use(CONTENT_REQUEST_PREFIX, contentRoutes);
app.use(THUMB_REQUEST_PREFIX, thumbRoutes);

// Start the server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(SERVER_PORT, ()=>{
  console.log(`Listening on port ${SERVER_PORT}`);
});
