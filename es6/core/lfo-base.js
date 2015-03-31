'use strict';

var id = 0;

class Lfo {
  constructor(options = {}, defaults = {}) {
    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      blockSampleRate: 0
    };

    this.params = Object.assign({}, defaults, options);
    this.children = [];

    // if (parent) {
    //   if (parent.streamParams === null) {
    //     throw new Error('cannot connect to as dead lfo node');
    //   }

    //   this.parent = parent;
    //   // add ourselves to the parent operator if its passed
    //   this.parent.add(this);
    //   // pass on stream params
    //   this.streamParams = Object.assign({}, this.parent.streamParams);
    //   // console.log(parent, this.streamParams);
    //   // this.setupStream();
    // }
  }

  // webAudioAPI connect like method
  connect(child) {
    if (this.streamParams === null) {
      throw new Error('cannot connect to a dead lfo node');
    }

    this.children.push(child);
    child.parent = this;
  }

  // initialize the current node stream and propagate to it's children
  initialize() {
    if (this.parent) {
      // defaults to inherit parent's stream parameters
      // reuse the same object each time
      this.streamParams = Object.assign(this.streamParams, this.parent.streamParams);
    }

    // entry point for stream params configuration in derived class
    this.configureStream();
    // create the `outStream` arrayBuffer
    this.setupStream();

    // propagate initialization in lfo chain
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].initialize();
    }
  }

  // for sources only
  // start() {
  //   this.initialize();
  //   this.reset();
  // }

  //
  configureStream() {
    if (this.params.frameSize) {
      this.streamParams.frameSize = this.params.frameSize;
    }

    if (this.params.frameRate) {
      this.streamParams.frameRate = this.params.frameRate;
    }

    if (this.params.blockSampleRate) {
      this.streamParams.blockSampleRate = this.params.blockSampleRate;
    }
  }
  // common stream configuration based on the given params
  setupStream(/* opts = {} */) {
    // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
    // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
    // if (opts.blockSampleRate) { this.streamParams.blockSampleRate = opts.blockSampleRate; }

    this.outFrame = new Float32Array(this.streamParams.frameSize);
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
  // @NOTE: `reset` is called in `sources.start`,
  //  if is called here, it will be called more than once in a child node
  //  is this a problem ?
  finalize() {
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].finalize();
    }
  }

  // bind child node
  // add(lfo) {
  //   this.children.push(lfo);
  // }

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
