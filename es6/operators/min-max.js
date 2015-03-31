'use strict';

var Lfo = require('../core/lfo-base');

class MinMax extends Lfo {
  constructor(options) {
    var defaults = {};

    super(options, defaults);
  }

  configureStream() {
    this.streamParams.frameSize = 2;
  }

  process(time, frame, metaData) {
    var min = +Infinity;
    var max = -Infinity;

    for (var i = 0, l = frame.length; i < l; i++) {
      var value = frame[i];
      if (value < min) { min = value; }
      if (value > max) { max = value; }
    }

    this.time = time;
    this.outFrame[0] = min;
    this.outFrame[1] = max;
    this.metaData = metaData;

    this.output();
  }
}

module.exports = MinMax;