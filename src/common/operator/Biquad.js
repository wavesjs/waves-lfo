import BaseLfo from '../core/BaseLfo';

const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const pow = Math.pow;
const _2PI = Math.PI * 2;

// plot (from http://www.earlevel.com/scripts/widgets/20131013/biquads2.js)
// var len = 512;
// var magPlot = [];
// for (var idx = 0; idx < len; idx++) {
//   var w;
//   if (plotType == "linear")
//     w = idx / (len - 1) * Math.PI;  // 0 to pi, linear scale
//   else
//     w = Math.exp(Math.log(1 / 0.001) * idx / (len - 1)) * 0.001 * Math.PI;  // 0.001 to 1, times pi, log scale

//   var phi = Math.pow(Math.sin(w/2), 2);
//   var y = Math.log(Math.pow(a0+a1+a2, 2) - 4*(a0*a1 + 4*a0*a2 + a1*a2)*phi + 16*a0*a2*phi*phi) - Math.log(Math.pow(1+b1+b2, 2) - 4*(b1 + 4*b2 + b1*b2)*phi + 16*b2*phi*phi);
//   y = y * 10 / Math.LN10
//   if (y == -Infinity)
//     y = -200;

//   if (plotType == "linear")
//     magPlot.push([idx / (len - 1) * Fs / 2, y]);
//   else
//     magPlot.push([idx / (len - 1) / 2, y]);

//   if (idx == 0)
//     minVal = maxVal = y;
//   else if (y < minVal)
//     minVal = y;
//   else if (y > maxVal)
//     maxVal = y;
// }

const definitions = {
  type: {
    type: 'enum',
    default: 'lowpass',
    list: [
      'lowpass',
      'highpass',
      'bandpass_constant_skirt',
      'bandpass',
      'bandpass_constant_peak',
      'notch',
      'allpass',
      'peaking',
      'lowshelf',
      'highshelf',
    ],
    metas: { kind: 'dyanmic' },
  },
  f0: {
    type: 'float',
    default: 1,
    metas: { kind: 'dyanmic' },
  },
  gain: {
    type: 'float',
    default: 1,
    min: 0,
    metas: { kind: 'dyanmic' },
  },
  q: {
    type: 'float',
    default: 1,
    min: 0.001, // PIPO_BIQUAD_MIN_Q
    // max: 1,
    metas: { kind: 'dyanmic' },
  },
  // bandwidth: {
  //   type: 'float',
  //   default: null,
  //   nullable: true,
  //   metas: { kind: 'dyanmic' },
  // },
}


/**
 * Biquad filter (Direct form I).
 *
 * Based on the ["Cookbook formulae for audio EQ biquad filter coefficients"](http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt)
 * by Robert Bristow-Johnson.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default values.
 * @param {String} [options.type='lowpass'] - Type of the filter. Available
 *  filters: 'lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass_constant_peak'
 *  (alias 'bandpass'), 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf'.
 * @param {Number} [options.f0=1] - Cutoff or center frequency of the filter
 *  according to its type.
 * @param {Number} [options.gain=1] - Gain of the filter (in dB).
 * @param {Number} [options.q=1] - Quality factor of the filter.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: buffer,
 * });
 *
 * const biquad = new lfo.operator.Biquad({
 *   type: 'lowpass',
 *   f0: 2000,
 *   gain: 3,
 *   q: 12,
 * });
 *
 * const spectrumDisplay = new lfo.sink.SpectrumDisplay({
 *   canvas: '#spectrum',
 * });
 *
 * audioInBuffer.connect(biquad);
 * biquad.connect(spectrumDisplay);
 *
 * audioInBuffer.start();
 */
