'use strict';

var { Lfo } = require('../core/lfo-base');

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Bpf extends Lfo {
  constructor(previous, options) {
    var defaults = {
      duration: 1,
      min: -1,
      max: 1,
      scale: 1,
      width: 300,
      height: 100,
      trigger: false,
      radius: 0,
      line: true
    };

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

    // for loop mode
    this.currentXPosition = 0;
    this.lastShiftError = 0;

    // create an array of colors according to the
    if (!this.params.colors) {
      this.params.colors = [];
      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        this.params.colors.push(getRandomColor());
      }
    }
  }

  // scale
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

  // allow to witch easily between the 2 modes
  setTrigger(bool) {
    this.params.trigger = bool;
    // clear canvas and cache
    this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    // reset currentXPosition
    this.currentXPosition = 0;
    this.lastShiftError = 0;
  }

  // main
  process(time, frame) {
    // @TODO: compare dt - if dt < fps return;
    if (this.params.trigger) {
      this.triggerModeDraw(frame, time);
    } else {
      this.scrollModeDraw(frame, time);
    }

    // save previous frame values
    this.previousFrame = new Float32Array(frame);
    this.previousTime  = time;

    // forward data ?
  }

  // ----------------------------------------
  // drawing strategies
  // ----------------------------------------

  // draw from left to right, go back to left when > width
  triggerModeDraw(frame, time) {
    var width  = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var ctx = this.ctx;
    var iShift = 0;

    // check boundaries
    if (this.previousTime) {
      var dt = time - this.previousTime;
      var fShift = (dt / duration) * width - this.lastShiftError; // px

      iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;
    }

    this.currentXPosition += iShift;

    // draw the right part
    ctx.save();
    ctx.translate(this.currentXPosition, 0);
    ctx.clearRect(-iShift, 0, iShift, height);
    this.drawCurve(frame, iShift);
    ctx.restore();

    // go back to the left of the canvas and redraw the same thing
    if (this.currentXPosition > width) {
      // go back to start
      this.currentXPosition -= width;

      ctx.save();
      ctx.translate(this.currentXPosition, 0);
      ctx.clearRect(-iShift, 0, iShift, height);
      this.drawCurve(frame, iShift);
      ctx.restore();
    }
  }

  // @default mode
  // draw from the right side of the canvas and scroll
  scrollModeDraw(frame, time) {
    var width  = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var colors = this.params.colors;
    var ctx = this.ctx;
    var iShift = 0;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // translate canvas according to dt
    if (this.previousTime) {
      var dt = time - this.previousTime;
      // handle average pixel errors between frames
      var fShift = (dt / duration) * width - this.lastShiftError; // px

      iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;
      // scroll canvas to the left
      ctx.drawImage(this.cachedCanvas,
        iShift, 0, width - iShift, height,
        0, 0, width - iShift, height
      );
    }

    ctx.restore();

    ctx.save();
    ctx.translate(width, 0);
    this.drawCurve(frame, iShift);
    ctx.restore();
    // save current state into buffer canvas
    this.cachedCtx.clearRect(0, 0, width, height);
    this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);
  }

  // @private
  drawCurve(frame, decay) {
    var colors = this.params.colors;
    var ctx = this.ctx;
    var radius = this.params.radius;
    // @TODO this can and should be abstracted
    for (var i = 0, l = frame.length; i < l; i++) {
      ctx.save();
      // color should bechosen according to index
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = colors[i];

      var posY = this.getYPosition(frame[i]);

      // as an options ? radius ?
      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      if (this.previousFrame && this.params.line) {
        var lastPosY = this.getYPosition(this.previousFrame[i]);
        // draw line
        ctx.beginPath();
        ctx.moveTo(-decay, lastPosY);
        ctx.lineTo(0, posY);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    }
  }
}

module.exports = Bpf;
