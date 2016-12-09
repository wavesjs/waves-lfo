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

var _windows = require('../utils/windows');

var _windows2 = _interopRequireDefault(_windows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/entry/fft/nayuki-obj/fft.js
/*
 * Free Fft and convolution (JavaScript)
 *
 * Copyright (c) 2014 Project Nayuki
 * http://www.nayuki.io/page/free-small-fft-in-multiple-languages
 *
 * (MIT License)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 *
 * Slightly restructured by Chris Cannam, cannam@all-day-breakfast.com
 *
 * @private
 */
/*
 * Construct an object for calculating the discrete Fourier transform (DFT) of
 * size n, where n is a power of 2.
 *
 * @private
 */
function FftNayuki(n) {

  this.n = n;
  this.levels = -1;

  for (var i = 0; i < 32; i++) {
    if (1 << i == n) {
      this.levels = i; // Equal to log2(n)
    }
  }

  if (this.levels == -1) {
    throw "Length is not a power of 2";
  }

  this.cosTable = new Array(n / 2);
  this.sinTable = new Array(n / 2);

  for (var i = 0; i < n / 2; i++) {
    this.cosTable[i] = Math.cos(2 * Math.PI * i / n);
    this.sinTable[i] = Math.sin(2 * Math.PI * i / n);
  }

  /*
   * Computes the discrete Fourier transform (DFT) of the given complex vector,
   * storing the result back into the vector.
   * The vector's length must be equal to the size n that was passed to the
   * object constructor, and this must be a power of 2. Uses the Cooley-Tukey
   * decimation-in-time radix-2 algorithm.
   *
   * @private
   */
  this.forward = function (real, imag) {
    var n = this.n;

    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
      var j = reverseBits(i, this.levels);

      if (j > i) {
        var temp = real[i];
        real[i] = real[j];
        real[j] = temp;
        temp = imag[i];
        imag[i] = imag[j];
        imag[j] = temp;
      }
    }

    // Cooley-Tukey decimation-in-time radix-2 Fft
    for (var size = 2; size <= n; size *= 2) {
      var halfsize = size / 2;
      var tablestep = n / size;

      for (var i = 0; i < n; i += size) {
        for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
          var tpre = real[j + halfsize] * this.cosTable[k] + imag[j + halfsize] * this.sinTable[k];
          var tpim = -real[j + halfsize] * this.sinTable[k] + imag[j + halfsize] * this.cosTable[k];
          real[j + halfsize] = real[j] - tpre;
          imag[j + halfsize] = imag[j] - tpim;
          real[j] += tpre;
          imag[j] += tpim;
        }
      }
    }

    // Returns the integer whose value is the reverse of the lowest 'bits'
    // bits of the integer 'x'.
    function reverseBits(x, bits) {
      var y = 0;

      for (var i = 0; i < bits; i++) {
        y = y << 1 | x & 1;
        x >>>= 1;
      }

      return y;
    }
  };

  /*
   * Computes the inverse discrete Fourier transform (IDFT) of the given complex
   * vector, storing the result back into the vector.
   * The vector's length must be equal to the size n that was passed to the
   * object constructor, and this must be a power of 2. This is a wrapper
   * function. This transform does not perform scaling, so the inverse is not
   * a true inverse.
   *
   * @private
   */
  this.inverse = function (real, imag) {
    forward(imag, real);
  };
}

var sqrt = Math.sqrt;

var isPowerOfTwo = function isPowerOfTwo(number) {
  while (number % 2 === 0 && number > 1) {
    number = number / 2;
  }return number === 1;
};

var definitions = {
  size: {
    type: 'integer',
    default: 1024,
    metas: { kind: 'static' }
  },
  window: {
    type: 'enum',
    list: ['none', 'hann', 'hanning', 'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'],
    default: 'none',
    metas: { kind: 'static' }
  },
  mode: {
    type: 'enum',
    list: ['magnitude', 'power'], // add complex output
    default: 'magnitude'
  },
  norm: {
    type: 'enum',
    default: 'auto',
    list: ['auto', 'none', 'linear', 'power']
  }
};

/**
 * Compute the Fast Fourier Transform of an incomming `signal`.
 *
 * Fft implementation by [Nayuki](https://code.soundsoftware.ac.uk/projects/js-dsp-test/repository/entry/fft/nayuki-obj/fft.js).
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.size=1024] - Size of the fft, should be a power of
 *  2. If the frame size of the incomming signal is lower than this value,
 *  it is zero padded to match the fft size.
 * @param {String} [options.window='none'] - Name of the window applied on the
 *  incomming signal. Available windows are: 'none', 'hann', 'hanning',
 *  'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'.
 * @param {String} [options.mode='magnitude'] - Type of the output (`magnitude`
 *  or `power`)
 * @param {String} [options.norm='auto'] - Type of normalization applied on the
 *  output. Possible values are 'auto', 'none', 'linear', 'power'. When set to
 *  `auto`, a `linear` normalization is applied on the magnitude spectrum, while
 *  a `power` normalizetion is applied on the power spectrum.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming an `audioBuffer` exists
 * const source = new lfo.source.AudioInBuffer({ audioBuffer });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 * });
 *
 * const fft = new lfo.operator.Fft({
 *   mode: 'power',
 *   window: 'hann',
 *   norm: 'power',
 *   size: 256,
 * });
 *
 * source.connect(slicer);
 * slicer.connect(fft);
 * source.start();
 *
 * // > outputs 129 bins containing the values of the power spectrum (including
 * // > DC and Nyuist frequencies).
 *
 * @todo - check if 'rectangle' and 'none' windows are not redondant.
 * @todo - check default values for all params.
 */

