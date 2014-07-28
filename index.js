"use strict";

var pck = require('./package.json');
var LFP = require('../lfp');
var _lfp = Object.create(LFP); // inherit from base lfp

Object.defineProperties(_lfp, {
  type: {value: pck.name},
  newFrame: {writable: true},
  frameSize : {writable: true} // freameoutout
});

Object.defineProperty(_lfp, 'init', {
  value: function() {
    this.newFrame = new Float32Array(1);
    this.frameSize = 1;
    return this;
  }
});

Object.defineProperty(_lfp, 'process', {
  value: function(time, frame) {

    var frameSize = frame.length;
    var sum = 0;
    var i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);
    
    time -= this.offset;
    this.newFrame.set([Math.sqrt(sum / frameSize)], 0);
    this.nextOperator(time, this.newFrame);
  }
});

module.exports = function(opts) {
  // creates an instance and returns it initialized
  return LFP.create(_lfp, opts);
};
