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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIllpbi5qcyJdLCJuYW1lcyI6WyJjZWlsIiwiTWF0aCIsImRlZmluaXRpb25zIiwidGhyZXNob2xkIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJkb3duU2FtcGxpbmdFeHAiLCJtaW4iLCJtYXgiLCJtaW5GcmVxIiwiWWluIiwib3B0aW9ucyIsInByb2JhYmlsaXR5IiwicGl0Y2giLCJ0ZXN0IiwiaW5wdXQiLCJzaXplIiwib3V0cHV0Iiwib3V0cHV0U2l6ZSIsImkiLCJqIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVNpemUiLCJkZXNjcmlwdGlvbiIsImlucHV0RnJhbWVTaXplIiwic291cmNlU2FtcGxlUmF0ZSIsInBhcmFtcyIsImdldCIsImRvd25GYWN0b3IiLCJkb3duU1IiLCJkb3duRnJhbWVTaXplIiwibWluRnJlcU5iclNhbXBsZXMiLCJoYWxmQnVmZmVyU2l6ZSIsIkVycm9yIiwiZG93blNhbXBsaW5nUmF0ZSIsImJ1ZmZlciIsIkZsb2F0MzJBcnJheSIsInlpbkJ1ZmZlciIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsInN1bSIsInRhdSIsInNxdWFyZWREaWZmZXJlbmNlIiwiZGVsdGEiLCJ0YXVFc3RpbWF0ZSIsImJldHRlclRhdSIsIngwIiwieDIiLCJzMCIsInMxIiwiczIiLCJzYW1wbGVSYXRlIiwib3V0RGF0YSIsImZyYW1lIiwiZGF0YSIsIl9kb3duc2FtcGxlIiwiX25vcm1hbGl6ZWREaWZmZXJlbmNlIiwiX2Fic29sdXRlVGhyZXNob2xkIiwiX3BhcmFib2xpY0ludGVycG9sYXRpb24iLCJpbnB1dFNpZ25hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsT0FBT0MsS0FBS0QsSUFBbEI7O0FBRUE7Ozs7OztBQU1BLElBQU1FLGNBQWM7QUFDbEJDLGFBQVc7QUFD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QXdCWSxjQUF4QixFQUF3Q1csTUFBeEMsRUFBZ0RoQyxlQUFoRDtBQUNBO0FBQ0E7QUFDQSxXQUFLb0QscUJBQUwsQ0FBMkJwQixNQUEzQjtBQUNBO0FBQ0FRLG9CQUFjLEtBQUthLGtCQUFMLEVBQWQ7O0FBRUEsVUFBSWIsZ0JBQWdCLENBQUMsQ0FBckIsRUFBd0I7QUFDdEI7QUFDQTtBQUNBQSxzQkFBYyxLQUFLYyx1QkFBTCxDQUE2QmQsV0FBN0IsQ0FBZDtBQUNBLGFBQUtqQyxLQUFMLEdBQWF3QyxhQUFhUCxXQUExQjtBQUNEOztBQUVEUSxjQUFRLENBQVIsSUFBYSxLQUFLekMsS0FBbEI7QUFDQXlDLGNBQVEsQ0FBUixJQUFhLEtBQUsxQyxXQUFsQjs7QUFFQSxhQUFPMEMsT0FBUDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsV0FBS00sV0FBTCxDQUFpQk4sTUFBTUMsSUFBdkI7QUFDRDs7Ozs7a0JBR1k5QyxHIiwiZmlsZSI6Illpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGNlaWwgPSBNYXRoLmNlaWw7XG5cbi8qKlxuICogcGFwZXI6IGh0dHA6Ly9yZWNoZXJjaGUuaXJjYW0uZnIvZXF1aXBlcy9wY20vY2hldmVpZ24vcHNzLzIwMDJfSkFTQV9ZSU4ucGRmXG4gKiBpbXBsZW1lbnRhdGlvbiBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXNob2tmZXJuYW5kZXovWWluLVBpdGNoLVRyYWNraW5nXG4gKiBAcHJpdmF0ZVxuICovXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICB0aHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMSwgLy8gZGVmYXVsdCBmcm9tIHBhcGVyXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgZG93blNhbXBsaW5nRXhwOiB7IC8vIGRvd25zYW1wbGluZyBmYWN0b3JcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMixcbiAgICBtaW46IDAsXG4gICAgbWF4OiAzLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1pbkZyZXE6IHsgLy9cbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDYwLCAvLyBtZWFuIDczNSBzYW1wbGVzXG4gICAgbWluOiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG59XG5cbi8qKlxuICogWWluIGZ1bmRhbWVudGFsIGZyZXF1ZW5jeSBlc3RpbWF0b3IsIGJhc2VkIG9uIGFsZ29yaXRobSBkZXNjcmliZWQgaW5cbiAqIFtZSU4sIGEgZnVuZGFtZW50YWwgZnJlcXVlbmN5IGVzdGltYXRvciBmb3Igc3BlZWNoIGFuZCBtdXNpY10oaHR0cDovL3JlY2hlcmNoZS5pcmNhbS5mci9lcXVpcGVzL3BjbS9jaGV2ZWlnbi9wc3MvMjAwMl9KQVNBX1lJTi5wZGYpXG4gKiBieSBDaGV2ZWlnbmUgYW5kIEthd2FoYXJhLlxuICogT24gZWFjaCBmcmFtZSwgdGhpcyBvcGVyYXRvciBwcm9wYWdhdGUgYSB2ZWN0b3IgY29udGFpbmluZyB0aGUgZm9sbG93aW5nXG4gKiB2YWx1ZXM6IGBmcmVxdWVuY3lgLCBgcHJvYmFiaWxpdHlgLlxuICpcbiAqIEZvciBnb29kIHJlc3VsdHMgdGhlIGlucHV0IGZyYW1lIHNpemUgc2hvdWxkIGJlIGxhcmdlICgxMDI0IG9yIDIwNDgpLlxuICpcbiAqIF9zdXBwb3J0IGBzdGFuZGFsb25lYCB1c2FnZV9cbiAqXG4gKiBAbm90ZSAtIEluIG5vZGUgZm9yIGEgZnJhbWUgb2YgMjA0OCBzYW1wbGVzLCBhdmVyYWdlIGNvbXB1dGF0aW9uIHRpbWUgaXM6XG4gKiAgICAgICAgIDAuMDAwMTY3NDIyODMzMzk5OTMzODkgc2Vjb25kLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPTAuMV0gLSBBYnNvbHV0ZSB0aHJlc2hvbGQgdG8gdGVzdCB0aGVcbiAqICBub3JtYWxpemVkIGRpZmZlcmVuY2UgKHNlZSBwYXBlciBmb3IgbW9yZSBpbmZvcm1hdGlvbnMpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmRvd25TYW1wbGluZ0V4cD0yXSAtIERvd24gc2FtcGxlIHRoZSBpbnB1dCBmcmFtZSBieVxuICogIGEgZmFjdG9yIG9mIDIgYXQgdGhlIHBvd2VyIG9mIGBkb3duU2FtcGxpbmdFeHBgIChtaW49MCBhbmQgbWF4PTMpIGZvclxuICogIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50cy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW5GcmVxPTYwXSAtIE1pbmltdW0gZnJlcXVlbmN5IHRoZSBvcGVyYXRvciBjYW5cbiAqICBzZWFyY2ggZm9yLiBUaGlzIHBhcmFtZXRlciBkZWZpbmVzIHRoZSBzaXplIG9mIHRoZSBhdXRvY29ycmVsYXRpb24gcGVyZm9ybWVkXG4gKiAgb24gdGhlIHNpZ25hbCwgdGhlIGlucHV0IGZyYW1lIHNpemUgc2hvdWxkIGJlIGFyb3VuZCAyIHRpbWUgdGhpcyBzaXplIGZvclxuICogIGdvb2QgcmVzdWx0cyAoaS5lLiBgaW5wdXRGcmFtZVNpemUg4omIIDIgKiAoc2FtcGxpbmdSYXRlIC8gbWluRnJlcSlgKS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIHNvbWUgQXVkaW9CdWZmZXJcbiAqIGNvbnN0IHNvdXJjZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYXVkaW9CdWZmZXIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogMjA0OCxcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHlpbiA9IG5ldyBsZm8ub3BlcmF0b3IuWWluKCk7XG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgbGZvLnNpbmsuTG9nZ2VyKHsgZGF0YTogdHJ1ZSB9KTtcbiAqXG4gKiBzb3VyY2UuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QoeWluKTtcbiAqIHlpbi5jb25uZWN0KGxvZ2dlcik7XG4gKlxuICogc291cmNlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIFlpbiBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wcm9iYWJpbGl0eSA9IDA7XG4gICAgdGhpcy5waXRjaCA9IC0xO1xuXG4gICAgdGhpcy50ZXN0ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZG93bnNhbXBsZShpbnB1dCwgc2l6ZSwgb3V0cHV0LCBkb3duU2FtcGxpbmdFeHApIHtcbiAgICBjb25zdCBvdXRwdXRTaXplID0gc2l6ZSA+PiBkb3duU2FtcGxpbmdFeHA7XG4gICAgbGV0IGksIGo7XG5cbiAgICBzd2l0Y2ggKGRvd25TYW1wbGluZ0V4cCkge1xuICAgICAgY2FzZSAwOiAvLyBubyBkb3duIHNhbXBsaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgICAgb3V0cHV0W2ldID0gaW5wdXRbaV07XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDIpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC41ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdKTtcblxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA0KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IG91dHB1dFNpemU7IGkrKywgaiArPSA4KVxuICAgICAgICAgIG91dHB1dFtpXSA9IDAuMTI1ICogKGlucHV0W2pdICsgaW5wdXRbaiArIDFdICsgaW5wdXRbaiArIDJdICsgaW5wdXRbaiArIDNdICsgaW5wdXRbaiArIDRdICsgaW5wdXRbaiArIDVdICsgaW5wdXRbaiArIDZdICsgaW5wdXRbaiArIDddKTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0U2l6ZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSAyO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gWydmcmVxdWVuY3knLCAnY29uZmlkZW5jZSddO1xuXG4gICAgdGhpcy5pbnB1dEZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIC8vIGhhbmRsZSBwYXJhbXNcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBkb3duU2FtcGxpbmdFeHAgPSB0aGlzLnBhcmFtcy5nZXQoJ2Rvd25TYW1wbGluZ0V4cCcpO1xuICAgIGNvbnN0IGRvd25GYWN0b3IgPSAxIDw8IGRvd25TYW1wbGluZ0V4cDsgLy8gMl5uXG4gICAgY29uc3QgZG93blNSID0gc291cmNlU2FtcGxlUmF0ZSAvIGRvd25GYWN0b3I7XG4gICAgY29uc3QgZG93bkZyYW1lU2l6ZSA9IHRoaXMuaW5wdXRGcmFtZVNpemUgLyBkb3duRmFjdG9yOyAvLyBuX3RpY2tfZG93biAvLyAxIC8gMl5uXG5cbiAgICBjb25zdCBtaW5GcmVxID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5GcmVxJyk7XG4gICAgLy8gbGltaXQgbWluIGZyZXEsIGNmLiBwYXBlciBJVi4gc2Vuc2l0aXZpdHkgdG8gcGFyYW1ldGVyc1xuICAgIGNvbnN0IG1pbkZyZXFOYnJTYW1wbGVzID0gZG93blNSIC8gbWluRnJlcTtcbiAgICAvLyBjb25zdCBidWZmZXJTaXplID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgdGhpcy5oYWxmQnVmZmVyU2l6ZSA9IGRvd25GcmFtZVNpemUgLyAyO1xuXG4gICAgLy8gbWluaW11bSBlcnJvciB0byBub3QgY3Jhc2ggYnV0IG5vdCBlbm91Z2h0IHRvIGhhdmUgcmVzdWx0c1xuICAgIGlmIChtaW5GcmVxTmJyU2FtcGxlcyA+IHRoaXMuaGFsZkJ1ZmZlclNpemUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgZnJhbWUgc2l6ZSwgdG9vIHNtYWxsIGZvciBnaXZlbiBcIm1pbkZyZXFcIicpO1xuXG4gICAgdGhpcy5kb3duU2FtcGxpbmdFeHAgPSBkb3duU2FtcGxpbmdFeHA7XG4gICAgdGhpcy5kb3duU2FtcGxpbmdSYXRlID0gZG93blNSO1xuICAgIHRoaXMuZG93bkZyYW1lU2l6ZSA9IGRvd25GcmFtZVNpemU7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGRvd25GcmFtZVNpemUpO1xuICAgIC8vIGF1dG9jb3JyZWxhdGlvbiBidWZmZXJcbiAgICB0aGlzLnlpbkJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5oYWxmQnVmZmVyU2l6ZSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9kb3duc2FtcGxlKGlucHV0LCBzaXplLCBvdXRwdXQsIGRvd25TYW1wbGluZ0V4cCkge1xuICAgIGNvbnN0IG91dHB1dFNpemUgPSBzaXplID4+IGRvd25TYW1wbGluZ0V4cDtcbiAgICBsZXQgaSwgajtcblxuICAgIHN3aXRjaCAoZG93blNhbXBsaW5nRXhwKSB7XG4gICAgICBjYXNlIDA6IC8vIG5vIGRvd24gc2FtcGxpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNpemU7IGkrKylcbiAgICAgICAgICBvdXRwdXRbaV0gPSBpbnB1dFtpXTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBvdXRwdXRTaXplOyBpKyssIGogKz0gMilcbiAgICAgICAgICBvdXRwdXRbaV0gPSAwLjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0pO1xuXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDQpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4yNSAqIChpbnB1dFtqXSArIGlucHV0W2ogKyAxXSArIGlucHV0W2ogKyAyXSArIGlucHV0W2ogKyAzXSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGZvciAoaSA9IDAsIGogPSAwOyBpIDwgb3V0cHV0U2l6ZTsgaSsrLCBqICs9IDgpXG4gICAgICAgICAgb3V0cHV0W2ldID0gMC4xMjUgKiAoaW5wdXRbal0gKyBpbnB1dFtqICsgMV0gKyBpbnB1dFtqICsgMl0gKyBpbnB1dFtqICsgM10gKyBpbnB1dFtqICsgNF0gKyBpbnB1dFtqICsgNV0gKyBpbnB1dFtqICsgNl0gKyBpbnB1dFtqICsgN10pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRwdXRTaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0ZXAgMSwgMiBhbmQgMyAtIFNxdWFyZWQgZGlmZmVyZW5jZSBvZiB0aGUgc2hpZnRlZCBzaWduYWwgd2l0aCBpdHNlbGYuXG4gICAqIGN1bXVsYXRpdmUgbWVhbiBub3JtYWxpemVkIGRpZmZlcmVuY2UuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbm9ybWFsaXplZERpZmZlcmVuY2UoYnVmZmVyKSB7XG4gICAgY29uc3QgaGFsZkJ1ZmZlclNpemUgPSB0aGlzLmhhbGZCdWZmZXJTaXplO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGxldCBzdW0gPSAwO1xuXG4gICAgLy8gZGlmZmVyZW5jZSBmb3IgZGlmZmVyZW50IHNoaWZ0IHZhbHVlcyAodGF1KVxuICAgIGZvciAobGV0IHRhdSA9IDA7IHRhdSA8IGhhbGZCdWZmZXJTaXplOyB0YXUrKykge1xuICAgICAgbGV0IHNxdWFyZWREaWZmZXJlbmNlID0gMDsgLy8gcmVzZXQgYnVmZmVyXG5cbiAgICAgIC8vIHRha2UgZGlmZmVyZW5jZSBvZiB0aGUgc2lnbmFsIHdpdGggYSBzaGlmdGVkIHZlcnNpb24gb2YgaXRzZWxmIHRoZW5cbiAgICAgIC8vIHNxYXVyZSB0aGUgcmVzdWx0XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhbGZCdWZmZXJTaXplOyBpKyspIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBidWZmZXJbaV0gLSBidWZmZXJbaSArIHRhdV07XG4gICAgICAgIHNxdWFyZWREaWZmZXJlbmNlICs9IGRlbHRhICogZGVsdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIHN0ZXAgMyAtIG5vcm1hbGl6ZSB5aW5CdWZmZXJcbiAgICAgIGlmICh0YXUgPiAwKSB7XG4gICAgICAgIHN1bSArPSBzcXVhcmVkRGlmZmVyZW5jZTtcbiAgICAgICAgeWluQnVmZmVyW3RhdV0gPSBzcXVhcmVkRGlmZmVyZW5jZSAqICh0YXUgLyBzdW0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHlpbkJ1ZmZlclswXSA9IDE7XG4gIH1cblxuICAvKipcbiAgICogU3RlcCA0IC0gZmluZCBmaXJzdCBiZXN0IHRhdSB0aGF0IGlzIHVuZGVyIHRoZSB0aHJlc29sZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hYnNvbHV0ZVRocmVzaG9sZCgpIHtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IHlpbkJ1ZmZlciA9IHRoaXMueWluQnVmZmVyO1xuICAgIGNvbnN0IGhhbGZCdWZmZXJTaXplID0gdGhpcy5oYWxmQnVmZmVyU2l6ZTtcbiAgICBsZXQgdGF1O1xuXG4gICAgZm9yICh0YXUgPSAxOyB0YXUgPCBoYWxmQnVmZmVyU2l6ZTsgdGF1KyspIHtcbiAgICAgIGlmICh5aW5CdWZmZXJbdGF1XSA8IHRocmVzaG9sZCkge1xuICAgICAgICAvLyBrZWVwIGluY3JlYXNpbmcgdGF1IGlmIG5leHQgdmFsdWUgaXMgYmV0dGVyXG4gICAgICAgIHdoaWxlICh0YXUgKyAxIDwgaGFsZkJ1ZmZlclNpemUgJiYgeWluQnVmZmVyW3RhdSArIDFdIDwgeWluQnVmZmVyW3RhdV0pXG4gICAgICAgICAgdGF1ICs9IDE7XG5cbiAgICAgICAgLy8gYmVzdCB0YXUgZm91bmQgLCB5aW5CdWZmZXJbdGF1XSBjYW4gYmUgc2VlbiBhcyBhbiBlc3RpbWF0aW9uIG9mXG4gICAgICAgIC8vIGFwZXJpb2RpY2l0eSB0aGVuOiBwZXJpb2RpY2l0eSA9IDEgLSBhcGVyaW9kaWNpdHlcbiAgICAgICAgdGhpcy5wcm9iYWJpbGl0eSA9IDEgLSB5aW5CdWZmZXJbdGF1XTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIC0xIGlmIG5vdCBtYXRjaCBmb3VuZFxuICAgIHJldHVybiAodGF1ID09PSBoYWxmQnVmZmVyU2l6ZSkgPyAtMSA6IHRhdTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGVwIDUgLSBGaW5kIGEgYmV0dGVyIGZyYWN0aW9ubmFsIGFwcHJveGltYXRlIG9mIHRhdS5cbiAgICogdGhpcyBjYW4gcHJvYmFibHkgYmUgc2ltcGxpZmllZC4uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BhcmFib2xpY0ludGVycG9sYXRpb24odGF1RXN0aW1hdGUpIHtcbiAgICBjb25zdCBoYWxmQnVmZmVyU2l6ZSA9IHRoaXMuaGFsZkJ1ZmZlclNpemU7XG4gICAgY29uc3QgeWluQnVmZmVyID0gdGhpcy55aW5CdWZmZXI7XG4gICAgbGV0IGJldHRlclRhdTtcbiAgICAvLyBAbm90ZSAtIHRhdUVzdGltYXRlIGNhbm5vdCBiZSB6ZXJvIGFzIHRoZSBsb29wIHN0YXJ0IGF0IDEgaW4gc3RlcCA0XG4gICAgY29uc3QgeDAgPSB0YXVFc3RpbWF0ZSAtIDE7XG4gICAgY29uc3QgeDIgPSAodGF1RXN0aW1hdGUgPCBoYWxmQnVmZmVyU2l6ZSAtIDEpID8gdGF1RXN0aW1hdGUgKyAxIDogdGF1RXN0aW1hdGU7XG5cbiAgICAvLyBpZiBgdGF1RXN0aW1hdGVgIGlzIGxhc3QgaW5kZXgsIHdlIGNhbid0IGludGVycG9sYXRlXG4gICAgaWYgKHgyID09PSB0YXVFc3RpbWF0ZSkge1xuICAgICAgICBiZXR0ZXJUYXUgPSB0YXVFc3RpbWF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgczAgPSB5aW5CdWZmZXJbeDBdO1xuICAgICAgY29uc3QgczEgPSB5aW5CdWZmZXJbdGF1RXN0aW1hdGVdO1xuICAgICAgY29uc3QgczIgPSB5aW5CdWZmZXJbeDJdO1xuXG4gICAgICAvLyBAbm90ZSAtIGRvbid0IGZ1bGx5IHVuZGVyc3RhbmQgdGhpcyBmb3JtdWxhIG5laXRoZXIuLi5cbiAgICAgIGJldHRlclRhdSA9IHRhdUVzdGltYXRlICsgKHMyIC0gczApIC8gKDIgKiAoMiAqIHMxIC0gczIgLSBzMCkpO1xuICAgIH1cblxuICAgIHJldHVybiBiZXR0ZXJUYXU7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgWWluYCBvcGVyYXRvciBpbiBgc3RhbmRhbG9uZWAgbW9kZSAoaS5lLiBvdXRzaWRlIG9mIGEgZ3JhcGgpLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fEZsb2F0MzJBcnJheX0gaW5wdXQgLSBUaGUgc2lnbmFsIGZyYWdtZW50IHRvIHByb2Nlc3MuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIEFycmF5IGNvbnRhaW5pbmcgdGhlIGBmcmVxdWVuY3lgLCBgZW5lcmd5YCwgYHBlcmlvZGljaXR5YFxuICAgKiAgYW5kIGBBQzFgXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAgICpcbiAgICogY29uc3QgeWluID0gbmV3IGxmby5vcGVyYXRvci5ZaW4oKTtcbiAgICogeWluLmluaXRTdHJlYW0oe1xuICAgKiAgIGZyYW1lU2l6ZTogMjA0OCxcbiAgICogICBmcmFtZVR5cGU6ICdzaWduYWwnLFxuICAgKiAgIHNvdXJjZVNhbXBsZVJhdGU6IDQ0MTAwXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zdCByZXN1bHRzID0geWluLmlucHV0U2lnbmFsKHNpZ25hbCk7XG4gICAqL1xuICBpbnB1dFNpZ25hbChpbnB1dCkge1xuICAgIHRoaXMucGl0Y2ggPSAtMTtcbiAgICB0aGlzLnByb2JhYmlsaXR5ID0gMDtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGNvbnN0IGlucHV0RnJhbWVTaXplID0gdGhpcy5pbnB1dEZyYW1lU2l6ZTtcbiAgICBjb25zdCBkb3duU2FtcGxpbmdFeHAgPSB0aGlzLmRvd25TYW1wbGluZ0V4cDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5kb3duU2FtcGxpbmdSYXRlO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgbGV0IHRhdUVzdGltYXRlID0gLTE7XG5cbiAgICAvLyBzdWJzYW1wbGluZ1xuICAgIHRoaXMuX2Rvd25zYW1wbGUoaW5wdXQsIGlucHV0RnJhbWVTaXplLCBidWZmZXIsIGRvd25TYW1wbGluZ0V4cCk7XG4gICAgLy8gc3RlcCAxLCAyLCAzIC0gbm9ybWFsaXplZCBzcXVhcmVkIGRpZmZlcmVuY2Ugb2YgdGhlIHNpZ25hbCB3aXRoIGFcbiAgICAvLyBzaGlmdGVkIHZlcnNpb24gb2YgaXRzZWxmXG4gICAgdGhpcy5fbm9ybWFsaXplZERpZmZlcmVuY2UoYnVmZmVyKTtcbiAgICAvLyBzdGVwIDQgLSBmaW5kIGZpcnN0IGJlc3QgdGF1IGVzdGltYXRlIHRoYXQgaXMgb3ZlciB0aGUgdGhyZXNob2xkXG4gICAgdGF1RXN0aW1hdGUgPSB0aGlzLl9hYnNvbHV0ZVRocmVzaG9sZCgpO1xuXG4gICAgaWYgKHRhdUVzdGltYXRlICE9PSAtMSkge1xuICAgICAgLy8gc3RlcCA1IC0gc28gZmFyIHRhdSBpcyBhbiBpbnRlZ2VyIHNoaWZ0IG9mIHRoZSBzaWduYWwsIGNoZWNrIGlmXG4gICAgICAvLyB0aGVyZSBpcyBhIGJldHRlciBmcmFjdGlvbm5hbCB2YWx1ZSBhcm91bmRcbiAgICAgIHRhdUVzdGltYXRlID0gdGhpcy5fcGFyYWJvbGljSW50ZXJwb2xhdGlvbih0YXVFc3RpbWF0ZSk7XG4gICAgICB0aGlzLnBpdGNoID0gc2FtcGxlUmF0ZSAvIHRhdUVzdGltYXRlO1xuICAgIH1cblxuICAgIG91dERhdGFbMF0gPSB0aGlzLnBpdGNoO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLnByb2JhYmlsaXR5O1xuXG4gICAgcmV0dXJuIG91dERhdGE7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWluO1xuIl19