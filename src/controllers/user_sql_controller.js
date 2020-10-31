'use strict';

const User = require('../models/user_model');

// Define findAll API behavior.
exports.findAll = function(req, res) {
  User.findAll(function(err, user) {
    console.log('controller')
    if (err) {
      res.send(err);
    } else {
      console.log('res', user);
      res.send(user);
    }
  });
};

// Define create API behavior.
exports.create = function(req, res) {
  const newUser = new User(req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field.' });
  } else {
    User.create(newUser, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({error: false, message: "User added successfully!", data: user});
      }
    });
  }
};

// Define findById API behavior.
exports.findById = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
};

// Define update API behavior.
exports.update = function(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field.' })
  } else {
    User.update(req.params.id, new User(req.body), function(err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json({ error: false, message: 'User successfully updated.' });
      }
    });
  }
};

// Define delete API behavior.
exports.delete = function(req, res) {
  User.delete(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json({ error: false, message: 'User successfully deleted.' });
    }
  });
};

// Define verify API behavior.
// Note that name and password are in the query field of the req, not params.
// Because the query url comes as '/user/verify?name=foo,password=bar'.
exports.verify = function(req, res) {
  User.findByName(req.query.name, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      console.log(user);
      // Here we need to go with user[0] because the returned item is like:
      // [ TextRow { id: 1, name: 'admin', ... } ]
      // Basically an array of users. And only one user in this case.
      if (user && user.length == 1 && req.query.password === user[0].password) {
        res.json(user);
      } else {
        res.send({ error: true, message: 'Invalid user or password'});
      }
    }
  });
};
