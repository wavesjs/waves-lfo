
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
    var frameSize = this.streamParams.frameSize,
      normalize = this.params.normalize,
      sum = 0,
      i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    if(normalize) sum /= frameSize;

    this.outFrame.set([Math.sqrt(sum)], 0);
    this.output(time);
  }
}

function factory(previous, options) {
  return new Magnitude(previous, options);
}
factory.Magnitude = Magnitude;

module.exports = factory;