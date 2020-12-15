"use strict";

const express = require("express");
const router = express.Router();
const thumbController = require("../controllers/thumb_controller");

// Retrieve thumb picture
router.get("/:thumbPath", thumbController.get);

// TODO: upload a thumb

// TODO: delete a thumb

module.exports = router;
