"use strict";

const datetimeGenerator = require("../../utils/controllers/datetime_generator");
const tokenValidator = require("../../utils/controllers/token_validator");
const checkToken = tokenValidator.checkToken;

const Commodity = require("../models/commodity_model");

/* ======================== Private APIs ======================== */

function _errDetectedThrownError(res) {
  res.status(400).send({ error: true, message: "Error detected in commodity part!" });
}

function _errFieldsRequired(res) {
  res.status(400).send({ error: true, message: "Please provide all required field." });
}

function _errCommodityNotFound(res) {
  res.status(400).send({ error: true, message: "Commodity not found." });
}

function _wrapCommodityListToJsonResponse(commodityList) {
  return { totalHits: commodityList.length, hits: commodityList };
}

async function _create(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      _errFieldsRequired(res);
      return;
    }

    /* Create new commodity. */
    const newCommodity = new Commodity(req.body);
    newCommodity.createdTime = datetimeGenerator.generateDateTime();

    /* Insert it to database. */
    const response = await Commodity.create(newCommodity);
    const message = "Commodity successfully created.";
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

    const commodityList = await Commodity.findById(req.params.id);
    /* Check that the commodity is found. */
    if (commodityList.length == 1) {
      const commodity = commodityList[0];
      res.json(commodity);
    } else if (commodityList.length == 0) {
      _errCommodityNotFound(res);
    } else {
      throw commodityList;
    }

  } catch(err) {
    console.log(err);
    _errDetectedThrownError(res);
  }
}

async function _findByContentId(req, res) {
  try {
    /* Check token of the request. */
    if (!await checkToken(req, res)) { return; }

    const commodityList = await Commodity.findByContentId(req.params.id);
    res.json(_wrapCommodityListToJsonResponse(commodityList));
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
    const response = await Commodity.update(req.params.id, req.body);
    if (response.affectedRows == 1) {
      const message = "Commodity successfully updated.";
      res.json({ error: false, message: message });
    } else if (response.affectedRows == 0) {
      _errCommodityNotFound(res);
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

    /* Delete the record from database. */
    const response = await Commodity.delete(req.params.id);
    if (response.affectedRows == 1) {
      const message = "Commodity successfully deleted.";
      res.json({ error: false, message: message });
    } else if (response.affectedRows == 0) {
      _errCommodityNotFound(res);
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

/* Define findById API behavior.
 * Token is required. */
exports.findByContentId = function(req, res) {
  _findByContentId(req, res);
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
