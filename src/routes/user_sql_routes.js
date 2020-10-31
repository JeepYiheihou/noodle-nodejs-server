'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_sql_controller');

// Retrieve all users.
router.get('/findAll', userController.findAll);

// Create a new user.
router.post('/', userController.create);

// Retrieve a single content with id.
router.get('/id/:id', userController.findById);

// Update a user with id.
router.put('/id/:id', userController.update);

// Delete a user with id.
router.delete('/id/:id', userController.delete);

// Verify if a name and password matches to log in as a user.
router.get('/verify', userController.verify);

module.exports = router;