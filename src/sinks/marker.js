import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';


export default class Marker extends BaseDraw {
  constructor(options) {
    super({
      frameSize: 1,
      color: getRandomColor(),
      threshold: 0,
    }, options);
  }

  drawCurve(frame, prevFrame, iShift) {
    const color = this.params.color;
    const ctx = this.ctx;
    const height = ctx.height;

    const value = frame[0];

    if (value > this.params.threshold) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-iShift, this.getYPosition(this.params.min));
      ctx.lineTo(-iShift, this.getYPosition(this.params.max));
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  }
}
