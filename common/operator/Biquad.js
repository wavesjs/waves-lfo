'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var pow = Math.pow;
var _2PI = Math.PI * 2;

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

var definitions = {
  type: {
    type: 'enum',
    default: 'lowpass',
    list: ['lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass', 'bandpass_constant_peak', 'notch', 'allpass', 'peaking', 'lowshelf', 'highshelf'],
    metas: { kind: 'dyanmic' }
  },
  f0: {
    type: 'float',
    default: 1,
    metas: { kind: 'dyanmic' }
  },
  gain: {
    type: 'float',
    default: 1,
    min: 0,
    metas: { kind: 'dyanmic' }
  },
  q: {
    type: 'float',
    default: 1,
    min: 0.001, // PIPO_BIQUAD_MIN_Q
    // max: 1,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Biquad filter (Direct form I). If input is of type `vector` the filter is
 * applied on each dimension i parallel.
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
var Biquad = function (_BaseLfo) {
  (0, _inherits3.default)(Biquad, _BaseLfo);

  function Biquad() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Biquad);
    return (0, _possibleConstructorReturn3.default)(this, (Biquad.__proto__ || (0, _getPrototypeOf2.default)(Biquad)).call(this, definitions, options));
  }

  (0, _createClass3.default)(Biquad, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      this._calculateCoefs();
    }
  }, {
    key: '_calculateCoefs',
    value: function _calculateCoefs() {
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameType = this.streamParams.frameType;
      var frameSize = this.streamParams.frameSize;

      var type = this.params.get('type');
      var f0 = this.params.get('f0');
      var gain = this.params.get('gain');
      var q = this.params.get('q');
      // const bandwidth = this.params.get('bandwidth');
      var bandwidth = null;

      var b0 = 0,
          b1 = 0,
          b2 = 0,
          a0 = 0,
          a1 = 0,
          a2 = 0;

      var A = pow(10, gain / 40);
      var w0 = _2PI * f0 / sampleRate;
      var cosW0 = cos(w0);
      var sinW0 = sin(w0);
      var alpha = void 0; // depend of the filter type
      var _2RootAAlpha = void 0; // intermediate value for lowshelf and highshelf

      switch (type) {
        // H(s) = 1 / (s^2 + s/Q + 1)
        case 'lowpass':
          alpha = sinW0 / (2 * q);
          b0 = (1 - cosW0) / 2;
          b1 = 1 - cosW0;
          b2 = b0;
          a0 = 1 + alpha;
          a1 = -2 * cosW0;
          a2 = 1 - alpha;
          break;
        // H(s) = s^2 / (s^2 + s/Q + 1)
        case 'highpass':
          alpha = sinW0 / (2 * q);
          b0 = (1 + cosW0) / 2;
          b1 = -(1 + cosW0);
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

          b0 = A * (A + 1 - (A - 1) * cosW0 + _2RootAAlpha);
          b1 = 2 * A * (A - 1 - (A + 1) * cosW0);
          b2 = A * (A + 1 - (A - 1) * cosW0 - _2RootAAlpha);
          a0 = A + 1 + (A - 1) * cosW0 + _2RootAAlpha;
          a1 = -2 * (A - 1 + (A + 1) * cosW0);
          a2 = A + 1 + (A - 1) * cosW0 - _2RootAAlpha;
          break;
        // H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
        case 'highshelf':
          alpha = sinW0 / (2 * q);
          _2RootAAlpha = 2 * sqrt(A) * alpha;

          b0 = A * (A + 1 + (A - 1) * cosW0 + _2RootAAlpha);
          b1 = -2 * A * (A - 1 + (A + 1) * cosW0);
          b2 = A * (A + 1 + (A - 1) * cosW0 - _2RootAAlpha);
          a0 = A + 1 - (A - 1) * cosW0 + _2RootAAlpha;
          a1 = 2 * (A - 1 - (A + 1) * cosW0);
          a2 = A + 1 - (A - 1) * cosW0 - _2RootAAlpha;

          break;
      }

      this.coefs = {
        b0: b0 / a0,
        b1: b1 / a0,
        b2: b2 / a0,
        a1: a1 / a0,
        a2: a2 / a0
      };

      // reset state
      if (frameType === 'signal') {
        this.state = { x1: 0, x2: 0, y1: 0, y2: 0 };
      } else {
        this.state = {
          x1: new Float32Array(frameSize),
          x2: new Float32Array(frameSize),
          y1: new Float32Array(frameSize),
          y2: new Float32Array(frameSize)
        };
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      // if no `sampleRate` or `sampleRate` is 0 we shall halt!
      var sampleRate = this.streamParams.sourceSampleRate;

      if (!sampleRate || sampleRate <= 0) throw new Error('Invalid sampleRate value (0) for biquad');

      this._calculateCoefs();
      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var frameSize = this.streamParams.frameSize;
      var outData = this.frame.data;
      var inData = frame.data;
      var state = this.state;
      var coefs = this.coefs;

      for (var i = 0; i < frameSize; i++) {
        var x = inData[i];
        var y = coefs.b0 * x + coefs.b1 * state.x1[i] + coefs.b2 * state.x2[i] - coefs.a1 * state.y1[i] - coefs.a2 * state.y2[i];

        outData[i] = y;

        // update states
        state.x2[i] = state.x1[i];
        state.x1[i] = x;
        state.y2[i] = state.y1[i];
        state.y1[i] = y;
      }
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var frameSize = this.streamParams.frameSize;
      var outData = this.frame.data;
      var inData = frame.data;
      var state = this.state;
      var coefs = this.coefs;

      for (var i = 0; i < frameSize; i++) {
        var x = inData[i];
        var y = coefs.b0 * x + coefs.b1 * state.x1 + coefs.b2 * state.x2 - coefs.a1 * state.y1 - coefs.a2 * state.y2;

        outData[i] = y;

        // update states
        state.x2 = state.x1;
        state.x1 = x;
        state.y2 = state.y1;
        state.y1 = y;
      }
    }
  }]);
  return Biquad;
}(_BaseLfo3.default);

