"use strict";

var _lfp = {};

Object.defineProperties(_lfp, {
  operators: { writable: true, value: []},
  returnType: { enumerable: true, value: 'scalar'},
  extend: {value: require('extend')} // inherit the extend method from extend
});

// determines the methid to call depending on the returntype
Object.defineProperty(_lfp, 'getOpName', {
  value: function(type) {
      var processName = 'processScalar';
      if(type) processName = (type === 'scalar')? 'processScalar' : 'processArray';
      return processName;
  }
});

Object.defineProperty(_lfp, 'toA', {
  enumerable: true, value: function (it){ return (!Array.isArray(it))? [it]:it;}
});

Object.defineProperty(_lfp, 'last', {
  enumerable: true, value: function (arr) {return arr[arr.length-1];}
});

Object.defineProperty(_lfp, 'pad', {
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

Object.defineProperty(_lfp, 'init', {
  enumerable: true, value: function (opts){
    this.options = opts;
    return this;
  }
});


// receives an array of values and returns an
// array of arrays each of them the size of the
// longest one, padded with the last value
Object.defineProperty(_lfp, 'lenAlign', {
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

// loop through the branches and call the appropiate method on the next one down the pipe
Object.defineProperty(_lfp, 'nextOperator', {
  writable: true, enumerable: true, value: function(data) {
    var operators = this.operators;

    for (var i = 0; i < operators.length; i++) {
      var op = operators[i][0]; // the operator object 
      var method = operators[i][1]; // the method that processes
      method.call(op, data); // call the method within the operator context
    }
  }
});

Object.defineProperty(_lfp, 'pipe', {
  writable: true, enumerable: true, value: function(_next, _cfg) {
    
    var cfg = this.extend(this.options, {
      inFrameRate: this.outFrameRate || 0
    }, _cfg);

    // compute the necessary values in advance to avoid doing it on runtime
    var nextProc = _next(cfg);
    var oName = this.getOpName(nextProc.returnType);
    
    // console.log(this.type +' -> '+ nextProc.type +'.'+ oName+'()');

    this.operators.push([nextProc, nextProc[oName]]); // [the object, the method]

    return nextProc;
  }
});

module.exports = _lfp;