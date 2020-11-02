"use strict";

// This is the generic template function generator to create callback function
// after response is got after a db query.
// params:
// result => a function taking in (err, res). It is provided from controller.
// errHandler => a function taking in (result, err) to actually handle errors.
// resHandler => a function taking in (result, res) to actually handle response.
exports.queryHandler = function(result, errHandler, resHandler) {
  return function(err, res) {
    if (err) {
      errHandler(result, err);
    } else {
      resHandler(result, res);
    }
  };
};

// Normal way to handle query error: log it and send it.
exports.sendErr = function(result, err) {
  console.log("error: ", err);
  result(err, null);
}

// Normal way to handle query response: send it.
exports.sendRes = function(result, res) {
  result(null, res);
}

// After inserting a new item to db, we better return insert id,
// rather than the entire response message.
exports.sendResInsertId = function(result, res) {
  console.log(res.insertId);
  result(null, res.insertId);
}
