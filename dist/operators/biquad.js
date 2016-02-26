/**
 * @fileoverview WAVE LFO module: biquad filter.
 * @author Jean-Philippe.Lambert@ircam.fr, Norbert.Schnell@ircam.fr, victor.saiz@ircam.fr
 * @version 0.1.0
 *
 * @brief  Biquad filter and coefficients calculator
 *
 * Based on the "Cookbook formulae for audio EQ biquad filter
 * coefficients" by Robert Bristow-Johnson
 *
 */

/* y(n) = b0 x(n) + b1 x(n-1) + b2 x(n-2)  */
/*                - a1 x(n-1) - a2 x(n-2)  */

/* f0 is normalised by the nyquist frequency */
/* q must be > 0. */
/* gain must be > 0. and is linear */

/* when there is no gain parameter, one can simply multiply the b
 * coefficients by a (linear) gain */

/* a0 is always 1. as each coefficient is normalised by a0, including a0 */

/* a1 is a[0] and a2 is a[1] */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var BaseLfo = require('../core/base-lfo');

var sin = Math.sin;
var cos = Math.cos;
var M_PI = Math.PI;
var sqrt = Math.sqrt;

// coefs calculations
// ------------------

/* LPF: H(s) = 1 / (s^2 + s/Q + 1) */
function lowpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = (1.0 - c) * 0.5 * a0_inv;
  coefs.b1 = (1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* HPF: H(s) = s^2 / (s^2 + s/Q + 1) */
function highpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = (1.0 + c) * 0.5 * a0_inv;
  coefs.b1 = (-1.0 - c) * a0_inv;
  coefs.b2 = coefs.b0;
}

/* BPF: H(s) = s / (s^2 + s/Q + 1)  (constant skirt gain, peak gain = Q) */
function bandpass_constant_skirt_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var s = sin(w0);
  var alpha = s / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = s * 0.5 * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

/* BPF: H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain) */
function bandpass_constant_peak_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = alpha * a0_inv;
  coefs.b1 = 0.0;
  coefs.b2 = -coefs.b0;
}

/* notch: H(s) = (s^2 + 1) / (s^2 + s/Q + 1) */
function notch_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = coefs.b0;
}

/* APF: H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1) */
function allpass_coefs(f0, q, coefs) {
  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha) * a0_inv;

  coefs.b0 = coefs.a2;
  coefs.b1 = coefs.a1;
  coefs.b2 = 1.0;
}

