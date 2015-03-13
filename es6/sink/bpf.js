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
      height: 100
    };

    super(previous, options, defaults);

    if (!this.params.canvas) {
      throw new Error('bpf: a canvas must be given to this module');
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
  getPosition(value) {
    // var a = this.params.height / (this.params.min - this.params.max);
    // return a * value + (this.params.height / 2);

    // a = height
    // b = 0
    var min = this.params.min;
    var max = this.params.max;
    var height = this.params.height;

    return (((0 - height) * (value - min)) / (max - min)) + height;
  }

  setDuration(duration) {
    this.params.duration = duration;
  }

  setMin(min) {
    this.params.min = min;
  }

  setMax(max) {
    this.params.max = max;
  }

  process(time, frame) {
    var width  = this.params.width;
    var height = this.params.height;
    var duration = this.params.duration;
    var colors = this.params.colors;
    var ctx = this.ctx;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // translate canvas according to dt
    // @TODO should handle scale factor
    if (this.previousTime) {
      var dt = time - this.previousTime;
      var decay = (dt / duration) * width;

      ctx.translate(-decay, 0);
      ctx.drawImage(this.cachedCanvas, 0, 0, width, height);
    }

    ctx.restore();

    // foreach frame index
    for (var i = 0, l = frame.length; i < l; i++) {
      ctx.save();
      // color should bechosen according to index
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = colors[i];

      ctx.translate(width, 0);
      // draw new point
      var posY = this.getPosition(frame[i]);

      ctx.arc(0, posY, 1, 0, Math.PI * 2, false);
      ctx.fill();

      if (this.previousFrame) {
        var lastPosY = this.getPosition(this.previousFrame[i]);
        // draw line
        ctx.beginPath();
        ctx.moveTo(-decay, lastPosY);
        ctx.lineTo(0, posY);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    }

    // save current state into buffer canvas
    this.cachedCtx.clearRect(0, 0, width, height);
    this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);

    // save values
    this.previousFrame = new Float32Array(frame);
    this.previousTime  = time;
  }
}

module.exports = Bpf;