exports.default = Biquad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpcXVhZC5qcyJdLCJuYW1lcyI6WyJzaW4iLCJNYXRoIiwiY29zIiwic3FydCIsInBvdyIsIl8yUEkiLCJQSSIsImRlZmluaXRpb25zIiwidHlwZSIsImRlZmF1bHQiLCJsaXN0IiwibWV0YXMiLCJraW5kIiwiZjAiLCJnYWluIiwibWluIiwicSIsIkJpcXVhZCIsIm9wdGlvbnMiLCJuYW1lIiwidmFsdWUiLCJfY2FsY3VsYXRlQ29lZnMiLCJzYW1wbGVSYXRlIiwic3RyZWFtUGFyYW1zIiwic291cmNlU2FtcGxlUmF0ZSIsImZyYW1lVHlwZSIsImZyYW1lU2l6ZSIsInBhcmFtcyIsImdldCIsImJhbmR3aWR0aCIsImIwIiwiYjEiLCJiMiIsImEwIiwiYTEiLCJhMiIsIkEiLCJ3MCIsImNvc1cwIiwic2luVzAiLCJhbHBoYSIsIl8yUm9vdEFBbHBoYSIsImNvZWZzIiwic3RhdGUiLCJ4MSIsIngyIiwieTEiLCJ5MiIsIkZsb2F0MzJBcnJheSIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiRXJyb3IiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsIm91dERhdGEiLCJkYXRhIiwiaW5EYXRhIiwiaSIsIngiLCJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxLQUFLRCxHQUFqQjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdBQWpCO0FBQ0EsSUFBTUMsT0FBT0YsS0FBS0UsSUFBbEI7QUFDQSxJQUFNQyxNQUFNSCxLQUFLRyxHQUFqQjtBQUNBLElBQU1DLE9BQU9KLEtBQUtLLEVBQUwsR0FBVSxDQUF2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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QUFXYSxDQUFYO0FBQ0Q7QUFDRjs7Ozs7a0JBR1kxQyxNIiwiZmlsZSI6IkJpcXVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IHNpbiA9IE1hdGguc2luO1xuY29uc3QgY29zID0gTWF0aC5jb3M7XG5jb25zdCBzcXJ0ID0gTWF0aC5zcXJ0O1xuY29uc3QgcG93ID0gTWF0aC5wb3c7XG5jb25zdCBfMlBJID0gTWF0aC5QSSAqIDI7XG5cbi8vIHBsb3QgKGZyb20gaHR0cDovL3d3dy5lYXJsZXZlbC5jb20vc2NyaXB0cy93aWRnZXRzLzIwMTMxMDEzL2JpcXVhZHMyLmpzKVxuLy8gdmFyIGxlbiA9IDUxMjtcbi8vIHZhciBtYWdQbG90ID0gW107XG4vLyBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW47IGlkeCsrKSB7XG4vLyAgIHZhciB3O1xuLy8gICBpZiAocGxvdFR5cGUgPT0gXCJsaW5lYXJcIilcbi8vICAgICB3ID0gaWR4IC8gKGxlbiAtIDEpICogTWF0aC5QSTsgIC8vIDAgdG8gcGksIGxpbmVhciBzY2FsZVxuLy8gICBlbHNlXG4vLyAgICAgdyA9IE1hdGguZXhwKE1hdGgubG9nKDEgLyAwLjAwMSkgKiBpZHggLyAobGVuIC0gMSkpICogMC4wMDEgKiBNYXRoLlBJOyAgLy8gMC4wMDEgdG8gMSwgdGltZXMgcGksIGxvZyBzY2FsZVxuXG4vLyAgIHZhciBwaGkgPSBNYXRoLnBvdyhNYXRoLnNpbih3LzIpLCAyKTtcbi8vICAgdmFyIHkgPSBNYXRoLmxvZyhNYXRoLnBvdyhhMCthMSthMiwgMikgLSA0KihhMCphMSArIDQqYTAqYTIgKyBhMSphMikqcGhpICsgMTYqYTAqYTIqcGhpKnBoaSkgLSBNYXRoLmxvZyhNYXRoLnBvdygxK2IxK2IyLCAyKSAtIDQqKGIxICsgNCpiMiArIGIxKmIyKSpwaGkgKyAxNipiMipwaGkqcGhpKTtcbi8vICAgeSA9IHkgKiAxMCAvIE1hdGguTE4xMFxuLy8gICBpZiAoeSA9PSAtSW5maW5pdHkpXG4vLyAgICAgeSA9IC0yMDA7XG5cbi8vICAgaWYgKHBsb3RUeXBlID09IFwibGluZWFyXCIpXG4vLyAgICAgbWFnUGxvdC5wdXNoKFtpZHggLyAobGVuIC0gMSkgKiBGcyAvIDIsIHldKTtcbi8vICAgZWxzZVxuLy8gICAgIG1hZ1Bsb3QucHVzaChbaWR4IC8gKGxlbiAtIDEpIC8gMiwgeV0pO1xuXG4vLyAgIGlmIChpZHggPT0gMClcbi8vICAgICBtaW5WYWwgPSBtYXhWYWwgPSB5O1xuLy8gICBlbHNlIGlmICh5IDwgbWluVmFsKVxuLy8gICAgIG1pblZhbCA9IHk7XG4vLyAgIGVsc2UgaWYgKHkgPiBtYXhWYWwpXG4vLyAgICAgbWF4VmFsID0geTtcbi8vIH1cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIHR5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xvd3Bhc3MnLFxuICAgIGxpc3Q6IFtcbiAgICAgICdsb3dwYXNzJyxcbiAgICAgICdoaWdocGFzcycsXG4gICAgICAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnLFxuICAgICAgJ2JhbmRwYXNzJyxcbiAgICAgICdiYW5kcGFzc19jb25zdGFudF9wZWFrJyxcbiAgICAgICdub3RjaCcsXG4gICAgICAnYWxscGFzcycsXG4gICAgICAncGVha2luZycsXG4gICAgICAnbG93c2hlbGYnLFxuICAgICAgJ2hpZ2hzaGVsZicsXG4gICAgXSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgZjA6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIGdhaW46IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWluOiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBxOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1pbjogMC4wMDEsIC8vIFBJUE9fQklRVUFEX01JTl9RXG4gICAgLy8gbWF4OiAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICAvLyBiYW5kd2lkdGg6IHtcbiAgLy8gICB0eXBlOiAnZmxvYXQnLFxuICAvLyAgIGRlZmF1bHQ6IG51bGwsXG4gIC8vICAgbnVsbGFibGU6IHRydWUsXG4gIC8vICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIC8vIH0sXG59XG5cblxuLyoqXG4gKiBCaXF1YWQgZmlsdGVyIChEaXJlY3QgZm9ybSBJKS4gSWYgaW5wdXQgaXMgb2YgdHlwZSBgdmVjdG9yYCB0aGUgZmlsdGVyIGlzXG4gKiBhcHBsaWVkIG9uIGVhY2ggZGltZW5zaW9uIGkgcGFyYWxsZWwuXG4gKlxuICogQmFzZWQgb24gdGhlIFtcIkNvb2tib29rIGZvcm11bGFlIGZvciBhdWRpbyBFUSBiaXF1YWQgZmlsdGVyIGNvZWZmaWNpZW50c1wiXShodHRwOi8vd3d3Lm11c2ljZHNwLm9yZy9maWxlcy9BdWRpby1FUS1Db29rYm9vay50eHQpXG4gKiBieSBSb2JlcnQgQnJpc3Rvdy1Kb2huc29uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50eXBlPSdsb3dwYXNzJ10gLSBUeXBlIG9mIHRoZSBmaWx0ZXIuIEF2YWlsYWJsZVxuICogIGZpbHRlcnM6ICdsb3dwYXNzJywgJ2hpZ2hwYXNzJywgJ2JhbmRwYXNzX2NvbnN0YW50X3NraXJ0JywgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnXG4gKiAgKGFsaWFzICdiYW5kcGFzcycpLCAnbm90Y2gnLCAnYWxscGFzcycsICdwZWFraW5nJywgJ2xvd3NoZWxmJywgJ2hpZ2hzaGVsZicuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZjA9MV0gLSBDdXRvZmYgb3IgY2VudGVyIGZyZXF1ZW5jeSBvZiB0aGUgZmlsdGVyXG4gKiAgYWNjb3JkaW5nIHRvIGl0cyB0eXBlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmdhaW49MV0gLSBHYWluIG9mIHRoZSBmaWx0ZXIgKGluIGRCKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5xPTFdIC0gUXVhbGl0eSBmYWN0b3Igb2YgdGhlIGZpbHRlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGJ1ZmZlcixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJpcXVhZCA9IG5ldyBsZm8ub3BlcmF0b3IuQmlxdWFkKHtcbiAqICAgdHlwZTogJ2xvd3Bhc3MnLFxuICogICBmMDogMjAwMCxcbiAqICAgZ2FpbjogMyxcbiAqICAgcTogMTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzcGVjdHJ1bURpc3BsYXkgPSBuZXcgbGZvLnNpbmsuU3BlY3RydW1EaXNwbGF5KHtcbiAqICAgY2FudmFzOiAnI3NwZWN0cnVtJyxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdChiaXF1YWQpO1xuICogYmlxdWFkLmNvbm5lY3Qoc3BlY3RydW1EaXNwbGF5KTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEJpcXVhZCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHRoaXMuX2NhbGN1bGF0ZUNvZWZzKCk7XG4gIH1cblxuICBfY2FsY3VsYXRlQ29lZnMoKSB7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVUeXBlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGNvbnN0IHR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3R5cGUnKTtcbiAgICBjb25zdCBmMCA9IHRoaXMucGFyYW1zLmdldCgnZjAnKTtcbiAgICBjb25zdCBnYWluID0gdGhpcy5wYXJhbXMuZ2V0KCdnYWluJyk7XG4gICAgY29uc3QgcSA9IHRoaXMucGFyYW1zLmdldCgncScpO1xuICAgIC8vIGNvbnN0IGJhbmR3aWR0aCA9IHRoaXMucGFyYW1zLmdldCgnYmFuZHdpZHRoJyk7XG4gICAgY29uc3QgYmFuZHdpZHRoID0gbnVsbDtcblxuICAgIGxldCBiMCA9IDAsIGIxID0gMCwgYjIgPSAwLCBhMCA9IDAsIGExID0gMCwgYTIgPSAwO1xuXG4gICAgY29uc3QgQSA9IHBvdygxMCwgZ2FpbiAvIDQwKTtcbiAgICBjb25zdCB3MCA9IF8yUEkgKiBmMCAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgY29zVzAgPSBjb3ModzApO1xuICAgIGNvbnN0IHNpblcwID0gc2luKHcwKTtcbiAgICBsZXQgYWxwaGE7IC8vIGRlcGVuZCBvZiB0aGUgZmlsdGVyIHR5cGVcbiAgICBsZXQgXzJSb290QUFscGhhOyAvLyBpbnRlcm1lZGlhdGUgdmFsdWUgZm9yIGxvd3NoZWxmIGFuZCBoaWdoc2hlbGZcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgLy8gSChzKSA9IDEgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ2xvd3Bhc3MnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgYjAgPSAoMSAtIGNvc1cwKSAvIDI7XG4gICAgICAgIGIxID0gMSAtIGNvc1cwO1xuICAgICAgICBiMiA9IGIwO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYTtcbiAgICAgICAgYTEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBhMiA9IDEgLWFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSBzXjIgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ2hpZ2hwYXNzJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gKDEgKyBjb3NXMCkgLyAyO1xuICAgICAgICBiMSA9IC0gKDEgKyBjb3NXMClcbiAgICAgICAgYjIgPSBiMDtcbiAgICAgICAgYTAgPSAxICsgYWxwaGE7XG4gICAgICAgIGExID0gLTIgKiBjb3NXMDtcbiAgICAgICAgYTIgPSAxIC0gYWxwaGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IHMgLyAoc14yICsgcy9RICsgMSkgIChjb25zdGFudCBza2lydCBnYWluLCBwZWFrIGdhaW4gPSBRKVxuICAgICAgY2FzZSAnYmFuZHBhc3NfY29uc3RhbnRfc2tpcnQnOlxuICAgICAgICBpZiAoYmFuZHdpZHRoKSB7XG4gICAgICAgICAgLy8gc2luKHcwKSpzaW5oKCBsbigyKS8yICogQlcgKiB3MC9zaW4odzApICkgICAgICAgICAgIChjYXNlOiBCVylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGIwID0gc2luVzAgLyAyO1xuICAgICAgICBiMSA9IDA7XG4gICAgICAgIGIyID0gLWIwO1xuICAgICAgICBhMCA9IDEgKyBhbHBoYTtcbiAgICAgICAgYTEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gKHMvUSkgLyAoc14yICsgcy9RICsgMSkgICAgICAoY29uc3RhbnQgMCBkQiBwZWFrIGdhaW4pXG4gICAgICBjYXNlICdiYW5kcGFzcyc6IC8vIGxvb2tzIGxpa2Ugd2hhdCBpcyBnbmVyYWxseSBjb25zaWRlcmVkIGFzIGEgYmFuZHBhc3NcbiAgICAgIGNhc2UgJ2JhbmRwYXNzX2NvbnN0YW50X3BlYWsnOlxuICAgICAgICBpZiAoYmFuZHdpZHRoKSB7XG4gICAgICAgICAgLy8gc2luKHcwKSpzaW5oKCBsbigyKS8yICogQlcgKiB3MC9zaW4odzApICkgICAgICAgICAgIChjYXNlOiBCVylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGIwID0gYWxwaGE7XG4gICAgICAgIGIxID0gMDtcbiAgICAgICAgYjIgPSAtYWxwaGE7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IC0yICogY29zVzA7XG4gICAgICAgIGEyID0gMSAtIGFscGhhO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAoc14yICsgMSkgLyAoc14yICsgcy9RICsgMSlcbiAgICAgIGNhc2UgJ25vdGNoJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gMTtcbiAgICAgICAgYjEgPSAtMiAqIGNvc1cwO1xuICAgICAgICBiMiA9IDE7XG4gICAgICAgIGEwID0gMSArIGFscGhhO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gKHNeMiAtIHMvUSArIDEpIC8gKHNeMiArIHMvUSArIDEpXG4gICAgICBjYXNlICdhbGxwYXNzJzpcbiAgICAgICAgYWxwaGEgPSBzaW5XMCAvICgyICogcSk7XG4gICAgICAgIGIwID0gMSAtIGFscGhhO1xuICAgICAgICBiMSA9IC0yICogY29zVzA7XG4gICAgICAgIGIyID0gMSArIGFscGhhO1xuICAgICAgICBhMCA9IGIyO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IGIwO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIEgocykgPSAoc14yICsgcyooQS9RKSArIDEpIC8gKHNeMiArIHMvKEEqUSkgKyAxKVxuICAgICAgY2FzZSAncGVha2luZyc6XG4gICAgICAgIGlmIChiYW5kd2lkdGgpIHtcbiAgICAgICAgICAvLyBzaW4odzApKnNpbmgoIGxuKDIpLzIgKiBCVyAqIHcwL3Npbih3MCkgKSAgICAgICAgICAgKGNhc2U6IEJXKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFscGhhID0gc2luVzAgLyAoMiAqIHEpO1xuICAgICAgICB9XG5cbiAgICAgICAgYjAgPSAxICsgYWxwaGEgKiBBO1xuICAgICAgICBiMSA9IC0yICogY29zVzA7XG4gICAgICAgIGIyID0gMSAtIGFscGhhICogQTtcbiAgICAgICAgYTAgPSAxICsgYWxwaGEgLyBBO1xuICAgICAgICBhMSA9IGIxO1xuICAgICAgICBhMiA9IDEgLSBhbHBoYSAvIEE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gSChzKSA9IEEgKiAoc14yICsgKHNxcnQoQSkvUSkqcyArIEEpLyhBKnNeMiArIChzcXJ0KEEpL1EpKnMgKyAxKVxuICAgICAgY2FzZSAnbG93c2hlbGYnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgXzJSb290QUFscGhhID0gMiAqIHNxcnQoQSkgKiBhbHBoYTtcblxuICAgICAgICBiMCA9ICAgICBBICogKChBICsgMSkgLSAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBiMSA9IDIgKiBBICogKChBIC0gMSkgLSAoQSArIDEpICogY29zVzApO1xuICAgICAgICBiMiA9ICAgICBBICogKChBICsgMSkgLSAoQSAtIDEpICogY29zVzAgLSBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBhMCA9ICAgICAgICAgIChBICsgMSkgKyAoQSAtIDEpICogY29zVzAgKyBfMlJvb3RBQWxwaGE7XG4gICAgICAgIGExID0gICAgLTIgKiAoKEEgLSAxKSArIChBICsgMSkgKiBjb3NXMCk7XG4gICAgICAgIGEyID0gICAgICAgICAgKEEgKyAxKSArIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBIKHMpID0gQSAqIChBKnNeMiArIChzcXJ0KEEpL1EpKnMgKyAxKS8oc14yICsgKHNxcnQoQSkvUSkqcyArIEEpXG4gICAgICBjYXNlICdoaWdoc2hlbGYnOlxuICAgICAgICBhbHBoYSA9IHNpblcwIC8gKDIgKiBxKTtcbiAgICAgICAgXzJSb290QUFscGhhID0gMiAqIHNxcnQoQSkgKiBhbHBoYTtcblxuICAgICAgICBiMCA9ICAgICAgQSAqICgoQSArIDEpICsgKEEgLSAxKSAqIGNvc1cwICsgXzJSb290QUFscGhhKTtcbiAgICAgICAgYjEgPSAtMiAqIEEgKiAoKEEgLSAxKSArIChBICsgMSkgKiBjb3NXMCk7XG4gICAgICAgIGIyID0gICAgICBBICogKChBICsgMSkgKyAoQSAtIDEpICogY29zVzAgLSBfMlJvb3RBQWxwaGEpO1xuICAgICAgICBhMCA9ICAgICAgICAgICAoQSArIDEpIC0gKEEgLSAxKSAqIGNvc1cwICsgXzJSb290QUFscGhhO1xuICAgICAgICBhMSA9ICAgICAgMiAqICgoQSAtIDEpIC0gKEEgKyAxKSAqIGNvc1cwKTtcbiAgICAgICAgYTIgPSAgICAgICAgICAgKEEgKyAxKSAtIChBIC0gMSkgKiBjb3NXMCAtIF8yUm9vdEFBbHBoYTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmNvZWZzID0ge1xuICAgICAgYjA6IGIwIC8gYTAsXG4gICAgICBiMTogYjEgLyBhMCxcbiAgICAgIGIyOiBiMiAvIGEwLFxuICAgICAgYTE6IGExIC8gYTAsXG4gICAgICBhMjogYTIgLyBhMCxcbiAgICB9O1xuXG4gICAgLy8gcmVzZXQgc3RhdGVcbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgdGhpcy5zdGF0ZSA9IHsgeDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgeDE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeDI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeTE6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgICAgeTI6IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIC8vIGlmIG5vIGBzYW1wbGVSYXRlYCBvciBgc2FtcGxlUmF0ZWAgaXMgMCB3ZSBzaGFsbCBoYWx0IVxuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgaWYgKCFzYW1wbGVSYXRlIHx8IHNhbXBsZVJhdGUgPD0gMClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzYW1wbGVSYXRlIHZhbHVlICgwKSBmb3IgYmlxdWFkJyk7XG5cbiAgICB0aGlzLl9jYWxjdWxhdGVDb2VmcygpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGluRGF0YSA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGNvZWZzID0gdGhpcy5jb2VmcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBpbkRhdGFbaV07XG4gICAgICBjb25zdCB5ID0gY29lZnMuYjAgKiB4XG4gICAgICAgICAgICAgICsgY29lZnMuYjEgKiBzdGF0ZS54MVtpXSArIGNvZWZzLmIyICogc3RhdGUueDJbaV1cbiAgICAgICAgICAgICAgLSBjb2Vmcy5hMSAqIHN0YXRlLnkxW2ldIC0gY29lZnMuYTIgKiBzdGF0ZS55MltpXTtcblxuICAgICAgb3V0RGF0YVtpXSA9IHk7XG5cbiAgICAgIC8vIHVwZGF0ZSBzdGF0ZXNcbiAgICAgIHN0YXRlLngyW2ldID0gc3RhdGUueDFbaV07XG4gICAgICBzdGF0ZS54MVtpXSA9IHg7XG4gICAgICBzdGF0ZS55MltpXSA9IHN0YXRlLnkxW2ldO1xuICAgICAgc3RhdGUueTFbaV0gPSB5O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmNvZWZzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGluRGF0YVtpXTtcbiAgICAgIGNvbnN0IHkgPSBjb2Vmcy5iMCAqIHhcbiAgICAgICAgICAgICAgKyBjb2Vmcy5iMSAqIHN0YXRlLngxICsgY29lZnMuYjIgKiBzdGF0ZS54MlxuICAgICAgICAgICAgICAtIGNvZWZzLmExICogc3RhdGUueTEgLSBjb2Vmcy5hMiAqIHN0YXRlLnkyO1xuXG4gICAgICBvdXREYXRhW2ldID0geTtcblxuICAgICAgLy8gdXBkYXRlIHN0YXRlc1xuICAgICAgc3RhdGUueDIgPSBzdGF0ZS54MTtcbiAgICAgIHN0YXRlLngxID0geDtcbiAgICAgIHN0YXRlLnkyID0gc3RhdGUueTE7XG4gICAgICBzdGF0ZS55MSA9IHk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJpcXVhZDtcbiJdfQ==