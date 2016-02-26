import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';

export default class Spectrogram extends BaseDraw {
  constructor(options) {
    super(options, {
      min: 0,
      max: 1,
      scale: 1,
      color: getRandomColor(),
    });

    super(options, defaults);
  }

  set scale(value) {
    this.params.scale = value;
  }

  get scale() {
    return this.params.scale;
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

    for (let i = 0; i < nbrBins; i++) {
      const x = Math.round(i / nbrBins * width);
      const y = this.getYPosition(frame[i] * scale);

      ctx.fillRect(x, y, binWidth, height - y);
    }
  }
}
