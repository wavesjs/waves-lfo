
"use strict";

var Lfo = require('lfo');

class Magnitude extends Lfo {

  constructor(previous = null, options = {}) {

    if (!(this instanceof Magnitude)) return new Magnitude(previous, options);

    super(previous, options);

    // pubs
    this.type = 'mag';
    // privs
    this.__outFrame = new Float32Array(1);
    this.__frameSize = options.frameSize || 2048;
    this.__offset = options.offset || 0;
  }


  process(time, frame) {

    var outFrame = this.__outFrame,
      frameSize  = this.__frameSize,
      sum = 0,
      i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    time -= this.__offset;
    outFrame.set([Math.sqrt(sum / frameSize)], 0);
    this.emit('frame', time, outFrame);
  }
}

module.exports = Magnitude;