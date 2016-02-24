import BaseDraw from './base-draw';
import { getRandomColor, getHue, hexToRGB } from '../utils/draw-utils';

export default class Trace extends BaseDraw {

  constructor(options) {
    const defaults = {
      colorScheme: 'none' // color, opacity
    };

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

  drawCurve(frame, prevFrame, iShift) {
    const ctx = this.ctx;
    let color, gradient;

    const halfRange = frame[1] / 2;
    const mean = this.getYPosition(frame[0]);
    const min = this.getYPosition(frame[0] - halfRange);
    const max = this.getYPosition(frame[0] + halfRange);

    let prevHalfRange;
    let prevMin;
    let prevMax;

    if (prevFrame) {
      prevHalfRange = prevFrame[1] / 2;
      prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
      prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
    }

    switch (this.params.colorScheme) {
      case 'none':
        ctx.fillStyle = this.params.color;
      break;
      case 'hue':
        gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

        if (prevFrame) {
          gradient.addColorStop(0, 'hsl(' + getHue(prevFrame[2]) + ', 100%, 50%)');
        } else {
          gradient.addColorStop(0, 'hsl(' + getHue(frame[2]) + ', 100%, 50%)');
        }

        gradient.addColorStop(1, 'hsl(' + getHue(frame[2]) + ', 100%, 50%)');
        ctx.fillStyle = gradient;
      break;
      case 'opacity':
        const rgb = hexToRGB(this.params.color);
        gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

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
