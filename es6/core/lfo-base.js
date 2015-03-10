
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

    this.params = Object.assign(defaults, options);

    if (previous) {
      // add ourselves to the previous operator if its passed
      previous.add(this);
      // pass on stream params
      this.streamParams = Object.assign({}, previous.streamParams);
    }
  }

  // common stream config based on the instantiated params
  setupStream(opts = {}) {
    if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
    if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }

    this.outFrame = new Float32Array(this.streamParams.frameSize);
  }

  // bind child node
  add(lfo = null) {
    this.on('frame', (t, d) => {
      lfo.process(t, d);
    });
  }

  // we take care of the emit ourselves
  output(outTime = null) {
    if (!outTime) outTime = this.time;
    this.emit('frame', outTime, this.outFrame);
  }

  // removes all children from listening
  remove() {
    this.removeAllListeners('frame');
  }

  process(time, data) {
    console.error('process not implemented');
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
