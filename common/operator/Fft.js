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

var _BaseLfo2 = require('../core/BaseLfo');

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
 * // assuming an `audioBuffer` exists
 * const source = new AudioInBuffer({ audioBuffer });
 *
 * const slicer = new Slicer({
 *   frameSize: 256,
 * });
 *
 * const fft = new Fft({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZmdC5qcyJdLCJuYW1lcyI6WyJGZnROYXl1a2kiLCJuIiwibGV2ZWxzIiwiaSIsImNvc1RhYmxlIiwiQXJyYXkiLCJzaW5UYWJsZSIsIk1hdGgiLCJjb3MiLCJQSSIsInNpbiIsImZvcndhcmQiLCJyZWFsIiwiaW1hZyIsImoiLCJyZXZlcnNlQml0cyIsInRlbXAiLCJzaXplIiwiaGFsZnNpemUiLCJ0YWJsZXN0ZXAiLCJrIiwidHByZSIsInRwaW0iLCJ4IiwiYml0cyIsInkiLCJpbnZlcnNlIiwic3FydCIsImlzUG93ZXJPZlR3byIsIm51bWJlciIsImRlZmluaXRpb25zIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJ3aW5kb3ciLCJsaXN0IiwibW9kZSIsIm5vcm0iLCJGZnQiLCJvcHRpb25zIiwid2luZG93U2l6ZSIsIm5vcm1hbGl6ZUNvZWZzIiwiZmZ0IiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImluRnJhbWVTaXplIiwiZnJhbWVTaXplIiwiZmZ0U2l6ZSIsIndpbmRvd05hbWUiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJkZXNjcmlwdGlvbiIsImxpbmVhciIsInBvd2VyIiwiRmxvYXQzMkFycmF5Iiwid2luZG93Tm9ybSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsInNpZ25hbCIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJyZWFsRGMiLCJpbWFnRGMiLCJyZWFsTnkiLCJpbWFnTnkiLCJpbnB1dFNpZ25hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7Ozs7OztBQU1BLFNBQVNBLFNBQVQsQ0FBbUJDLENBQW5CLEVBQXNCOztBQUVwQixPQUFLQSxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLQyxNQUFMLEdB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Q0FBUixJQUFhLENBQUNHLFVBQVNBLE9BQVQsR0FBa0JDLFVBQVNBLE9BQTVCLElBQXNDNUIsS0FBbkQ7O0FBRUE7QUFDQSxZQUFNNkIsVUFBUyxLQUFLdkQsSUFBTCxDQUFVdUMsVUFBVSxDQUFwQixDQUFmO0FBQ0EsWUFBTWlCLFVBQVMsS0FBS3ZELElBQUwsQ0FBVXNDLFVBQVUsQ0FBcEIsQ0FBZjtBQUNBVyxnQkFBUVgsVUFBVSxDQUFsQixJQUF1QixDQUFDZ0IsVUFBU0EsT0FBVCxHQUFrQkMsVUFBU0EsT0FBNUIsSUFBc0M5QixLQUE3RDs7QUFFQTtBQUNBLGFBQUssSUFBSW5DLE1BQUksQ0FBUixFQUFXVyxLQUFJcUMsVUFBVSxDQUE5QixFQUFpQ2hELE1BQUlnRCxVQUFVLENBQS9DLEVBQWtEaEQsT0FBS1csSUFBdkQsRUFBNEQ7QUFDMUQsY0FBTUYsUUFBTyxPQUFPLEtBQUtBLElBQUwsQ0FBVVQsR0FBVixJQUFlLEtBQUtTLElBQUwsQ0FBVUUsRUFBVixDQUF0QixDQUFiO0FBQ0EsY0FBTUQsUUFBTyxPQUFPLEtBQUtBLElBQUwsQ0FBVVYsR0FBVixJQUFlLEtBQUtVLElBQUwsQ0FBVUMsRUFBVixDQUF0QixDQUFiOztBQUVBZ0Qsa0JBQVEzRCxHQUFSLElBQWEsS0FBS1MsUUFBT0EsS0FBUCxHQUFjQyxRQUFPQSxLQUExQixJQUFrQ3lCLEtBQS9DO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPd0IsT0FBUDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsV0FBS00sV0FBTCxDQUFpQk4sTUFBTUMsSUFBdkI7QUFDRDs7Ozs7a0JBR1l6QixHIiwiZmlsZSI6IkZmdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgaW5pdFdpbmRvdyBmcm9tICcuLi91dGlscy93aW5kb3dzJztcblxuLy8gaHR0cHM6Ly9jb2RlLnNvdW5kc29mdHdhcmUuYWMudWsvcHJvamVjdHMvanMtZHNwLXRlc3QvcmVwb3NpdG9yeS9lbnRyeS9mZnQvbmF5dWtpLW9iai9mZnQuanNcbi8qXG4gKiBGcmVlIEZmdCBhbmQgY29udm9sdXRpb24gKEphdmFTY3JpcHQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IFByb2plY3QgTmF5dWtpXG4gKiBodHRwOi8vd3d3Lm5heXVraS5pby9wYWdlL2ZyZWUtc21hbGwtZmZ0LWluLW11bHRpcGxlLWxhbmd1YWdlc1xuICpcbiAqIChNSVQgTGljZW5zZSlcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2ZcbiAqIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW5cbiAqIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG9cbiAqIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mXG4gKiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIC0gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqICAgYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiAtIFRoZSBTb2Z0d2FyZSBpcyBwcm92aWRlZCBcImFzIGlzXCIsIHdpdGhvdXQgd2FycmFudHkgb2YgYW55IGtpbmQsIGV4cHJlc3Mgb3JcbiAqICAgaW1wbGllZCwgaW5jbHVkaW5nIGJ1dCBub3QgbGltaXRlZCB0byB0aGUgd2FycmFudGllcyBvZiBtZXJjaGFudGFiaWxpdHksXG4gKiAgIGZpdG5lc3MgZm9yIGEgcGFydGljdWxhciBwdXJwb3NlIGFuZCBub25pbmZyaW5nZW1lbnQuIEluIG5vIGV2ZW50IHNoYWxsIHRoZVxuICogICBhdXRob3JzIG9yIGNvcHlyaWdodCBob2xkZXJzIGJlIGxpYWJsZSBmb3IgYW55IGNsYWltLCBkYW1hZ2VzIG9yIG90aGVyXG4gKiAgIGxpYWJpbGl0eSwgd2hldGhlciBpbiBhbiBhY3Rpb24gb2YgY29udHJhY3QsIHRvcnQgb3Igb3RoZXJ3aXNlLCBhcmlzaW5nIGZyb20sXG4gKiAgIG91dCBvZiBvciBpbiBjb25uZWN0aW9uIHdpdGggdGhlIFNvZnR3YXJlIG9yIHRoZSB1c2Ugb3Igb3RoZXIgZGVhbGluZ3MgaW4gdGhlXG4gKiAgIFNvZnR3YXJlLlxuICpcbiAqIFNsaWdodGx5IHJlc3RydWN0dXJlZCBieSBDaHJpcyBDYW5uYW0sIGNhbm5hbUBhbGwtZGF5LWJyZWFrZmFzdC5jb21cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG4vKlxuICogQ29uc3RydWN0IGFuIG9iamVjdCBmb3IgY2FsY3VsYXRpbmcgdGhlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChERlQpIG9mXG4gKiBzaXplIG4sIHdoZXJlIG4gaXMgYSBwb3dlciBvZiAyLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEZmdE5heXVraShuKSB7XG5cbiAgdGhpcy5uID0gbjtcbiAgdGhpcy5sZXZlbHMgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDMyOyBpKyspIHtcbiAgICBpZiAoMSA8PCBpID09IG4pIHtcbiAgICAgIHRoaXMubGV2ZWxzID0gaTsgIC8vIEVxdWFsIHRvIGxvZzIobilcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5sZXZlbHMgPT0gLTEpIHtcbiAgICB0aHJvdyBcIkxlbmd0aCBpcyBub3QgYSBwb3dlciBvZiAyXCI7XG4gIH1cblxuICB0aGlzLmNvc1RhYmxlID0gbmV3IEFycmF5KG4gLyAyKTtcbiAgdGhpcy5zaW5UYWJsZSA9IG5ldyBBcnJheShuIC8gMik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuIC8gMjsgaSsrKSB7XG4gICAgdGhpcy5jb3NUYWJsZVtpXSA9IE1hdGguY29zKDIgKiBNYXRoLlBJICogaSAvIG4pO1xuICAgIHRoaXMuc2luVGFibGVbaV0gPSBNYXRoLnNpbigyICogTWF0aC5QSSAqIGkgLyBuKTtcbiAgfVxuXG4gIC8qXG4gICAqIENvbXB1dGVzIHRoZSBkaXNjcmV0ZSBGb3VyaWVyIHRyYW5zZm9ybSAoREZUKSBvZiB0aGUgZ2l2ZW4gY29tcGxleCB2ZWN0b3IsXG4gICAqIHN0b3JpbmcgdGhlIHJlc3VsdCBiYWNrIGludG8gdGhlIHZlY3Rvci5cbiAgICogVGhlIHZlY3RvcidzIGxlbmd0aCBtdXN0IGJlIGVxdWFsIHRvIHRoZSBzaXplIG4gdGhhdCB3YXMgcGFzc2VkIHRvIHRoZVxuICAgKiBvYmplY3QgY29uc3RydWN0b3IsIGFuZCB0aGlzIG11c3QgYmUgYSBwb3dlciBvZiAyLiBVc2VzIHRoZSBDb29sZXktVHVrZXlcbiAgICogZGVjaW1hdGlvbi1pbi10aW1lIHJhZGl4LTIgYWxnb3JpdGhtLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdGhpcy5mb3J3YXJkID0gZnVuY3Rpb24ocmVhbCwgaW1hZykge1xuICAgIHZhciBuID0gdGhpcy5uO1xuXG4gICAgLy8gQml0LXJldmVyc2VkIGFkZHJlc3NpbmcgcGVybXV0YXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgdmFyIGogPSByZXZlcnNlQml0cyhpLCB0aGlzLmxldmVscyk7XG5cbiAgICAgIGlmIChqID4gaSkge1xuICAgICAgICB2YXIgdGVtcCA9IHJlYWxbaV07XG4gICAgICAgIHJlYWxbaV0gPSByZWFsW2pdO1xuICAgICAgICByZWFsW2pdID0gdGVtcDtcbiAgICAgICAgdGVtcCA9IGltYWdbaV07XG4gICAgICAgIGltYWdbaV0gPSBpbWFnW2pdO1xuICAgICAgICBpbWFnW2pdID0gdGVtcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb29sZXktVHVrZXkgZGVjaW1hdGlvbi1pbi10aW1lIHJhZGl4LTIgRmZ0XG4gICAgZm9yICh2YXIgc2l6ZSA9IDI7IHNpemUgPD0gbjsgc2l6ZSAqPSAyKSB7XG4gICAgICB2YXIgaGFsZnNpemUgPSBzaXplIC8gMjtcbiAgICAgIHZhciB0YWJsZXN0ZXAgPSBuIC8gc2l6ZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpICs9IHNpemUpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IGksIGsgPSAwOyBqIDwgaSArIGhhbGZzaXplOyBqKyssIGsgKz0gdGFibGVzdGVwKSB7XG4gICAgICAgICAgdmFyIHRwcmUgPSAgcmVhbFtqK2hhbGZzaXplXSAqIHRoaXMuY29zVGFibGVba10gK1xuICAgICAgICAgICAgICAgICAgICAgIGltYWdbaitoYWxmc2l6ZV0gKiB0aGlzLnNpblRhYmxlW2tdO1xuICAgICAgICAgIHZhciB0cGltID0gLXJlYWxbaitoYWxmc2l6ZV0gKiB0aGlzLnNpblRhYmxlW2tdICtcbiAgICAgICAgICAgICAgICAgICAgICBpbWFnW2oraGFsZnNpemVdICogdGhpcy5jb3NUYWJsZVtrXTtcbiAgICAgICAgICByZWFsW2ogKyBoYWxmc2l6ZV0gPSByZWFsW2pdIC0gdHByZTtcbiAgICAgICAgICBpbWFnW2ogKyBoYWxmc2l6ZV0gPSBpbWFnW2pdIC0gdHBpbTtcbiAgICAgICAgICByZWFsW2pdICs9IHRwcmU7XG4gICAgICAgICAgaW1hZ1tqXSArPSB0cGltO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyB0aGUgaW50ZWdlciB3aG9zZSB2YWx1ZSBpcyB0aGUgcmV2ZXJzZSBvZiB0aGUgbG93ZXN0ICdiaXRzJ1xuICAgIC8vIGJpdHMgb2YgdGhlIGludGVnZXIgJ3gnLlxuICAgIGZ1bmN0aW9uIHJldmVyc2VCaXRzKHgsIGJpdHMpIHtcbiAgICAgIHZhciB5ID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaXRzOyBpKyspIHtcbiAgICAgICAgeSA9ICh5IDw8IDEpIHwgKHggJiAxKTtcbiAgICAgICAgeCA+Pj49IDE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB5O1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIENvbXB1dGVzIHRoZSBpbnZlcnNlIGRpc2NyZXRlIEZvdXJpZXIgdHJhbnNmb3JtIChJREZUKSBvZiB0aGUgZ2l2ZW4gY29tcGxleFxuICAgKiB2ZWN0b3IsIHN0b3JpbmcgdGhlIHJlc3VsdCBiYWNrIGludG8gdGhlIHZlY3Rvci5cbiAgICogVGhlIHZlY3RvcidzIGxlbmd0aCBtdXN0IGJlIGVxdWFsIHRvIHRoZSBzaXplIG4gdGhhdCB3YXMgcGFzc2VkIHRvIHRoZVxuICAgKiBvYmplY3QgY29uc3RydWN0b3IsIGFuZCB0aGlzIG11c3QgYmUgYSBwb3dlciBvZiAyLiBUaGlzIGlzIGEgd3JhcHBlclxuICAgKiBmdW5jdGlvbi4gVGhpcyB0cmFuc2Zvcm0gZG9lcyBub3QgcGVyZm9ybSBzY2FsaW5nLCBzbyB0aGUgaW52ZXJzZSBpcyBub3RcbiAgICogYSB0cnVlIGludmVyc2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmludmVyc2UgPSBmdW5jdGlvbihyZWFsLCBpbWFnKSB7XG4gICAgZm9yd2FyZChpbWFnLCByZWFsKTtcbiAgfVxufVxuXG5cbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmNvbnN0IGlzUG93ZXJPZlR3byA9IGZ1bmN0aW9uKG51bWJlcikge1xuICB3aGlsZSAoKG51bWJlciAlIDIgPT09IDApICYmIG51bWJlciA+IDEpXG4gICAgbnVtYmVyID0gbnVtYmVyIC8gMjtcblxuICByZXR1cm4gbnVtYmVyID09PSAxO1xufVxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgc2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAxMDI0LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHdpbmRvdzoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ25vbmUnLCAnaGFubicsICdoYW5uaW5nJywgJ2hhbW1pbmcnLCAnYmxhY2ttYW4nLCAnYmxhY2ttYW5oYXJyaXMnLCAnc2luZScsICdyZWN0YW5nbGUnXSxcbiAgICBkZWZhdWx0OiAnbm9uZScsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbW9kZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ21hZ25pdHVkZScsICdwb3dlciddLCAvLyBhZGQgY29tcGxleCBvdXRwdXRcbiAgICBkZWZhdWx0OiAnbWFnbml0dWRlJyxcbiAgfSxcbiAgbm9ybToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgbGlzdDogWydhdXRvJywgJ25vbmUnLCAnbGluZWFyJywgJ3Bvd2VyJ10sXG4gIH0sXG59XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgRmFzdCBGb3VyaWVyIFRyYW5zZm9ybSBvZiBhbiBpbmNvbW1pbmcgYHNpZ25hbGAuXG4gKlxuICogRmZ0IGltcGxlbWVudGF0aW9uIGJ5IFtOYXl1a2ldKGh0dHBzOi8vY29kZS5zb3VuZHNvZnR3YXJlLmFjLnVrL3Byb2plY3RzL2pzLWRzcC10ZXN0L3JlcG9zaXRvcnkvZW50cnkvZmZ0L25heXVraS1vYmovZmZ0LmpzKS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zaXplPTEwMjRdIC0gU2l6ZSBvZiB0aGUgZmZ0LCBzaG91bGQgYmUgYSBwb3dlciBvZlxuICogIDIuIElmIHRoZSBmcmFtZSBzaXplIG9mIHRoZSBpbmNvbW1pbmcgc2lnbmFsIGlzIGxvd2VyIHRoYW4gdGhpcyB2YWx1ZSxcbiAqICBpdCBpcyB6ZXJvIHBhZGRlZCB0byBtYXRjaCB0aGUgZmZ0IHNpemUuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMud2luZG93PSdub25lJ10gLSBOYW1lIG9mIHRoZSB3aW5kb3cgYXBwbGllZCBvbiB0aGVcbiAqICBpbmNvbW1pbmcgc2lnbmFsLiBBdmFpbGFibGUgd2luZG93cyBhcmU6ICdub25lJywgJ2hhbm4nLCAnaGFubmluZycsXG4gKiAgJ2hhbW1pbmcnLCAnYmxhY2ttYW4nLCAnYmxhY2ttYW5oYXJyaXMnLCAnc2luZScsICdyZWN0YW5nbGUnLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1vZGU9J21hZ25pdHVkZSddIC0gVHlwZSBvZiB0aGUgb3V0cHV0IChgbWFnbml0dWRlYFxuICogIG9yIGBwb3dlcmApXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubm9ybT0nYXV0byddIC0gVHlwZSBvZiBub3JtYWxpemF0aW9uIGFwcGxpZWQgb24gdGhlXG4gKiAgb3V0cHV0LiBQb3NzaWJsZSB2YWx1ZXMgYXJlICdhdXRvJywgJ25vbmUnLCAnbGluZWFyJywgJ3Bvd2VyJy4gV2hlbiBzZXQgdG9cbiAqICBgYXV0b2AsIGEgYGxpbmVhcmAgbm9ybWFsaXphdGlvbiBpcyBhcHBsaWVkIG9uIHRoZSBtYWduaXR1ZGUgc3BlY3RydW0sIHdoaWxlXG4gKiAgYSBgcG93ZXJgIG5vcm1hbGl6ZXRpb24gaXMgYXBwbGllZCBvbiB0aGUgcG93ZXIgc3BlY3RydW0uXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGFzc3VtaW5nIGFuIGBhdWRpb0J1ZmZlcmAgZXhpc3RzXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgQXVkaW9JbkJ1ZmZlcih7IGF1ZGlvQnVmZmVyIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBTbGljZXIoe1xuICogICBmcmFtZVNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGZmdCA9IG5ldyBGZnQoe1xuICogICBtb2RlOiAncG93ZXInLFxuICogICB3aW5kb3c6ICdoYW5uJyxcbiAqICAgbm9ybTogJ3Bvd2VyJyxcbiAqICAgc2l6ZTogMjU2LFxuICogfSk7XG4gKlxuICogc291cmNlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KGZmdCk7XG4gKiBzb3VyY2Uuc3RhcnQoKTtcbiAqXG4gKiAvLyA+IG91dHB1dHMgMTI5IGJpbnMgY29udGFpbmluZyB0aGUgdmFsdWVzIG9mIHRoZSBwb3dlciBzcGVjdHJ1bSAoaW5jbHVkaW5nXG4gKiAvLyA+IERDIGFuZCBOeXVpc3QgZnJlcXVlbmNpZXMpLlxuICpcbiAqIEB0b2RvIC0gY2hlY2sgaWYgJ3JlY3RhbmdsZScgYW5kICdub25lJyB3aW5kb3dzIGFyZSBub3QgcmVkb25kYW50LlxuICogQHRvZG8gLSBjaGVjayBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHBhcmFtcy5cbiAqL1xuY2xhc3MgRmZ0IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMud2luZG93U2l6ZSA9IG51bGw7XG4gICAgdGhpcy5ub3JtYWxpemVDb2VmcyA9IG51bGw7XG4gICAgdGhpcy53aW5kb3cgPSBudWxsO1xuICAgIHRoaXMucmVhbCA9IG51bGw7XG4gICAgdGhpcy5pbWFnID0gbnVsbDtcbiAgICB0aGlzLmZmdCA9IG51bGw7XG5cbiAgICBpZiAoIWlzUG93ZXJPZlR3byh0aGlzLnBhcmFtcy5nZXQoJ3NpemUnKSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZmdFNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3bycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICAvLyBzZXQgdGhlIG91dHB1dCBmcmFtZSBzaXplXG4gICAgY29uc3QgaW5GcmFtZVNpemUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdzaXplJyk7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMucGFyYW1zLmdldCgnbW9kZScpO1xuICAgIGNvbnN0IG5vcm0gPSB0aGlzLnBhcmFtcy5nZXQoJ25vcm0nKTtcbiAgICBsZXQgd2luZG93TmFtZSA9IHRoaXMucGFyYW1zLmdldCgnd2luZG93Jyk7XG4gICAgLy8gd2luZG93IGBub25lYCBhbmQgYHJlY3RhbmdsZWAgYXJlIGFsaWFzZXNcbiAgICBpZiAod2luZG93TmFtZSA9PT0gJ25vbmUnKVxuICAgICAgd2luZG93TmFtZSA9ICdyZWN0YW5nbGUnO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZmZ0U2l6ZSAvIDIgKyAxO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gW107XG4gICAgLy8gc2l6ZSBvZiB0aGUgd2luZG93IHRvIGFwcGx5IG9uIHRoZSBpbnB1dCBmcmFtZVxuICAgIHRoaXMud2luZG93U2l6ZSA9IChpbkZyYW1lU2l6ZSA8IGZmdFNpemUpID8gaW5GcmFtZVNpemUgOiBmZnRTaXplO1xuXG4gICAgLy8gcmVmZXJlbmNlcyB0byBwb3B1bGF0ZSBpbiB0aGUgd2luZG93IGZ1bmN0aW9ucyAoY2YuIGBpbml0V2luZG93YClcbiAgICB0aGlzLm5vcm1hbGl6ZUNvZWZzID0geyBsaW5lYXI6IDAsIHBvd2VyOiAwIH07XG4gICAgdGhpcy53aW5kb3cgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMud2luZG93U2l6ZSk7XG5cbiAgICBpbml0V2luZG93KFxuICAgICAgd2luZG93TmFtZSwgICAgICAgICAvLyBuYW1lIG9mIHRoZSB3aW5kb3dcbiAgICAgIHRoaXMud2luZG93LCAgICAgICAgLy8gYnVmZmVyIHBvcHVsYXRlZCB3aXRoIHRoZSB3aW5kb3cgc2lnbmFsXG4gICAgICB0aGlzLndpbmRvd1NpemUsICAgIC8vIHNpemUgb2YgdGhlIHdpbmRvd1xuICAgICAgdGhpcy5ub3JtYWxpemVDb2VmcyAvLyBvYmplY3QgcG9wdWxhdGVkIHdpdGggdGhlIG5vcm1hbGl6YXRpb24gY29lZnNcbiAgICApO1xuXG4gICAgY29uc3QgeyBsaW5lYXIsIHBvd2VyIH0gPSB0aGlzLm5vcm1hbGl6ZUNvZWZzO1xuXG4gICAgc3dpdGNoIChub3JtKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gMTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2xpbmVhcic6XG4gICAgICAgIHRoaXMud2luZG93Tm9ybSA9IGxpbmVhcjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3Bvd2VyJzpcbiAgICAgICAgdGhpcy53aW5kb3dOb3JtID0gcG93ZXI7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdhdXRvJzpcbiAgICAgICAgaWYgKG1vZGUgPT09ICdtYWduaXR1ZGUnKVxuICAgICAgICAgIHRoaXMud2luZG93Tm9ybSA9IGxpbmVhcjtcbiAgICAgICAgZWxzZSBpZiAobW9kZSA9PT0gJ3Bvd2VyJylcbiAgICAgICAgICB0aGlzLndpbmRvd05vcm0gPSBwb3dlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yZWFsID0gbmV3IEZsb2F0MzJBcnJheShmZnRTaXplKTtcbiAgICB0aGlzLmltYWcgPSBuZXcgRmxvYXQzMkFycmF5KGZmdFNpemUpO1xuICAgIHRoaXMuZmZ0ID0gbmV3IEZmdE5heXVraShmZnRTaXplKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgRmZ0YCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBzaWduYWwgLSBJbnB1dCB2YWx1ZXMuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIEZmdCBvZiB0aGUgaW5wdXQgc2lnbmFsLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBmZnQgPSBuZXcgbGZvLm9wZXJhdG9yLkZmdCh7IHNpemU6IDUxMiwgd2luZG93OiAnaGFubicgfSk7XG4gICAqIC8vIG1hbmRhdG9yeSBmb3IgdXNlIGluIHN0YW5kYWxvbmUgbW9kZVxuICAgKiBmZnQuaW5pdFN0cmVhbSh7IGZyYW1lU2l6ZTogMjU2LCBmcmFtZVR5cGU6ICdzaWduYWwnIH0pO1xuICAgKiBmZnQuaW5wdXRTaWduYWwoc2lnbmFsKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKHNpZ25hbCkge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGUnKTtcbiAgICBjb25zdCB3aW5kb3dTaXplID0gdGhpcy53aW5kb3dTaXplO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBmZnRTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdzaXplJyk7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcblxuICAgIC8vIGFwcGx5IHdpbmRvdyBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZCByZXNldCBpbWFnIGJ1ZmZlclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2luZG93U2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLnJlYWxbaV0gPSBzaWduYWxbaV0gKiB0aGlzLndpbmRvd1tpXSAqIHRoaXMud2luZG93Tm9ybTtcbiAgICAgIHRoaXMuaW1hZ1tpXSA9IDA7XG4gICAgfVxuXG4gICAgLy8gaWYgcmVhbCBpcyBiaWdnZXIgdGhhbiBpbnB1dCBzaWduYWwsIGZpbGwgd2l0aCB6ZXJvc1xuICAgIGZvciAobGV0IGkgPSB3aW5kb3dTaXplOyBpIDwgZmZ0U2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLnJlYWxbaV0gPSAwO1xuICAgICAgdGhpcy5pbWFnW2ldID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLmZmdC5mb3J3YXJkKHRoaXMucmVhbCwgdGhpcy5pbWFnKTtcblxuICAgIGlmIChtb2RlID09PSAnbWFnbml0dWRlJykge1xuICAgICAgY29uc3Qgbm9ybSA9IDEgLyBmZnRTaXplO1xuXG4gICAgICAvLyBEQyBpbmRleFxuICAgICAgY29uc3QgcmVhbERjID0gdGhpcy5yZWFsWzBdO1xuICAgICAgY29uc3QgaW1hZ0RjID0gdGhpcy5pbWFnWzBdO1xuICAgICAgb3V0RGF0YVswXSA9IHNxcnQocmVhbERjICogcmVhbERjICsgaW1hZ0RjICogaW1hZ0RjKSAqIG5vcm07XG5cbiAgICAgIC8vIE5xdXlzdCBpbmRleFxuICAgICAgY29uc3QgcmVhbE55ID0gdGhpcy5yZWFsW2ZmdFNpemUgLyAyXTtcbiAgICAgIGNvbnN0IGltYWdOeSA9IHRoaXMuaW1hZ1tmZnRTaXplIC8gMl07XG4gICAgICBvdXREYXRhW2ZmdFNpemUgLyAyXSA9IHNxcnQocmVhbE55ICogcmVhbE55ICsgaW1hZ055ICogaW1hZ055KSAqIG5vcm07XG5cbiAgICAgIC8vIHBvd2VyIHNwZWN0cnVtXG4gICAgICBmb3IgKGxldCBpID0gMSwgaiA9IGZmdFNpemUgLSAxOyBpIDwgZmZ0U2l6ZSAvIDI7IGkrKywgai0tKSB7XG4gICAgICAgIGNvbnN0IHJlYWwgPSAwLjUgKiAodGhpcy5yZWFsW2ldICsgdGhpcy5yZWFsW2pdKTtcbiAgICAgICAgY29uc3QgaW1hZyA9IDAuNSAqICh0aGlzLmltYWdbaV0gLSB0aGlzLmltYWdbal0pO1xuXG4gICAgICAgIG91dERhdGFbaV0gPSAyICogc3FydChyZWFsICogcmVhbCArIGltYWcgKiBpbWFnKSAqIG5vcm07XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdwb3dlcicpIHtcbiAgICAgIGNvbnN0IG5vcm0gPSAxIC8gKGZmdFNpemUgKiBmZnRTaXplKTtcblxuICAgICAgLy8gREMgaW5kZXhcbiAgICAgIGNvbnN0IHJlYWxEYyA9IHRoaXMucmVhbFswXTtcbiAgICAgIGNvbnN0IGltYWdEYyA9IHRoaXMuaW1hZ1swXTtcbiAgICAgIG91dERhdGFbMF0gPSAocmVhbERjICogcmVhbERjICsgaW1hZ0RjICogaW1hZ0RjKSAqIG5vcm07XG5cbiAgICAgIC8vIE5xdXlzdCBpbmRleFxuICAgICAgY29uc3QgcmVhbE55ID0gdGhpcy5yZWFsW2ZmdFNpemUgLyAyXTtcbiAgICAgIGNvbnN0IGltYWdOeSA9IHRoaXMuaW1hZ1tmZnRTaXplIC8gMl07XG4gICAgICBvdXREYXRhW2ZmdFNpemUgLyAyXSA9IChyZWFsTnkgKiByZWFsTnkgKyBpbWFnTnkgKiBpbWFnTnkpICogbm9ybTtcblxuICAgICAgLy8gcG93ZXIgc3BlY3RydW1cbiAgICAgIGZvciAobGV0IGkgPSAxLCBqID0gZmZ0U2l6ZSAtIDE7IGkgPCBmZnRTaXplIC8gMjsgaSsrLCBqLS0pIHtcbiAgICAgICAgY29uc3QgcmVhbCA9IDAuNSAqICh0aGlzLnJlYWxbaV0gKyB0aGlzLnJlYWxbal0pO1xuICAgICAgICBjb25zdCBpbWFnID0gMC41ICogKHRoaXMuaW1hZ1tpXSAtIHRoaXMuaW1hZ1tqXSk7XG5cbiAgICAgICAgb3V0RGF0YVtpXSA9IDQgKiAocmVhbCAqIHJlYWwgKyBpbWFnICogaW1hZykgKiBub3JtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXREYXRhO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0U2lnbmFsKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZmdDtcbiJdfQ==