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

var _Fft = require('./Fft');

var _Fft2 = _interopRequireDefault(_Fft);

var _Mel = require('./Mel');

var _Mel2 = _interopRequireDefault(_Mel);

var _Dct = require('./Dct');

var _Dct2 = _interopRequireDefault(_Dct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  nbrBands: {
    type: 'integer',
    default: 24,
    meta: { kind: 'static' }
  },
  nbrCoefs: {
    type: 'integer',
    default: 12,
    meta: { kind: 'static' }
  },
  minFreq: {
    type: 'float',
    default: 0,
    meta: { kind: 'static' }
  },
  maxFreq: {
    type: 'float',
    default: null,
    nullable: true,
    meta: { kind: 'static' }
  }
};

/**
 * Compute the Mfcc of the incomming `signal`. Is basically a wrapper around
 * [`Fft`]{@link module:common.operator.Fft}, [`Mel`]{@link module:common.operator.Mel}
 * and [`Dct`]{@link module:common.operator.Dct}.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {nbrBands} [options.nbrBands=24] - Number of Mel bands.
 * @param {nbrCoefs} [options.nbrCoefs=12] - Number of output coefs.
 *
 * @see {@link module:common.operator.Fft}
 * @see {@link module:common.operator.Mel}
 * @see {@link module:common.operator.Dct}
 *
 * @example
 * import lfo from 'waves-lfo/node'
 *
 * const audioInFile = new lfo.source.AudioInFile({
 *   filename: 'path/to/file',
 *   frameSize: 512,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 * });
 *
 * const mfcc = new lfo.operator.Mfcc({
 *   nbrBands: 24,
 *   nbrCoefs: 12,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInFile.connect(slicer);
 * slicer.connect(mfcc);
 * mfcc.connect(logger);
 *
 * audioInFile.start();
 */

