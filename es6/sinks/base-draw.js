import BaseLfo from '../core/base-lfo';


export default class BaseDraw extends BaseLfo {
  constructor(options = {}, extendDefaults = {}) {

    const defaults = Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 150, // default canvas size in DOM too
      isSynchronized: false // is set to true if used in a synchronizedSink
    }, extendDefaults);

    super(options, defaults);

    if (!this.params.canvas) {
      throw new Error('params.canvas is mandatory and must be canvas DOM element');
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;

    this.resize(this.params.width, this.params.height);
    // this._cache = [];
    // this._rafId;
    // this.draw = this.draw.bind(this);
  }

  // initialize() {
  //   super.initialize();
  //   // this._rafId = requestAnimationFrame(this.draw);
  // }

  // finalize() {
  //   super.finalize();
  //   // cancelAnimationFrame(this._rafId);
  // }

  // draw() {
  //   console.log('draw', this._cache.length);
  //   this._cache.forEach((infos) => {
  //     console.log(infos);
  //     this.scrollModeDraw(infos.time, infos.frame);
  //   });

  //   this._cache.length = 0;
  //   this._rafId = requestAnimationFrame(this.draw);
  // }

  reset() {
    super.reset();
    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
  }

  setupStream() {
    super.setupStream();
    this.previousFrame = new Float32Array(this.streamParams.frameSize);
  }

  resize(width, height) {
    this.ctx.canvas.width  = this.cachedCtx.canvas.width  = this.params.width = width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height = height;
    // clear cache canvas
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    // update scale
    this.setYScale();
  }

  setYScale() {
    const min = this.params.min;
    const max = this.params.max;
    const height = this.params.height;

    const a = (0 - height) / (max - min);
    const b = height - (a * min);

    this.getYPosition = (x) => a * x + b;
  }

  // params modifiers
  set duration(duration) {
    this.params.duration = duration;
  }

  set min(min) {
    this.params.min = min;
    this.setYScale();
  }

  set max(max) {
    this.params.max = max;
    this.setYScale();
  }

  // main process method
  process(time, frame, metaData) {
    super.process(time, frame, metaData);
  }

  // default draw mode
  scrollModeDraw(time, frame) {
    const width = this.params.width;
    const height = this.params.height;
    const duration = this.params.duration;
    const ctx = this.ctx;

    const dt = time - this.previousTime;
    const fShift = (dt / duration) * width - this.lastShiftError;
    const iShift = Math.round(fShift);
    this.lastShiftError = iShift - fShift;

    const partialShift = iShift - this.currentPartialShift;
    this.shiftCanvas(partialShift);

    // shift all siblings if synchronized
    if (this.params.isSynchronized && this.synchronizer) {
      this.synchronizer.shiftSiblings(partialShift, this);
    }

    // translate to the current frame and draw a new polygon
    ctx.save();
    ctx.translate(width, 0);
    this.drawCurve(frame, this.previousFrame, iShift);
    ctx.restore();
    // update `currentPartialShift`
    this.currentPartialShift -= iShift;
    // save current state into buffer canvas
    this.cachedCtx.clearRect(0, 0, width, height);
    this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);

    this.previousFrame.set(frame, 0);
    this.previousTime = time;
  }

  shiftCanvas(shift) {
    const width = this.params.width;
    const height = this.params.height;
    const ctx = this.ctx;

    this.currentPartialShift += shift;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.drawImage(this.cachedCanvas,
      this.currentPartialShift, 0, width - this.currentPartialShift, height,
      0, 0, width - this.currentPartialShift, height
    );

    ctx.restore();
  }

  // Must implement the logic to draw the shape between
  // the previous and the current frame.
  // Assuming the context is centered on the current frame
  drawCurve(frame, prevFrame, iShift) {
    console.error('must be implemented');
  }
}

module.exports = BaseDraw;