var Fft = function (_BaseLfo) {
  (0, _inherits3.default)(Fft, _BaseLfo);

  function Fft() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Fft);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Fft.__proto__ || (0, _getPrototypeOf2.default)(Fft)).call(this, definitions, options));

    _this.windowSize = null;
    _this.normalizeCoefs = null;
    _this.window = null;
    _this.real = null;
    _this.imag = null;
    _this.fft = null;

    if (!isPowerOfTwo(_this.params.get('size'))) throw new Error('fftSize must be a power of two');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Fft, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);
      // set the output frame size
      var inFrameSize = prevStreamParams.frameSize;
      var fftSize = this.params.get('size');
      var mode = this.params.get('mode');
      var norm = this.params.get('norm');
      var windowName = this.params.get('window');
      // window `none` and `rectangle` are aliases
      if (windowName === 'none') windowName = 'rectangle';

      this.streamParams.frameSize = fftSize / 2 + 1;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];
      // size of the window to apply on the input frame
      this.windowSize = inFrameSize < fftSize ? inFrameSize : fftSize;

      // references to populate in the window functions (cf. `initWindow`)
      this.normalizeCoefs = { linear: 0, power: 0 };
      this.window = new Float32Array(this.windowSize);

      (0, _windows2.default)(windowName, // name of the window
      this.window, // buffer populated with the window signal
      this.windowSize, // size of the window
      this.normalizeCoefs // object populated with the normalization coefs
      );

      var _normalizeCoefs = this.normalizeCoefs,
          linear = _normalizeCoefs.linear,
          power = _normalizeCoefs.power;


      switch (norm) {
        case 'none':
          this.windowNorm = 1;
          break;

        case 'linear':
          this.windowNorm = linear;
          break;

        case 'power':
          this.windowNorm = power;
          break;

        case 'auto':
          if (mode === 'magnitude') this.windowNorm = linear;else if (mode === 'power') this.windowNorm = power;
          break;
      }

      this.real = new Float32Array(fftSize);
      this.imag = new Float32Array(fftSize);
      this.fft = new FftNayuki(fftSize);

      this.propagateStreamParams();
    }

    /**
     * Use the `Fft` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} signal - Input values.
     * @return {Array} - Fft of the input signal.
     *
     * @example
     * const fft = new lfo.operator.Fft({ size: 512, window: 'hann' });
     * // mandatory for use in standalone mode
     * fft.initStream({ frameSize: 256, frameType: 'signal' });
     * fft.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(signal) {
      var mode = this.params.get('mode');
      var windowSize = this.windowSize;
      var frameSize = this.streamParams.frameSize;
      var fftSize = this.params.get('size');
      var outData = this.frame.data;

      // apply window on the input signal and reset imag buffer
      for (var i = 0; i < windowSize; i++) {
        this.real[i] = signal[i] * this.window[i] * this.windowNorm;
        this.imag[i] = 0;
      }

      // if real is bigger than input signal, fill with zeros
      for (var _i = windowSize; _i < fftSize; _i++) {
        this.real[_i] = 0;
        this.imag[_i] = 0;
      }

      this.fft.forward(this.real, this.imag);

      if (mode === 'magnitude') {
        var norm = 1 / fftSize;

        // DC index
        var realDc = this.real[0];
        var imagDc = this.imag[0];
        outData[0] = sqrt(realDc * realDc + imagDc * imagDc) * norm;

        // Nquyst index
        var realNy = this.real[fftSize / 2];
        var imagNy = this.imag[fftSize / 2];
        outData[fftSize / 2] = sqrt(realNy * realNy + imagNy * imagNy) * norm;

        // power spectrum
        for (var _i2 = 1, j = fftSize - 1; _i2 < fftSize / 2; _i2++, j--) {
          var real = 0.5 * (this.real[_i2] + this.real[j]);
          var imag = 0.5 * (this.imag[_i2] - this.imag[j]);

          outData[_i2] = 2 * sqrt(real * real + imag * imag) * norm;
        }
      } else if (mode === 'power') {
        var _norm = 1 / (fftSize * fftSize);

        // DC index
        var _realDc = this.real[0];
        var _imagDc = this.imag[0];
        outData[0] = (_realDc * _realDc + _imagDc * _imagDc) * _norm;

        // Nquyst index
        var _realNy = this.real[fftSize / 2];
        var _imagNy = this.imag[fftSize / 2];
        outData[fftSize / 2] = (_realNy * _realNy + _imagNy * _imagNy) * _norm;

        // power spectrum
        for (var _i3 = 1, _j = fftSize - 1; _i3 < fftSize / 2; _i3++, _j--) {
          var _real = 0.5 * (this.real[_i3] + this.real[_j]);
          var _imag = 0.5 * (this.imag[_i3] - this.imag[_j]);

          outData[_i3] = 4 * (_real * _real + _imag * _imag) * _norm;
        }
      }

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Fft;
}(_BaseLfo3.default);

exports.default = Fft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZmdC5qcyJdLCJuYW1lcyI6WyJGZnROYXl1a2kiLCJuIiwibGV2ZWxzIiwiaSIsImNvc1RhYmxlIiwiQXJyYXkiLCJzaW5UYWJsZSIsIk1hdGgiLCJjb3MiLCJQSSIsInNpbiIsImZvcndhcmQiLCJyZWFsIiwiaW1hZyIsImoiLCJyZXZlcnNlQml0cyIsInRlbXAiLCJzaXplIiwiaGFsZnNpemUiLCJ0YWJsZXN0ZXAiLCJrIiwidHByZSIsInRwaW0iLCJ4IiwiYml0cyIsInkiLCJpbnZlcnNlIiwic3FydCIsImlzUG93ZXJPZlR3byIsIm51bWJlciIsImRlZmluaXRpb25zIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJ3aW5kb3ciLCJsaXN0IiwibW9kZSIsIm5vcm0iLCJGZnQiLCJvcHRpb25zIiwid2luZG93U2l6ZSIsIm5vcm1hbGl6ZUNvZWZzIiwiZmZ0IiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImluRnJhbWVTaXplIiwiZnJhbWVTaXplIiwiZmZ0U2l6ZSIsIndpbmRvd05hbWUiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJkZXNjcmlwdGlvbiIsImxpbmVhciIsInBvd2VyIiwiRmxvYXQzMkFycmF5Iiwid2luZG93Tm9ybSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsInNpZ25hbCIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJyZWFsRGMiLCJpbWFnRGMiLCJyZWFsTnkiLCJpbWFnTnkiLCJpbnB1dFNpZ25hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7Ozs7OztBQU1BLFNBQVNBLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCOztBQUVwQixPQUFLQSxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLQyxNQUFMLEdB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USxDQUFSLElBQWEsQ0FBQ0csVUFBU0EsT0FBVCxHQUFrQkMsVUFBU0EsT0FBNUIsSUFBc0M1QixLQUFuRDs7QUFFQTtBQUNBLFlBQU02QixVQUFTLEtBQUt2RCxJQUFMLENBQVV1QyxVQUFVLENBQXBCLENBQWY7QUFDQSxZQUFNaUIsVUFBUyxLQUFLdkQsSUFBTCxDQUFVc0MsVUFBVSxDQUFwQixDQUFmO0FBQ0FXLGdCQUFRWCxVQUFVLENBQWxCLElBQXVCLENBQUNnQixVQUFTQSxPQUFULEdBQWtCQyxVQUFTQSxPQUE1QixJQUFzQzlCLEtBQTdEOztBQUVBO0FBQ0EsYUFBSyxJQUFJbkMsTUFBSSxDQUFSLEVBQVdXLEtBQUlxQyxVQUFVLENBQTlCLEVBQWlDaEQsTUFBSWdELFVBQVUsQ0FBL0MsRUFBa0RoRCxPQUFLVyxJQUF2RCxFQUE0RDtBQUMxRCxjQUFNRixRQUFPLE9BQU8sS0FBS0EsSUFBTCxDQUFVVCxHQUFWLElBQWUsS0FBS1MsSUFBTCxDQUFVRSxFQUFWLENBQXRCLENBQWI7QUFDQSxjQUFNRCxRQUFPLE9BQU8sS0FBS0EsSUFBTCxDQUFVVixHQUFWLElBQWUsS0FBS1UsSUFBTCxDQUFVQyxFQUFWLENBQXRCLENBQWI7O0FBRUFnRCxrQkFBUTNELEdBQVIsSUFBYSxLQUFLUyxRQUFPQSxLQUFQLEdBQWNDLFFBQU9BLEtBQTFCLElBQWtDeUIsS0FBL0M7QUFDRDtBQUNGOztBQUVELGFBQU93QixPQUFQO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixXQUFLTSxXQUFMLENBQWlCTixNQUFNQyxJQUF2QjtBQUNEOzs7OztrQkFHWXpCLEciLCJmaWxlIjoiRmZ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBpbml0V2luZG93IGZyb20gJy4uL3V0aWxzL3dpbmRvd3MnO1xuXG4vLyBodHRwczovL2NvZGUuc291bmRzb2Z0d2FyZS5hYy51ay9wcm9qZWN0cy9qcy1kc3AtdGVzdC9yZXBvc2l0b3J5L2VudHJ5L2ZmdC9uYXl1a2ktb2JqL2ZmdC5qc1xuLypcbiAqIEZyZWUgRmZ0IGFuZCBjb252b2x1dGlvbiAoSmF2YVNjcmlwdClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgUHJvamVjdCBOYXl1a2lcbiAqIGh0dHA6Ly93d3cubmF5dWtpLmlvL3BhZ2UvZnJlZS1zbWFsbC1mZnQtaW4tbXVsdGlwbGUtbGFuZ3VhZ2VzXG4gKlxuICogKE1JVCBMaWNlbnNlKVxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxuICogdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxuICogdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xuICogdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2ZcbiAqIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogLSBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIC0gVGhlIFNvZnR3YXJlIGlzIHByb3ZpZGVkIFwiYXMgaXNcIiwgd2l0aG91dCB3YXJyYW50eSBvZiBhbnkga2luZCwgZXhwcmVzcyBvclxuICogICBpbXBsaWVkLCBpbmNsdWRpbmcgYnV0IG5vdCBsaW1pdGVkIHRvIHRoZSB3YXJyYW50aWVzIG9mIG1lcmNoYW50YWJpbGl0eSxcbiAqICAgZml0bmVzcyBmb3IgYSBwYXJ0aWN1bGFyIHB1cnBvc2UgYW5kIG5vbmluZnJpbmdlbWVudC4gSW4gbm8gZXZlbnQgc2hhbGwgdGhlXG4gKiAgIGF1dGhvcnMgb3IgY29weXJpZ2h0IGhvbGRlcnMgYmUgbGlhYmxlIGZvciBhbnkgY2xhaW0sIGRhbWFnZXMgb3Igb3RoZXJcbiAqICAgbGlhYmlsaXR5LCB3aGV0aGVyIGluIGFuIGFjdGlvbiBvZiBjb250cmFjdCwgdG9ydCBvciBvdGhlcndpc2UsIGFyaXNpbmcgZnJvbSxcbiAqICAgb3V0IG9mIG9yIGluIGNvbm5lY3Rpb24gd2l0aCB0aGUgU29mdHdhcmUgb3IgdGhlIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGVcbiAqICAgU29mdHdhcmUuXG4gKlxuICogU2xpZ2h0bHkgcmVzdHJ1Y3R1cmVkIGJ5IENocmlzIENhbm5hbSwgY2FubmFtQGFsbC1kYXktYnJlYWtmYXN0LmNvbVxuICpcbiAqIEBwcml2YXRlXG4gKi9cbi8qXG4gKiBDb25zdHJ1Y3QgYW4gb2JqZWN0IGZvciBjYWxjdWxhdGluZyB0aGUgZGlzY3JldGUgRm91cmllciB0cmFuc2Zvcm0gKERGVCkgb2ZcbiAqIHNpemUgbiwgd2hlcmUgbiBpcyBhIHBvd2VyIG9mIDIuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRmZ0TmF5dWtpKG4pIHtcblxuICB0aGlzLm4gPSBuO1xuICB0aGlzLmxldmVscyA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7IGkrKykge1xuICAgIGlmICgxIDw8IGkgPT0gbikge1xuICAgICAgdGhpcy5sZXZlbHMgPSBpOyAgLy8gRXF1YWwgdG8gbG9nMihuKVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLmxldmVscyA9PSAtMSkge1xuICAgIHRocm93IFwiTGVuZ3RoIGlzIG5vdCBhIHBvd2VyIG9mIDJcIjtcbiAgfVxuXG4gIHRoaXMuY29zVGFibGUgPSBuZXcgQXJyYXkobiAvIDIpO1xuICB0aGlzLnNpblRhYmxlID0gbmV3IEFycmF5KG4gLyAyKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG4gLyAyOyBpKyspIHtcbiAgICB0aGlzLmNvc1RhYmxlW2ldID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbik7XG4gICAgdGhpcy5zaW5UYWJsZVtpXSA9IE1hdGguc2luKDIgKiBNYXRoLlBJICogaSAvIG4pO1xuICB9XG5cbiAgLypcbiAgICogQ29tcHV0ZXMgdGhlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChERlQpIG9mIHRoZSBnaXZlbiBjb21wbGV4IHZlY3RvcixcbiAgICogc3RvcmluZyB0aGUgcmVzdWx0IGJhY2sgaW50byB0aGUgdmVjdG9yLlxuICAgKiBUaGUgdmVjdG9yJ3MgbGVuZ3RoIG11c3QgYmUgZXF1YWwgdG8gdGhlIHNpemUgbiB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlXG4gICAqIG9iamVjdCBjb25zdHJ1Y3RvciwgYW5kIHRoaXMgbXVzdCBiZSBhIHBvd2VyIG9mIDIuIFVzZXMgdGhlIENvb2xleS1UdWtleVxuICAgKiBkZWNpbWF0aW9uLWluLXRpbWUgcmFkaXgtMiBhbGdvcml0aG0uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmZvcndhcmQgPSBmdW5jdGlvbihyZWFsLCBpbWFnKSB7XG4gICAgdmFyIG4gPSB0aGlzLm47XG5cbiAgICAvLyBCaXQtcmV2ZXJzZWQgYWRkcmVzc2luZyBwZXJtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICB2YXIgaiA9IHJldmVyc2VCaXRzKGksIHRoaXMubGV2ZWxzKTtcblxuICAgICAgaWYgKGogPiBpKSB7XG4gICAgICAgIHZhciB0ZW1wID0gcmVhbFtpXTtcbiAgICAgICAgcmVhbFtpXSA9IHJlYWxbal07XG4gICAgICAgIHJlYWxbal0gPSB0ZW1wO1xuICAgICAgICB0ZW1wID0gaW1hZ1tpXTtcbiAgICAgICAgaW1hZ1tpXSA9IGltYWdbal07XG4gICAgICAgIGltYWdbal0gPSB0ZW1wO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvb2xleS1UdWtleSBkZWNpbWF0aW9uLWluLXRpbWUgcmFkaXgtMiBGZnRcbiAgICBmb3IgKHZhciBzaXplID0gMjsgc2l6ZSA8PSBuOyBzaXplICo9IDIpIHtcbiAgICAgIHZhciBoYWxmc2l6ZSA9IHNpemUgLyAyO1xuICAgICAgdmFyIHRhYmxlc3RlcCA9IG4gLyBzaXplO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkgKz0gc2l6ZSkge1xuICAgICAgICBmb3IgKHZhciBqID0gaSwgayA9IDA7IGogPCBpICsgaGFsZnNpemU7IGorKywgayArPSB0YWJsZXN0ZXApIHtcbiAgICAgICAgICB2YXIgdHByZSA9ICByZWFsW2oraGFsZnNpemVdICogdGhpcy5jb3NUYWJsZVtrXSArXG4gICAgICAgICAgICAgICAgICAgICAgaW1hZ1tqK2hhbGZzaXplXSAqIHRoaXMuc2luVGFibGVba107XG4gICAgICAgICAgdmFyIHRwaW0gPSAtcmVhbFtqK2hhbGZzaXplXSAqIHRoaXMuc2luVGFibGVba10gK1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdbaitoYWxmc2l6ZV0gKiB0aGlzLmNvc1RhYmxlW2tdO1xuICAgICAgICAgIHJlYWxbaiArIGhhbGZzaXplXSA9IHJlYWxbal0gLSB0cHJlO1xuICAgICAgICAgIGltYWdbaiArIGhhbGZzaXplXSA9IGltYWdbal0gLSB0cGltO1xuICAgICAgICAgIHJlYWxbal0gKz0gdHByZTtcbiAgICAgICAgICBpbWFnW2pdICs9IHRwaW07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSBpbnRlZ2VyIHdob3NlIHZhbHVlIGlzIHRoZSByZXZlcnNlIG9mIHRoZSBsb3dlc3QgJ2JpdHMnXG4gICAgLy8gYml0cyBvZiB0aGUgaW50ZWdlciAneCcuXG4gICAgZnVuY3Rpb24gcmV2ZXJzZUJpdHMoeCwgYml0cykge1xuICAgICAgdmFyIHkgPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJpdHM7IGkrKykge1xuICAgICAgICB5ID0gKHkgPDwgMSkgfCAoeCAmIDEpO1xuICAgICAgICB4ID4+Pj0gMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogQ29tcHV0ZXMgdGhlIGludmVyc2UgZGlzY3JldGUgRm91cmllciB0cmFuc2Zvcm0gKElERlQpIG9mIHRoZSBnaXZlbiBjb21wbGV4XG4gICAqIHZlY3Rvciwgc3RvcmluZyB0aGUgcmVzdWx0IGJhY2sgaW50byB0aGUgdmVjdG9yLlxuICAgKiBUaGUgdmVjdG9yJ3MgbGVuZ3RoIG11c3QgYmUgZXF1YWwgdG8gdGhlIHNpemUgbiB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlXG4gICAqIG9iamVjdCBjb25zdHJ1Y3RvciwgYW5kIHRoaXMgbXVzdCBiZSBhIHBvd2VyIG9mIDIuIFRoaXMgaXMgYSB3cmFwcGVyXG4gICAqIGZ1bmN0aW9uLiBUaGlzIHRyYW5zZm9ybSBkb2VzIG5vdCBwZXJmb3JtIHNjYWxpbmcsIHNvIHRoZSBpbnZlcnNlIGlzIG5vdFxuICAgKiBhIHRydWUgaW52ZXJzZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRoaXMuaW52ZXJzZSA9IGZ1bmN0aW9uKHJlYWwsIGltYWcpIHtcbiAgICBmb3J3YXJkKGltYWcsIHJlYWwpO1xuICB9XG59XG5cblxuY29uc3Qgc3FydCA9IE1hdGguc3FydDtcblxuY29uc3QgaXNQb3dlck9mVHdvID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gIHdoaWxlICgobnVtYmVyICUgMiA9PT0gMCkgJiYgbnVtYmVyID4gMSlcbiAgICBudW1iZXIgPSBudW1iZXIgLyAyO1xuXG4gIHJldHVybiBudW1iZXIgPT09IDE7XG59XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBzaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEwMjQsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgd2luZG93OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnbm9uZScsICdoYW5uJywgJ2hhbm5pbmcnLCAnaGFtbWluZycsICdibGFja21hbicsICdibGFja21hbmhhcnJpcycsICdzaW5lJywgJ3JlY3RhbmdsZSddLFxuICAgIGRlZmF1bHQ6ICdub25lJyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtb2RlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnbWFnbml0dWRlJywgJ3Bvd2VyJ10sIC8vIGFkZCBjb21wbGV4IG91dHB1dFxuICAgIGRlZmF1bHQ6ICdtYWduaXR1ZGUnLFxuICB9LFxuICBub3JtOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICBsaXN0OiBbJ2F1dG8nLCAnbm9uZScsICdsaW5lYXInLCAncG93ZXInXSxcbiAgfSxcbn1cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBGYXN0IEZvdXJpZXIgVHJhbnNmb3JtIG9mIGFuIGluY29tbWluZyBgc2lnbmFsYC5cbiAqXG4gKiBGZnQgaW1wbGVtZW50YXRpb24gYnkgW05heXVraV0oaHR0cHM6Ly9jb2RlLnNvdW5kc29mdHdhcmUuYWMudWsvcHJvamVjdHMvanMtZHNwLXRlc3QvcmVwb3NpdG9yeS9lbnRyeS9mZnQvbmF5dWtpLW9iai9mZnQuanMpLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNpemU9MTAyNF0gLSBTaXplIG9mIHRoZSBmZnQsIHNob3VsZCBiZSBhIHBvd2VyIG9mXG4gKiAgMi4gSWYgdGhlIGZyYW1lIHNpemUgb2YgdGhlIGluY29tbWluZyBzaWduYWwgaXMgbG93ZXIgdGhhbiB0aGlzIHZhbHVlLFxuICogIGl0IGlzIHplcm8gcGFkZGVkIHRvIG1hdGNoIHRoZSBmZnQgc2l6ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy53aW5kb3c9J25vbmUnXSAtIE5hbWUgb2YgdGhlIHdpbmRvdyBhcHBsaWVkIG9uIHRoZVxuICogIGluY29tbWluZyBzaWduYWwuIEF2YWlsYWJsZSB3aW5kb3dzIGFyZTogJ25vbmUnLCAnaGFubicsICdoYW5uaW5nJyxcbiAqICAnaGFtbWluZycsICdibGFja21hbicsICdibGFja21hbmhhcnJpcycsICdzaW5lJywgJ3JlY3RhbmdsZScuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubW9kZT0nbWFnbml0dWRlJ10gLSBUeXBlIG9mIHRoZSBvdXRwdXQgKGBtYWduaXR1ZGVgXG4gKiAgb3IgYHBvd2VyYClcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5ub3JtPSdhdXRvJ10gLSBUeXBlIG9mIG5vcm1hbGl6YXRpb24gYXBwbGllZCBvbiB0aGVcbiAqICBvdXRwdXQuIFBvc3NpYmxlIHZhbHVlcyBhcmUgJ2F1dG8nLCAnbm9uZScsICdsaW5lYXInLCAncG93ZXInLiBXaGVuIHNldCB0b1xuICogIGBhdXRvYCwgYSBgbGluZWFyYCBub3JtYWxpemF0aW9uIGlzIGFwcGxpZWQgb24gdGhlIG1hZ25pdHVkZSBzcGVjdHJ1bSwgd2hpbGVcbiAqICBhIGBwb3dlcmAgbm9ybWFsaXpldGlvbiBpcyBhcHBsaWVkIG9uIHRoZSBwb3dlciBzcGVjdHJ1bS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIGFuIGBhdWRpb0J1ZmZlcmAgZXhpc3RzXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHsgYXVkaW9CdWZmZXIgfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGZmdCA9IG5ldyBsZm8ub3BlcmF0b3IuRmZ0KHtcbiAqICAgbW9kZTogJ3Bvd2VyJyxcbiAqICAgd2luZG93OiAnaGFubicsXG4gKiAgIG5vcm06ICdwb3dlcicsXG4gKiAgIHNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIHNvdXJjZS5jb25uZWN0KHNsaWNlcik7XG4gKiBzbGljZXIuY29ubmVjdChmZnQpO1xuICogc291cmNlLnN0YXJ0KCk7XG4gKlxuICogLy8gPiBvdXRwdXRzIDEyOSBiaW5zIGNvbnRhaW5pbmcgdGhlIHZhbHVlcyBvZiB0aGUgcG93ZXIgc3BlY3RydW0gKGluY2x1ZGluZ1xuICogLy8gPiBEQyBhbmQgTnl1aXN0IGZyZXF1ZW5jaWVzKS5cbiAqXG4gKiBAdG9kbyAtIGNoZWNrIGlmICdyZWN0YW5nbGUnIGFuZCAnbm9uZScgd2luZG93cyBhcmUgbm90IHJlZG9uZGFudC5cbiAqIEB0b2RvIC0gY2hlY2sgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCBwYXJhbXMuXG4gKi9cbmNsYXNzIEZmdCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLndpbmRvd1NpemUgPSBudWxsO1xuICAgIHRoaXMubm9ybWFsaXplQ29lZnMgPSBudWxsO1xuICAgIHRoaXMud2luZG93ID0gbnVsbDtcbiAgICB0aGlzLnJlYWwgPSBudWxsO1xuICAgIHRoaXMuaW1hZyA9IG51bGw7XG4gICAgdGhpcy5mZnQgPSBudWxsO1xuXG4gICAgaWYgKCFpc1Bvd2VyT2ZUd28odGhpcy5wYXJhbXMuZ2V0KCdzaXplJykpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmZnRTaXplIG11c3QgYmUgYSBwb3dlciBvZiB0d28nKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG4gICAgLy8gc2V0IHRoZSBvdXRwdXQgZnJhbWUgc2l6ZVxuICAgIGNvbnN0IGluRnJhbWVTaXplID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnc2l6ZScpO1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGUnKTtcbiAgICBjb25zdCBub3JtID0gdGhpcy5wYXJhbXMuZ2V0KCdub3JtJyk7XG4gICAgbGV0IHdpbmRvd05hbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ3dpbmRvdycpO1xuICAgIC8vIHdpbmRvdyBgbm9uZWAgYW5kIGByZWN0YW5nbGVgIGFyZSBhbGlhc2VzXG4gICAgaWYgKHdpbmRvd05hbWUgPT09ICdub25lJylcbiAgICAgIHdpbmRvd05hbWUgPSAncmVjdGFuZ2xlJztcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZmdFNpemUgLyAyICsgMTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFtdO1xuICAgIC8vIHNpemUgb2YgdGhlIHdpbmRvdyB0byBhcHBseSBvbiB0aGUgaW5wdXQgZnJhbWVcbiAgICB0aGlzLndpbmRvd1NpemUgPSAoaW5GcmFtZVNpemUgPCBmZnRTaXplKSA/IGluRnJhbWVTaXplIDogZmZ0U2l6ZTtcblxuICAgIC8vIHJlZmVyZW5jZXMgdG8gcG9wdWxhdGUgaW4gdGhlIHdpbmRvdyBmdW5jdGlvbnMgKGNmLiBgaW5pdFdpbmRvd2ApXG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IHsgbGluZWFyOiAwLCBwb3dlcjogMCB9O1xuICAgIHRoaXMud2luZG93ID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLndpbmRvd1NpemUpO1xuXG4gICAgaW5pdFdpbmRvdyhcbiAgICAgIHdpbmRvd05hbWUsICAgICAgICAgLy8gbmFtZSBvZiB0aGUgd2luZG93XG4gICAgICB0aGlzLndpbmRvdywgICAgICAgIC8vIGJ1ZmZlciBwb3B1bGF0ZWQgd2l0aCB0aGUgd2luZG93IHNpZ25hbFxuICAgICAgdGhpcy53aW5kb3dTaXplLCAgICAvLyBzaXplIG9mIHRoZSB3aW5kb3dcbiAgICAgIHRoaXMubm9ybWFsaXplQ29lZnMgLy8gb2JqZWN0IHBvcHVsYXRlZCB3aXRoIHRoZSBub3JtYWxpemF0aW9uIGNvZWZzXG4gICAgKTtcblxuICAgIGNvbnN0IHsgbGluZWFyLCBwb3dlciB9ID0gdGhpcy5ub3JtYWxpemVDb2VmcztcblxuICAgIHN3aXRjaCAobm9ybSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIHRoaXMud2luZG93Tm9ybSA9IDE7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdsaW5lYXInOlxuICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBsaW5lYXI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdwb3dlcic6XG4gICAgICAgIHRoaXMud2luZG93Tm9ybSA9IHBvd2VyO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnYXV0byc6XG4gICAgICAgIGlmIChtb2RlID09PSAnbWFnbml0dWRlJylcbiAgICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBsaW5lYXI7XG4gICAgICAgIGVsc2UgaWYgKG1vZGUgPT09ICdwb3dlcicpXG4gICAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gcG93ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucmVhbCA9IG5ldyBGbG9hdDMyQXJyYXkoZmZ0U2l6ZSk7XG4gICAgdGhpcy5pbWFnID0gbmV3IEZsb2F0MzJBcnJheShmZnRTaXplKTtcbiAgICB0aGlzLmZmdCA9IG5ldyBGZnROYXl1a2koZmZ0U2l6ZSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYEZmdGAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gc2lnbmFsIC0gSW5wdXQgdmFsdWVzLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBGZnQgb2YgdGhlIGlucHV0IHNpZ25hbC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgZmZ0ID0gbmV3IGxmby5vcGVyYXRvci5GZnQoeyBzaXplOiA1MTIsIHdpbmRvdzogJ2hhbm4nIH0pO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogZmZ0LmluaXRTdHJlYW0oeyBmcmFtZVNpemU6IDI1NiwgZnJhbWVUeXBlOiAnc2lnbmFsJyB9KTtcbiAgICogZmZ0LmlucHV0U2lnbmFsKHNpZ25hbCk7XG4gICAqL1xuICBpbnB1dFNpZ25hbChzaWduYWwpIHtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlJyk7XG4gICAgY29uc3Qgd2luZG93U2l6ZSA9IHRoaXMud2luZG93U2l6ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgZmZ0U2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnc2l6ZScpO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICAvLyBhcHBseSB3aW5kb3cgb24gdGhlIGlucHV0IHNpZ25hbCBhbmQgcmVzZXQgaW1hZyBidWZmZXJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd1NpemU7IGkrKykge1xuICAgICAgdGhpcy5yZWFsW2ldID0gc2lnbmFsW2ldICogdGhpcy53aW5kb3dbaV0gKiB0aGlzLndpbmRvd05vcm07XG4gICAgICB0aGlzLmltYWdbaV0gPSAwO1xuICAgIH1cblxuICAgIC8vIGlmIHJlYWwgaXMgYmlnZ2VyIHRoYW4gaW5wdXQgc2lnbmFsLCBmaWxsIHdpdGggemVyb3NcbiAgICBmb3IgKGxldCBpID0gd2luZG93U2l6ZTsgaSA8IGZmdFNpemU7IGkrKykge1xuICAgICAgdGhpcy5yZWFsW2ldID0gMDtcbiAgICAgIHRoaXMuaW1hZ1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5mZnQuZm9yd2FyZCh0aGlzLnJlYWwsIHRoaXMuaW1hZyk7XG5cbiAgICBpZiAobW9kZSA9PT0gJ21hZ25pdHVkZScpIHtcbiAgICAgIGNvbnN0IG5vcm0gPSAxIC8gZmZ0U2l6ZTtcblxuICAgICAgLy8gREMgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxEYyA9IHRoaXMucmVhbFswXTtcbiAgICAgIGNvbnN0IGltYWdEYyA9IHRoaXMuaW1hZ1swXTtcbiAgICAgIG91dERhdGFbMF0gPSBzcXJ0KHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBub3JtO1xuXG4gICAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxOeSA9IHRoaXMucmVhbFtmZnRTaXplIC8gMl07XG4gICAgICBjb25zdCBpbWFnTnkgPSB0aGlzLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgICAgb3V0RGF0YVtmZnRTaXplIC8gMl0gPSBzcXJ0KHJlYWxOeSAqIHJlYWxOeSArIGltYWdOeSAqIGltYWdOeSkgKiBub3JtO1xuXG4gICAgICAvLyBwb3dlciBzcGVjdHJ1bVxuICAgICAgZm9yIChsZXQgaSA9IDEsIGogPSBmZnRTaXplIC0gMTsgaSA8IGZmdFNpemUgLyAyOyBpKyssIGotLSkge1xuICAgICAgICBjb25zdCByZWFsID0gMC41ICogKHRoaXMucmVhbFtpXSArIHRoaXMucmVhbFtqXSk7XG4gICAgICAgIGNvbnN0IGltYWcgPSAwLjUgKiAodGhpcy5pbWFnW2ldIC0gdGhpcy5pbWFnW2pdKTtcblxuICAgICAgICBvdXREYXRhW2ldID0gMiAqIHNxcnQocmVhbCAqIHJlYWwgKyBpbWFnICogaW1hZykgKiBub3JtO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChtb2RlID09PSAncG93ZXInKSB7XG4gICAgICBjb25zdCBub3JtID0gMSAvIChmZnRTaXplICogZmZ0U2l6ZSk7XG5cbiAgICAgIC8vIERDIGluZGV4XG4gICAgICBjb25zdCByZWFsRGMgPSB0aGlzLnJlYWxbMF07XG4gICAgICBjb25zdCBpbWFnRGMgPSB0aGlzLmltYWdbMF07XG4gICAgICBvdXREYXRhWzBdID0gKHJlYWxEYyAqIHJlYWxEYyArIGltYWdEYyAqIGltYWdEYykgKiBub3JtO1xuXG4gICAgICAvLyBOcXV5c3QgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxOeSA9IHRoaXMucmVhbFtmZnRTaXplIC8gMl07XG4gICAgICBjb25zdCBpbWFnTnkgPSB0aGlzLmltYWdbZmZ0U2l6ZSAvIDJdO1xuICAgICAgb3V0RGF0YVtmZnRTaXplIC8gMl0gPSAocmVhbE55ICogcmVhbE55ICsgaW1hZ055ICogaW1hZ055KSAqIG5vcm07XG5cbiAgICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgICBmb3IgKGxldCBpID0gMSwgaiA9IGZmdFNpemUgLSAxOyBpIDwgZmZ0U2l6ZSAvIDI7IGkrKywgai0tKSB7XG4gICAgICAgIGNvbnN0IHJlYWwgPSAwLjUgKiAodGhpcy5yZWFsW2ldICsgdGhpcy5yZWFsW2pdKTtcbiAgICAgICAgY29uc3QgaW1hZyA9IDAuNSAqICh0aGlzLmltYWdbaV0gLSB0aGlzLmltYWdbal0pO1xuXG4gICAgICAgIG91dERhdGFbaV0gPSA0ICogKHJlYWwgKiByZWFsICsgaW1hZyAqIGltYWcpICogbm9ybTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0RGF0YTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU2lnbmFsKGZyYW1lKSB7XG4gICAgdGhpcy5pbnB1dFNpZ25hbChmcmFtZS5kYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGZnQ7XG4iXX0=