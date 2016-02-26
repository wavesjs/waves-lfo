import BaseLfo from '../core/base-lfo';


export default class BaseDraw extends BaseLfo {
  constructor(options = {}, extendDefaults = {}) {
    const defaults = Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 150, // default canvas size in DOM too
      isSynchronized: false, // is set to true if used in a synchronizedSink
      canvas: null, // an existing canvas element be used for drawing
      container: null, // a selector inside which create an element
    }, extendDefaults);

    super(defaults, options);

    if (!this.params.canvas && !this.params.container)
      throw new Error('parameter `canvas` or `container` are mandatory');

    // prepare canvas
    if (this.params.canvas) {
      this.canvas = this.params.canvas;
    } else if (this.params.container) {
      const container = document.querySelector(this.params.container);
      this.canvas = document.createElement('canvas');
      container.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;

    this.resize(this.params.width, this.params.height);

    //
    this._stack;
    this._rafId;
    this.draw = this.draw.bind(this);
  }

  // params modifiers
  set duration(duration) {
    this.params.duration = duration;
  }

  set min(min) {
    this.params.min = min;
    this._setYScale();
  }

  set max(max) {
    this.params.max = max;
    this._setYScale();
  }

  /**
   * Create the transfert function used to map values to pixel in the y axis
   * @private
   */
  _setYScale() {
    const min = this.params.min;
    const max = this.params.max;
    const height = this.params.height;

    const a = (0 - height) / (max - min);
    const b = height - (a * min);

    this.getYPosition = (x) => a * x + b;
  }

  setupStream() {
    super.setupStream();
    // keep track of the previous frame
    this.previousFrame = new Float32Array(this.streamParams.frameSize);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    this._stack = [];
    this._rafId = requestAnimationFrame(this.draw);
  }

  reset() {
    super.reset();
    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
  }

  finalize(endTime) {
    super.finalize(endTime);
    cancelAnimationFrame(this._rafId);
  }

  /**
   * Add the current frame to the frames to draw. Should not be overriden.
   * @inheritdoc
   * @final
   */
  process(time, frame, metaData) {
    const buffer = frame.buffer.slice(0); // copy values instead of reference
    const copy = new Float32Array(buffer);
    // console.log(copy);
    // frame = frame.slice(0);
    this._stack.push({ time, frame: copy, metaData });
  }

  draw() {
    for (let i = 0, length = this._stack.length; i < length; i++) {
      const event = this._stack[i];
      this.executeDraw(event.time, event.frame);
    }

    // reinit stack for next call
    this._stack.length = 0;
    this._rafId = requestAnimationFrame(this.draw);
  }

  executeDraw(time, frame) {
    this.scrollModeDraw(time, frame);
  }

  resize(width, height) {
    const ctx = this.ctx;
    const cachedCtx = this.cachedCtx;

    // @todo - fix this, problem with the cached canvas...
    // http://www.html5rocks.com/en/tutorials/canvas/hidpi/
    // const auto = true;
    // const devicePixelRatio = window.devicePixelRatio || 1;
    // const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
    //                     ctx.mozBackingStorePixelRatio ||
    //                     ctx.msBackingStorePixelRatio ||
    //                     ctx.oBackingStorePixelRatio ||
    //                     ctx.backingStorePixelRatio || 1;

    // if (auto && devicePixelRatio !== backingStoreRatio) {
    //   const ratio = devicePixelRatio / backingStoreRatio;

    //   this.params.width = width * ratio;
    //   this.params.height = height * ratio;

    //   ctx.canvas.width = cachedCtx.canvas.width = this.params.width;
    //   ctx.canvas.height = cachedCtx.canvas.height = this.params.height;

    //   ctx.canvas.style.width = `${width}px`;
    //   ctx.canvas.style.height = `${height}px`;

    //   ctx.scale(ratio, ratio);
    // } else {
      this.params.width = width;
      this.params.height = height;

      ctx.canvas.width = cachedCtx.canvas.width = width;
      ctx.canvas.height = cachedCtx.canvas.height = height;
    // }

    // clear cache canvas
    cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    // update scale
    this._setYScale();
  }

  // default draw mode
  scrollModeDraw(time, frame) {
    const ctx = this.ctx;
    const width = this.params.width;
    const height = this.params.height;
    const duration = this.params.duration;

    const dt = time - this.previousTime;
    const fShift = (dt / duration) * width - this.lastShiftError;
    const iShift = Math.round(fShift);
    this.lastShiftError = iShift - fShift;

    const partialShift = iShift - this.currentPartialShift;
    this.shiftCanvas(partialShift);

    // shift all siblings if synchronized
    if (this.params.isSynchronized && this.synchronizer)
      this.synchronizer.shiftSiblings(partialShift, this);

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
    const ctx = this.ctx;
    const width = this.params.width;
    const height = this.params.height;

    this.currentPartialShift += shift;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    const croppedWidth = width - this.currentPartialShift;

    ctx.drawImage(this.cachedCanvas,
      this.currentPartialShift, 0, croppedWidth, height,
      0, 0, croppedWidth, height
    );

    ctx.restore();
  }

  /**
   * Interface method to implement in order to define how to draw the shape
   * between the previous and the current frame, assuming the canvas context
   * is centered on the current frame.
   * @param {Float32Array} frame - The current frame to draw.
   * @param {Float32Array} prevFrame - The last frame.
   * @param {Number} iShift - the number of pixels between the last and the current frame.
   */
  drawCurve(frame, prevFrame, iShift) {
    console.error('must be implemented');
  }
}
