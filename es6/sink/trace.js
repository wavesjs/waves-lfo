'use strict';

var BaseDraw = require('./base-draw');
var { getRandomColor, getHue, hexToRGB } = require('../utils/draw-utils');

class Trace extends BaseDraw {

  constructor(previous, options) {
    var extendDefaults = {
      colorScheme: 'none' // color, opacity
    };

    super(previous, options);
    // create an array of colors according to the
    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  process(time, frame) {
    this.scrollModeDraw(time, frame);
    super.process(time, frame);
  }

  drawCurve(frame, prevFrame, iShift) {
    var ctx = this.ctx;
    var color;

    var halfRange = frame[1] / 2;
    var mean = this.getYPosition(frame[0]);
    var min = this.getYPosition(frame[0] - halfRange);
    var max = this.getYPosition(frame[0] + halfRange);

    if (prevFrame) {
      var prevHalfRange = prevFrame[1] / 2;
      var prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
      var prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
    }

    switch (this.params.colorScheme) {
      case 'none':
        ctx.fillStyle = this.params.color;
      break;
      case 'hue':
        var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

        if (prevFrame) {
          gradient.addColorStop(0, 'hsl(' + getHue(prevFrame[2]) + ', 100%, 50%)');
        } else {
          gradient.addColorStop(0, 'hsl(' + getHue(frame[2]) + ', 100%, 50%)');
        }

        gradient.addColorStop(1, 'hsl(' + getHue(frame[2]) + ', 100%, 50%)');
        ctx.fillStyle = gradient;
      break;
      case 'opacity':
        var rgb = hexToRGB(this.params.color);
        var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

        if (prevFrame) {
          gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + prevFrame[2] + ')');
        } else {
          gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
        }

        gradient.addColorStop(1, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
        ctx.fillStyle = gradient;
      break;
    }

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
