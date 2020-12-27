"use strict";

const datetimeGenerator = require("../../utils/controllers/datetime_generator");
const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

const Content = require("../models/content_model");

/* ======================== Private APIs ======================== */

function _errInvalidAuthorization(res) {
  res.status(400).send({ error: true, message: "You don't have the authorization to do this." });
}

function _errFieldsRequired(res) {
  res.status(400).send({ error: true, message: "Please provide all required field." });
}

function _errInvalidRangeStartOrEndNeeded(res) {
  res.status(400).send({ error: true, message: "Invalid range. Please provide start or end params." });
}

function _errInvalidRangeWithStartLargerThanEnd(res) {
  res.status(400).send({ error: true, message: "Invalid range. Start cannot be larger than end." });
}

function _errContentNotFound(res) {
  res.status(400).send({ error: true, message: "Content not found." });
}

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in content part!" });
}

function _wrapContentListToJsonResponse(contentList) {
  return { totalHits: contentList.length, hits: contentList };
}

async function _create(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Create new content. */
    const newContent = new Content(req.body);
    newContent.creater = req.query.id;
    newContent.createdTime = datetimeGenerator.generateDateTime();

    /* Insert it to database. */
    const response = await Content.create(newContent);
    const message = "Content successfully created.";
    res.json({ error: false, message: message, id: response.insertId });
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findById(req, res) {
  try {
    /* Check token of the request. */
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

async function _findAll(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    const contentList = await Content.findAll();
    res.json(_wrapContentListToJsonResponse(contentList));
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findByRange(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    /* Check start and end are provided. */
    if (!req.query.start || !req.query.end) {
      _errInvalidRangeStartOrEndNeeded(res);
      return;
    }

    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);

    /* Check end is larger than or equal to start. */
    if (start > end) {
      _errInvalidRangeWithStartLargerThanEnd(res);
      return;
    }

    const contentList = await Content.findByRange(start, end);
    res.json(_wrapContentListToJsonResponse(contentList));
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _update(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Update the fields into database. */
    const response = await Content.update(req.params.id, req.body);
    if (response.affectedRows == 1) {
      const message = "Content successfully updated.";
      res.json({ error: false, message: message });
    } else if (response.affectedRows == 0) {
      _errContentNotFound(res);
    } else {
      throw response;
    }
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _delete(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    /* First, check if the content was created by the requester. */
    const contentList = await Content.findById(req.params.id);
    if (contentList.length == 1) {
      const content = contentList[0];
      if (content.creater != req.query.id) {
        _errInvalidAuthorization(res);
        return;
      }
    } else if (contentList.length == 0) {
      _errContentNotFound(res);
      return;
    } else {
      throw response;
    }

    /* Delete the record from database. */
    const response = await Content.delete(req.params.id);
    if (response.affectedRows == 1) {
      const message = "Content successfully deleted.";
      res.json({ error: false, message: message });
    } else if (response.affectedRows == 0) {
      _errContentNotFound(res);
    } else {
      throw response;
    }
  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

/* ======================== Public APIs ======================== */

/* Define create API behavior.
/* Token is required. */
exports.create = function(req, res) {
  _create(req, res);
};

/* Define findById API behavior.
 * Token is required. */
exports.findById = function(req, res) {
  _findById(req, res);
};

/* Define findAll API behavior.
 * Token is required. */
exports.findAll = function(req, res) {
  _findAll(req, res);
};

/* Define findByRange API behavior.
 * Token is required. */
exports.findByRange = function(req, res) {
  _findByRange(req, res);
};

/* Define update API behavior.
 * Token is required. */
exports.update = function(req, res) {
  _update(req, res);
};

/* Define delete API behavior.
 * Token is required. */
exports.delete = function(req, res) {
  _delete(req, res);
};
