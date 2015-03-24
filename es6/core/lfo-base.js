'use strict';

var id = 0;

class Lfo {
  constructor(parent = null, options = {}, defaults = {}) {
    this.cid = id++;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0
    };

    this.params = Object.assign({}, defaults, options);
    this.children = [];

    if (parent) {
      if (parent.streamParams === null) {
        throw new Error('cannot connect to as dead node');
      }
      // add ourselves to the parent operator if its passed
      parent.add(this);
      // pass on stream params
      this.streamParams = Object.assign({}, parent.streamParams);
    }
  }

  // reset `outFrame` and call reset on children
  reset() {}

  // fill the on-going buffer with 0
  // output it, then call reset on all the children
  finalize() {}

  // common stream configuration based on the given params
  setupStream(opts = {}) {
    if (opts.frameRate) {
      this.streamParams.frameRate = opts.frameRate;
    }

    if (opts.frameSize) {
      this.streamParams.frameSize = opts.frameSize;
    }

    if (opts.blockSampleRate) {
      this.streamParams.blockSampleRate = opts.blockSampleRate;
    }

    this.outFrame = new Float32Array(this.streamParams.frameSize);
  }

  // bind child node
  add(lfo = null) {
    this.children.push(lfo);
  }

  // forward the current state (time, frame, metaData) to all the children
  output(time = this.time, outFrame = this.outFrame, metaData = this.metaData) {
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].process(time, outFrame, metaData);
    }
  }

  // main function to override, defaults to noop
  process(time, frame, metaData) {
    this.time = time;
    this.outFrame = frame;
    this.metaData = metaData;

    this.output();
  }

  destroy() {
    // call `destroy` in all it's children
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].destroy();
    }

    // delete itself from the parent node
    if (this.previous) {
      var index =  parent.children.indexOf(this);
      parent.children.splice(index, 1);
    }

    // cannot use a dead object as parent
    this.streamParams = null;

    // clean it's own references / disconnect audio nodes if needed
  }

}

module.exports = Lfo;
