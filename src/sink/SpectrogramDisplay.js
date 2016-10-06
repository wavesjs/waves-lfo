import BaseDisplay from './BaseDisplay';
import FFT from '../operator/FFT';
import { getRandomColor } from '../utils/display-utils';


const definitions = {
  scale: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' },
  },
  color: {
    type: 'string',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  min: {
    type: 'float',
    default: -60,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' },
  }
};


/**
 *
 *
 *
 */
class SpectrogramDisplay extends BaseDisplay {
  constructor(options) {
    super(definitions, options);

    if (this.params.get('color') === null)
      this.params.set('color', getRandomColor());
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    this.fft = new FFT({ fftSize: this.streamParams.frameSize });
    this.fft.processStreamParams(this.streamParams);
    this.fft.resetStream();
  }

  // no need to scroll or anything
  executeDraw(frame, frameWidth, pixelsSinceLastFrame) {
    this.processFunction(frame, frameWidth, pixelsSinceLastFrame);
  }

  processSignal(frame, frameWidth, pixelsSinceLastFrame) {
    const bins = this.fft.inputSignal(frame.data);
    const nbrBins = bins.length;

    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const scale = this.params.get('scale');

    const binWidth = width / nbrBins;
    const ctx = this.ctx;

    ctx.fillStyle = this.params.get('color');
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
        const db = 20 * Math.log10(bins[i]);
        const y = this.getYPosition(db * scale);
        ctx.fillRect(x1Int, y, width, height - y);
      } else {
        error -= binWidth;
      }
    }
  }
}

export default SpectrogramDisplay;
