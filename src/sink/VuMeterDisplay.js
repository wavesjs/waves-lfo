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
    default: -80,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' },
  },
  width: {
    type: 'integer',
    default: 6,
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

    this.lastDB = 0;
    this.peak = {
      value: 0,
      time: 0,
    }

    this.peakLifetime = 1; // sec
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    this.rmsOperator.processStreamParams(prevStreamParams);
    this.rmsOperator.resetStream();

    super.propagateStreamParams();
  }

  processSignal(frame) {
    const now = new Date().getTime() / 1000; // sec
    const offset = this.params.get('offset'); // offset zero of the vu meter
    const height = this.canvasHeight;
    const width = this.canvasWidth;
    const ctx = this.ctx;

    const lastDB = this.lastDB;
    const peak = this.peak;

    const red = '#ff2121';
    const yellow = '#ffff1f';
    const green = '#00ff00';

    // handle current db value
    const rms = this.rmsOperator.inputSignal(frame.data);
    let dB = 20 * log10(rms) - offset;

    // slow release (maybe could be improved)
    if (lastDB > dB)
      dB = lastDB - 6;

    // handle peak
    if (dB > peak.value) {
      peak.value = dB;
      peak.time = now;
    } else {
      if (now - peak.time > this.peakLifetime) {
        peak.value = dB;
        peak.time = now;
      }
    }

    const y0 = this.getYPosition(0);
    const y = this.getYPosition(dB);
    const yPeak = this.getYPosition(peak.value);

    ctx.save();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, green);
    gradient.addColorStop((height - y0) / height, yellow);
    gradient.addColorStop(1, red);

    // current dB
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, width, height - y);

    // marker at 0dB
    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, y0, width, 2);

    // peak
    ctx.fillStyle = gradient;
    ctx.fillRect(0, yPeak, width, 2);


    ctx.restore();

    this.lastDB = dB;
  }
}

export default VuMeterDisplay;
