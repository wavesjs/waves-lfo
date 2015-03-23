
"use strict";

var EventEmitter = require('events').EventEmitter;
// var extend = require('object-assign');

class Lfo extends EventEmitter {

  constructor(previous = null, options = {}, defaults = {}) {
    this.idx = 0;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = Object.assign({}, defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = Object.assign({}, previous.streamParams);
    }
  }

  // reset `outFrame` and call reset on children
  reset() {}

  // fill the on-going buffer with 0
  // output it, then call reset on all the children
  // @NOTE the event based system (async) could produce that the reset
  //       could be called before the child finalize
  finalize() {}

  // common stream config based on the instantiated params
  setupStream(opts = {}) {
    if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
    if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
    if (opts.blockSampleRate) { this.streamParams.blockSampleRate = opts.blockSampleRate; }

    this.outFrame = new Float32Array(this.streamParams.frameSize);
  }

  // bind child node
  add(lfo = null) {
    this.on('frame', function(time, frame, metaData) {
      lfo.process(time, frame, metaData);
    });
  }

  // we take care of the emit ourselves
  output(outTime = this.time, outFrame = this.outFrame, metaData = this.metaData) {
    this.emit('frame', outTime, outFrame, metaData);
  }

  // removes all children from listening
  remove() {
    this.removeAllListeners('frame');
  }

  process(time, frame, metadata) {
    this.time = time;
  }

  // will delete itself from the parent node
  // @NOTE this node and all his children will never garbage collected
  // `this.previous = null` fixes the first problem but not the second one
  destroy() {
    if (!this.previous) { return; }
    this.previous.removeListener('frame', this);
  }

}

function factory(previous, options, defaults) {
  return new Lfo(previous, options, defaults);
}
factory.Lfo = Lfo;

module.exports = factory;
