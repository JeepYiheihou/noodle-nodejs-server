"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");

// Retrieve all users.
router.get("/find-all", userController.findAll);

// Create a new user.
router.post("/", userController.create);

// Retrieve a single content with id.
router.get("/id/:id", userController.findById);

// Update a user with id.
router.put("/id/:id", userController.update);

// Delete a user with id.
router.delete("/id/:id", userController.delete);

// Verify if a name and password matches to log in as a user.
router.post("/login", userController.login);

module.exports = router;
