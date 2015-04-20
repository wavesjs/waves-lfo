'use strict';

var Lfo = require('../core/lfo-base');


// @TODO create a single instance of ArrayBuffer of the last frame
class BaseDraw extends Lfo {
  constructor(options = {}, extendDefaults = {}) {

    var defaults = Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100,
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

    this.ctx.canvas.width  = this.cachedCtx.canvas.width  = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;
  }

  reset() {
    super.reset();

    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
  }

  setupStream() {
    super.setupStream();
    this.previousFrame = new Float32Array(this.streamParams.frameSize);
  }

  // http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
  //          (b-a)(x - min)
  // f(x) = --------------  + a
  //           max - min
  getYPosition(value) {
    // a = height
    // b = 0
    var min = this.params.min;
    var max = this.params.max;
    var height = this.params.height;

    return (((0 - height) * (value - min)) / (max - min)) + height;
  }

  // params modifiers
    // params modifier
  setDuration(duration) {
    this.params.duration = duration;
  }

  setMin(min) {
    this.params.min = min;
  }

  setMax(max) {
    this.params.max = max;
  }

  // main process method
  process(time, frame) {
    this.previousFrame.set(frame, 0);
    this.previousTime = time;
    super.process(time, frame);
  }

  // default draw mode
  scrollModeDraw(time, frame) {
    var width = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var ctx = this.ctx;

    var dt = time - this.previousTime;
    var fShift = (dt / duration) * width - this.lastShiftError;
    var iShift = Math.round(fShift);
    this.lastShiftError = iShift - fShift;

    var partialShift = iShift - this.currentPartialShift;
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
  }

  shiftCanvas(shift) {
    var width = this.params.width;
    var height = this.params.height;
    var ctx = this.ctx;

    this.currentPartialShift += shift;

    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
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


