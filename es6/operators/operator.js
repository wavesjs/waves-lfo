'use strict';

var { Lfo } = require('../core/lfo-base');

// apply a given function on each frame
class Operator extends Lfo {

  constructor(previous, options) {
    super(previous, options, {});

    this.params.type = this.params.type || 'scalar';

    if (this.params.type === 'vector' && this.params.frameSize) {
      this.setupStream({ frameSize: this.params.frameSize });
    } else {
      // if type `scalar` outFrame.length === inFrame.length
      this.setupStream();
    }
  }

  // register the callback to be consumed in process

  // @SIGNATURE scalar callback
  // function(value, index, frame) {
  //   return doSomething(value)
  // }

  // @SIGNATURE vector callback
  // function(time, inFrame, outFrame) {
  //   outFrame.set(inFrame, 0);
  //   return time + 1;
  // }
  callback(func) {
    // bind current context
    this.callback = func.bind(this);
  }

  process(time, frame, metaData) {
    // apply the callback to the frame
    if (this.params.type === 'vector') {
      var outTime = this.callback(time, frame, this.outFrame);

      if (outTime !== undefined) {
        time = outTime;
      }
    } else {
      for (var i = 0, l = frame.length; i < l; i++) {
        this.outFrame[i] = this.callback(frame[i], i);
      }
    }

    this.time = time;
    this.metaData = metaData;

    this.output();
  }
};

module.exports = Operator;