/* peakingEQ: H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function peaking_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);
  var g_inv = 1.0 / g;

  var w0 = M_PI * f0;
  var alpha = sin(w0) / (2.0 * q);
  var c = cos(w0);

  var a0_inv = 1.0 / (1.0 + alpha * g_inv);

  coefs.a1 = -2.0 * c * a0_inv;
  coefs.a2 = (1.0 - alpha * g_inv) * a0_inv;

  coefs.b0 = (1.0 + alpha * g) * a0_inv;
  coefs.b1 = coefs.a1;
  coefs.b2 = (1.0 - alpha * g) * a0_inv;
}

/* lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function lowshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1.0 / (g + 1.0 + (g - 1.0) * c + alpha_2_sqrtg);

  coefs.a1 = -2.0 * (g - 1.0 + (g + 1.0) * c) * a0_inv;
  coefs.a2 = (g + 1.0 + (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1.0 - (g - 1.0) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = 2.0 * g * (g - 1.0 - (g + 1.0) * c) * a0_inv;
  coefs.b2 = g * (g + 1.0 - (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;
}

/* highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A) */
/* A = sqrt( 10^(dBgain/20) ) = 10^(dBgain/40) */
/* gain is linear here */
function highshelf_coefs(f0, q, gain, coefs) {
  var g = sqrt(gain);

  var w0 = M_PI * f0;
  var alpha_2_sqrtg = sin(w0) * sqrt(g) / q;
  var c = cos(w0);

  var a0_inv = 1.0 / (g + 1.0 - (g - 1.0) * c + alpha_2_sqrtg);

  coefs.a1 = 2.0 * (g - 1.0 - (g + 1.0) * c) * a0_inv;
  coefs.a2 = (g + 1.0 - (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;

  coefs.b0 = g * (g + 1.0 + (g - 1.0) * c + alpha_2_sqrtg) * a0_inv;
  coefs.b1 = -2.0 * g * (g - 1.0 + (g + 1.0) * c) * a0_inv;
  coefs.b2 = g * (g + 1.0 + (g - 1.0) * c - alpha_2_sqrtg) * a0_inv;
}

/* helper */
function calculateCoefs(type, f0, q, gain, coefs) {

  switch (type) {
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

/* direct form I */
/* a0 = 1, a1 = a[0], a2 = a[1] */
/* 4 states (in that order): x(n-1), x(n-2), y(n-1), y(n-2)  */
function biquadArrayDf1(coefs, state, inFrame, outFrame, size) {
  for (var i = 0; i < size; i++) {
    var y = coefs.b0 * inFrame[i] + coefs.b1 * state.xn_1[i] + coefs.b2 * state.xn_2[i] - coefs.a1 * state.yn_1[i] - coefs.a2 * state.yn_2[i];

    outFrame[i] = y;

    // update states
    state.xn_2[i] = state.xn_1[i];
    state.xn_1[i] = inFrame[i];

    state.yn_2[i] = state.yn_1[i];
    state.yn_1[i] = y;
  }
}

/* transposed direct form II */
/* a0 = 1, a1 = a[0], a2 = a[1] */
/* 2 states */
function biquadArrayDf2(coefs, state, inFrame, outFrame, size) {
  for (var i = 0; i < size; i++) {
    outFrame[i] = coefs.b0 * inFrame[i] + state.xn_1[i];

    // update states
    state.xn_1[i] = coefs.b1 * inFrame[i] - coefs.a1[i] * outFrame[i] + state.xn_2[i];
    state.xn_2[i] = coefs.b2 * inFrame[i] - coefs.a2[i] * outFrame[i];
  }
}

var Biquad = (function (_BaseLfo) {
  _inherits(Biquad, _BaseLfo);

  function Biquad(options) {
    _classCallCheck(this, Biquad);

    _get(Object.getPrototypeOf(Biquad.prototype), 'constructor', this).call(this, options, {
      filterType: 'lowpass',
      f0: 1.0,
      gain: 1.0,
      q: 1.0
    });
    // this.type = 'biquad';

    // from here on options is this.params

    // to implement
    // if(opts.damp) …
    // if(opts.decay) …
    // if(opts.over) …

    // var frameRate = this.streamParams.frameRate;
    // // if no frameRate or framerate is 0 we shall halt!
    // if (!frameRate || frameRate <= 0) {
    //   throw new Error('This Operator requires a frameRate higher than 0.');
    // }

    // var normF0 = this.params.f0 / frameRate,
    //     gain = this.params.gain,
    //     q;

    // if (this.params.q)  { q = this.params.q; }
    // if (this.params.bw) { q = this.params.f0 / this.params.bw; }

    // this.coefs = {
    //   b0: 0,
    //   b1: 0,
    //   b2: 0,
    //   a1: 0,
    //   a2: 0
    // };

    // var frameSize = this.streamParams.frameSize;
    // this.state = {
    //   xn_1: new Float32Array(frameSize),
    //   xn_2: new Float32Array(frameSize),
    //   yn_1: new Float32Array(frameSize),
    //   yn_2: new Float32Array(frameSize)
    // };

    // calculateCoefs(this.params.filterType, normF0, q, gain, this.coefs);
    // this.setupStream();
  }

  _createClass(Biquad, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Biquad.prototype), 'initialize', this).call(this);

      var frameRate = this.streamParams.frameRate;
      // if no frameRate or framerate is 0 we shall halt!
      if (!frameRate || frameRate <= 0) {
        throw new Error('This Operator requires a frameRate higher than 0.');
      }

      var normF0 = this.params.f0 / frameRate,
          gain = this.params.gain,
          q;

      if (this.params.q) {
        q = this.params.q;
      }
      if (this.params.bw) {
        q = this.params.f0 / this.params.bw;
      }

      this.coefs = {
        b0: 0,
        b1: 0,
        b2: 0,
        a1: 0,
        a2: 0
      };

      var frameSize = this.streamParams.frameSize;
      this.state = {
        xn_1: new Float32Array(frameSize),
        xn_2: new Float32Array(frameSize),
        yn_1: new Float32Array(frameSize),
        yn_2: new Float32Array(frameSize)
      };

      calculateCoefs(this.params.filterType, normF0, q, gain, this.coefs);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      biquadArrayDf1(this.coefs, this.state, frame, this.outFrame, frame.length);
      // console.log(this.outFrame);
      this.output(time, this.outFrame, metaData);
    }
  }]);

  return Biquad;
})(BaseLfo);