class Biquad extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);
  }

  onParamUpdate(name, value, metas) {
    this._calculateCoefs();
  }

  _calculateCoefs() {
    const sampleRate = this.streamParams.sourceSampleRate;
    const type = this.params.get('type');
    const f0 = this.params.get('f0');
    const gain = this.params.get('gain');
    const q = this.params.get('q');
    // const bandwidth = this.params.get('bandwidth');
    const bandwidth = null;

    let b0 = 0, b1 = 0, b2 = 0, a0 = 0, a1 = 0, a2 = 0;

    const A = pow(10, gain / 40);
    const w0 = _2PI * f0 / sampleRate;
    const cosW0 = cos(w0);
    const sinW0 = sin(w0);
    let alpha; // depend of the filter type
    let _2RootAAlpha; // intermediate value for lowshelf and highshelf

    switch (type) {
      // H(s) = 1 / (s^2 + s/Q + 1)
      case 'lowpass':
        alpha = sinW0 / (2 * q);
        b0 = (1 - cosW0) / 2;
        b1 = 1 - cosW0;
        b2 = b0;
        a0 = 1 + alpha;
        a1 = -2 * cosW0;
        a2 = 1 -alpha;
        break;
      // H(s) = s^2 / (s^2 + s/Q + 1)
      case 'highpass':
        alpha = sinW0 / (2 * q);
        b0 = (1 + cosW0) / 2;
        b1 = - (1 + cosW0)
        b2 = b0;
        a0 = 1 + alpha;
        a1 = -2 * cosW0;
        a2 = 1 - alpha;
        break;
      // H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
      case 'bandpass_constant_skirt':
        if (bandwidth) {
          // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
        } else {
          alpha = sinW0 / (2 * q);
        }

        b0 = sinW0 / 2;
        b1 = 0;
        b2 = -b0;
        a0 = 1 + alpha;
        a1 = -2 * cosW0;
        a2 = 1 - alpha;
        break;
      // H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
      case 'bandpass': // looks like what is gnerally considered as a bandpass
      case 'bandpass_constant_peak':
        if (bandwidth) {
          // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
        } else {
          alpha = sinW0 / (2 * q);
        }

        b0 = alpha;
        b1 = 0;
        b2 = -alpha;
        a0 = 1 + alpha;
        a1 = -2 * cosW0;
        a2 = 1 - alpha;
        break;
      // H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
      case 'notch':
        alpha = sinW0 / (2 * q);
        b0 = 1;
        b1 = -2 * cosW0;
        b2 = 1;
        a0 = 1 + alpha;
        a1 = b1;
        a2 = 1 - alpha;
        break;
      // H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
      case 'allpass':
        alpha = sinW0 / (2 * q);
        b0 = 1 - alpha;
        b1 = -2 * cosW0;
        b2 = 1 + alpha;
        a0 = b2;
        a1 = b1;
        a2 = b0;
        break;
      // H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
      case 'peaking':
        if (bandwidth) {
          // sin(w0)*sinh( ln(2)/2 * BW * w0/sin(w0) )           (case: BW)
        } else {
          alpha = sinW0 / (2 * q);
        }

        b0 = 1 + alpha * A;
        b1 = -2 * cosW0;
        b2 = 1 - alpha * A;
        a0 = 1 + alpha / A;
        a1 = b1;
        a2 = 1 - alpha / A;
        break;
      // H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
      case 'lowshelf':
        alpha = sinW0 / (2 * q);
        _2RootAAlpha = 2 * sqrt(A) * alpha;

        b0 =     A * ((A + 1) - (A - 1) * cosW0 + _2RootAAlpha);
        b1 = 2 * A * ((A - 1) - (A + 1) * cosW0);
        b2 =     A * ((A + 1) - (A - 1) * cosW0 - _2RootAAlpha);
        a0 =          (A + 1) + (A - 1) * cosW0 + _2RootAAlpha;
        a1 =    -2 * ((A - 1) + (A + 1) * cosW0);
        a2 =          (A + 1) + (A - 1) * cosW0 - _2RootAAlpha;
        break;
      // H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
      case 'highshelf':
        alpha = sinW0 / (2 * q);
        _2RootAAlpha = 2 * sqrt(A) * alpha;

        b0 =      A * ((A + 1) + (A - 1) * cosW0 + _2RootAAlpha);
        b1 = -2 * A * ((A - 1) + (A + 1) * cosW0);
        b2 =      A * ((A + 1) + (A - 1) * cosW0 - _2RootAAlpha);
        a0 =           (A + 1) - (A - 1) * cosW0 + _2RootAAlpha;
        a1 =      2 * ((A - 1) - (A + 1) * cosW0);
        a2 =           (A + 1) - (A - 1) * cosW0 - _2RootAAlpha;

        break;
    }

    this.coefs = {
      b0: b0 / a0,
      b1: b1 / a0,
      b2: b2 / a0,
      a1: a1 / a0,
      a2: a2 / a0,
    };

    // reset state
    this.state = { x1: 0, x2: 0, y1: 0, y2: 0 };
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    // if no `sampleRate` or `sampleRate` is 0 we shall halt!
    const sampleRate = this.streamParams.sourceSampleRate;

    if (!sampleRate || sampleRate <= 0)
      throw new Error('Invalid sampleRate value (0) for biquad');

    this._calculateCoefs();
    this.propagateStreamParams();
  }

  /** @private */
  processSignal(frame) {
    const frameSize = this.streamParams.frameSize;
    const outData = this.frame.data;
    const inData = frame.data;
    const state = this.state;
    const coefs = this.coefs;

    for (let i = 0; i < frameSize; i++) {
      const x = inData[i];
      const y = coefs.b0 * x
              + coefs.b1 * state.x1 + coefs.b2 * state.x2
              - coefs.a1 * state.y1 - coefs.a2 * state.y2;

      outData[i] = y;

      // update states
      state.x2 = state.x1;
      state.x1 = x;
      state.y2 = state.y1;
      state.y1 = y;
    }
  }
}

export default Biquad;
