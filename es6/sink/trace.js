'use strict';

var BaseDraw = require('./base-draw');
var { getRandomColor } = require('./draw-utils');

class Trace extends BaseDraw {

  constructor(previous, options) {
    super(previous, options);
    // create an array of colors according to the
    if (this.streamParams.frameSize === 2 && !this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  process(time, frame) {
    this.scrollModeDraw(time, frame);
    super.process(time, frame);
  }

  drawCurve(frame, prevFrame, iShift) {
    var color = this.params.color;
    var ctx = this.ctx;

    var halfRange = frame[1] / 2;
    var mean = this.getYPosition(frame[0]);
    var min = this.getYPosition(frame[0] - halfRange);
    var max = this.getYPosition(frame[0] + halfRange);

    if (prevFrame) {
      var prevHalfRange = prevFrame[1] / 2;
      var prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
      var prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
    }

    // draw range
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, mean);
    ctx.lineTo(0, max);

    if (prevFrame) {
      ctx.lineTo(-iShift, prevMax);
      ctx.lineTo(-iShift, prevMin);
    }

    ctx.lineTo(0, min);
    ctx.closePath();

    ctx.fill();
    ctx.restore();
  }
};

module.exports = Trace;
