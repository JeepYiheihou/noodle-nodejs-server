"use strict";

const express = require("express");
const router = express.Router();
const contentController = require("../controllers/content_controller");

// Retrieve all contents.
router.get("/find-all", contentController.findAll);

// Get contents by range, for paged queries.
router.get("/find-by-range", contentController.findByRange);

// Create a new content.
router.post("/create/", contentController.create);

// Retrieve a single content with id.
router.get("/id/:id", contentController.findById);

// Update a content with id.
router.put("/id/:id", contentController.update);

// Delete a content with id.
router.delete("/id/:id", contentController.delete);

module.exports = router;
