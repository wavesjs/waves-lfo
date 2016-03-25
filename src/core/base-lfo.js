let id = 0;

export default class BaseLfo {
  /**
   * @todo - reverse arguments order, is weird
   */
  constructor(defaults = {}, options = {}) {
    this.cid = id++;
    this.params = {};

    this.streamParams = {
      frameSize: 1,
      frameRate: 0,
      sourceSampleRate: 0
    };

    this.params = Object.assign({}, defaults, options);
    this.children = [];

    // stream data
    this.time = 0;
    this.outFrame = null;
    this.metaData = {};
  }

  // WebAudioAPI `connect` like method
  connect(child) {
    if (this.streamParams === null) {
      throw new Error('cannot connect to a dead lfo node');
    }

    this.children.push(child);
    child.parent = this;
  }

  // define if suffiscient
  disconnect() {
    // remove itself from parent children
    const index = this.parent.children.indexOf(this);
    this.parent.children.splice(index, 1);
    // this.parent = null;
    // this.children = null;
  }

  // initialize the current node stream and propagate to it's children
  initialize(inStreamParams = {}, outStreamParams = {}) {
    Object.assign(this.streamParams, inStreamParams, outStreamParams);

    // create the `outFrame` arrayBuffer
    this.setupStream();

    // propagate initialization in lfo chain
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].initialize(this.streamParams);
    }
  }

  /**
   * create the outputFrame according to the `streamParams`
   */
  setupStream() {
    const frameSize = this.streamParams.frameSize;

    if(frameSize > 0)
      this.outFrame = new Float32Array(frameSize);
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

  // finalize stream
  finalize(endTime) {
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].finalize(endTime);
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
