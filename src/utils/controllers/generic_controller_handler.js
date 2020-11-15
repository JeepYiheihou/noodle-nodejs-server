"use strict";

// This is the generic template function generator to create callback function
// after response is got from model layer's db queries back to controller layer.
// params:
// res => the parameter passed down from express.js routers.
// errHandler => a function taking in (result, err) to actually handle errors.
// resHandler => a function taking in (result, resBack) to actually handle response.
exports.ctrHandler = function(res, errHandler, resHandler) {
  return function(err, resBack) {
    if (err) {
      errHandler(res, err);
    } else {
      resHandler(res, resBack);
    }
  };
};

// Normal way to handle error: log it and send it.
exports.sendErr = function(res, err) {
  console.log("error: ", err);
  res.send(err);
}

// Normal way to handle response: send it in JSON format.
exports.sendData = function(res, data) {
  res.json(data);
}

// Normal way to handle response: send a success message.
exports.sendMessage = function(res, message) {
  return function(res, data) {
    // In this case the resBack is not used, since we don't expose it.
    // We just send a message to front end client.
    res.json({ error: false, message: message });
  };
};

// Handler response: send both message and response data.
exports.sendMessageAndData = function(res, message) {
  return function(res, data) {
    res.json({ error: false, message: message, data: data });
  }
}

// Handler response: wrap and send the response data of contents.
exports.sendWrappedContentData = function(res, data) {
    res.json({totalHits: data.length, hits: data })
}
