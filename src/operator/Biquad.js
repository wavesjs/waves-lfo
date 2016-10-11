/**
 * @author Jean-Philippe.Lambert@ircam.fr, Norbert.Schnell@ircam.fr, victor.saiz@ircam.fr
 *
 * @brief  Biquad filter and coefficients calculator
 *
 * Based on the "Cookbook formulae for audio EQ biquad filter
 * coefficients" by Robert Bristow-Johnson
 *
 * @private
 */

// y(n) = b0 x(n) + b1 x(n-1) + b2 x(n-2)
//                - a1 x(n-1) - a2 x(n-2)
//
// f0 is normalised by the nyquist frequency
// q must be > 0.
// gain must be > 0. and is linear
//
// when there is no gain parameter, one can simply multiply the b
//  * coefficients by a (linear) gain
//
// a0 is always 1. as each coefficient is normalised by a0, including a0
//
// a1 is a[0] and a2 is a[1]

import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

var sin = Math.sin;
var cos = Math.cos;
var M_PI = Math.PI;
var sqrt = Math.sqrt;

// -------------------------------------------
// coefs calculations
// -------------------------------------------

// LPF: H(s) = 1 / (s^2 + s/Q + 1)
function lowpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = ((1.0 - c) * 0.5) * a0_inv;
  coefs.b1 = (1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

// HPF: H(s) = s^2 / (s^2 + s/Q + 1)
function highpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = ((1.0 + c) * 0.5) * a0_inv;
  coefs.b1 = (-1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

// BPF: H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q)
function bandpass_constant_skirt_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var s = sin(w0);
  var alpha = s / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = (s * 0.5) * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

// BPF: H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
function bandpass_constant_peak_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = alpha * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

// notch: H(s) = (s^2 + 1) / (s^2 + s/Q + 1)
function notch_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = coefs.b0;
}

// APF: H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)
function allpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = coefs.a2;
  coefs.b1 = coefs.a1;
  coefs.b2 = 1.0;
}

// peakingEQ: H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
// A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40)
// gain is linear here
function peaking_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);
  var g_inv = 1.0 / g;

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha * g_inv);

  coefs.a1 = (-2.0 * c) * a0_inv;
  coefs.a2 = (1.0 - alpha * g_inv) * a0_inv;

  coefs.b0 = (1.0 + alpha * g) * a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = (1.0 - alpha * g) * a0_inv;
}

// lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)
// A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40)
// gain is linear here
function lowshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q ;
  var c = cos(w0);

  var a0_inv = 1.0 / ( (g+1.0) + (g-1.0) * c + alpha_2_sqrtg);

  coefs.a1 = (-2.0 *     ( (g-1.0) + (g+1.0) * c                ) ) * a0_inv;
  coefs.a2 = (             (g+1.0) + (g-1.0) * c - alpha_2_sqrtg  ) * a0_inv;

  coefs.b0 = (       g * ( (g+1.0) - (g-1.0) * c + alpha_2_sqrtg) ) * a0_inv;
  coefs.b1 = ( 2.0 * g * ( (g-1.0) - (g+1.0) * c                ) ) * a0_inv;
  coefs.b2 = (       g * ( (g+1.0) - (g-1.0) * c - alpha_2_sqrtg) ) * a0_inv;
}

// highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
// A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40)
// gain is linear here
function highshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q ;
  var c = cos(w0);

  var a0_inv = 1.0 / ( (g+1.0) - (g-1.0) * c + alpha_2_sqrtg);

  coefs.a1 = ( 2.0 *     ( (g-1.0) - (g+1.0) * c                ) ) * a0_inv;
  coefs.a2 = (             (g+1.0) - (g-1.0) * c - alpha_2_sqrtg  ) * a0_inv;

  coefs.b0 = (      g * (  (g+1.0) + (g-1.0) * c + alpha_2_sqrtg) ) * a0_inv;
  coefs.b1 = (-2.0 * g * ( (g-1.0) + (g+1.0) * c                ) ) * a0_inv;
  coefs.b2 = (      g * (  (g+1.0) + (g-1.0) * c - alpha_2_sqrtg) ) * a0_inv;
}

