"use strict";

var Lfp = require('../lfp');

class Magnitude extends Lfp {

  constructor(previous = null, options = {}) {

    if (!(this instanceof Magnitude)) return new Magnitude(previous, options);

    super(previous, options);

    this.declareMembers(["type", "outFrame", "frameSize", "offset"]);

    this.type = 'mag';
    this.outFrame = new Float32Array(1);
    this.frameSize = options.frameSize || 2048;

  }

  process(time, frame) {

    var outFrame = this.outFrame,
      frameSize = this.frameSize,
      sum = 0,
      i;

    for (i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    time -= this.offset;
    outFrame.set([Math.sqrt(sum / frameSize)], 0);
    this.nextOperators(time, outFrame);
  }
}

module.exports = Magnitude;