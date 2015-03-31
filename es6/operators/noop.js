'use strict';

var Lfo = require('../core/lfo-base');

class Noop extends Lfo {
  constructor(previous, options = {}) {
    super(previous, options);
  }

  // default noop - override if needed
  process(time, frame, metaData) {
    this.outFrame.set(frame, 0);
    this.time = time;
    this.metaData = metaData;

    this.output();
  }
}

module.exports = Noop;