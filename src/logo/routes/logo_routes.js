"use strict";

const express = require("express");
const router = express.Router();
const logoController = require("../controllers/logo_controller");

/* Retrieve logo picture */
router.get("/", logoController.get);

module.exports = router;
