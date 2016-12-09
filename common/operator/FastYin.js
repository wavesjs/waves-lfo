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

/**
 * This implementation needs to be reviewed before being exposed in the library.
 * Results are too ... from the PiPo results for now.
 */

/**
 * based on:
 * - http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * - PiPo.yin and rta library implementations.
 *
 * @private
 */

var ceil = Math.ceil;
var sqrt = Math.sqrt;

function autocorrelation(correlation, acSize, buffer, windowSize) {
  // corr, acSize, buffer, windowSize
  for (var tau = 0; tau < acSize; tau++) {
    correlation[tau] = 0;

    for (var i = 0; i < windowSize; i++) {
      correlation[tau] += buffer[tau + i] * buffer[i];
    }
  }

  return correlation;
}

var definitions = {
  threshold: {
    type: 'float',
    default: 0.1, // default from paper
    metas: { kind: 'static' }
  },
  downSamplingExp: { // downsampling factor
    type: 'integer',
    default: 2,
    min: 0,
    max: 3,
    metas: { kind: 'static' }
  },
  minFreq: { //
    type: 'float',
    default: 60, // means 735 samples
    min: 0,
    metas: { kind: 'static' }
  }
};

/**
 * Yin fundamental frequency estimator, based on algorithm described in
 * [YIN, a fundamental frequency estimator for speech and music](http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf)
 * by Cheveigne and Kawahara.
 * On each frame, this operator propagate a vector containing the following
 * values: `frequency`, `energy`, `periodicity` and `AC1`.
 *
 * For good results the input frame size should be large (1024 or 2048).
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.threshold=0.1] - Absolute threshold to test the
 *  normalized difference (see paper for more informations).
 * @param {Number} [options.downSamplingExp=2] - Down sample the input frame by
 *  a factor of 2 at the power of `downSamplingExp` (min=0 and max=3) for
 *  performance improvements.
 * @param {Number} [options.minFreq=60] - Minimum frequency the operator can
 *  search for. This parameter defines the size of the autocorrelation performed
 *  on the signal, the input frame size should be around 2 time this size for
 *  good results (i.e. `inputFrameSize ≈ 2 * (samplingRate / minFreq)`).
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some AudioBuffer
 * const source = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 2048,
 * });
 *
 * const yin = new lfo.operator.Yin();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * source.connect(slicer);
 * slicer.connect(yin);
 * yin.connect(logger);
 *
 * source.start();
 */

