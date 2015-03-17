'use strict';

var BaseDraw = require('base-draw');

class Waveform extends BaseDraw {
  constructor(previous, options) {
    var extendDefaults = {};

    super(previous, options, extendDefaults);

    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  process(time, frame) {
    this.scrollModeDraw(time, frame);
    super.process(time, frame);
  }

  drawCurve(frame, previousFrame, iShift) {
    var ctx = this.ctx;


  }
}

module.exports = Waveform;