exports['default'] = Biquad;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvYmlxdWFkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFMUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ25CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDbkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7Ozs7O0FBTXJCLFNBQVMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ25DLE1BQUksRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFaEIsTUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUVqQyxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztBQUMvQixPQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQSxHQUFJLE1BQU0sQ0FBQzs7QUFFbEMsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQSxHQUFJLEdBQUcsR0FBSSxNQUFNLENBQUM7QUFDdEMsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUEsR0FBSSxNQUFNLENBQUM7QUFDOUIsT0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0NBQ3JCOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNwQyxNQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLE1BQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNoQyxNQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWhCLE1BQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFBLEFBQUMsQ0FBQzs7QUFFakMsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBSSxNQUFNLENBQUM7QUFDL0IsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUEsR0FBSSxNQUFNLENBQUM7O0FBRWxDLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLEdBQUksTUFBTSxDQUFDO0FBQ3RDLE9BQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUEsR0FBSSxNQUFNLENBQUM7QUFDL0IsT0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0NBQ3JCOzs7QUFHRCxTQUFTLDZCQUE2QixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ25ELE1BQUksRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLE1BQUksS0FBSyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUMxQixNQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWhCLE1BQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFBLEFBQUMsQ0FBQzs7QUFFakMsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBSSxNQUFNLENBQUM7QUFDL0IsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUEsR0FBSSxNQUFNLENBQUM7O0FBRWxDLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBQyxDQUFDLEdBQUcsR0FBRyxHQUFJLE1BQU0sQ0FBQztBQUM5QixPQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUNmLE9BQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0NBQ3RCOzs7QUFHRCxTQUFTLDRCQUE0QixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xELE1BQUksRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFaEIsTUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUVqQyxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztBQUMvQixPQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQSxHQUFJLE1BQU0sQ0FBQzs7QUFFbEMsT0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQzFCLE9BQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ2YsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Q0FDdEI7OztBQUdELFNBQVMsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLE1BQUksRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFaEIsTUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUVqQyxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztBQUMvQixPQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQSxHQUFJLE1BQU0sQ0FBQzs7QUFFbEMsT0FBSyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7QUFDbEIsT0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3BCLE9BQUssQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztDQUNyQjs7O0FBR0QsU0FBUyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbkMsTUFBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixNQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDaEMsTUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixNQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQSxBQUFDLENBQUM7O0FBRWpDLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUksTUFBTSxDQUFDO0FBQy9CLE9BQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFBLEdBQUksTUFBTSxDQUFDOztBQUVsQyxPQUFLLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDcEIsT0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3BCLE9BQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0NBQ2hCOzs7OztBQUtELFNBQVMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN6QyxNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkIsTUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFcEIsTUFBSSxFQUFFLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNuQixNQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDaEMsTUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixNQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUV6QyxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztBQUMvQixPQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUEsR0FBSSxNQUFNLENBQUM7O0FBRTFDLE9BQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQSxHQUFJLE1BQU0sQ0FBQztBQUN0QyxPQUFLLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDcEIsT0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBLEdBQUksTUFBTSxDQUFDO0NBQ3ZDOzs7OztBQUtELFNBQVMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMxQyxNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLE1BQUksRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUU7QUFDM0MsTUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixNQUFJLE1BQU0sR0FBRyxHQUFHLElBQUssQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsR0FBRyxhQUFhLENBQUEsQUFBQyxDQUFDOztBQUU1RCxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUMsQ0FBQyxHQUFHLElBQVMsQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsQ0FBQSxBQUFpQixHQUFLLE1BQU0sQ0FBQztBQUMzRSxPQUFLLENBQUMsRUFBRSxHQUFHLENBQWMsQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsR0FBRyxhQUFhLENBQUEsR0FBTSxNQUFNLENBQUM7O0FBRTNFLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBUSxDQUFDLElBQUssQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsR0FBRyxhQUFhLENBQUEsQUFBQyxHQUFLLE1BQU0sQ0FBQztBQUMzRSxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQUUsR0FBRyxHQUFHLENBQUMsSUFBSyxBQUFDLENBQUMsR0FBQyxHQUFHLEdBQUksQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFBLEdBQUksQ0FBQyxDQUFBLEFBQWlCLEdBQUssTUFBTSxDQUFDO0FBQzNFLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBUSxDQUFDLElBQUssQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsR0FBRyxhQUFhLENBQUEsQUFBQyxHQUFLLE1BQU0sQ0FBQztDQUM1RTs7Ozs7QUFLRCxTQUFTLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDM0MsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQixNQUFJLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25CLE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFO0FBQzNDLE1BQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFaEIsTUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFLLEFBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEFBQUMsQ0FBQzs7QUFFNUQsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFFLEdBQUcsSUFBUyxBQUFDLENBQUMsR0FBQyxHQUFHLEdBQUksQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFBLEdBQUksQ0FBQyxDQUFBLEFBQWlCLEdBQUssTUFBTSxDQUFDO0FBQzNFLE9BQUssQ0FBQyxFQUFFLEdBQUcsQ0FBYyxBQUFDLENBQUMsR0FBQyxHQUFHLEdBQUksQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFBLEdBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQSxHQUFNLE1BQU0sQ0FBQzs7QUFFM0UsT0FBSyxDQUFDLEVBQUUsR0FBRyxBQUFPLENBQUMsSUFBTSxBQUFDLENBQUMsR0FBQyxHQUFHLEdBQUksQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFBLEdBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQSxBQUFDLEdBQUssTUFBTSxDQUFDO0FBQzNFLE9BQUssQ0FBQyxFQUFFLEdBQUcsQUFBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUssQUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQSxHQUFJLENBQUMsQ0FBQSxBQUFpQixHQUFLLE1BQU0sQ0FBQztBQUMzRSxPQUFLLENBQUMsRUFBRSxHQUFHLEFBQU8sQ0FBQyxJQUFNLEFBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBSSxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUEsR0FBSSxDQUFDLEdBQUcsYUFBYSxDQUFBLEFBQUMsR0FBSyxNQUFNLENBQUM7Q0FDNUU7OztBQUdELFNBQVMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7O0FBRWhELFVBQU8sSUFBSTtBQUNULFNBQUssU0FBUztBQUNaLG1CQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QixZQUFNOztBQUFBLEFBRVIsU0FBSyxVQUFVO0FBQ2Isb0JBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdCLFlBQU07O0FBQUEsQUFFUixTQUFLLHlCQUF5QjtBQUM1QixtQ0FBNkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFlBQU07O0FBQUEsQUFFUixTQUFLLHdCQUF3QjtBQUMzQixrQ0FBNEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNDLFlBQU07O0FBQUEsQUFFUixTQUFLLE9BQU87QUFDVixpQkFBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUIsWUFBTTs7QUFBQSxBQUVSLFNBQUssU0FBUztBQUNaLG1CQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QixZQUFNOztBQUFBLEFBRVIsU0FBSyxTQUFTO0FBQ1osbUJBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsQyxZQUFNOztBQUFBLEFBRVIsU0FBSyxVQUFVO0FBQ2Isb0JBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuQyxZQUFNOztBQUFBLEFBRVIsU0FBSyxXQUFXO0FBQ2QscUJBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQyxZQUFNO0FBQUEsR0FDVDs7O0FBR0QsVUFBUSxJQUFJO0FBQ1YsU0FBSyxTQUFTLENBQUM7QUFDZixTQUFLLFVBQVUsQ0FBQztBQUNoQixTQUFLLHlCQUF5QixDQUFDO0FBQy9CLFNBQUssd0JBQXdCLENBQUM7QUFDOUIsU0FBSyxPQUFPLENBQUM7QUFDYixTQUFLLFNBQVM7QUFDWixVQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDZixhQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztBQUNqQixhQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztBQUNqQixhQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztPQUNsQjtBQUNELFlBQU07QUFBQTtBQUVSLFNBQUssU0FBUyxDQUFDO0FBQ2YsU0FBSyxVQUFVLENBQUM7QUFDaEIsU0FBSyxXQUFXO0FBQ2QsWUFBTTtBQUFBLEdBQ1Q7Q0FDRjs7Ozs7QUFLRCxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQzdELE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUIsUUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQ3JCLEtBQUssQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQ25ELEtBQUssQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTVELFlBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7OztBQUdoQixTQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsU0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTNCLFNBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixTQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNuQjtDQUNGOzs7OztBQUtELFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7QUFDN0QsT0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QixZQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR3BELFNBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRixTQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ25FO0NBQ0Y7O0lBRW9CLE1BQU07WUFBTixNQUFNOztBQUVkLFdBRlEsTUFBTSxDQUViLE9BQU8sRUFBRTswQkFGRixNQUFNOztBQUd2QiwrQkFIaUIsTUFBTSw2Q0FHakIsT0FBTyxFQUFFO0FBQ2IsZ0JBQVUsRUFBQyxTQUFTO0FBQ3BCLFFBQUUsRUFBRSxHQUFHO0FBQ1AsVUFBSSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsR0FBRztLQUNQLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNKOztlQWpEa0IsTUFBTTs7V0FtRGYsc0JBQUc7QUFDWCxpQ0FwRGlCLE1BQU0sNENBb0RKOztBQUVuQixVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQzs7QUFFNUMsVUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO0FBQ2hDLGNBQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztPQUN0RTs7QUFFRCxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxTQUFTO1VBQ25DLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7VUFDdkIsQ0FBQyxDQUFDOztBQUVOLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUc7QUFBRSxTQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7T0FBRTtBQUMxQyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO0FBQUUsU0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO09BQUU7O0FBRTVELFVBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxVQUFFLEVBQUUsQ0FBQztBQUNMLFVBQUUsRUFBRSxDQUFDO0FBQ0wsVUFBRSxFQUFFLENBQUM7QUFDTCxVQUFFLEVBQUUsQ0FBQztBQUNMLFVBQUUsRUFBRSxDQUFDO09BQ04sQ0FBQzs7QUFFRixVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUM1QyxVQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsWUFBSSxFQUFFLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQztBQUNqQyxZQUFJLEVBQUUsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQ2pDLFlBQUksRUFBRSxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDakMsWUFBSSxFQUFFLElBQUksWUFBWSxDQUFDLFNBQVMsQ0FBQztPQUNsQyxDQUFDOztBQUVGLG9CQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3JFOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixvQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNFLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDNUM7OztTQTFGa0IsTUFBTTtHQUFTLE9BQU87O3FCQUF0QixNQUFNIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvYmlxdWFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFdBVkUgTEZPIG1vZHVsZTogYmlxdWFkIGZpbHRlci5cbiAqIEBhdXRob3IgSmVhbi1QaGlsaXBwZS5MYW1iZXJ0QGlyY2FtLmZyLCBOb3JiZXJ0LlNjaG5lbGxAaXJjYW0uZnIsIHZpY3Rvci5zYWl6QGlyY2FtLmZyXG4gKiBAdmVyc2lvbiAwLjEuMFxuICpcbiAqIEBicmllZiAgQmlxdWFkIGZpbHRlciBhbmQgY29lZmZpY2llbnRzIGNhbGN1bGF0b3JcbiAqXG4gKiBCYXNlZCBvbiB0aGUgXCJDb29rYm9vayBmb3JtdWxhZSBmb3IgYXVkaW8gRVEgYmlxdWFkIGZpbHRlclxuICogY29lZmZpY2llbnRzXCIgYnkgUm9iZXJ0IEJyaXN0b3ctSm9obnNvblxuICpcbiAqL1xuXG4vKiB5KG4pID0gYjAgeChuKSArIGIxIHgobi0xKSArIGIyIHgobi0yKSAgKi9cbi8qICAgICAgICAgICAgICAgIC0gYTEgeChuLTEpIC0gYTIgeChuLTIpICAqL1xuXG4vKiBmMCBpcyBub3JtYWxpc2VkIGJ5IHRoZSBueXF1aXN0IGZyZXF1ZW5jeSAqL1xuLyogcSBtdXN0IGJlID4gMC4gKi9cbi8qIGdhaW4gbXVzdCBiZSA+IDAuIGFuZCBpcyBsaW5lYXIgKi9cblxuLyogd2hlbiB0aGVyZSBpcyBubyBnYWluIHBhcmFtZXRlciwgb25lIGNhbiBzaW1wbHkgbXVsdGlwbHkgdGhlIGJcbiAqIGNvZWZmaWNpZW50cyBieSBhIChsaW5lYXIpIGdhaW4gKi9cblxuLyogYTAgaXMgYWx3YXlzIDEuIGFzIGVhY2ggY29lZmZpY2llbnQgaXMgbm9ybWFsaXNlZCBieSBhMCwgaW5jbHVkaW5nIGEwICovXG5cbi8qIGExIGlzIGFbMF0gYW5kIGEyIGlzIGFbMV0gKi9cblxudmFyIEJhc2VMZm8gPSByZXF1aXJlKCcuLi9jb3JlL2Jhc2UtbGZvJyk7XG5cbnZhciBzaW4gPSBNYXRoLnNpbjtcbnZhciBjb3MgPSBNYXRoLmNvcztcbnZhciBNX1BJID0gTWF0aC5QSTtcbnZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG4vLyBjb2VmcyBjYWxjdWxhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiBMUEY6IEgocykgPSAxIC8gKHNeMiArIHMvUSArIDEpICovXG5mdW5jdGlvbiBsb3dwYXNzX2NvZWZzKGYwLCBxLCBjb2Vmcykge1xuICB2YXIgdzAgPSBNX1BJICogZjA7XG4gIHZhciBhbHBoYSA9IHNpbih3MCkgLyAoMi4wICogcSk7XG4gIHZhciBjID0gY29zKHcwKTtcblxuICB2YXIgYTBfaW52ID0gMS4wIC8gKDEuMCArIGFscGhhKTtcblxuICBjb2Vmcy5hMSA9ICgtMi4wICogYykgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKDEuMCAtIGFscGhhKSAqIGEwX2ludjtcblxuICBjb2Vmcy5iMCA9ICgoMS4wIC0gYykgKiAwLjUpICogYTBfaW52O1xuICBjb2Vmcy5iMSA9ICgxLjAgLSBjKSAqIGEwX2ludjtcbiAgY29lZnMuYjIgPSBjb2Vmcy5iMDtcbn1cblxuICAvKiBIUEY6IEgocykgPSBzXjIgLyAoc14yICsgcy9RICsgMSkgKi9cbmZ1bmN0aW9uIGhpZ2hwYXNzX2NvZWZzKGYwLCBxLCBjb2Vmcykge1xuICB2YXIgdzAgPSBNX1BJICogZjA7XG4gIHZhciBhbHBoYSA9IHNpbih3MCkgLyAoMi4wICogcSk7XG4gIHZhciBjID0gY29zKHcwKTtcblxuICB2YXIgYTBfaW52ID0gMS4wIC8gKDEuMCArIGFscGhhKTtcblxuICBjb2Vmcy5hMSA9ICgtMi4wICogYykgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKDEuMCAtIGFscGhhKSAqIGEwX2ludjtcblxuICBjb2Vmcy5iMCA9ICgoMS4wICsgYykgKiAwLjUpICogYTBfaW52O1xuICBjb2Vmcy5iMSA9ICgtMS4wIC0gYykgKiBhMF9pbnY7XG4gIGNvZWZzLmIyID0gY29lZnMuYjA7XG59XG5cbi8qIEJQRjogSChzKSA9IHMgLyAoc14yICsgcy9RICsgMSkgIChjb25zdGFudCBza2lydCBnYWluLCBwZWFrIGdhaW4gPSBRKSAqL1xuZnVuY3Rpb24gYmFuZHBhc3NfY29uc3RhbnRfc2tpcnRfY29lZnMoZjAsIHEsIGNvZWZzKSB7XG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIHMgPSBzaW4odzApO1xuICB2YXIgYWxwaGEgPSBzIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSAocyAqIDAuNSkgKiBhMF9pbnY7XG4gIGNvZWZzLmIxID0gMC4wO1xuICBjb2Vmcy5iMiA9IC1jb2Vmcy5iMDtcbn1cblxuLyogQlBGOiBIKHMpID0gKHMvUSkgLyAoc14yICsgcy9RICsgMSkgICAgICAoY29uc3RhbnQgMCBkQiBwZWFrIGdhaW4pICovXG5mdW5jdGlvbiBiYW5kcGFzc19jb25zdGFudF9wZWFrX2NvZWZzKGYwLCBxLCBjb2Vmcykge1xuICB2YXIgdzAgPSBNX1BJICogZjA7XG4gIHZhciBhbHBoYSA9IHNpbih3MCkgLyAoMi4wICogcSk7XG4gIHZhciBjID0gY29zKHcwKTtcblxuICB2YXIgYTBfaW52ID0gMS4wIC8gKDEuMCArIGFscGhhKTtcblxuICBjb2Vmcy5hMSA9ICgtMi4wICogYykgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKDEuMCAtIGFscGhhKSAqIGEwX2ludjtcblxuICBjb2Vmcy5iMCA9IGFscGhhICogYTBfaW52O1xuICBjb2Vmcy5iMSA9IDAuMDtcbiAgY29lZnMuYjIgPSAtY29lZnMuYjA7XG59XG5cbi8qIG5vdGNoOiBIKHMpID0gKHNeMiArIDEpIC8gKHNeMiArIHMvUSArIDEpICovXG5mdW5jdGlvbiBub3RjaF9jb2VmcyhmMCwgcSwgY29lZnMpIHtcbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSBhMF9pbnY7XG4gIGNvZWZzLmIxID0gY29lZnMuYTE7XG4gIGNvZWZzLmIyID0gY29lZnMuYjA7XG59XG5cbi8qIEFQRjogSChzKSA9IChzXjIgLSBzL1EgKyAxKSAvIChzXjIgKyBzL1EgKyAxKSAqL1xuZnVuY3Rpb24gYWxscGFzc19jb2VmcyhmMCwgcSwgY29lZnMpIHtcbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqIGMpICogYTBfaW52O1xuICBjb2Vmcy5hMiA9ICgxLjAgLSBhbHBoYSkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSBjb2Vmcy5hMjtcbiAgY29lZnMuYjEgPSBjb2Vmcy5hMTtcbiAgY29lZnMuYjIgPSAxLjA7XG59XG5cbi8qIHBlYWtpbmdFUTogSChzKSA9IChzXjIgKyBzKihBL1EpICsgMSkgLyAoc14yICsgcy8oQSpRKSArIDEpICovXG4vKiBBID0gc3FydCggMTBeKGRCZ2Fpbi8yMCkgKSA9IDEwXihkQmdhaW4vNDApICovXG4vKiBnYWluIGlzIGxpbmVhciBoZXJlICovXG5mdW5jdGlvbiBwZWFraW5nX2NvZWZzKGYwLCBxLCBnYWluLCBjb2Vmcykge1xuICB2YXIgZyA9IHNxcnQoZ2Fpbik7XG4gIHZhciBnX2ludiA9IDEuMCAvIGc7XG5cbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGEgPSBzaW4odzApIC8gKDIuMCAqIHEpO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICgxLjAgKyBhbHBoYSAqIGdfaW52KTtcblxuICBjb2Vmcy5hMSA9ICgtMi4wICogYykgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKDEuMCAtIGFscGhhICogZ19pbnYpICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gKDEuMCArIGFscGhhICogZykgKiBhMF9pbnY7XG4gIGNvZWZzLmIxID0gY29lZnMuYTE7XG4gIGNvZWZzLmIyID0gKDEuMCAtIGFscGhhICogZykgKiBhMF9pbnY7XG59XG5cbi8qIGxvd1NoZWxmOiBIKHMpID0gQSAqIChzXjIgKyAoc3FydChBKS9RKSpzICsgQSkvKEEqc14yICsgKHNxcnQoQSkvUSkqcyArIDEpICovXG4vKiBBID0gc3FydCggMTBeKGRCZ2Fpbi8yMCkgKSA9IDEwXihkQmdhaW4vNDApICovXG4vKiBnYWluIGlzIGxpbmVhciBoZXJlICovXG5mdW5jdGlvbiBsb3dzaGVsZl9jb2VmcyhmMCwgcSwgZ2FpbiwgY29lZnMpIHtcbiAgdmFyIGcgPSBzcXJ0KGdhaW4pO1xuXG4gIHZhciB3MCA9IE1fUEkgKiBmMDtcbiAgdmFyIGFscGhhXzJfc3FydGcgPSBzaW4odzApICogc3FydChnKSAvIHEgO1xuICB2YXIgYyA9IGNvcyh3MCk7XG5cbiAgdmFyIGEwX2ludiA9IDEuMCAvICggKGcrMS4wKSArIChnLTEuMCkgKiBjICsgYWxwaGFfMl9zcXJ0Zyk7XG5cbiAgY29lZnMuYTEgPSAoLTIuMCAqICAgICAoIChnLTEuMCkgKyAoZysxLjApICogYyAgICAgICAgICAgICAgICApICkgKiBhMF9pbnY7XG4gIGNvZWZzLmEyID0gKCAgICAgICAgICAgICAoZysxLjApICsgKGctMS4wKSAqIGMgLSBhbHBoYV8yX3NxcnRnICApICogYTBfaW52O1xuXG4gIGNvZWZzLmIwID0gKCAgICAgICBnICogKCAoZysxLjApIC0gKGctMS4wKSAqIGMgKyBhbHBoYV8yX3NxcnRnKSApICogYTBfaW52O1xuICBjb2Vmcy5iMSA9ICggMi4wICogZyAqICggKGctMS4wKSAtIChnKzEuMCkgKiBjICAgICAgICAgICAgICAgICkgKSAqIGEwX2ludjtcbiAgY29lZnMuYjIgPSAoICAgICAgIGcgKiAoIChnKzEuMCkgLSAoZy0xLjApICogYyAtIGFscGhhXzJfc3FydGcpICkgKiBhMF9pbnY7XG59XG5cbi8qIGhpZ2hTaGVsZjogSChzKSA9IEEgKiAoQSpzXjIgKyAoc3FydChBKS9RKSpzICsgMSkvKHNeMiArIChzcXJ0KEEpL1EpKnMgKyBBKSAqL1xuLyogQSA9IHNxcnQoIDEwXihkQmdhaW4vMjApICkgPSAxMF4oZEJnYWluLzQwKSAqL1xuLyogZ2FpbiBpcyBsaW5lYXIgaGVyZSAqL1xuZnVuY3Rpb24gaGlnaHNoZWxmX2NvZWZzKGYwLCBxLCBnYWluLCBjb2Vmcykge1xuICB2YXIgZyA9IHNxcnQoZ2Fpbik7XG5cbiAgdmFyIHcwID0gTV9QSSAqIGYwO1xuICB2YXIgYWxwaGFfMl9zcXJ0ZyA9IHNpbih3MCkgKiBzcXJ0KGcpIC8gcSA7XG4gIHZhciBjID0gY29zKHcwKTtcblxuICB2YXIgYTBfaW52ID0gMS4wIC8gKCAoZysxLjApIC0gKGctMS4wKSAqIGMgKyBhbHBoYV8yX3NxcnRnKTtcblxuICBjb2Vmcy5hMSA9ICggMi4wICogICAgICggKGctMS4wKSAtIChnKzEuMCkgKiBjICAgICAgICAgICAgICAgICkgKSAqIGEwX2ludjtcbiAgY29lZnMuYTIgPSAoICAgICAgICAgICAgIChnKzEuMCkgLSAoZy0xLjApICogYyAtIGFscGhhXzJfc3FydGcgICkgKiBhMF9pbnY7XG5cbiAgY29lZnMuYjAgPSAoICAgICAgZyAqICggIChnKzEuMCkgKyAoZy0xLjApICogYyArIGFscGhhXzJfc3FydGcpICkgKiBhMF9pbnY7XG4gIGNvZWZzLmIxID0gKC0yLjAgKiBnICogKCAoZy0xLjApICsgKGcrMS4wKSAqIGMgICAgICAgICAgICAgICAgKSApICogYTBfaW52O1xuICBjb2Vmcy5iMiA9ICggICAgICBnICogKCAgKGcrMS4wKSArIChnLTEuMCkgKiBjIC0gYWxwaGFfMl9zcXJ0ZykgKSAqIGEwX2ludjtcbn1cblxuICAvKiBoZWxwZXIgKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZUNvZWZzKHR5cGUsIGYwLCBxLCBnYWluLCBjb2Vmcykge1xuXG4gIHN3aXRjaCh0eXBlKSB7XG4gICAgY2FzZSAnbG93cGFzcyc6XG4gICAgICBsb3dwYXNzX2NvZWZzKGYwLCBxLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hpZ2hwYXNzJzpcbiAgICAgIGhpZ2hwYXNzX2NvZWZzKGYwLCBxLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3NraXJ0JzpcbiAgICAgIGJhbmRwYXNzX2NvbnN0YW50X3NraXJ0X2NvZWZzKGYwLCBxLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnOlxuICAgICAgYmFuZHBhc3NfY29uc3RhbnRfcGVha19jb2VmcyhmMCwgcSwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdub3RjaCc6XG4gICAgICBub3RjaF9jb2VmcyhmMCwgcSwgY29lZnMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhbGxwYXNzJzpcbiAgICAgIGFsbHBhc3NfY29lZnMoZjAsIHEsIGNvZWZzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAncGVha2luZyc6XG4gICAgICBwZWFraW5nX2NvZWZzKGYwLCBxLCBnYWluLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2xvd3NoZWxmJzpcbiAgICAgIGxvd3NoZWxmX2NvZWZzKGYwLCBxLCBnYWluLCBjb2Vmcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2hpZ2hzaGVsZic6XG4gICAgICBoaWdoc2hlbGZfY29lZnMoZjAsIHEsIGdhaW4sIGNvZWZzKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gYXBwbHkgZ2FpblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdsb3dwYXNzJzpcbiAgICBjYXNlICdoaWdocGFzcyc6XG4gICAgY2FzZSAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnOlxuICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnOlxuICAgIGNhc2UgJ25vdGNoJzpcbiAgICBjYXNlICdhbGxwYXNzJzpcbiAgICAgIGlmIChnYWluICE9IDEuMCkge1xuICAgICAgICBjb2Vmcy5iMCAqPSBnYWluO1xuICAgICAgICBjb2Vmcy5iMSAqPSBnYWluO1xuICAgICAgICBjb2Vmcy5iMiAqPSBnYWluO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgLyogZ2FpbiBpcyBhbHJlYWR5IGludGVncmF0ZWQgZm9yIHRoZSBmb2xsb3dpbmcgKi9cbiAgICBjYXNlICdwZWFraW5nJzpcbiAgICBjYXNlICdsb3dzaGVsZic6XG4gICAgY2FzZSAnaGlnaHNoZWxmJzpcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbi8qIGRpcmVjdCBmb3JtIEkgKi9cbi8qIGEwID0gMSwgYTEgPSBhWzBdLCBhMiA9IGFbMV0gKi9cbi8qIDQgc3RhdGVzIChpbiB0aGF0IG9yZGVyKTogeChuLTEpLCB4KG4tMiksIHkobi0xKSwgeShuLTIpICAqL1xuZnVuY3Rpb24gYmlxdWFkQXJyYXlEZjEoY29lZnMsIHN0YXRlLCBpbkZyYW1lLCBvdXRGcmFtZSwgc2l6ZSkge1xuICBmb3IobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgdmFyIHkgPSBjb2Vmcy5iMCAqIGluRnJhbWVbaV1cbiAgICAgICAgICArIGNvZWZzLmIxICogc3RhdGUueG5fMVtpXSArIGNvZWZzLmIyICogc3RhdGUueG5fMltpXVxuICAgICAgICAgIC0gY29lZnMuYTEgKiBzdGF0ZS55bl8xW2ldIC0gY29lZnMuYTIgKiBzdGF0ZS55bl8yW2ldO1xuXG4gICAgb3V0RnJhbWVbaV0gPSB5O1xuXG4gICAgLy8gdXBkYXRlIHN0YXRlc1xuICAgIHN0YXRlLnhuXzJbaV0gPSBzdGF0ZS54bl8xW2ldO1xuICAgIHN0YXRlLnhuXzFbaV0gPSBpbkZyYW1lW2ldO1xuXG4gICAgc3RhdGUueW5fMltpXSA9IHN0YXRlLnluXzFbaV07XG4gICAgc3RhdGUueW5fMVtpXSA9IHk7XG4gIH1cbn1cblxuLyogdHJhbnNwb3NlZCBkaXJlY3QgZm9ybSBJSSAqL1xuLyogYTAgPSAxLCBhMSA9IGFbMF0sIGEyID0gYVsxXSAqL1xuLyogMiBzdGF0ZXMgKi9cbmZ1bmN0aW9uIGJpcXVhZEFycmF5RGYyKGNvZWZzLCBzdGF0ZSwgaW5GcmFtZSwgb3V0RnJhbWUsIHNpemUpIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIG91dEZyYW1lW2ldID0gY29lZnMuYjAgKiBpbkZyYW1lW2ldICsgc3RhdGUueG5fMVtpXTtcblxuICAgIC8vIHVwZGF0ZSBzdGF0ZXNcbiAgICBzdGF0ZS54bl8xW2ldID0gY29lZnMuYjEgKiBpbkZyYW1lW2ldIC0gY29lZnMuYTFbaV0gKiBvdXRGcmFtZVtpXSArIHN0YXRlLnhuXzJbaV07XG4gICAgc3RhdGUueG5fMltpXSA9IGNvZWZzLmIyICogaW5GcmFtZVtpXSAtIGNvZWZzLmEyW2ldICogb3V0RnJhbWVbaV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmlxdWFkIGV4dGVuZHMgQmFzZUxmbyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIGZpbHRlclR5cGU6J2xvd3Bhc3MnLFxuICAgICAgZjA6IDEuMCxcbiAgICAgIGdhaW46IDEuMCxcbiAgICAgIHE6IDEuMFxuICAgIH0pO1xuICAgIC8vIHRoaXMudHlwZSA9ICdiaXF1YWQnO1xuXG4gICAgLy8gZnJvbSBoZXJlIG9uIG9wdGlvbnMgaXMgdGhpcy5wYXJhbXNcblxuICAgIC8vIHRvIGltcGxlbWVudFxuICAgIC8vIGlmKG9wdHMuZGFtcCkg4oCmXG4gICAgLy8gaWYob3B0cy5kZWNheSkg4oCmXG4gICAgLy8gaWYob3B0cy5vdmVyKSDigKZcblxuICAgIC8vIHZhciBmcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgLy8gLy8gaWYgbm8gZnJhbWVSYXRlIG9yIGZyYW1lcmF0ZSBpcyAwIHdlIHNoYWxsIGhhbHQhXG4gICAgLy8gaWYgKCFmcmFtZVJhdGUgfHwgZnJhbWVSYXRlIDw9IDApIHtcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcignVGhpcyBPcGVyYXRvciByZXF1aXJlcyBhIGZyYW1lUmF0ZSBoaWdoZXIgdGhhbiAwLicpO1xuICAgIC8vIH1cblxuICAgIC8vIHZhciBub3JtRjAgPSB0aGlzLnBhcmFtcy5mMCAvIGZyYW1lUmF0ZSxcbiAgICAvLyAgICAgZ2FpbiA9IHRoaXMucGFyYW1zLmdhaW4sXG4gICAgLy8gICAgIHE7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucSkgIHsgcSA9IHRoaXMucGFyYW1zLnE7IH1cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMuYncpIHsgcSA9IHRoaXMucGFyYW1zLmYwIC8gdGhpcy5wYXJhbXMuYnc7IH1cblxuICAgIC8vIHRoaXMuY29lZnMgPSB7XG4gICAgLy8gICBiMDogMCxcbiAgICAvLyAgIGIxOiAwLFxuICAgIC8vICAgYjI6IDAsXG4gICAgLy8gICBhMTogMCxcbiAgICAvLyAgIGEyOiAwXG4gICAgLy8gfTtcblxuICAgIC8vIHZhciBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgLy8gdGhpcy5zdGF0ZSA9IHtcbiAgICAvLyAgIHhuXzE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHhuXzI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHluXzE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAvLyAgIHluXzI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKVxuICAgIC8vIH07XG5cbiAgICAvLyBjYWxjdWxhdGVDb2Vmcyh0aGlzLnBhcmFtcy5maWx0ZXJUeXBlLCBub3JtRjAsIHEsIGdhaW4sIHRoaXMuY29lZnMpO1xuICAgIC8vIHRoaXMuc2V0dXBTdHJlYW0oKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdmFyIGZyYW1lUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZTtcbiAgICAvLyBpZiBubyBmcmFtZVJhdGUgb3IgZnJhbWVyYXRlIGlzIDAgd2Ugc2hhbGwgaGFsdCFcbiAgICBpZiAoIWZyYW1lUmF0ZSB8fCBmcmFtZVJhdGUgPD0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIE9wZXJhdG9yIHJlcXVpcmVzIGEgZnJhbWVSYXRlIGhpZ2hlciB0aGFuIDAuJyk7XG4gICAgfVxuXG4gICAgdmFyIG5vcm1GMCA9IHRoaXMucGFyYW1zLmYwIC8gZnJhbWVSYXRlLFxuICAgICAgICBnYWluID0gdGhpcy5wYXJhbXMuZ2FpbixcbiAgICAgICAgcTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5xKSAgeyBxID0gdGhpcy5wYXJhbXMucTsgfVxuICAgIGlmICh0aGlzLnBhcmFtcy5idykgeyBxID0gdGhpcy5wYXJhbXMuZjAgLyB0aGlzLnBhcmFtcy5idzsgfVxuXG4gICAgdGhpcy5jb2VmcyA9IHtcbiAgICAgIGIwOiAwLFxuICAgICAgYjE6IDAsXG4gICAgICBiMjogMCxcbiAgICAgIGExOiAwLFxuICAgICAgYTI6IDBcbiAgICB9O1xuXG4gICAgdmFyIGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgeG5fMTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeG5fMjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeW5fMTogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpLFxuICAgICAgeW5fMjogbmV3IEZsb2F0MzJBcnJheShmcmFtZVNpemUpXG4gICAgfTtcblxuICAgIGNhbGN1bGF0ZUNvZWZzKHRoaXMucGFyYW1zLmZpbHRlclR5cGUsIG5vcm1GMCwgcSwgZ2FpbiwgdGhpcy5jb2Vmcyk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGJpcXVhZEFycmF5RGYxKHRoaXMuY29lZnMsIHRoaXMuc3RhdGUsIGZyYW1lLCB0aGlzLm91dEZyYW1lLCBmcmFtZS5sZW5ndGgpO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMub3V0RnJhbWUpO1xuICAgIHRoaXMub3V0cHV0KHRpbWUsIHRoaXMub3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19