var Mfcc = function (_BaseLfo) {
  (0, _inherits3.default)(Mfcc, _BaseLfo);

  function Mfcc(options) {
    (0, _classCallCheck3.default)(this, Mfcc);
    return (0, _possibleConstructorReturn3.default)(this, (Mfcc.__proto__ || (0, _getPrototypeOf2.default)(Mfcc)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Mfcc, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var nbrBands = this.params.get('nbrBands');
      var nbrCoefs = this.params.get('nbrCoefs');
      var minFreq = this.params.get('minFreq');
      var maxFreq = this.params.get('maxFreq');
      var inputFrameSize = prevStreamParams.frameSize;
      var inputFrameRate = prevStreamParams.frameRate;
      var inputSampleRate = prevStreamParams.sourceSampleRate;
      var nbrBins = inputFrameSize / 2 + 1;

      this.streamParams.frameSize = nbrCoefs;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];

      this.fft = new _Fft2.default({
        window: 'hann',
        mode: 'power',
        norm: 'power',
        size: inputFrameSize
      });

      this.mel = new _Mel2.default({
        nbrBands: nbrBands,
        log: true,
        power: 1,
        minFreq: minFreq,
        maxFreq: maxFreq
      });

      this.dct = new _Dct2.default({
        order: nbrCoefs
      });

      // init streams
      this.fft.initStream({
        frameType: 'signal',
        frameSize: inputFrameSize,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.mel.initStream({
        frameType: 'vector',
        frameSize: nbrBins,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.dct.initStream({
        frameType: 'vector',
        frameSize: nbrBands,
        frameRate: inputFrameRate,
        sourceSampleRate: inputSampleRate
      });

      this.propagateStreamParams();
    }

    /**
     * Use the `Mfcc` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} data - Signal chunk to analyse.
     * @return {Array} - Mfcc coefficients.
     *
     * @example
     * const mfcc = new lfo.operator.Mfcc();
     * // mandatory for use in standalone mode
     * mfcc.initStream({ frameSize: 256, frameType: 'vector' });
     * mfcc.inputSignal(signal);
     */

  }, {
    key: 'inputSignal',
    value: function inputSignal(data) {
      var output = this.frame.data;
      var nbrCoefs = this.params.get('nbrCoefs');

      var bins = this.fft.inputSignal(data);
      var melBands = this.mel.inputVector(bins);
      // console.log(melBands);
      var coefs = this.dct.inputSignal(melBands);

      for (var i = 0; i < nbrCoefs; i++) {
        output[i] = coefs[i];
      }return output;
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      this.inputSignal(frame.data);
    }
  }]);
  return Mfcc;
}(_BaseLfo3.default);

exports.default = Mfcc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1mY2MuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJuYnJCYW5kcyIsInR5cGUiLCJkZWZhdWx0IiwibWV0YSIsImtpbmQiLCJuYnJDb2VmcyIsIm1pbkZyZXEiLCJtYXhGcmVxIiwibnVsbGFibGUiLCJNZmNjIiwib3B0aW9ucyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwicGFyYW1zIiwiZ2V0IiwiaW5wdXRGcmFtZVNpemUiLCJmcmFtZVNpemUiLCJpbnB1dEZyYW1lUmF0ZSIsImZyYW1lUmF0ZSIsImlucHV0U2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZVJhdGUiLCJuYnJCaW5zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwiZGVzY3JpcHRpb24iLCJmZnQiLCJ3aW5kb3ciLCJtb2RlIiwibm9ybSIsInNpemUiLCJtZWwiLCJsb2ciLCJwb3dlciIsImRjdCIsIm9yZGVyIiwiaW5pdFN0cmVhbSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImRhdGEiLCJvdXRwdXQiLCJmcmFtZSIsImJpbnMiLCJpbnB1dFNpZ25hbCIsIm1lbEJhbmRzIiwiaW5wdXRWZWN0b3IiLCJjb2VmcyIsImkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFlBQVU7QUFDUkMsVUFBTSxTQURFO0FBRVJDLGFBQVMsRUFGRDtBQUdSQyxVQUFNLEVBQUVDLE1BQU0sUUFBUjtBQUhFLEdBRFE7QUFNbEJDLFlBQVU7QUFDUkosVUFBTSxTQURFO0FBRVJDLGFBQVMsRUFGRDtBQUdSQyxVQUFNLEVBQUVDLE1BQU0sUUFBUjtBQUhFLEdBTlE7QUFXbEJFLFdBQVM7QUFDUEwsVUFBTSxPQURDO0FBRVBDLGFBQVMsQ0FGRjtBQUdQQyxVQUFNLEVBQUVDLE1BQU0sUUFBUjtBQUhDLEdBWFM7QUFnQmxCRyxXQUFTO0FBQ1BO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QyxHQUE5QjtBQUNFUCxlQUFPTyxDQUFQLElBQVlELE1BQU1DLENBQU4sQ0FBWjtBQURGLE9BR0EsT0FBT1AsTUFBUDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsV0FBS0UsV0FBTCxDQUFpQkYsTUFBTUYsSUFBdkI7QUFDRDs7Ozs7a0JBR1k1QixJIiwiZmlsZSI6Ik1mY2MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IEZmdCBmcm9tICcuL0ZmdCc7XG5pbXBvcnQgTWVsIGZyb20gJy4vTWVsJztcbmltcG9ydCBEY3QgZnJvbSAnLi9EY3QnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBuYnJCYW5kczoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyNCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG5ickNvZWZzOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEyLFxuICAgIG1ldGE6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgbWluRnJlcToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtZXRhOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1heEZyZXE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YTogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgTWZjYyBvZiB0aGUgaW5jb21taW5nIGBzaWduYWxgLiBJcyBiYXNpY2FsbHkgYSB3cmFwcGVyIGFyb3VuZFxuICogW2BGZnRgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH0sIFtgTWVsYF17QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5NZWx9XG4gKiBhbmQgW2BEY3RgXXtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkRjdH0uXG4gKlxuICogX3N1cHBvcnQgYHN0YW5kYWxvbmVgIHVzYWdlX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge25ickJhbmRzfSBbb3B0aW9ucy5uYnJCYW5kcz0yNF0gLSBOdW1iZXIgb2YgTWVsIGJhbmRzLlxuICogQHBhcmFtIHtuYnJDb2Vmc30gW29wdGlvbnMubmJyQ29lZnM9MTJdIC0gTnVtYmVyIG9mIG91dHB1dCBjb2Vmcy5cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLm9wZXJhdG9yLkZmdH1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24ub3BlcmF0b3IuTWVsfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5vcGVyYXRvci5EY3R9XG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnXG4gKlxuICogY29uc3QgYXVkaW9JbkZpbGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiAncGF0aC90by9maWxlJyxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzbGljZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlNsaWNlcih7XG4gKiAgIGZyYW1lU2l6ZTogMjU2LFxuICogfSk7XG4gKlxuICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYyh7XG4gKiAgIG5ickJhbmRzOiAyNCxcbiAqICAgbmJyQ29lZnM6IDEyLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QobWZjYyk7XG4gKiBtZmNjLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luRmlsZS5zdGFydCgpO1xuICovXG5jbGFzcyBNZmNjIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbmJyQmFuZHMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickJhbmRzJyk7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG4gICAgY29uc3QgbWluRnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWluRnJlcScpO1xuICAgIGNvbnN0IG1heEZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21heEZyZXEnKTtcbiAgICBjb25zdCBpbnB1dEZyYW1lU2l6ZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGlucHV0RnJhbWVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgY29uc3QgaW5wdXRTYW1wbGVSYXRlID0gcHJldlN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IG5ickJpbnMgPSBpbnB1dEZyYW1lU2l6ZSAvIDIgKyAxO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gbmJyQ29lZnM7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIHRoaXMuZmZ0ID0gbmV3IEZmdCh7XG4gICAgICB3aW5kb3c6ICdoYW5uJyxcbiAgICAgIG1vZGU6ICdwb3dlcicsXG4gICAgICBub3JtOiAncG93ZXInLFxuICAgICAgc2l6ZTogaW5wdXRGcmFtZVNpemUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbCA9IG5ldyBNZWwoe1xuICAgICAgbmJyQmFuZHM6IG5ickJhbmRzLFxuICAgICAgbG9nOiB0cnVlLFxuICAgICAgcG93ZXI6IDEsXG4gICAgICBtaW5GcmVxOiBtaW5GcmVxLFxuICAgICAgbWF4RnJlcTogbWF4RnJlcSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGN0ID0gbmV3IERjdCh7XG4gICAgICBvcmRlcjogbmJyQ29lZnMsXG4gICAgfSk7XG5cbiAgICAvLyBpbml0IHN0cmVhbXNcbiAgICB0aGlzLmZmdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3NpZ25hbCcsXG4gICAgICBmcmFtZVNpemU6IGlucHV0RnJhbWVTaXplLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMubWVsLmluaXRTdHJlYW0oe1xuICAgICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAgICAgIGZyYW1lU2l6ZTogbmJyQmlucyxcbiAgICAgIGZyYW1lUmF0ZTogaW5wdXRGcmFtZVJhdGUsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiBpbnB1dFNhbXBsZVJhdGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRjdC5pbml0U3RyZWFtKHtcbiAgICAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gICAgICBmcmFtZVNpemU6IG5ickJhbmRzLFxuICAgICAgZnJhbWVSYXRlOiBpbnB1dEZyYW1lUmF0ZSxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IGlucHV0U2FtcGxlUmF0ZSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBgTWZjY2Agb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFNpZ25hbCBjaHVuayB0byBhbmFseXNlLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBNZmNjIGNvZWZmaWNpZW50cy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgbWZjYyA9IG5ldyBsZm8ub3BlcmF0b3IuTWZjYygpO1xuICAgKiAvLyBtYW5kYXRvcnkgZm9yIHVzZSBpbiBzdGFuZGFsb25lIG1vZGVcbiAgICogbWZjYy5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gICAqIG1mY2MuaW5wdXRTaWduYWwoc2lnbmFsKTtcbiAgICovXG4gIGlucHV0U2lnbmFsKGRhdGEpIHtcbiAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbmJyQ29lZnMgPSB0aGlzLnBhcmFtcy5nZXQoJ25ickNvZWZzJyk7XG5cbiAgICBjb25zdCBiaW5zID0gdGhpcy5mZnQuaW5wdXRTaWduYWwoZGF0YSk7XG4gICAgY29uc3QgbWVsQmFuZHMgPSB0aGlzLm1lbC5pbnB1dFZlY3RvcihiaW5zKTtcbiAgICAvLyBjb25zb2xlLmxvZyhtZWxCYW5kcyk7XG4gICAgY29uc3QgY29lZnMgPSB0aGlzLmRjdC5pbnB1dFNpZ25hbChtZWxCYW5kcyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickNvZWZzOyBpKyspXG4gICAgICBvdXRwdXRbaV0gPSBjb2Vmc1tpXTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIHRoaXMuaW5wdXRTaWduYWwoZnJhbWUuZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWZjYztcbiJdfQ==