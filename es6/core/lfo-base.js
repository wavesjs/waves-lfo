'use strict';

var id = 0;

class Lfo {
  constructor(parent = null, options = {}, defaults = {}) {
    this.cid = id++;
    this.params = {};
    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      blockSampleRate: 0
    };

    this.params = Object.assign({}, defaults, options);
    this.children = [];

    if (parent) {
      if (parent.streamParams === null) {
        throw new Error('cannot connect to as dead lfo node');
      }

      this.parent = parent;
      // add ourselves to the parent operator if its passed
      this.parent.add(this);
      // pass on stream params
      this.streamParams = Object.assign({}, this.parent.streamParams);
    }
  }

  // reset `outFrame` and call reset on children
  reset() {
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].reset();
    }

    // sinks have no `outFrame`
    if (!this.outFrame) { return }

    // this.outFrame.fill(0); // probably better but doesn't work yet
    for (let i = 0, l = this.outFrame.length; i < l; i++) {
      this.outFrame[i] = 0;
    }
  }

  // fill the on-going buffer with 0
  // output it, then call reset on all the children (sure ?)
  // @NOTE: what about calling `reset` in `sources.start`
  //  if `reset` is called here, it will be called more than once in a child node
  finalize() {
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].finalize();
    }
  }

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
    var index = this.children.length;
    while (index--) {
      this.children[index].destroy();
    }

    // delete itself from the parent node
    if (this.parent) {
      var index =  this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
    }

    // cannot use a dead object as parent
    this.streamParams = null;

    // clean it's own references / disconnect audio nodes if needed
  }

}

module.exports = Lfo;
