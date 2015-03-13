
"use strict";

var { Lfo } = require('../core/lfo-base');

class Magnitude extends Lfo {

  constructor(previous = null, options = {}) {
    super(previous, options, { normalize: false });
    this.type = 'magnitude';
    // sets the necessary logic based on the params
    this.setupStream({ frameSize: 1 });
  }

  process(time, frame) {
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

    this.outFrame[0] = Math.sqrt(sum);
    this.output(time);
  }
}

function factory(previous, options) {
  return new Magnitude(previous, options);
}
factory.Magnitude = Magnitude;

module.exports = factory;