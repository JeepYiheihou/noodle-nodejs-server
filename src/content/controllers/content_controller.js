"use strict";

const datetimeGenerator = require("../../utils/controllers/datetime_generator");
const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

const Content = require("../models/content_model");

// ======================== Private APIs ========================

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in content part!" });
}

function _errFieldsRequired(res) {
  res.status(400).send({ error: true, message: "Please provide all required field." });
}

async function _create(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    const newContent = new Content(req.body);
    const response = await Content.create(newContent);
    const message = "Content created successfully!";
    res.json({ error: false, message: message, id: response.insertId });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findAll(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    const contentList = await Content.findAll();
    res.json(contentList);
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findByRange(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    const contentList = await Content.findByRange(req.query.start, req.query.end);
    res.json(contentList);
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findById(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    const contentList = await Content.findById(req.params.id);
    /* Check that the content is found. */
    if (contentList.length == 1) {
      const content = contentList[0];
      res.json(content);
    } else if (contentList.length == 0) {
      _errContentNotFound(res);
    } else {
      throw contentList;
    }
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _update(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Update the fields into database. */
    const response = await Content.update(req.params.id, req.body);
    var message;
    if (response.affectedRows == 1) {
      message = "Content successfully updated.";
    } else if (response.affectedRows == 0) {
      message = "Cannot find the content with given id. Maybe already deleted.";
    } else {
      throw response;
    }
    res.json({error: false, message: message });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _delete(req, res) {
  try {
    /* Check token of the request */
    if (!await checkToken(req, res)) { return; }

    /* Delete the record from database. */
    const response = await Content.delete(req.params.id);
    var message;
    if (response.affectedRows == 1) {
      message = "Content successfully deleted.";
    } else if (response.affectedRows == 0) {
      message = "Content doesn't exist.";
    } else {
      throw response;
    }
    res.json({ error: false, message: message });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

// ======================== Public APIs ========================

// Define create API behavior.
// Token is required.
exports.create = function(req, res) {
  _create(req, res);
};

// Define findAll API behavior.
// Token is required.
exports.findAll = function(req, res) {
  _findAll(req, res);
};

// Define findByRange API behavior.
// Token is required.
exports.findByRange = function(req, res) {
  _findByRange(req, res);
};

// Define findById API behavior.
// Token is required.
exports.findById = function(req, res) {
  _findById(req, res);
};

// Define update API behavior.
// Token is required.
exports.update = function(req, res) {
  _update(req, res);
};

// Define delete API behavior.
// Token is required.
exports.delete = function(req, res) {
  _delete(req, res);
};
