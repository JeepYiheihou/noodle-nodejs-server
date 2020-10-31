'use strict';

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content_sql_controller');

// Retrieve all contents.
router.get('/', contentController.findAll);

// Create a new content.
router.post('/', contentController.create);

// Retrieve a single content with id.
router.get('/:id', contentController.findById);

// Update a content with id.
router.put('/:id', contentController.update);

// Delete a content with id.
router.delete('/:id', contentController.delete);

module.exports = router;
