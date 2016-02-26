import BaseDraw from './base-draw';
import { getRandomColor } from '../utils/draw-utils';


export default class Spectrogram extends BaseDraw {
  constructor(options) {
    super(options, {
      min: 0,
      max: 1,
      scale: 1
    });
  }

  set scale(value) {
    this.params.scale = value;
  }

  get scale() {
    return this.params.scale;
  }

  initialize() {
    super.initialize();

    this._rafFlag = true;
    if (!this.params.color) { this.params.color = getRandomColor(); }
  }

  finalize() {
    super.finalize();
    this._rafFlag = false;
  }

  process(time, frame, metaData) {
    if (this._rafFlag) {
      this._rafFlag = false;
      requestAnimationFrame(() => this.drawCurve(frame));
    }

    super.process(time, frame, metaData);
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
      const x = i / nbrBins * width;
      const y = this.getYPosition(frame[i] * scale);

      ctx.fillRect(x, y, binWidth, height - y);
    }

    this._rafFlag = true;
  }
}
