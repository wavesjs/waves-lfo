let id = 0;

export default class BaseLfo {
  constructor(options = {}, defaults = {}) {
    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = Object.assign({}, defaults, options);
    this.children = [];
  }

  // WebAudioAPI `connect` like method
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
      this.streamParams = Object.assign(this.streamParams, this.parent.streamParams);
    }

    // entry point for stream params configuration in derived class
    this.configureStream();
    // create the `outFrame` arrayBuffer
    this.setupStream();

    // propagate initialization in lfo chain
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].initialize();
    }
  }

  // sources only
  // start() {
  //   this.initialize();
  //   this.reset();
  // }

  /**
   * override inherited streamParams, only if specified in `params`
   */
  configureStream() {
    if (this.params.frameSize) {
      this.streamParams.frameSize = this.params.frameSize;
    }

    if (this.params.frameRate) {
      this.streamParams.frameRate = this.params.frameRate;
    }

    if (this.params.sourceSampleRate) {
      this.streamParams.sourceSampleRate = this.params.sourceSampleRate;
    }
  }

  /**
   * create the outputFrame according to the `streamParams`
   * @NOTE remove commented code ?
   */
  setupStream(/* opts = {} */) {
    // if (opts.frameRate) { this.streamParams.frameRate = opts.frameRate; }
    // if (opts.frameSize) { this.streamParams.frameSize = opts.frameSize; }
    // if (opts.sourceSampleRate) { this.streamParams.sourceSampleRate = opts.sourceSampleRate; }
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

  // fill the on-going buffer with 0 (is done)
  // output it, then call reset on all the children (sure ?)
  // @NOTE: `reset` is called in `sources.start`,
  //  if is called here, it will be called more than once in a child node
  //  is this a problem ?
  finalize() {
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].finalize();
    }
  }

  // forward the current state (time, frame, metaData) to all the children
  output(time = this.time, outFrame = this.outFrame, metaData = this.metaData) {
    for (let i = 0, l = this.children.length; i < l; i++) {
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
    let index = this.children.length;

    while (index--) {
      this.children[index].destroy();
    }

    // delete itself from the parent node
    if (this.parent) {
      const index =  this.parent.children.indexOf(this);
      this.parent.children.splice(index, 1);
    }

    // cannot use a dead object as parent
    this.streamParams = null;

    // clean it's own references / disconnect audio nodes if needed
  }
}
