"use strict";

var LFP = require('../lfp');
var _lfp = Object.create(LFP); // inherit from base lfp

var newFrame = new Float32Array(1);

Object.defineProperty(_lfp, 'processScalar', {
  value: function(data) {

    var time = data[0];
    var frame = data[1];
    var frameSize = frame.length;
    var sum = 0;
    var i;

    for (i = 0; i < frameSize; i++) sum += frame[i] * frame[i];
    newFrame.set([Math.sqrt(sum / frameSize)], 0);
    this.nextOperator([time, newFrame]);
  }
});

module.exports = function(opts) {
  _lfp.type = 'rms';
  return Object.create(_lfp.init(opts));
};
