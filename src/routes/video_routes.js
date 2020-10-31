'use strict';

const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video_controller');

// Retrieve and play video
router.get('/:videoPath', videoController.get);

// TODO: upload a video

// TODO: delete a video

module.exports = router
