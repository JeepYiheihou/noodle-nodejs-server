"use strict";

const datetimeGenerator = require("../../utils/controllers/datetime_generator");
const tokenGenerator = require("../../utils/controllers/token_generator");
const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

const User = require("../models/user_model");

// ======================== Private APIs ========================

function _errInvalidAuthorization(res) {
  res.status(400).send({ error: true, message: "You don't have the authorization to do this." });
}

function _errInvalidUserPassword(res) {
  res.status(400).send({ error: true, message: "Invalid user or password." });
}

function _errUserAlreadyExisted(res) {
  res.status(400).send({ error: true, message: "User already existed with this email." });
}

function _errUserNotFound(res) {
  res.status(400).send({ error: true, message: "User not found." });
}

function _errFieldsRequired(res) {
  res.status(400).send({ error: true, message: "Please provide all required field." });
}

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in user part!" });
}

async function _create(req, res) {

  try {
    /* Check request body. */
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Check no users are using this email. */
    const userList = await User.findByEmail(req.body.email);
    if (userList.length != 0) {
      _errUserAlreadyExisted(res);
      return;
    }

    /* Create new user. */
    const newUser = new User(req.body);
    newUser.createdTime = datetimeGenerator.generateDateTime();

    /* Insert it to database. */
    const response = await User.create(newUser);
    const message = "User successfully created!";
    res.json({ error: false, message: message, id: response.insertId });
  } catch (err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findAll(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    const userList = await User.findAll();
    res.json(userList);
  } catch (err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findById(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    const userList = await User.findById(req.params.id);
    /* Check that the user is found. */
    if (userList.length == 1) {
      const user = userList[0];
      res.json(user);
    } else if (userList.length == 0) {
      _errUserNotFound(res);
    } else {
      throw userList;
    }
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _update(req, res) {
  /* Check if the user has the right to operate UPDATE. */
  if (req.params.id != req.query.id) {
    _errInvalidAuthorization(res);
    return;
  }

  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Udpate the fields into database. */
    const response = await User.update(req.params.id, req.body);
    var message;
    if (response.affectedRows == 1) {
      message = "User successfully updated.";
    } else if (response.affectedRows == 0) {
      message = "Cannot find the user with given id. Maybe already deleted.";
    } else {
      throw response;
    }
    res.json({ error: false, message: message });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _delete(req, res) {
  /* Check if the user has the right to operate DELETE. */
  if (req.params.id != req.query.id) {
    _errInvalidAuthorization(res);
    return;
  }

  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    /* Delete the record from database. */
    const response = await User.delete(req.params.id);
    var message;
    if (response.affectedRows == 1) {
      message = "User successfully deleted.";
    } else if (response.affectedRows == 0) {
      message = "User doesn't exist.";
    } else {
      throw response;
    }
    res.json({ error: false, message: message });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _login(req, res) {
  try {
    const userList = await User.findByName(req.body.name);

    /* Check that we only find one entry. */
    if (userList.length == 0) {
      _errInvalidUserPassword(res);
      return;
    } else if (userList.length != 1) {
      throw userList;
    }

    /* Check that password matches. */
    const user = userList[0];
    if (user.password != req.body.password) {
      _errInvalidUserPassword(res);
      return;
    }

    /* Generate new token and SET it into redis. */
    var newToken = tokenGenerator.generate();
    await User.setToken(user.id, newToken);
    user["token"] = tokenGenerator.makeJSON(newToken);
    res.json(user);
  } catch (err) {
    console.log(err);
    _errDetectedThrownError(res)
  }
}

// ======================== Public APIs ========================

// Define create API behavior.
// Token check is not required.
exports.create = function(req, res) {
  _create(req, res);
};

// Define findAll API behavior.
// Token check is required.
exports.findAll = function(req, res) {
  _findAll(req, res);
};

// Define findById API behavior.
// Token check is required.
exports.findById = function(req, res) {
  _findById(req, res);
};

// Define update API behavior.
// Token check is required.
exports.update = function(req, res) {
  _update(req, res);
};


// Define delete API behavior.
// Token check is required.
exports.delete = function(req, res) {
  _delete(req, res);
};

// Define login API behavior.
// Token check is not required.
exports.login = function(req, res) {
  _login(req, res);
};
