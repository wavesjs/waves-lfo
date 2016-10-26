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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ceil = Math.ceil;

/**
 * paper: http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * implementation based on https://github.com/ashokfernandez/Yin-Pitch-Tracking
 * @private
 */

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
    default: 60, // mean 735 samples
    min: 0,
    metas: { kind: 'static' }
  }
};

/**
 * Yin fundamental frequency estimator, based on algorithm described in
 * [YIN, a fundamental frequency estimator for speech and music](http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf)
 * by Cheveigne and Kawahara.
 * On each frame, this operator propagate a vector containing the following
 * values: `frequency`, `probability`.
 *
 * For good results the input frame size should be large (1024 or 2048).
 *
 * _support `standalone` usage_
 *
 * @note - In node for a frame of 2048 samples, average computation time is:
 *         0.00016742283339993389 second.
 *
 * @memberof module:common.operator
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

  function Yin(options) {
    (0, _classCallCheck3.default)(this, Yin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Yin.__proto__ || (0, _getPrototypeOf2.default)(Yin)).call(this, definitions, options));

    _this.probability = 0;
    _this.pitch = -1;

    _this.test = 0;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Yin, [{
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
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 2;
      this.streamParams.description = ['frequency', 'confidence'];

      this.inputFrameSize = prevStreamParams.frameSize;
      // handle params
      var sourceSampleRate = this.streamParams.sourceSampleRate;
      var downSamplingExp = this.params.get('downSamplingExp');
      var downFactor = 1 << downSamplingExp; // 2^n
      var downSR = sourceSampleRate / downFactor;
      var downFrameSize = this.inputFrameSize / downFactor; // n_tick_down // 1 / 2^n

      var minFreq = this.params.get('minFreq');
      // limit min freq, cf. paper IV. sensitivity to parameters
      var minFreqNbrSamples = downSR / minFreq;
      // const bufferSize = prevStreamParams.frameSize;
      this.halfBufferSize = downFrameSize / 2;

      // minimum error to not crash but not enought to have results
      if (minFreqNbrSamples > this.halfBufferSize) throw new Error('Invalid input frame size, too small for given "minFreq"');

      this.downSamplingExp = downSamplingExp;
      this.downSamplingRate = downSR;
      this.downFrameSize = downFrameSize;
      this.buffer = new Float32Array(downFrameSize);
      // autocorrelation buffer
      this.yinBuffer = new Float32Array(this.halfBufferSize);
      this.yinBuffer.fill(0);

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

    /**
     * Step 1, 2 and 3 - Squared difference of the shifted signal with itself.
     * cumulative mean normalized difference.
     *
     * @private
     */

  }, {
    key: '_normalizedDifference',
    value: function _normalizedDifference(buffer) {
      var halfBufferSize = this.halfBufferSize;
      var yinBuffer = this.yinBuffer;
      var sum = 0;

      // difference for different shift values (tau)
      for (var tau = 0; tau < halfBufferSize; tau++) {
        var squaredDifference = 0; // reset buffer

        // take difference of the signal with a shifted version of itself then
        // sqaure the result
        for (var i = 0; i < halfBufferSize; i++) {
          var delta = buffer[i] - buffer[i + tau];
          squaredDifference += delta * delta;
        }

        // step 3 - normalize yinBuffer
        if (tau > 0) {
          sum += squaredDifference;
          yinBuffer[tau] = squaredDifference * (tau / sum);
        }
      }

      yinBuffer[0] = 1;
    }

    /**
     * Step 4 - find first best tau that is under the thresold.
     *
     * @private
     */

  }, {
    key: '_absoluteThreshold',
    value: function _absoluteThreshold() {
      var threshold = this.params.get('threshold');
      var yinBuffer = this.yinBuffer;
      var halfBufferSize = this.halfBufferSize;
      var tau = void 0;

      for (tau = 1; tau < halfBufferSize; tau++) {
        if (yinBuffer[tau] < threshold) {
          // keep increasing tau if next value is better
          while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
            tau += 1;
          } // best tau found , yinBuffer[tau] can be seen as an estimation of
          // aperiodicity then: periodicity = 1 - aperiodicity
          this.probability = 1 - yinBuffer[tau];
          break;
        }
      }

      // return -1 if not match found
      return tau === halfBufferSize ? -1 : tau;
    }

    /**
     * Step 5 - Find a better fractionnal approximate of tau.
     * this can probably be simplified...
     *
     * @private
     */

  }, {
    key: '_parabolicInterpolation',
    value: function _parabolicInterpolation(tauEstimate) {
      var halfBufferSize = this.halfBufferSize;
      var yinBuffer = this.yinBuffer;
      var betterTau = void 0;
      // @note - tauEstimate cannot be zero as the loop start at 1 in step 4
      var x0 = tauEstimate - 1;
      var x2 = tauEstimate < halfBufferSize - 1 ? tauEstimate + 1 : tauEstimate;

      // if `tauEstimate` is last index, we can't interpolate
      if (x2 === tauEstimate) {
        betterTau = tauEstimate;
      } else {
        var s0 = yinBuffer[x0];
        var s1 = yinBuffer[tauEstimate];
        var s2 = yinBuffer[x2];

        // @note - don't fully understand this formula neither...
        betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
      }

      return betterTau;
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
      this.pitch = -1;
      this.probability = 0;

      var buffer = this.buffer;
      var inputFrameSize = this.inputFrameSize;
      var downSamplingExp = this.downSamplingExp;
      var sampleRate = this.downSamplingRate;
      var outData = this.frame.data;
      var tauEstimate = -1;

      // subsampling
      this._downsample(input, inputFrameSize, buffer, downSamplingExp);
      // step 1, 2, 3 - normalized squared difference of the signal with a
      // shifted version of itself
      this._normalizedDifference(buffer);
      // step 4 - find first best tau estimate that is over the threshold
      tauEstimate = this._absoluteThreshold();

      if (tauEstimate !== -1) {
        // step 5 - so far tau is an integer shift of the signal, check if
        // there is a better fractionnal value around
        tauEstimate = this._parabolicInterpolation(tauEstimate);
        this.pitch = sampleRate / tauEstimate;
      }

      outData[0] = this.pitch;
      outData[1] = this.probability;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIllpbi5qcyJdLCJuYW1lcyI6WyJjZWlsIiwiTWF0aCIsImRlZmluaXRpb25zIiwidGhyZXNob2xkIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJkb3duU2FtcGxpbmdFeHAiLCJtaW4iLCJtYXgiLCJtaW5GcmVxIiwiWWluIiwib3B0aW9ucyIsInByb2JhYmlsaXR5IiwicGl0Y2giLCJ0ZXN0IiwiaW5wdXQiLCJzaXplIiwib3V0cHV0Iiwib3V0cHV0U2l6ZSIsImkiLCJqIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVNpemUiLCJkZXNjcmlwdGlvbiIsImlucHV0RnJhbWVTaXplIiwic291cmNlU2FtcGxlUmF0ZSIsInBhcmFtcyIsImdldCIsImRvd25GYWN0b3IiLCJkb3duU1IiLCJkb3duRnJhbWVTaXplIiwibWluRnJlcU5iclNhbXBsZXMiLCJoYWxmQnVmZmVyU2l6ZSIsIkVycm9yIiwiZG93blNhbXBsaW5nUmF0ZSIsImJ1ZmZlciIsIkZsb2F0MzJBcnJheSIsInlpbkJ1ZmZlciIsImZpbGwiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJzdW0iLCJ0YXUiLCJzcXVhcmVkRGlmZmVyZW5jZSIsImRlbHRhIiwidGF1RXN0aW1hdGUiLCJiZXR0ZXJUYXUiLCJ4MCIsIngyIiwiczAiLCJzMSIsInMyIiwic2FtcGxlUmF0ZSIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJfZG93bnNhbXBsZSIsIl9ub3JtYWxpemVkRGlmZmVyZW5jZSIsIl9hYnNvbHV0ZVRocmVzaG9sZCIsIl9wYXJhYm9saWNJbnRlcnBvbGF0aW9uIiwiaW5wdXRTaWduYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLE9BQU9DLEtBQUtELElBQWxCOztBQUVBOzs7Ozs7QUFNQSxJQUFNRSxjQUFjO0FBQ2xCQyxh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QyxDQUFuQjs7QUFFQTtBQUNBLFdBQUtXLFdBQUwsQ0FBaUIzQyxLQUFqQixFQUF3QlksY0FBeEIsRUFBd0NXLE1BQXhDLEVBQWdEaEMsZUFBaEQ7QUFDQTtBQUNBO0FBQ0EsV0FBS3FELHFCQUFMLENBQTJCckIsTUFBM0I7QUFDQTtBQUNBUyxvQkFBYyxLQUFLYSxrQkFBTCxFQUFkOztBQUVBLFVBQUliLGdCQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBQ3RCO0FBQ0E7QUFDQUEsc0JBQWMsS0FBS2MsdUJBQUwsQ0FBNkJkLFdBQTdCLENBQWQ7QUFDQSxhQUFLbEMsS0FBTCxHQUFheUMsYUFBYVAsV0FBMUI7QUFDRDs7QUFFRFEsY0FBUSxDQUFSLElBQWEsS0FBSzFDLEtBQWxCO0FBQ0EwQyxjQUFRLENBQVIsSUFBYSxLQUFLM0MsV0FBbEI7O0FBRUEsYUFBTzJDLE9BQVA7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQ25CLFdBQUtNLFdBQUwsQ0FBaUJOLE1BQU1DLElBQXZCO0FBQ0Q7Ozs7O2tCQUdZL0MsRyIsImZpbGUiOiJZaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBjZWlsID0gTWF0aC5jZWlsO1xuXG4vKipcbiAqIHBhcGVyOiBodHRwOi8vcmVjaGVyY2hlLmlyY2FtLmZyL2VxdWlwZXMvcGNtL2NoZXZlaWduL3Bzcy8yMDAyX0pBU0FfWUlOLnBkZlxuICogaW1wbGVtZW50YXRpb24gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2FzaG9rZmVybmFuZGV6L1lpbi1QaXRjaC1UcmFja2luZ1xuICogQHByaXZhdGVcbiAqL1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjEsIC8vIGRlZmF1bHQgZnJvbSBwYXBlclxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGRvd25TYW1wbGluZ0V4cDogeyAvLyBkb3duc2FtcGxpbmcgZmFjdG9yXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIsXG4gICAgbWluOiAwLFxuICAgIG1heDogMyxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7IC8vXG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiA2MCwgLy8gbWVhbiA3MzUgc2FtcGxlc1xuICAgIG1pbjogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxufVxuXG4vKipcbiAqIFlpbiBmdW5kYW1lbnRhbCBmcmVxdWVuY3kgZXN0aW1hdG9yLCBiYXNlZCBvbiBhbGdvcml0aG0gZGVzY3JpYmVkIGluXG4gKiBbWUlOLCBhIGZ1bmRhbWVudGFsIGZyZXF1ZW5jeSBlc3RpbWF0b3IgZm9yIHNwZWVjaCBhbmQgbXVzaWNdKGh0dHA6Ly9yZWNoZXJjaGUuaXJjYW0uZnIvZXF1aXBlcy9wY20vY2hldmVpZ24vcHNzLzIwMDJfSkFTQV9ZSU4ucGRmKVxuICogYnkgQ2hldmVpZ25lIGFuZCBLYXdhaGFyYS5cbiAqIE9uIGVhY2ggZnJhbWUsIHRoaXMgb3BlcmF0b3IgcHJvcGFnYXRlIGEgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZ1xuICogdmFsdWVzOiBgZnJlcXVlbmN5YCwgYHByb2JhYmlsaXR5YC5cbiAqXG4gKiBGb3IgZ29vZCByZXN1bHRzIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBsYXJnZSAoMTAyNCBvciAyMDQ4KS5cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG5vdGUgLSBJbiBub2RlIGZvciBhIGZyYW1lIG9mIDIwNDggc2FtcGxlcywgYXZlcmFnZSBjb21wdXRhdGlvbiB0aW1lIGlzOlxuICogICAgICAgICAwLjAwMDE2NzQyMjgzMzM5OTkzMzg5IHNlY29uZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0wLjFdIC0gQWJzb2x1dGUgdGhyZXNob2xkIHRvIHRlc3QgdGhlXG4gKiAgbm9ybWFsaXplZCBkaWZmZXJlbmNlIChzZWUgcGFwZXIgZm9yIG1vcmUgaW5mb3JtYXRpb25zKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kb3duU2FtcGxpbmdFeHA9Ml0gLSBEb3duIHNhbXBsZSB0aGUgaW5wdXQgZnJhbWUgYnlcbiAqICBhIGZhY3RvciBvZiAyIGF0IHRoZSBwb3dlciBvZiBgZG93blNhbXBsaW5nRXhwYCAobWluPTAgYW5kIG1heD0zKSBmb3JcbiAqICBwZXJmb3JtYW5jZSBpbXByb3ZlbWVudHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT02MF0gLSBNaW5pbXVtIGZyZXF1ZW5jeSB0aGUgb3BlcmF0b3IgY2FuXG4gKiAgc2VhcmNoIGZvci4gVGhpcyBwYXJhbWV0ZXIgZGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgYXV0b2NvcnJlbGF0aW9uIHBlcmZvcm1lZFxuICogIG9uIHRoZSBzaWduYWwsIHRoZSBpbnB1dCBmcmFtZSBzaXplIHNob3VsZCBiZSBhcm91bmQgMiB0aW1lIHRoaXMgc2l6ZSBmb3JcbiAqICBnb29kIHJlc3VsdHMgKGkuZS4gYGlucHV0RnJhbWVTaXplIOKJiCAyICogKHNhbXBsaW5nUmF0ZSAvIG1pbkZyZXEpYCkuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiAvLyBhc3N1bWluZyBzb21lIEF1ZGlvQnVmZmVyXG4gKiBjb25zdCBzb3VyY2UgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IDIwNDgsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB5aW4gPSBuZXcgbGZvLm9wZXJhdG9yLllpbigpO1xuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogc291cmNlLmNvbm5lY3Qoc2xpY2VyKTtcbiAqIHNsaWNlci5jb25uZWN0KHlpbik7XG4gKiB5aW4uY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIHNvdXJjZS5zdGFydCgpO1xuICovXG5jbGFzcyBZaW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJvYmFiaWxpdHkgPSAwO1xuICAgIHRoaXMucGl0Y2ggPSAtMTtcblxuICAgIHRoaXMudGVzdCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2Rvd25zYW1wbGUoaW5wdXQsIHNpemUsIG91dHB1dCwgZG93blNhbXBsaW5nRXhwKSB7XG4gICAgY29uc3Qgb3V0cHV0U2l6ZSA9IHNpemUgPj4gZG93blNhbXBsaW5nRXhwO1xuICAgIGxldCBpLCBqO1xuXG4gICAgc3dpdGNoIChkb3duU2FtcGxpbmdFeHApIHtcbiAgICAgIGNhc2UgMDogLy8gbm8gZG93biBzYW1wbGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICAgICAgICAgIG91dHB1dFtpXSA9IGlucHV0W2ldO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSAyKVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSk7XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gNClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gOClcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjEyNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSArIGlucHV0W2ogKyA0XSArIGlucHV0W2ogKyA1XSArIGlucHV0W2ogKyA2XSArIGlucHV0W2ogKyA3XSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dFNpemU7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gMjtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZnJlcXVlbmN5JywgJ2NvbmZpZGVuY2UnXTtcblxuICAgIHRoaXMuaW5wdXRGcmFtZVNpemUgPSBwcmV2U3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICAvLyBoYW5kbGUgcGFyYW1zXG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZG93blNhbXBsaW5nRXhwID0gdGhpcy5wYXJhbXMuZ2V0KCdkb3duU2FtcGxpbmdFeHAnKTtcbiAgICBjb25zdCBkb3duRmFjdG9yID0gMSA8PCBkb3duU2FtcGxpbmdFeHA7IC8vIDJeblxuICAgIGNvbnN0IGRvd25TUiA9IHNvdXJjZVNhbXBsZVJhdGUgLyBkb3duRmFjdG9yO1xuICAgIGNvbnN0IGRvd25GcmFtZVNpemUgPSB0aGlzLmlucHV0RnJhbWVTaXplIC8gZG93bkZhY3RvcjsgLy8gbl90aWNrX2Rvd24gLy8gMSAvIDJeblxuXG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIC8vIGxpbWl0IG1pbiBmcmVxLCBjZi4gcGFwZXIgSVYuIHNlbnNpdGl2aXR5IHRvIHBhcmFtZXRlcnNcbiAgICBjb25zdCBtaW5GcmVxTmJyU2FtcGxlcyA9IGRvd25TUiAvIG1pbkZyZXE7XG4gICAgLy8gY29uc3QgYnVmZmVyU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIHRoaXMuaGFsZkJ1ZmZlclNpemUgPSBkb3duRnJhbWVTaXplIC8gMjtcblxuICAgIC8vIG1pbmltdW0gZXJyb3IgdG8gbm90IGNyYXNoIGJ1dCBub3QgZW5vdWdodCB0byBoYXZlIHJlc3VsdHNcbiAgICBpZiAobWluRnJlcU5iclNhbXBsZXMgPiB0aGlzLmhhbGZCdWZmZXJTaXplKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IGZyYW1lIHNpemUsIHRvbyBzbWFsbCBmb3IgZ2l2ZW4gXCJtaW5GcmVxXCInKTtcblxuICAgIHRoaXMuZG93blNhbXBsaW5nRXhwID0gZG93blNhbXBsaW5nRXhwO1xuICAgIHRoaXMuZG93blNhbXBsaW5nUmF0ZSA9IGRvd25TUjtcbiAgICB0aGlzLmRvd25GcmFtZVNpemUgPSBkb3duRnJhbWVTaXplO1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShkb3duRnJhbWVTaXplKTtcbiAgICAvLyBhdXRvY29ycmVsYXRpb24gYnVmZmVyXG4gICAgdGhpcy55aW5CdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuaGFsZkJ1ZmZlclNpemUpO1xuICAgIHRoaXMueWluQnVmZmVyLmZpbGwoMCk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3duc2FtcGxlKGlucHV0LCBzaXplLCBvdXRwdXQsIGRvd25TYW1wbGluZ0V4cCkge1xuICAgIGNvbnN0IG91dHB1dFNpemUgPSBzaXplID4+IGRvd25TYW1wbGluZ0V4cDtcbiAgICBsZXQgaSwgajtcblxuICAgIHN3aXRjaCAoZG93blNhbXBsaW5nRXhwKSB7XG4gICAgICBjYXNlIDA6IC8vIG5vIGRvd24gc2FtcGxpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNpemU7IGkrKylcbiAgICAgICAgICBvdXRwdXRbaV0gPSBpbnB1dFtpXTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gMilcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0pO1xuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDQpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4yNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDgpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4xMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10gKyBpbnB1dFtqICsgNF0gKyBpbnB1dFtqICsgNV0gKyBpbnB1dFtqICsgNl0gKyBpbnB1dFtqICsgN10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRTaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0ZXAgMSwgMiBhbmQgMyAtIFNxdWFyZWQgZGlmZmVyZW5jZSBvZiB0aGUgc2hpZnRlZCBzaWduYWwgd2l0aCBpdHNlbGYuXG4gICAqIGN1bXVsYXRpdmUgbWVhbiBub3JtYWxpemVkIGRpZmZlcmVuY2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbm9ybWFsaXplZERpZmZlcmVuY2UoYnVmZmVyKSB7XG4gICAgY29uc3QgaGFsZkJ1ZmZlclNpemUgPSB0aGlzLmhhbGZCdWZmZXJTaXplO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgLy8gZGlmZmVyZW5jZSBmb3IgZGlmZmVyZW50IHNoaWZ0IHZhbHVlcyAodGF1KVxuICAgIGZvciAobGV0IHRhdSA9IDA7IHRhdSA8IGhhbGZCdWZmZXJTaXplOyB0YXUrKykge1xuICAgICAgbGV0IHNxdWFyZWREaWZmZXJlbmNlID0gMDsgLy8gcmVzZXQgYnVmZmVyXG5cbiAgICAgIC8vIHRha2UgZGlmZmVyZW5jZSBvZiB0aGUgc2lnbmFsIHdpdGggYSBzaGlmdGVkIHZlcnNpb24gb2YgaXRzZWxmIHRoZW5cbiAgICAgIC8vIHNxYXVyZSB0aGUgcmVzdWx0XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZCdWZmZXJTaXplOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBidWZmZXJbaV0gLSBidWZmZXJbaSArIHRhdV07XG4gICAgICAgIHNxdWFyZWREaWZmZXJlbmNlICs9IGRlbHRhICogZGVsdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0ZXAgMyAtIG5vcm1hbGl6ZSB5aW5CdWZmZXJcbiAgICAgIGlmICh0YXUgPiAwKSB7XG4gICAgICAgIHN1bSArPSBzcXVhcmVkRGlmZmVyZW5jZTtcbiAgICAgICAgeWluQnVmZmVyW3RhdV0gPSBzcXVhcmVkRGlmZmVyZW5jZSAqICh0YXUgLyBzdW0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHlpbkJ1ZmZlclswXSA9IDE7XG4gIH1cblxuICAvKipcbiAgICogU3RlcCA0IC0gZmluZCBmaXJzdCBiZXN0IHRhdSB0aGF0IGlzIHVuZGVyIHRoZSB0aHJlc29sZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hYnNvbHV0ZVRocmVzaG9sZCgpIHtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGNvbnN0IGhhbGZCdWZmZXJTaXplID0gdGhpcy5oYWxmQnVmZmVyU2l6ZTtcbiAgICBsZXQgdGF1O1xuXG4gICAgZm9yICh0YXUgPSAxOyB0YXUgPCBoYWxmQnVmZmVyU2l6ZTsgdGF1KyspIHtcbiAgICAgIGlmICh5aW5CdWZmZXJbdGF1XSA8IHRocmVzaG9sZCkge1xuICAgICAgICAvLyBrZWVwIGluY3JlYXNpbmcgdGF1IGlmIG5leHQgdmFsdWUgaXMgYmV0dGVyXG4gICAgICAgIHdoaWxlICh0YXUgKyAxIDwgaGFsZkJ1ZmZlclNpemUgJiYgeWluQnVmZmVyW3RhdSArIDFdIDwgeWluQnVmZmVyW3RhdV0pXG4gICAgICAgICAgdGF1ICs9IDE7XG5cbiAgICAgICAgLy8gYmVzdCB0YXUgZm91bmQgLCB5aW5CdWZmZXJbdGF1XSBjYW4gYmUgc2VlbiBhcyBhbiBlc3RpbWF0aW9uIG9mXG4gICAgICAgIC8vIGFwZXJpb2RpY2l0eSB0aGVuOiBwZXJpb2RpY2l0eSA9IDEgLSBhcGVyaW9kaWNpdHlcbiAgICAgICAgdGhpcy5wcm9iYWJpbGl0eSA9IDEgLSB5aW5CdWZmZXJbdGF1XTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIC0xIGlmIG5vdCBtYXRjaCBmb3VuZFxuICAgIHJldHVybiAodGF1ID09PSBoYWxmQnVmZmVyU2l6ZSkgPyAtMSA6IHRhdTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGVwIDUgLSBGaW5kIGEgYmV0dGVyIGZyYWN0aW9ubmFsIGFwcHJveGltYXRlIG9mIHRhdS5cbiAgICogdGhpcyBjYW4gcHJvYmFibHkgYmUgc2ltcGxpZmllZC4uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BhcmFib2xpY0ludGVycG9sYXRpb24odGF1RXN0aW1hdGUpIHtcbiAgICBjb25zdCBoYWxmQnVmZmVyU2l6ZSA9IHRoaXMuaGFsZkJ1ZmZlclNpemU7XG4gICAgY29uc3QgeWluQnVmZmVyID0gdGhpcy55aW5CdWZmZXI7XG4gICAgbGV0IGJldHRlclRhdTtcbiAgICAvLyBAbm90ZSAtIHRhdUVzdGltYXRlIGNhbm5vdCBiZSB6ZXJvIGFzIHRoZSBsb29wIHN0YXJ0IGF0IDEgaW4gc3RlcCA0XG4gICAgY29uc3QgeDAgPSB0YXVFc3RpbWF0ZSAtIDE7XG4gICAgY29uc3QgeDIgPSAodGF1RXN0aW1hdGUgPCBoYWxmQnVmZmVyU2l6ZSAtIDEpID8gdGF1RXN0aW1hdGUgKyAxIDogdGF1RXN0aW1hdGU7XG5cbiAgICAvLyBpZiBgdGF1RXN0aW1hdGVgIGlzIGxhc3QgaW5kZXgsIHdlIGNhbid0IGludGVycG9sYXRlXG4gICAgaWYgKHgyID09PSB0YXVFc3RpbWF0ZSkge1xuICAgICAgICBiZXR0ZXJUYXUgPSB0YXVFc3RpbWF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgczAgPSB5aW5CdWZmZXJbeDBdO1xuICAgICAgY29uc3QgczEgPSB5aW5CdWZmZXJbdGF1RXN0aW1hdGVdO1xuICAgICAgY29uc3QgczIgPSB5aW5CdWZmZXJbeDJdO1xuXG4gICAgICAvLyBAbm90ZSAtIGRvbid0IGZ1bGx5IHVuZGVyc3RhbmQgdGhpcyBmb3JtdWxhIG5laXRoZXIuLi5cbiAgICAgIGJldHRlclRhdSA9IHRhdUVzdGltYXRlICsgKHMyIC0gczApIC8gKDIgKiAoMiAqIHMxIC0gczIgLSBzMCkpO1xuICAgIH1cblxuICAgIHJldHVybiBiZXR0ZXJUYXU7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgWWluYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fEZsb2F0MzJBcnJheX0gaW5wdXQgLSBUaGUgc2lnbmFsIGZyYWdtZW50IHRvIHByb2Nlc3MuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIEFycmF5IGNvbnRhaW5pbmcgdGhlIGBmcmVxdWVuY3lgLCBgZW5lcmd5YCwgYHBlcmlvZGljaXR5YFxuICAgKiAgYW5kIGBBQzFgXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgeWluID0gbmV3IGxmby5vcGVyYXRvci5ZaW4oKTtcbiAgICogeWluLmluaXRTdHJlYW0oe1xuICAgKiAgIGZyYW1lU2l6ZTogMjA0OCxcbiAgICogICBmcmFtZVR5cGU6ICdzaWduYWwnLFxuICAgKiAgIHNvdXJjZVNhbXBsZVJhdGU6IDQ0MTAwXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zdCByZXN1bHRzID0geWluLmlucHV0U2lnbmFsKHNpZ25hbCk7XG4gICAqL1xuICBpbnB1dFNpZ25hbChpbnB1dCkge1xuICAgIHRoaXMucGl0Y2ggPSAtMTtcbiAgICB0aGlzLnByb2JhYmlsaXR5ID0gMDtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGNvbnN0IGlucHV0RnJhbWVTaXplID0gdGhpcy5pbnB1dEZyYW1lU2l6ZTtcbiAgICBjb25zdCBkb3duU2FtcGxpbmdFeHAgPSB0aGlzLmRvd25TYW1wbGluZ0V4cDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5kb3duU2FtcGxpbmdSYXRlO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgbGV0IHRhdUVzdGltYXRlID0gLTE7XG5cbiAgICAvLyBzdWJzYW1wbGluZ1xuICAgIHRoaXMuX2Rvd25zYW1wbGUoaW5wdXQsIGlucHV0RnJhbWVTaXplLCBidWZmZXIsIGRvd25TYW1wbGluZ0V4cCk7XG4gICAgLy8gc3RlcCAxLCAyLCAzIC0gbm9ybWFsaXplZCBzcXVhcmVkIGRpZmZlcmVuY2Ugb2YgdGhlIHNpZ25hbCB3aXRoIGFcbiAgICAvLyBzaGlmdGVkIHZlcnNpb24gb2YgaXRzZWxmXG4gICAgdGhpcy5fbm9ybWFsaXplZERpZmZlcmVuY2UoYnVmZmVyKTtcbiAgICAvLyBzdGVwIDQgLSBmaW5kIGZpcnN0IGJlc3QgdGF1IGVzdGltYXRlIHRoYXQgaXMgb3ZlciB0aGUgdGhyZXNob2xkXG4gICAgdGF1RXN0aW1hdGUgPSB0aGlzLl9hYnNvbHV0ZVRocmVzaG9sZCgpO1xuXG4gICAgaWYgKHRhdUVzdGltYXRlICE9PSAtMSkge1xuICAgICAgLy8gc3RlcCA1IC0gc28gZmFyIHRhdSBpcyBhbiBpbnRlZ2VyIHNoaWZ0IG9mIHRoZSBzaWduYWwsIGNoZWNrIGlmXG4gICAgICAvLyB0aGVyZSBpcyBhIGJldHRlciBmcmFjdGlvbm5hbCB2YWx1ZSBhcm91bmRcbiAgICAgIHRhdUVzdGltYXRlID0gdGhpcy5fcGFyYWJvbGljSW50ZXJwb2xhdGlvbih0YXVFc3RpbWF0ZSk7XG4gICAgICB0aGlzLnBpdGNoID0gc2FtcGxlUmF0ZSAvIHRhdUVzdGltYXRlO1xuICAgIH1cblxuICAgIG91dERhdGFbMF0gPSB0aGlzLnBpdGNoO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLnByb2JhYmlsaXR5O1xuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWluO1xuIl19