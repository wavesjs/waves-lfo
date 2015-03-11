'use strict';

var { Lfo } = require('../core/lfo-base');

class Noop {
  constructor(previous, options = {}) {
    super(previous, options);
  }

  process(time, frame) {
    this.outputFrame = frame;

    this.output(time);
  }
}

module.exports = Noop;