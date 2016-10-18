import BaseDisplay from './BaseDisplay';
import RMS from '../operator/RMS';

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
 * Simple VU-Meter to used on a `signal` stream.
 *
 * @memberof module:sink
 *
 * @param {Object} options - Override defaults parameters.
 * @param {Number} [options.offset=-14] - dB offset applied to the signal.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=6] - Width of the display (in pixels).
 * @param {Number} [options.height=150] - Height of the canvas.
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas.
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw.
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const audioContext = new window.AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const vuMeter = new lfo.sink.VuMeterDisplay({
 *     canvas: '#vu-meter',
 *   });
 *
 *   audioInNode.connect(vuMeter);
 *   audioInNode.start();
 * }
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

    // @todo - check doesn't work...
    // this.ctx.fillStyle = '#000000';
    // this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.rmsOperator.initStream(this.streamParams);

    this.propagateStreamParams();
  }

  /** @private */
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

    // slow release (could probably be improved)
    if (lastDB > dB)
      dB = lastDB - 6;

    // handle peak
    if (dB > peak.value || (now - peak.time) > this.peakLifetime) {
      peak.value = dB;
      peak.time = now;
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

    // dB
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, width, height - y);

    // 0 dB marker
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
