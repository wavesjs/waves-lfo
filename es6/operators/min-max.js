'use strict';

var Lfo = require('../core/lfo-base');

class MinMax extends Lfo {
  constructor(previous, options) {
    var defaults = {};

    super(previous, options, defaults);

    this.setupStream({ frameSize: 2 });
  }

  process(time, frame, metaData) {
    var min = +Infinity;
    var max = -Infinity;

    for (var i = 0, l = frame.length; i < l; i++) {
      var value = frame[i];
      if (value < min) { min = value }
      if (value > max) { max = value }
    }

    this.time = time;
    this.outFrame.set([min, max], 0);
    this.metaData = metaData;

    this.output();
  }
}

module.exports = MinMax;