import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';


export default class Spectrogram extends BaseDraw {
  constructor(options) {
    super({
      min: 0,
      max: 1,
      scale: 1,
      color: getRandomColor(),
    }, options);
  }

  set scale(value) {
    this.params.scale = value;
  }

  get scale() {
    return this.params.scale;
  }

  // no need to scroll or anything
  executeDraw(time, frame) {
    this.drawCurve(frame);
  }

  drawCurve(frame) {
    const nbrBins = frame.length;
    const width = this.params.width;
    const height = this.params.height;
    const binWidth = width / nbrBins;
    const scale = this.params.scale;
    const ctx = this.ctx;

    ctx.fillStyle = this.params.color;
    ctx.clearRect(0, 0, width, height);

    let error = 0;

    for (let i = 0; i < nbrBins; i++) {
      const x = Math.round(i * binWidth);
      const y = this.getYPosition(frame[i] * scale);
      ctx.fillRect(x, y, binWidth, height - y);
    }
  }
}