var Yin = function (_BaseLfo) {
  (0, _inherits3.default)(Yin, _BaseLfo);

  function Yin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Yin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Yin.__proto__ || (0, _getPrototypeOf2.default)(Yin)).call(this, definitions, options));

    _this.probability = 0;
    _this.pitch = -1;

    _this.test = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Yin, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.inputFrameSize = prevStreamParams.frameSize;

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 4;
      this.streamParams.description = ['frequency', 'energy', 'periodicity', 'AC1'];

      var sourceSampleRate = this.streamParams.sourceSampleRate;
      // handle params
      var downSamplingExp = this.params.get('downSamplingExp');
      var downFactor = 1 << downSamplingExp; // 2^n
      var downSR = sourceSampleRate / downFactor;
      var downFrameSize = this.inputFrameSize / downFactor; // n_tick_down // 1 / 2^n

      var minFreq = this.params.get('minFreq');
      // limit min freq, cf. paper IV. sensitivity to parameters
      minFreq = minFreq > 0.25 * downSR ? 0.25 * downSR : minFreq;
      // size of autocorrelation
      this.acSize = ceil(downSR / minFreq) + 2;

      // minimum error to not crash but not enought to have results
      if (this.acSize >= downFrameSize) throw new Error('Invalid input frame size, too small for given "minFreq"');

      // allocate memory
      this.buffer = new Float32Array(downFrameSize);
      this.corr = new Float32Array(this.acSize);
      this.downSamplingExp = downSamplingExp;
      this.downSamplingRate = downSR;

      // maximum number of searched minima
      this.yinMaxMins = 128; // cf. PiPo for this value choice
      // interleaved min / tau used in this._yin
      this.yinMins = new Float32Array(this.yinMaxMins * 2);
      // values returned by _yin
      this.yinResults = new Array(2); // min, tau

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: '_downsample',
    value: function _downsample(input, size, output, downSamplingExp) {
      var outputSize = size >> downSamplingExp;
      var i = void 0,
          j = void 0;

      switch (downSamplingExp) {
        case 0:
          // no down sampling
          for (i = 0; i < size; i++) {
            output[i] = input[i];
          }break;
        case 1:
          for (i = 0, j = 0; i < outputSize; i++, j += 2) {
            output[i] = 0.5 * (input[j] + input[j + 1]);
          }break;
        case 2:
          for (i = 0, j = 0; i < outputSize; i++, j += 4) {
            output[i] = 0.25 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3]);
          }break;
        case 3:
          for (i = 0, j = 0; i < outputSize; i++, j += 8) {
            output[i] = 0.125 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3] + input[j + 4] + input[j + 5] + input[j + 6] + input[j + 7]);
          }break;
      }

      return outputSize;
    }

    /** @private */

  }, {
    key: '_yin',
    value: function _yin(corr, acSize, buffer, downSize, threshold) {
      var windowSize = downSize - acSize;

      autocorrelation(corr, acSize, buffer, windowSize);

      var corr0 = corr[0]; // energy of the input signal in windowSize (a^2)
      var maxMins = this.yinMaxMins;
      var mins = this.yinMins;
      var yinResults = this.yinResults;
      var biasedThreshold = threshold;
      var minCounter = 0;
      var absTau = acSize - 1.5;
      var absMin = 1;
      var x = void 0;
      var xm = void 0;
      var energy = void 0;
      var diff = void 0;
      var diffLeft = void 0;
      var diffRight = void 0;
      var sum = void 0;

      // diff[0]
      x = buffer[0];
      xm = buffer[windowSize];
      // corr[0] is a^2, corr[1-n] is ab, energy is b^2 (windowSize shifted by tau)
      energy = corr0 + xm * xm - x * x;
      diffLeft = 0;
      diff = 0;
      // (a - b)^2 = a^2 - 2ab + b2  (squared difference)
      diffRight = corr0 + energy - 2 * corr[1];
      sum = 0;

      // diff[1]
      x = buffer[1];
      xm = buffer[1 + windowSize];
      energy += xm * xm - x * x;
      diffLeft = diff;
      diff = diffRight;
      diffRight = corr0 + energy - 2 * corr[2];
      sum = diff;

      // minimum difference search
      for (var i = 2; i < acSize - 1 && minCounter < maxMins; i++) {
        x = buffer[i];
        xm = buffer[i + windowSize];
        energy += xm * xm - x * x;
        diffLeft = diff;
        diff = diffRight;
        diffRight = corr0 + energy - 2 * corr[i + 1];
        sum += diff;

        // local minima
        if (diff < diffLeft && diff < diffRight && sum !== 0) {
          // a bit of black magic... quadratic interpolation ?
          var a = diffLeft + diffRight - 2 * diff;
          var b = 0.5 * (diffRight - diffLeft);
          var min = diff - b * b / (2 * a);
          var normMin = i * min / sum;
          var tau = i - b / a;

          mins[minCounter * 2] = normMin;
          mins[minCounter * 2 + 1] = tau;
          minCounter += 1;

          if (normMin < absMin) absMin = normMin;
        }
      }

      biasedThreshold += absMin;

      // first minimum under biased threshold
      for (var _i = 0; _i < minCounter; _i++) {
        var j = _i * 2;

        if (mins[j] < biasedThreshold) {
          absMin = mins[j];
          absTau = mins[j + 1];
          break;
        }
      }

      if (absMin < 0) absMin = 0;

      yinResults[0] = absMin;
      yinResults[1] = absTau;

      return yinResults;
    }

    /**
     * Use the `Yin` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array|Float32Array} input - The signal fragment to process.
     * @return {Array} - Array containing the `frequency`, `energy`, `periodicity`
     *  and `AC1`
     *
     * @example
     * import * as lfo from 'waves-lfo/client';
     *
     * const yin = new lfo.operator.Yin();
     * yin.initStream({
     *   frameSize: 2048,
     *   frameType: 'signal',
     *   sourceSampleRate: 44100
     * });
     *
     * const results = yin.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(input) {
      var threshold = this.params.get('threshold');
      var inputFrameSize = this.inputFrameSize;
      var downSamplingExp = this.downSamplingExp;
      var downSamplingRate = this.downSamplingRate;
      var acSize = this.acSize;
      var outData = this.frame.data;
      var buffer = this.buffer;
      var corr = this.corr;

      var ac1OverAc0 = void 0;
      var periodicity = void 0;
      var energy = void 0;

      var downSize = this._downsample(input, inputFrameSize, buffer, downSamplingExp);
      var res = this._yin(corr, acSize, buffer, downSize, threshold);

      var min = res[0];
      var period = res[1];

      // energy
      energy = sqrt(corr[0] / (downSize - acSize));

      // periodicity
      if (min > 0) periodicity = min < 1 ? 1.0 - sqrt(min) : 0;else periodicity = 1;

      // ac1 over ac0 (kind of spectral slope ?)
      if (corr[0] !== 0) ac1OverAc0 = corr[1] / corr[0];else ac1OverAc0 = 0;

      // populate frame with results
      outData[0] = downSamplingRate / period;
      outData[1] = energy;
      outData[2] = periodicity;
      outData[3] = ac1OverAc0;

      return outData;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Yin;
}(_BaseLfo3.default);

exports.default = Yin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZhc3RZaW4uanMiXSwibmFtZXMiOlsiY2VpbCIsIk1hdGgiLCJzcXJ0IiwiYXV0b2NvcnJlbGF0aW9uIiwiY29ycmVsYXRpb24iLCJhY1NpemUiLCJidWZmZXIiLCJ3aW5kb3dTaXplIiwidGF1IiwiaSIsImRlZmluaXRpb25zIiwidGhyZXNob2xkIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJkb3duU2FtcGxpbmdFeHAiLCJtaW4iLCJtYXgiLCJtaW5GcmVxIiwiWWluIiwib3B0aW9ucyIsInByb2JhYmlsaXR5IiwicGl0Y2giLCJ0ZXN0IiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJpbnB1dEZyYW1lU2l6ZSIsImZyYW1lU2l6ZSIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImRlc2NyaXB0aW9uIiwic291cmNlU2FtcGxlUmF0ZSIsInBhcmFtcyIsImdldCIsImRvd25GYWN0b3IiLCJkb3duU1IiLCJkb3duRnJhbWVTaXplIiwiRXJyb3IiLCJGbG9hdDMyQXJyYXkiLCJjb3JyIiwiZG93blNhbXBsaW5nUmF0ZSIsInlpbk1heE1pbnMiLCJ5aW5NaW5zIiwieWluUmVzdWx0cyIsIkFycmF5IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiaW5wdXQiLCJzaXplIiwib3V0cHV0Iiwib3V0cHV0U2l6ZSIsImoiLCJkb3duU2l6ZSIsImNvcnIwIiwibWF4TWlucyIsIm1pbnMiLCJiaWFzZWRUaHJlc2hvbGQiLCJtaW5Db3VudGVyIiwiYWJzVGF1IiwiYWJzTWluIiwieCIsInhtIiwiZW5lcmd5IiwiZGlmZiIsImRpZmZMZWZ0IiwiZGlmZlJpZ2h0Iiwic3VtIiwiYSIsImIiLCJub3JtTWluIiwib3V0RGF0YSIsImZyYW1lIiwiZGF0YSIsImFjMU92ZXJBYzAiLCJwZXJpb2RpY2l0eSIsIl9kb3duc2FtcGxlIiwicmVzIiwiX3lpbiIsInBlcmlvZCIsImlucHV0U2lnbmFsIl0sIm1hcHBpbmdzIjoiOzs7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TUFBYjtBQUNBUSxjQUFRLENBQVIsSUFBYUksV0FBYjtBQUNBSixjQUFRLENBQVIsSUFBYUcsVUFBYjs7QUFFQSxhQUFPSCxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixXQUFLUSxXQUFMLENBQWlCUixNQUFNQyxJQUF2QjtBQUNEOzs7OztrQkFHWXBELEciLCJmaWxlIjoiRmFzdFlpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbi8qKlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBuZWVkcyB0byBiZSByZXZpZXdlZCBiZWZvcmUgYmVpbmcgZXhwb3NlZCBpbiB0aGUgbGlicmFyeS5cbiAqIFJlc3VsdHMgYXJlIHRvbyAuLi4gZnJvbSB0aGUgUGlQbyByZXN1bHRzIGZvciBub3cuXG4gKi9cblxuLyoqXG4gKiBiYXNlZCBvbjpcbiAqIC0gaHR0cDovL3JlY2hlcmNoZS5pcmNhbS5mci9lcXVpcGVzL3BjbS9jaGV2ZWlnbi9wc3MvMjAwMl9KQVNBX1lJTi5wZGZcbiAqIC0gUGlQby55aW4gYW5kIHJ0YSBsaWJyYXJ5IGltcGxlbWVudGF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5cblxuY29uc3QgY2VpbCA9IE1hdGguY2VpbDtcbmNvbnN0IHNxcnQgPSBNYXRoLnNxcnQ7XG5cbmZ1bmN0aW9uIGF1dG9jb3JyZWxhdGlvbihjb3JyZWxhdGlvbiwgYWNTaXplLCBidWZmZXIsIHdpbmRvd1NpemUpIHtcbiAgLy8gY29yciwgYWNTaXplLCBidWZmZXIsIHdpbmRvd1NpemVcbiAgZm9yIChsZXQgdGF1ID0gMDsgdGF1IDwgYWNTaXplOyB0YXUrKykge1xuICAgIGNvcnJlbGF0aW9uW3RhdV0gPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3aW5kb3dTaXplOyBpKyspXG4gICAgICBjb3JyZWxhdGlvblt0YXVdICs9IGJ1ZmZlclt0YXUgKyBpXSAqIGJ1ZmZlcltpXTtcbiAgfVxuXG4gIHJldHVybiBjb3JyZWxhdGlvbjtcbn1cblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjEsIC8vIGRlZmF1bHQgZnJvbSBwYXBlclxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGRvd25TYW1wbGluZ0V4cDogeyAvLyBkb3duc2FtcGxpbmcgZmFjdG9yXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIsXG4gICAgbWluOiAwLFxuICAgIG1heDogMyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7IC8vXG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2MCwgLy8gbWVhbnMgNzM1IHNhbXBsZXNcbiAgICBtaW46IDAsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbn07XG5cbi8qKlxuICogWWluIGZ1bmRhbWVudGFsIGZyZXF1ZW5jeSBlc3RpbWF0b3IsIGJhc2VkIG9uIGFsZ29yaXRobSBkZXNjcmliZWQgaW5cbiAqIFtZSU4sIGEgZnVuZGFtZW50YWwgZnJlcXVlbmN5IGVzdGltYXRvciBmb3Igc3BlZWNoIGFuZCBtdXNpY10oaHR0cDovL3JlY2hlcmNoZS5pcmNhbS5mci9lcXVpcGVzL3BjbS9jaGV2ZWlnbi9wc3MvMjAwMl9KQVNBX1lJTi5wZGYpXG4gKiBieSBDaGV2ZWlnbmUgYW5kIEthd2FoYXJhLlxuICogT24gZWFjaCBmcmFtZSwgdGhpcyBvcGVyYXRvciBwcm9wYWdhdGUgYSB2ZWN0b3IgY29udGFpbmluZyB0aGUgZm9sbG93aW5nXG4gKiB2YWx1ZXM6IGBmcmVxdWVuY3lgLCBgZW5lcmd5YCwgYHBlcmlvZGljaXR5YCBhbmQgYEFDMWAuXG4gKlxuICogRm9yIGdvb2QgcmVzdWx0cyB0aGUgaW5wdXQgZnJhbWUgc2l6ZSBzaG91bGQgYmUgbGFyZ2UgKDEwMjQgb3IgMjA0OCkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpvcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0wLjFdIC0gQWJzb2x1dGUgdGhyZXNob2xkIHRvIHRlc3QgdGhlXG4gKiAgbm9ybWFsaXplZCBkaWZmZXJlbmNlIChzZWUgcGFwZXIgZm9yIG1vcmUgaW5mb3JtYXRpb25zKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kb3duU2FtcGxpbmdFeHA9Ml0gLSBEb3duIHNhbXBsZSB0aGUgaW5wdXQgZnJhbWUgYnlcbiAqICBhIGZhY3RvciBvZiAyIGF0IHRoZSBwb3dlciBvZiBgZG93blNhbXBsaW5nRXhwYCAobWluPTAgYW5kIG1heD0zKSBmb3JcbiAqICBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT02MF0gLSBNaW5pbXVtIGZyZXF1ZW5jeSB0aGUgb3BlcmF0b3IgY2FuXG4gKiAgc2VhcmNoIGZvci4gVGhpcyBwYXJhbWV0ZXIgZGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgYXV0b2NvcnJlbGF0aW9uIHBlcmZvcm1lZFxuICogIG9uIHRoZSBzaWduYWwsIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBhcm91bmQgMiB0aW1lIHRoaXMgc2l6ZSBmb3JcbiAqICBnb29kIHJlc3VsdHMgKGkuZS4gYGlucHV0RnJhbWVTaXplIOKJiCAyICogKHNhbXBsaW5nUmF0ZSAvIG1pbkZyZXEpYCkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIEF1ZGlvQnVmZmVyXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDIwNDgsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB5aW4gPSBuZXcgbGZvLm9wZXJhdG9yLllpbigpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogc291cmNlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KHlpbik7XG4gKiB5aW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIHNvdXJjZS5zdGFydCgpO1xuICovXG5jbGFzcyBZaW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wcm9iYWJpbGl0eSA9IDA7XG4gICAgdGhpcy5waXRjaCA9IC0xO1xuXG4gICAgdGhpcy50ZXN0ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLmlucHV0RnJhbWVTaXplID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSA0O1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gWydmcmVxdWVuY3knLCAnZW5lcmd5JywgJ3BlcmlvZGljaXR5JywgJ0FDMSddO1xuXG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgLy8gaGFuZGxlIHBhcmFtc1xuICAgIGNvbnN0IGRvd25TYW1wbGluZ0V4cCA9IHRoaXMucGFyYW1zLmdldCgnZG93blNhbXBsaW5nRXhwJyk7XG4gICAgY29uc3QgZG93bkZhY3RvciA9IDEgPDwgZG93blNhbXBsaW5nRXhwOyAvLyAyXm5cbiAgICBjb25zdCBkb3duU1IgPSBzb3VyY2VTYW1wbGVSYXRlIC8gZG93bkZhY3RvcjtcbiAgICBjb25zdCBkb3duRnJhbWVTaXplID0gdGhpcy5pbnB1dEZyYW1lU2l6ZSAvIGRvd25GYWN0b3I7IC8vIG5fdGlja19kb3duIC8vIDEgLyAyXm5cblxuICAgIGxldCBtaW5GcmVxID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5GcmVxJyk7XG4gICAgLy8gbGltaXQgbWluIGZyZXEsIGNmLiBwYXBlciBJVi4gc2Vuc2l0aXZpdHkgdG8gcGFyYW1ldGVyc1xuICAgIG1pbkZyZXEgPSAobWluRnJlcSA+IDAuMjUgKiBkb3duU1IpID8gMC4yNSAqIGRvd25TUiA6IG1pbkZyZXE7XG4gICAgLy8gc2l6ZSBvZiBhdXRvY29ycmVsYXRpb25cbiAgICB0aGlzLmFjU2l6ZSA9IGNlaWwoZG93blNSIC8gbWluRnJlcSkgKyAyO1xuXG4gICAgLy8gbWluaW11bSBlcnJvciB0byBub3QgY3Jhc2ggYnV0IG5vdCBlbm91Z2h0IHRvIGhhdmUgcmVzdWx0c1xuICAgIGlmICh0aGlzLmFjU2l6ZSA+PSBkb3duRnJhbWVTaXplKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IGZyYW1lIHNpemUsIHRvbyBzbWFsbCBmb3IgZ2l2ZW4gXCJtaW5GcmVxXCInKTtcblxuICAgIC8vIGFsbG9jYXRlIG1lbW9yeVxuICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShkb3duRnJhbWVTaXplKTtcbiAgICB0aGlzLmNvcnIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYWNTaXplKTtcbiAgICB0aGlzLmRvd25TYW1wbGluZ0V4cCA9IGRvd25TYW1wbGluZ0V4cDtcbiAgICB0aGlzLmRvd25TYW1wbGluZ1JhdGUgPSBkb3duU1I7XG5cbiAgICAvLyBtYXhpbXVtIG51bWJlciBvZiBzZWFyY2hlZCBtaW5pbWFcbiAgICB0aGlzLnlpbk1heE1pbnMgPSAxMjg7IC8vIGNmLiBQaVBvIGZvciB0aGlzIHZhbHVlIGNob2ljZVxuICAgIC8vIGludGVybGVhdmVkIG1pbiAvIHRhdSB1c2VkIGluIHRoaXMuX3lpblxuICAgIHRoaXMueWluTWlucyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy55aW5NYXhNaW5zICogMik7XG4gICAgLy8gdmFsdWVzIHJldHVybmVkIGJ5IF95aW5cbiAgICB0aGlzLnlpblJlc3VsdHMgPSBuZXcgQXJyYXkoMik7IC8vIG1pbiwgdGF1XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3duc2FtcGxlKGlucHV0LCBzaXplLCBvdXRwdXQsIGRvd25TYW1wbGluZ0V4cCkge1xuICAgIGNvbnN0IG91dHB1dFNpemUgPSBzaXplID4+IGRvd25TYW1wbGluZ0V4cDtcbiAgICBsZXQgaSwgajtcblxuICAgIHN3aXRjaCAoZG93blNhbXBsaW5nRXhwKSB7XG4gICAgICBjYXNlIDA6IC8vIG5vIGRvd24gc2FtcGxpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNpemU7IGkrKylcbiAgICAgICAgICBvdXRwdXRbaV0gPSBpbnB1dFtpXTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gMilcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0pO1xuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDQpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4yNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDgpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4xMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10gKyBpbnB1dFtqICsgNF0gKyBpbnB1dFtqICsgNV0gKyBpbnB1dFtqICsgNl0gKyBpbnB1dFtqICsgN10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRTaXplO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF95aW4oY29yciwgYWNTaXplLCBidWZmZXIsIGRvd25TaXplLCB0aHJlc2hvbGQpIHtcbiAgICBjb25zdCB3aW5kb3dTaXplID0gZG93blNpemUgLSBhY1NpemU7XG5cbiAgICBhdXRvY29ycmVsYXRpb24oY29yciwgYWNTaXplLCBidWZmZXIsIHdpbmRvd1NpemUpO1xuXG4gICAgY29uc3QgY29ycjAgPSBjb3JyWzBdOyAvLyBlbmVyZ3kgb2YgdGhlIGlucHV0IHNpZ25hbCBpbiB3aW5kb3dTaXplIChhXjIpXG4gICAgY29uc3QgbWF4TWlucyA9IHRoaXMueWluTWF4TWlucztcbiAgICBjb25zdCBtaW5zID0gdGhpcy55aW5NaW5zO1xuICAgIGNvbnN0IHlpblJlc3VsdHMgPSB0aGlzLnlpblJlc3VsdHM7XG4gICAgbGV0IGJpYXNlZFRocmVzaG9sZCA9IHRocmVzaG9sZDtcbiAgICBsZXQgbWluQ291bnRlciA9IDA7XG4gICAgbGV0IGFic1RhdSA9IGFjU2l6ZSAtIDEuNTtcbiAgICBsZXQgYWJzTWluID0gMTtcbiAgICBsZXQgeDtcbiAgICBsZXQgeG07XG4gICAgbGV0IGVuZXJneTtcbiAgICBsZXQgZGlmZjtcbiAgICBsZXQgZGlmZkxlZnQ7XG4gICAgbGV0IGRpZmZSaWdodDtcbiAgICBsZXQgc3VtO1xuXG4gICAgLy8gZGlmZlswXVxuICAgIHggPSBidWZmZXJbMF07XG4gICAgeG0gPSBidWZmZXJbd2luZG93U2l6ZV07XG4gICAgLy8gY29yclswXSBpcyBhXjIsIGNvcnJbMS1uXSBpcyBhYiwgZW5lcmd5IGlzIGJeMiAod2luZG93U2l6ZSBzaGlmdGVkIGJ5IHRhdSlcbiAgICBlbmVyZ3kgPSBjb3JyMCArIHhtICogeG0gLSB4ICogeDtcbiAgICBkaWZmTGVmdCA9IDA7XG4gICAgZGlmZiA9IDA7XG4gICAgLy8gKGEgLSBiKV4yID0gYV4yIC0gMmFiICsgYjIgIChzcXVhcmVkIGRpZmZlcmVuY2UpXG4gICAgZGlmZlJpZ2h0ID0gY29ycjAgKyBlbmVyZ3kgLSAyICogY29yclsxXTtcbiAgICBzdW0gPSAwO1xuXG4gICAgLy8gZGlmZlsxXVxuICAgIHggPSBidWZmZXJbMV07XG4gICAgeG0gPSBidWZmZXJbMSArIHdpbmRvd1NpemVdO1xuICAgIGVuZXJneSArPSB4bSAqIHhtIC0geCAqIHg7XG4gICAgZGlmZkxlZnQgPSBkaWZmO1xuICAgIGRpZmYgPSBkaWZmUmlnaHQ7XG4gICAgZGlmZlJpZ2h0ID0gY29ycjAgKyBlbmVyZ3kgLSAyICogY29yclsyXTtcbiAgICBzdW0gPSBkaWZmO1xuXG4gICAgLy8gbWluaW11bSBkaWZmZXJlbmNlIHNlYXJjaFxuICAgIGZvciAobGV0IGkgPSAyOyBpIDwgYWNTaXplIC0gMSAmJiBtaW5Db3VudGVyIDwgbWF4TWluczsgaSsrKSB7XG4gICAgICB4ID0gYnVmZmVyW2ldO1xuICAgICAgeG0gPSBidWZmZXJbaSArIHdpbmRvd1NpemVdO1xuICAgICAgZW5lcmd5ICs9IHhtICogeG0gLSB4ICogeDtcbiAgICAgIGRpZmZMZWZ0ID0gZGlmZjtcbiAgICAgIGRpZmYgPSBkaWZmUmlnaHQ7XG4gICAgICBkaWZmUmlnaHQgPSBjb3JyMCArIGVuZXJneSAtIDIgKiBjb3JyW2kgKyAxXTtcbiAgICAgIHN1bSArPSBkaWZmO1xuXG4gICAgICAvLyBsb2NhbCBtaW5pbWFcbiAgICAgIGlmIChkaWZmIDwgZGlmZkxlZnQgJiYgZGlmZiA8IGRpZmZSaWdodCAmJiBzdW0gIT09IDApIHtcbiAgICAgICAgLy8gYSBiaXQgb2YgYmxhY2sgbWFnaWMuLi4gcXVhZHJhdGljIGludGVycG9sYXRpb24gP1xuICAgICAgICBjb25zdCBhID0gZGlmZkxlZnQgKyBkaWZmUmlnaHQgLSAyICogZGlmZjtcbiAgICAgICAgY29uc3QgYiA9IDAuNSAqIChkaWZmUmlnaHQgLSBkaWZmTGVmdCk7XG4gICAgICAgIGNvbnN0IG1pbiA9IGRpZmYgLSAoYiAqIGIpIC8gKDIgKiBhKTtcbiAgICAgICAgY29uc3Qgbm9ybU1pbiA9IGkgKiBtaW4gLyBzdW07XG4gICAgICAgIGNvbnN0IHRhdSA9IGkgLSBiIC8gYTtcblxuICAgICAgICBtaW5zW21pbkNvdW50ZXIgKiAyXSA9IG5vcm1NaW47XG4gICAgICAgIG1pbnNbbWluQ291bnRlciAqIDIgKyAxXSA9IHRhdTtcbiAgICAgICAgbWluQ291bnRlciArPSAxO1xuXG4gICAgICAgIGlmIChub3JtTWluIDwgYWJzTWluKVxuICAgICAgICAgIGFic01pbiA9IG5vcm1NaW47XG4gICAgICB9XG4gICAgfVxuXG4gICAgYmlhc2VkVGhyZXNob2xkICs9IGFic01pbjtcblxuICAgIC8vIGZpcnN0IG1pbmltdW0gdW5kZXIgYmlhc2VkIHRocmVzaG9sZFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWluQ291bnRlcjsgaSsrKSB7XG4gICAgICBjb25zdCBqID0gaSAqIDI7XG5cbiAgICAgIGlmIChtaW5zW2pdIDwgYmlhc2VkVGhyZXNob2xkKSB7XG4gICAgICAgIGFic01pbiA9IG1pbnNbal07XG4gICAgICAgIGFic1RhdSA9IG1pbnNbaiArIDFdO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWJzTWluIDwgMClcbiAgICAgIGFic01pbiA9IDA7XG5cbiAgICB5aW5SZXN1bHRzWzBdID0gYWJzTWluO1xuICAgIHlpblJlc3VsdHNbMV0gPSBhYnNUYXU7XG5cbiAgICByZXR1cm4geWluUmVzdWx0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGBZaW5gIG9wZXJhdG9yIGluIGBzdGFuZGFsb25lYCBtb2RlIChpLmUuIG91dHNpZGUgb2YgYSBncmFwaCkuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8RmxvYXQzMkFycmF5fSBpbnB1dCAtIFRoZSBzaWduYWwgZnJhZ21lbnQgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gQXJyYXkgY29udGFpbmluZyB0aGUgYGZyZXF1ZW5jeWAsIGBlbmVyZ3lgLCBgcGVyaW9kaWNpdHlgXG4gICAqICBhbmQgYEFDMWBcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICAgKlxuICAgKiBjb25zdCB5aW4gPSBuZXcgbGZvLm9wZXJhdG9yLllpbigpO1xuICAgKiB5aW4uaW5pdFN0cmVhbSh7XG4gICAqICAgZnJhbWVTaXplOiAyMDQ4LFxuICAgKiAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gICAqICAgc291cmNlU2FtcGxlUmF0ZTogNDQxMDBcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnN0IHJlc3VsdHMgPSB5aW4uaW5wdXRTaWduYWwoc2lnbmFsKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKGlucHV0KSB7XG4gICAgY29uc3QgdGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCd0aHJlc2hvbGQnKTtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHRoaXMuaW5wdXRGcmFtZVNpemU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5kb3duU2FtcGxpbmdFeHA7XG4gICAgY29uc3QgZG93blNhbXBsaW5nUmF0ZSA9IHRoaXMuZG93blNhbXBsaW5nUmF0ZTtcbiAgICBjb25zdCBhY1NpemUgPSB0aGlzLmFjU2l6ZTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGNvbnN0IGNvcnIgPSB0aGlzLmNvcnI7XG5cbiAgICBsZXQgYWMxT3ZlckFjMDtcbiAgICBsZXQgcGVyaW9kaWNpdHk7XG4gICAgbGV0IGVuZXJneTtcblxuICAgIGNvbnN0IGRvd25TaXplID0gdGhpcy5fZG93bnNhbXBsZShpbnB1dCwgaW5wdXRGcmFtZVNpemUsIGJ1ZmZlciwgZG93blNhbXBsaW5nRXhwKTtcbiAgICBjb25zdCByZXMgPSB0aGlzLl95aW4oY29yciwgYWNTaXplLCBidWZmZXIsIGRvd25TaXplLCB0aHJlc2hvbGQpO1xuXG4gICAgY29uc3QgbWluID0gcmVzWzBdO1xuICAgIGNvbnN0IHBlcmlvZCA9IHJlc1sxXTtcblxuICAgIC8vIGVuZXJneVxuICAgIGVuZXJneSA9IHNxcnQoY29yclswXSAvIChkb3duU2l6ZSAtIGFjU2l6ZSkpO1xuXG4gICAgLy8gcGVyaW9kaWNpdHlcbiAgICBpZiAobWluID4gMClcbiAgICAgIHBlcmlvZGljaXR5ID0gKG1pbiA8IDEpID8gMS4wIC0gc3FydChtaW4pIDogMDtcbiAgICBlbHNlXG4gICAgICBwZXJpb2RpY2l0eSA9IDE7XG5cbiAgICAvLyBhYzEgb3ZlciBhYzAgKGtpbmQgb2Ygc3BlY3RyYWwgc2xvcGUgPylcbiAgICBpZiAoY29yclswXSAhPT0gMClcbiAgICAgIGFjMU92ZXJBYzAgPSBjb3JyWzFdIC8gY29yclswXTtcbiAgICBlbHNlXG4gICAgICBhYzFPdmVyQWMwID0gMDtcblxuICAgIC8vIHBvcHVsYXRlIGZyYW1lIHdpdGggcmVzdWx0c1xuICAgIG91dERhdGFbMF0gPSBkb3duU2FtcGxpbmdSYXRlIC8gcGVyaW9kO1xuICAgIG91dERhdGFbMV0gPSBlbmVyZ3k7XG4gICAgb3V0RGF0YVsyXSA9IHBlcmlvZGljaXR5O1xuICAgIG91dERhdGFbM10gPSBhYzFPdmVyQWMwO1xuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWluO1xuIl19