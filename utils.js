"use strict";

var utils = {};

Object.defineProperties(utils, {
  filter: {value: require('../../../wave/ui/utils/filter-object')},
  extend: {value: require('extend')} // inherit the extend method from extend
});

// determines the methid to call depending on the returntype
Object.defineProperty(utils, 'getOpName', {
  value: function(type) {
    var processName = 'processScalar';
    if(type) processName = (type === 'scalar')? 'processScalar' : 'processArray';
    return processName;
  }
});

Object.defineProperty(utils, 'toA', {
  enumerable: true, value: function (it){ return (!Array.isArray(it))? [it]:it;}
});

Object.defineProperty(utils, 'last', {
  enumerable: true, value: function (arr) {return arr[arr.length-1];}
});

// pads an array to a certain size using the last value
Object.defineProperty(utils, 'pad', {
  enumerable: true, value: function (arr, size, value) {

    if (Math.abs(size) <= arr.length) return arr;
    value = value || this.last(arr);
    var out = [],
        i,
        len;

    if (size > 0) {
      for (i = 0;  i < size; ++i) out[i] = i < arr.length ? arr[i] : value;
    } else {
      size = Math.abs(size);
      len = size - arr.length;
      for (i = 0;  i < size; ++i) out[i] = i < len ? value : arr[i - len];
    }

    return out;
  }
});

// receives an array of values and returns an
// array of arrays each of them the size of the
// longest one, padded with the last value
Object.defineProperty(utils, 'lenAlign', {
  enumerable: true, value: function (values){
  
  var finalLen = 0, params = values.length;

  for (var i = 0; i < params; i++) {
    values[i] = this.toA(values[i]);
    if(values[i].length > finalLen) finalLen = values[i].length;
  }
  
  for (var j = 0; j < params; j++) values[j] = this.pad(values[j], finalLen);

  return values;
}
});

module.exports = utils;