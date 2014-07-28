"use strict";

var _lfp = require('./utils');

Object.defineProperties(_lfp, {
  config: { writable: true },
  _init: {value: null },
  _pipe: {value: null },
  offset: {writable: true, value: 0 },
  allowedThrough: { writable: true, value: ['sampleRate', 'frameSize', 'frameRate'] },
  operators: { writable: true }
});

// pseudo sub-class constructor
Object.defineProperty(_lfp, 'create', {
  enumerable: true, value: function(object, opts) {
    var o = Object.create(object);
    var ins = this.initialize.call(o, opts);
    return ins;
  }
});

Object.defineProperty(_lfp, 'initialize', {
  writable: true, value: function(opts) {

    this.config = this.filter(opts || {}, this.allowedThrough);
    this.operators = [];

    if(this.init)
      this.init(this.extend(this.config, opts));

    this.config.offset = this.offset;

    return this;
  }
});

// loop through the branches and call the appropiate method on the next one down the pipe
Object.defineProperty(_lfp, 'nextOperator', {
  writable: true, enumerable: true, value: function(time, data) {
    var operators = this.operators;
    for (var i = 0; i < operators.length; i++) {
      var op = operators[i]; // the next operator object 
      op.process.call(op, time, data); // call the process
    }
  }
});

// initiates the next processor with config
Object.defineProperty(_lfp, 'pipe', {
  writable: true, enumerable: true, value: function(_next, _cfg) {

    // we can still modify the config
    if(this._pipe) this._pipe(_next, _cfg);

    // inherit config from the previous objects
    var cfg = this.extend(this.config, _cfg);
    var nextProcessor = _next(cfg);
    this.operators.push(nextProcessor);

    return nextProcessor;
  }
});

module.exports = _lfp;