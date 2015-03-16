'use strict';

var { Lfo } = require('../core/lfo-base');

class BaseDraw extends Lfo {
  constructor(previous, options, extendDefaults = {}) {

    var defaults = Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100
    }, extendDefaults);

    super(previous, options, defaults);

    if (!this.params.canvas) {
      throw new Error('bpf: params.canvas is mandatory and must be canvas DOM element');
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.ctx.canvas.width  = this.cachedCtx.canvas.width  = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousFrame = null;
    this.previousTime = null;

    this.lastShiftError = 0;
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
    this.previousFrame = new Float32Array(frame);
    this.previousTime = time;
  }

  // default draw mode
  scrollModeDraw(time, frame) {
    var width = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var ctx = this.ctx;
    var iShift = 0;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // copy cached canvas according to dt
    if (this.previousTime) {
      var dt = time - this.previousTime;
      var fShift = (dt / duration) * width - this.lastShiftError;

      iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;

      ctx.drawImage(this.cachedCanvas,
        iShift, 0, width - iShift, height,
        0, 0, width - iShift, height
      );
    }

    ctx.restore();
    // draw new polygon
    ctx.save();
    ctx.translate(width, iShift);
    this.drawCurve(frame, this.previousFrame, iShift);
    ctx.restore();
    // save current state into buffer canvas
    this.cachedCtx.clearRect(0, 0, width, height);
    this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);
  }

  // must implement the logic to draw between the previous frame and the current frame
  // assuming the context is centered on the current frame
  drawCurve(frame, prevFrame, iShift) {
    console.log('must be implemented');
  }
}

module.exports = BaseDraw;


