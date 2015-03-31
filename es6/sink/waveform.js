'use strict';

var BaseDraw = require('./base-draw');
var { getRandomColor } = require('../utils/draw-utils');

class Waveform extends BaseDraw {
  constructor(options) {
    var defaults = {};

    super(options, defaults);
  }

  initialize() {
    super.initialize();

    if (!this.params.color) { this.params.color = getRandomColor(); }
  }

  process(time, frame) {
    this.scrollModeDraw(time, frame);
    super.process(time, frame);
  }

  drawCurve(frame, previousFrame, iShift) {
    var ctx = this.ctx;
    var min = this.getYPosition(frame[0]);
    var max = this.getYPosition(frame[1]);

    ctx.save();

    ctx.fillStyle = this.params.color;
    ctx.beginPath();

    ctx.moveTo(0, this.getYPosition(0));
    ctx.lineTo(0, max);

    if (previousFrame) {
      var prevMin = this.getYPosition(previousFrame[0]);
      var prevMax = this.getYPosition(previousFrame[1]);
      ctx.lineTo(-iShift, prevMax);
      ctx.lineTo(-iShift, prevMin);
    }

    ctx.lineTo(0, min);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

module.exports = Waveform;