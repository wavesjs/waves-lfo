'use strict';

var { Lfo } = require('../core/lfo-base');

class Noop {
  constructor(previous, options = {}) {
    super(previous, options);
  }

  process(time, frame, metadata) {
    this.outputFrame = frame;

    this.output(time, metadata);
  }
}

module.exports = Noop;