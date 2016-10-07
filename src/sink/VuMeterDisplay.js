import BaseDisplay from './BaseDisplay';
import RMS from '../operator/RMS';
import parameters from 'parameters';

const log10 = Math.log10;

const definitions = {
  offset: {
    type: 'float',
    default: -14,
    metas: { kind: 'dyanmic' },
  },
  min: {
    type: 'float',
    default: -70,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 5,
    metas: { kind: 'dynamic' },
  },
  width: {
    type: 'integer',
    default: 10,
    metas: { kind: 'dynamic' },
  }
}

/**
 * Simple VU-Meter
 *
 * @todo - define if possible to embed it's own slicer.
 * @todo - add a peak (max style)
 * @todo - draw a scale on the left.
 *
 */
class VuMeterDisplay extends BaseDisplay {
  constructor(options = {}) {
    super(definitions, options, false);

    this.rmsOperator = new RMS();
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    this.rmsOperator.processStreamParams(prevStreamParams);
    this.rmsOperator.resetStream();

    super.propagateStreamParams();
  }

  processSignal(frame) {
    const offset = this.params.get('offset'); // offset zero of the vu meter
    const height = this.canvasHeight;
    const width = this.canvasWidth;
    const ctx = this.ctx;

    const red = '#ff2121';
    const yellow = '#ffff1f';
    const green = '#00ff00';

    const lastDB = this.lastDB;
    const rms = this.rmsOperator.inputSignal(frame.data);
    let dB = 20 * log10(rms) - offset;

    // try to do on the rms instead...
    if (lastDB > dB)
      dB = lastDB - 6;

    // offset of 14 dB
    const y = this.getYPosition(dB);
    const y0 = this.getYPosition(0);
    const y3 = this.getYPosition(3);

    ctx.save();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (dB < 0) {
      ctx.fillStyle = green;
      ctx.fillRect(0, y, width, height - y);
    } else if (dB < 3) {
      ctx.fillStyle = green;
      ctx.fillRect(0, y0, width, height - y0);

      const rest = y0 - y;
      ctx.fillStyle = yellow;
      ctx.fillRect(0, y, width, rest);
    } else {
      ctx.fillStyle = green;
      ctx.fillRect(0, y0, width, height - y0);

      ctx.fillStyle = yellow;
      ctx.fillRect(0, y3, width, y0 - y3);

      const rest = y - y3;
      ctx.fillStyle = red;
      ctx.fillRect(0, y3, width, rest);
    }

    // draw line at 0dB
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, y0, width, 1);

    ctx.restore();

    this.lastDB = dB;
  }
}

export default VuMeterDisplay;
