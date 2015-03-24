'use strict';

var Lfo = require('../core/lfo-base');

class Noop extends Lfo {
  constructor(previous, options = {}) {
    super(previous, options);
    this.setupStream();
  }

  process(time, frame, metaData) {
    this.outFrame.set(frame, 0);
    this.time = time;
    this.metaData = metaData;

    this.output();
  }
}

module.exports = Noop;