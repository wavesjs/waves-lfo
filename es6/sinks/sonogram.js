import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';

let counter = 0;
export default class Sonogram extends BaseDraw {
  constructor(options) {
    super(options, {
      scale: 1
    });
  }

  set scale(value) {
    this.params.scale = value;
  }

  get scale() {
    return this.params.scale;
  }

  drawCurve(frame, previousFrame, iShift) {
    const ctx = this.ctx;
    const height = this.params.height;
    const scale = this.params.scale;
    const binPerPixel = frame.length / this.params.height;

    for (let i = 0; i < height; i++) {
      // interpolate between prev and next bins
      // is not a very good strategy if more than two bins per pixels
      // some values won't be taken into account
      // this hack is not reliable
      // -> could we resample the frame in frequency domain ?
      const fBin = i * binPerPixel;
      const prevBinIndex = Math.floor(fBin);
      const nextBinIndex = Math.ceil(fBin);

      const prevBin = frame[prevBinIndex];
      const nextBin = frame[nextBinIndex];

      const position = fBin - prevBinIndex;
      const slope = (nextBin - prevBin);
      const intercept = prevBin;
      const weightedBin = slope * position + intercept;
      const sqrtWeightedBin = weightedBin * weightedBin;

      const y = this.params.height - i;
      const c = Math.round(sqrtWeightedBin * scale * 255);

      ctx.fillStyle = `rgba(${c}, ${c}, ${c}, 1)`;
      ctx.fillRect(-iShift, y, iShift, -1);
    }
  }
}
