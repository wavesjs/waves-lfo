
"use strict";

var Lfo = require('../core/lfo-base');

class Magnitude extends Lfo {

  constructor(options = {}) {
    var defaults = {
      normalize: false
    };

    super(options, defaults);

    // this.type = 'magnitude';
  }

  configureStream() {
    this.streamParams.frameSize = 1;
  }

  process(time, frame, metaData) {
    var frameSize = frame.length;
    var sum = 0;
    var i = 0;

    for (i = 0; i < frameSize; i++) {
      sum += (frame[i] * frame[i]);
    }

    if (this.params.normalize) {
      // sum is a mean here (for rms)
      sum /= frameSize;
    }

    this.time = time;
    this.outFrame[0] = Math.sqrt(sum);
    this.metaData = metaData;

    this.output();
  }
}

module.exports = Magnitude;