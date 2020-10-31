'use strict';

// Parse an object into mysql INSERT compatible query string.
// For example:
// {'foo': 'bar', 'name': 'alice'} => 'foo=bar,name=alice'.
exports.parse = function(objectToParse) {
  var str = '';
  var property;
  for (property in objectToParse) {
    str = str.concat(property, '=', objectToParse[property], ',')
  }
  // Trim the last ','
  if (str) {
    str = str.slice(0, -1);
  }
  return str;
};
