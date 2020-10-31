'use strict';

const Content = require('../models/content_model');

// Define findAll API behavior.
exports.findAll = function(req, res) {
  Content.findAll(function(err, content) {
    console.log('controller')
    if (err) {
      res.send(err);
    } else {
      console.log('res', content);
      res.send(content);
    }
  });
};

// Define create API behavior.
exports.create = function(req, res) {
  const newContent = new Content(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field.' });
  } else {
    Content.create(newContent, function(err, content) {
      if (err) {
        res.send(err);
      } else {
        res.json({error: false, message: "Content added successfully!", data: content});
      }
    });
  }
};

// Define findById API behavior.
exports.findById = function(req, res) {
  Content.findById(req.params.id, function(err, content) {
    if (err) {
      res.send(err);
    } else {
      res.json(content);
    }
  });
};

// Define update API behavior.
exports.update = function(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field.' })
  } else {
    Content.update(req.params.id, new Content(req.body), function(err, content) {
      if (err) {
        res.send(err);
      } else {
        res.json({ error: false, message: 'Content successfully updated.' });
      }
    });
  }
};

// Define delete API behavior.
exports.delete = function(req, res) {
  Content.delete(req.params.id, function(err, content) {
    if (err) {
      res.send(err);
    } else {
      res.json({ error: false, message: 'Content successfully deleted.' })
    }
  });
};
