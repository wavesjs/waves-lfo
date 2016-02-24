import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';


export default class Waveform extends BaseDraw {
  constructor(options) {
    const defaults = {};
    super(options, defaults);
  }

  initialize() {
    super.initialize();

    if (!this.params.color) { this.params.color = getRandomColor(); }
  }

  process(time, frame, metaData) {
    this.scrollModeDraw(time, frame);
    // this._cache.push({ time, frame });
    super.process(time, frame, metaData);
  }

  drawCurve(frame, previousFrame, iShift) {
    const ctx = this.ctx;
    const min = this.getYPosition(frame[0]);
    const max = this.getYPosition(frame[1]);

    ctx.save();

    ctx.fillStyle = this.params.color;
    ctx.beginPath();

    // console.log(this.getYPosition(0));
    ctx.moveTo(0, this.getYPosition(0));
    ctx.lineTo(0, max);

    if (previousFrame) {
      const prevMin = this.getYPosition(previousFrame[0]);
      const prevMax = this.getYPosition(previousFrame[1]);
      ctx.lineTo(-iShift, prevMax);
      ctx.lineTo(-iShift, prevMin);
    }

    ctx.lineTo(0, min);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
