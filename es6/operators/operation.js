'use strict';

var { Lfo } = require('../core/lfo-base');

// apply a given function on each frame
class Operation extends Lfo {

  constructor(previous, options) {
    super(previous, options, {});
  }

  process(time, frame, metadata) {
    // copy input frame
    this.outFrame.set(frame, 0);
    // apply the callback to the frame
    this.outFrame.forEach(this.params.func);

    super.process();
    this.output();
  }

};

module.exports = Operation;