// helper function
function calculateCoefs(type, f0, q, gain, coefs) {

  switch(type) {
    case 'lowpass':
      lowpass_coefs(f0, q, coefs);
      break;

    case 'highpass':
      highpass_coefs(f0, q, coefs);
      break;

    case 'bandpass_constant_skirt':
      bandpass_constant_skirt_coefs(f0, q, coefs);
      break;

    case 'bandpass_constant_peak':
      bandpass_constant_peak_coefs(f0, q, coefs);
      break;

    case 'notch':
      notch_coefs(f0, q, coefs);
      break;

    case 'allpass':
      allpass_coefs(f0, q, coefs);
      break;

    case 'peaking':
      peaking_coefs(f0, q, gain, coefs);
      break;

    case 'lowshelf':
      lowshelf_coefs(f0, q, gain, coefs);
      break;

    case 'highshelf':
      highshelf_coefs(f0, q, gain, coefs);
      break;
  }

  // apply gain
  switch (type) {
    case 'lowpass':
    case 'highpass':
    case 'bandpass_constant_skirt':
    case 'bandpass_constant_peak':
    case 'notch':
    case 'allpass':
      if (gain != 1.0) {
        coefs.b0 *= gain;
        coefs.b1 *= gain;
        coefs.b2 *= gain;
      }
      break;
    /* gain is already integrated for the following */
    case 'peaking':
    case 'lowshelf':
    case 'highshelf':
      break;
  }
}

// direct form I
// a0 = 1, a1 = a[0], a2 = a[1]
// 4 states (in that order): x(n-1), x(n-2), y(n-1), y(n-2)
function biquadArrayDf1(coefs, state, inFrame, outFrame, size) {
  for(let i = 0; i < size; i++) {
    var y = coefs.b0 * inFrame[i]
          + coefs.b1 * state.xn_1[i] + coefs.b2 * state.xn_2[i]
          - coefs.a1 * state.yn_1[i] - coefs.a2 * state.yn_2[i];

    outFrame[i] = y;

    // update states
    state.xn_2[i] = state.xn_1[i];
    state.xn_1[i] = inFrame[i];

    state.yn_2[i] = state.yn_1[i];
    state.yn_1[i] = y;
  }
}

// transposed direct form II
// a0 = 1, a1 = a[0], a2 = a[1]
// 2 states
function biquadArrayDf2(coefs, state, inFrame, outFrame, size) {
  for (let i = 0; i < size; i++) {
    outFrame[i] = coefs.b0 * inFrame[i] + state.xn_1[i];

    // update states
    state.xn_1[i] = coefs.b1 * inFrame[i] - coefs.a1[i] * outFrame[i] + state.xn_2[i];
    state.xn_2[i] = coefs.b2 * inFrame[i] - coefs.a2[i] * outFrame[i];
  }
}



const definitions = {
  type: {
    type: 'enum',
    default: 'lowpass',
    list: [
      'lowpass',
      'highpass',
      'bandpass_constant_skirt',
      'bandpass_constant_peak',
      'notch',
      'allpass',
      'peaking',
      'lowshelf',
      'highshelf',
    ],
    metas: { kind: 'static' },
  },
  f0: {
    type: 'float',
    default: 1,
    metas: { kind: 'static' },
  },
  gain: {
    type: 'float',
    default: 1,
    metas: { kind: 'static' },
  },
  q: {
    type: 'float',
    default: 1,
    metas: { kind: 'static' },
  },
  bandwidth: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'static' },
  },
}

/**
 * Biquad filter (Direct form I).
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default values.
 * @param {String} [type='lowpass'] - Type of the filter. Available filters are:
 *  'lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass_constant_peak',
 *  'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf'.
 * @param {Number} [f0=1] - Cutoff or center frequency of the filter according
 *  to its type.
 * @param {Number} [gain=1] - Gain of the filter.
 * @param {Number} [q=1] - Quality factor of the filter.
 * @param {Number} [bandwidth=null] - Bandwidth of the filter. If defined,
 *  compute the `q` factor according to the `f0` and `bandwidth`.
 *
 * @example
 * // todo
 */
class Biquad extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);
    this.params.addListener(this.onParamUpdate.bind(this));
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const frameRate = this.streamParams.frameRate;
    const frameSize = this.streamParams.frameSize;

    // if no `frameRate` or `frameRate` is 0 we shall halt!
    if (!frameRate || frameRate <= 0)
      throw new Error('Invalid framerate value (0) for biquad');

    const type = this.params.get('type');
    const f0 = this.params.get('f0');
    const gain = this.params.get('gain');
    const q = this.params.get('q');
    const bandwidth = this.params.get('bandwidth');
    const normF0 = f0 / frameRate;
    let qFactor = q;

    // if bandwidth is defined, override the definition of the `q` factor.
    if (bandwidth !== null)
      qFactor = f0 / bandwidth;

    this.coefs = { b0: 0, b1: 0, b2: 0, a1: 0, a2: 0 };
    this.state = {
      xn_1: new Float32Array(frameSize),
      xn_2: new Float32Array(frameSize),
      yn_1: new Float32Array(frameSize),
      yn_2: new Float32Array(frameSize)
    };

    calculateCoefs(type, normF0, qFactor, gain, this.coefs);

    this.propagateStreamParams();
  }

  /** @private */
  processSignal(frame) {
    const frameSize = this.streamParams.frameSize;
    biquadArrayDf1(this.coefs, this.state, frame.data, this.frame.data, frameSize);
  }
}

export default Biquad;
