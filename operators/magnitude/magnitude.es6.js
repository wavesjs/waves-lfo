
"use strict";

var Lfo = require('../../lfo-base');

class Magnitude extends Lfo {

  constructor(previous = null, options = {}) {

    if (!(this instanceof Magnitude)) return new Magnitude(previous, options);

    super(previous, options, {normalize: false});

    this.type = 'mag';

    // sets all the necessary logic based on the params
    this.setupStream({frameSize: 1});
  }

  process(time, frame) {

    var frameSize = this.streamParams.frameSize,
      normalize = this.params.normalize,
      sum = 0,
      i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    if(normalize)
      sum /= frameSize;

    this.outFrame.set([Math.sqrt(sum)], 0);
    this.output(time);
  }
}

module.exports = Magnitude;