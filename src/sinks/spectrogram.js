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

    // error handling needs review...
    let error = 0;

    for (let i = 0; i < nbrBins; i++) {
      const x1Float = i * binWidth + error;
      const x1Int = Math.round(x1Float);
      const x2Float = x1Float + (binWidth - error);
      const x2Int = Math.round(x2Float);

      error = x2Int - x2Float;

      if (x1Int !== x2Int) {
        const width = x2Int - x1Int;
        const y = this.getYPosition(frame[i] * scale);
        ctx.fillRect(x1Int, y, width, height - y);
      } else {
        error -= binWidth;
      }
    }
  }
}
