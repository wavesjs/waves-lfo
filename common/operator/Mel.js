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

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _BaseLfo2 = require('../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var min = Math.min;
var max = Math.max;
var pow = Math.pow;
var log10 = _log2.default;

function hertzToMelHtk(freqHz) {
  return 2595 * (0, _log2.default)(1 + freqHz / 700);
}

function melToHertzHtk(freqMel) {
  return 700 * (Math.pow(10, freqMel / 2595) - 1);
}

/**
 * Returns a description of the weights to apply on the fft bins for each
 * Mel band filter.
 * @note - adapted from imtr-tools/rta
 *
 * @param {Number} nbrBins - Number of fft bins.
 * @param {Number} nbrFilter - Number of mel filters.
 * @param {Number} sampleRate - Sample Rate of the signal.
 * @param {Number} minFreq - Minimum Frequency to be considerered.
 * @param {Number} maxFreq - Maximum frequency to consider.
 * @return {Array<Object>} - Description of the weights to apply on the bins for
 *  each mel filter. Each description has the following structure:
 *  { startIndex: binIndex, centerFreq: binCenterFrequency, weights: [] }
 *
 * @private
 */
function getMelBandWeights(nbrBins, nbrBands, sampleRate, minFreq, maxFreq) {
  var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'htk';


  var hertzToMel = null;
  var melToHertz = null;
  var minMel = void 0;
  var maxMel = void 0;

  if (type === 'htk') {
    hertzToMel = hertzToMelHtk;
    melToHertz = melToHertzHtk;
    minMel = hertzToMel(minFreq);
    maxMel = hertzToMel(maxFreq);
  } else {
    throw new Error('Invalid mel band type: "' + type + '"');
  }

  var melBandDescriptions = new Array(nbrBands);
  // center frequencies of FFT bins
  var fftFreqs = new Float32Array(nbrBins);
  // center frequencies of mel bands - uniformly spaced in mel domain between
  // limits, there are 2 more frequencies than the actual number of filters in
  // order to calculate the slopes
  var filterFreqs = new Float32Array(nbrBands + 2);

  var fftSize = (nbrBins - 1) * 2;
  // compute bins center frequencies
  for (var i = 0; i < nbrBins; i++) {
    fftFreqs[i] = sampleRate * i / fftSize;
  }for (var _i = 0; _i < nbrBands + 2; _i++) {
    filterFreqs[_i] = melToHertz(minMel + _i / (nbrBands + 1) * (maxMel - minMel));
  } // loop throught filters
  for (var _i2 = 0; _i2 < nbrBands; _i2++) {
    var minWeightIndexDefined = 0;

    var description = {
      startIndex: null,
      centerFreq: null,
      weights: []
    };

    // define contribution of each bin for the filter at index (i + 1)
    // do not process the last spectrum component (Nyquist)
    for (var j = 0; j < nbrBins - 1; j++) {
      var posSlopeContrib = (fftFreqs[j] - filterFreqs[_i2]) / (filterFreqs[_i2 + 1] - filterFreqs[_i2]);

      var negSlopeContrib = (filterFreqs[_i2 + 2] - fftFreqs[j]) / (filterFreqs[_i2 + 2] - filterFreqs[_i2 + 1]);
      // lowerSlope and upper slope intersect at zero and with each other
      var contribution = max(0, min(posSlopeContrib, negSlopeContrib));

      if (contribution > 0) {
        if (description.startIndex === null) {
          description.startIndex = j;
          description.centerFreq = filterFreqs[_i2 + 1];
        }

        description.weights.push(contribution);
      }
    }

    // empty filter
    if (description.startIndex === null) {
      description.startIndex = 0;
      description.centerFreq = 0;
    }

    // @todo - do some scaling for Slaney-style mel
    melBandDescriptions[_i2] = description;
  }

  return melBandDescriptions;
}

var definitions = {
  log: {
    type: 'boolean',
    default: false,
    metas: { kind: 'static' }
  },
  nbrBands: {
    type: 'integer',
    default: 24,
    metas: { kind: 'static' }
  },
  minFreq: {
    type: 'float',
    default: 0,
    metas: { kind: 'static' }
  },
  maxFreq: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  power: {
    type: 'integer',
    default: 1,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Compute the mel bands spectrum from a given spectrum (`vector` type).
 * _Implement the `htk` mel band style._
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.log=false] - Apply a logarithmic scale on the output.
 * @param {Number} [options.nbrBands=24] - Number of filters defining the mel
 *  bands.
 * @param {Number} [options.minFreq=0] - Minimum frequency to consider.
 * @param {Number} [options.maxFreq=null] - Maximum frequency to consider.
 *  If `null`, is set to Nyquist frequency.
 * @param {Number} [options.power=1] - Apply a power scaling on each mel band.
 *
 * @todo - implement Slaney style mel bands
 *
 * @example
 * import lfo from 'waves-lfo/node'
 *
 * // read a file from path (node only source)
 * const audioInFile = new lfo.source.AudioInFile({
 *   filename: 'path/to/file',
 *   frameSize: 512,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 256,
 *   hopSize: 256,
 * });
 *
 * const fft = new lfo.operator.FFT({
 *   size: 1024,
 *   window: 'hann',
 *   mode: 'power',
 *   norm: 'power',
 * });
 *
 * const mel = new lfo.operator.Mel({
 *   log: true,
 *   nbrBands: 24,
 * });
 *
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInFile.connect(slicer);
 * slicer.connect(fft);
 * fft.connect(mel);
 * mel.connect(logger);
 *
 * audioInFile.start();
 */

var Mel = function (_BaseLfo) {
  (0, _inherits3.default)(Mel, _BaseLfo);

  function Mel() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Mel);
    return (0, _possibleConstructorReturn3.default)(this, (Mel.__proto__ || (0, _getPrototypeOf2.default)(Mel)).call(this, definitions, options));
  }

  /** @private */


  (0, _createClass3.default)(Mel, [{
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var nbrBins = prevStreamParams.frameSize;
      var nbrBands = this.params.get('nbrBands');
      var sampleRate = this.streamParams.sourceSampleRate;
      var minFreq = this.params.get('minFreq');
      var maxFreq = this.params.get('maxFreq');

      //
      this.streamParams.frameSize = nbrBands;
      this.streamParams.frameType = 'vector';
      this.streamParams.description = [];

      if (maxFreq === null) maxFreq = this.streamParams.sourceSampleRate / 2;

      this.melBandDescriptions = getMelBandWeights(nbrBins, nbrBands, sampleRate, minFreq, maxFreq);

      this.propagateStreamParams();
    }

    /**
     * Use the `Mel` operator in `standalone` mode (i.e. outside of a graph).
     *
     * @param {Array} spectrum - FFT bins.
     * @return {Array} - Mel bands.
     *
     * @example
     * const mel = new lfo.operator.Mel({ nbrBands: 24 });
     * // mandatory for use in standalone mode
     * mel.initStream({ frameSize: 256, frameType: 'vector' });
     * mel.inputVector(fftBins);
     */

  }, {
    key: 'inputVector',
    value: function inputVector(bins) {

      var power = this.params.get('power');
      var log = this.params.get('log');
      var melBands = this.frame.data;
      var nbrBands = this.streamParams.frameSize;
      var scale = 1;

      var minLogValue = 1e-48;
      var minLog = -480;

      if (log) scale *= nbrBands;

      for (var i = 0; i < nbrBands; i++) {
        var _melBandDescriptions$ = this.melBandDescriptions[i];
        var startIndex = _melBandDescriptions$.startIndex;
        var weights = _melBandDescriptions$.weights;

        var value = 0;

        for (var j = 0; j < weights.length; j++) {
          value += weights[j] * bins[startIndex + j];
        } // apply same logic as in PiPoBands
        if (scale !== 1) value *= scale;

        if (log) {
          if (value > minLogValue) value = 10 * log10(value);else value = minLog;
        }

        if (power !== 1) value = pow(value, power);

        melBands[i] = value;
      }

      return melBands;
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      this.inputVector(frame.data);
    }
  }]);
  return Mel;
}(_BaseLfo3.default);

exports.default = Mel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbC5qcyJdLCJuYW1lcyI6WyJtaW4iLCJNYXRoIiwibWF4IiwicG93IiwibG9nMTAiLCJoZXJ0elRvTWVsSHRrIiwiZnJlcUh6IiwibWVsVG9IZXJ0ekh0ayIsImZyZXFNZWwiLCJnZXRNZWxCYW5kV2VpZ2h0cyIsIm5ickJpbnMiLCJuYnJCYW5kcyIsInNhbXBsZVJhdGUiLCJtaW5GcmVxIiwibWF4RnJlcSIsInR5cGUiLCJoZXJ0elRvTWVsIiwibWVsVG9IZXJ0eiIsIm1pbk1lbCIsIm1heE1lbCIsIkVycm9yIiwibWVsQmFuZERlc2NyaXB0aW9ucyIsIkFycmF5IiwiZmZ0RnJlcXMiLCJGbG9hdDMyQXJyYXkiLCJmaWx0ZXJGcmVxcyIsImZmdFNpemUiLCJpIiwibWluV2VpZ2h0SW5kZXhEZWZpbmVkIiwiZGVzY3JpcHRpb24iLCJzdGFydEluZGV4IiwiY2VudGVyRnJlcSIsIndlaWdodHMiLCJqIiwicG9zU2xvcGVDb250cmliIiwibmVnU2xvcGVDb250cmliIiwiY29udHJpYnV0aW9uIiwicHVzaCIsImRlZmluaXRpb25zIiwibG9nIiwiZGVmYXVsdCIsIm1ldGFzIiwia2luZCIsIm51bGxhYmxlIiwicG93ZXIiLCJNZWwiLCJvcHRpb25zIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJwYXJhbXMiLCJnZXQiLCJzdHJlYW1QYXJhbXMiLCJzb3VyY2VTYW1wbGVSYXRlIiwiZnJhbWVUeXBlIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiYmlucyIsIm1lbEJhbmRzIiwiZnJhbWUiLCJkYXRhIiwic2NhbGUiLCJtaW5Mb2dWYWx1ZSIsIm1pbkxvZyIsInZhbHVlIiwibGVuZ3RoIiwiaW5wdXRWZWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxLQUFLRCxHQUFqQjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdB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QUFwQjtBQUNBLFVBQU1DLFNBQVMsQ0FBQyxHQUFoQjs7QUFFQSxVQUFJdkIsR0FBSixFQUNFcUIsU0FBU2pELFFBQVQ7O0FBRUYsV0FBSyxJQUFJZ0IsSUFBSSxDQUFiLEVBQWdCQSxJQUFJaEIsUUFBcEIsRUFBOEJnQixHQUE5QixFQUFtQztBQUFBLG9DQUNELEtBQUtOLG1CQUFMLENBQXlCTSxDQUF6QixDQURDO0FBQUEsWUFDekJHLFVBRHlCLHlCQUN6QkEsVUFEeUI7QUFBQSxZQUNiRSxPQURhLHlCQUNiQSxPQURhOztBQUVqQyxZQUFJK0IsUUFBUSxDQUFaOztBQUVBLGFBQUssSUFBSTlCLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsUUFBUWdDLE1BQTVCLEVBQW9DL0IsR0FBcEM7QUFDRThCLG1CQUFTL0IsUUFBUUMsQ0FBUixJQUFhdUIsS0FBSzFCLGFBQWFHLENBQWxCLENBQXRCO0FBREYsU0FKaUMsQ0FPakM7QUFDQSxZQUFJMkIsVUFBVSxDQUFkLEVBQ0VHLFNBQVNILEtBQVQ7O0FBRUYsWUFBSXJCLEdBQUosRUFBUztBQUNQLGNBQUl3QixRQUFRRixXQUFaLEVBQ0VFLFFBQVEsS0FBSzNELE1BQU0yRCxLQUFOLENBQWIsQ0FERixLQUdFQSxRQUFRRCxNQUFSO0FBQ0g7O0FBRUQsWUFBSWxCLFVBQVUsQ0FBZCxFQUNFbUIsUUFBUTVELElBQUk0RCxLQUFKLEVBQVduQixLQUFYLENBQVI7O0FBRUZhLGlCQUFTOUIsQ0FBVCxJQUFjb0MsS0FBZDtBQUNEOztBQUVELGFBQU9OLFFBQVA7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQ25CLFdBQUtPLFdBQUwsQ0FBaUJQLE1BQU1DLElBQXZCO0FBQ0Q7Ozs7O2tCQUdZZCxHIiwiZmlsZSI6Ik1lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5jb25zdCBwb3cgPSBNYXRoLnBvdztcbmNvbnN0IGxvZzEwID0gTWF0aC5sb2cxMDtcblxuZnVuY3Rpb24gaGVydHpUb01lbEh0ayhmcmVxSHopIHtcbiAgcmV0dXJuIDI1OTUgKiBNYXRoLmxvZzEwKDEgKyAoZnJlcUh6IC8gNzAwKSk7XG59XG5cbmZ1bmN0aW9uIG1lbFRvSGVydHpIdGsoZnJlcU1lbCkge1xuICByZXR1cm4gNzAwICogKE1hdGgucG93KDEwLCBmcmVxTWVsIC8gMjU5NSkgLSAxKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVzY3JpcHRpb24gb2YgdGhlIHdlaWdodHMgdG8gYXBwbHkgb24gdGhlIGZmdCBiaW5zIGZvciBlYWNoXG4gKiBNZWwgYmFuZCBmaWx0ZXIuXG4gKiBAbm90ZSAtIGFkYXB0ZWQgZnJvbSBpbXRyLXRvb2xzL3J0YVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuYnJCaW5zIC0gTnVtYmVyIG9mIGZmdCBiaW5zLlxuICogQHBhcmFtIHtOdW1iZXJ9IG5ickZpbHRlciAtIE51bWJlciBvZiBtZWwgZmlsdGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzYW1wbGVSYXRlIC0gU2FtcGxlIFJhdGUgb2YgdGhlIHNpZ25hbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtaW5GcmVxIC0gTWluaW11bSBGcmVxdWVuY3kgdG8gYmUgY29uc2lkZXJlcmVkLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1heEZyZXEgLSBNYXhpbXVtIGZyZXF1ZW5jeSB0byBjb25zaWRlci5cbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IC0gRGVzY3JpcHRpb24gb2YgdGhlIHdlaWdodHMgdG8gYXBwbHkgb24gdGhlIGJpbnMgZm9yXG4gKiAgZWFjaCBtZWwgZmlsdGVyLiBFYWNoIGRlc2NyaXB0aW9uIGhhcyB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqICB7IHN0YXJ0SW5kZXg6IGJpbkluZGV4LCBjZW50ZXJGcmVxOiBiaW5DZW50ZXJGcmVxdWVuY3ksIHdlaWdodHM6IFtdIH1cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRNZWxCYW5kV2VpZ2h0cyhuYnJCaW5zLCBuYnJCYW5kcywgc2FtcGxlUmF0ZSwgbWluRnJlcSwgbWF4RnJlcSwgdHlwZSA9ICdodGsnKSB7XG5cbiAgbGV0IGhlcnR6VG9NZWwgPSBudWxsO1xuICBsZXQgbWVsVG9IZXJ0eiA9IG51bGw7XG4gIGxldCBtaW5NZWw7XG4gIGxldCBtYXhNZWw7XG5cbiAgaWYgKHR5cGUgPT09ICdodGsnKSB7XG4gICAgaGVydHpUb01lbCA9IGhlcnR6VG9NZWxIdGs7XG4gICAgbWVsVG9IZXJ0eiA9IG1lbFRvSGVydHpIdGs7XG4gICAgbWluTWVsID0gaGVydHpUb01lbChtaW5GcmVxKTtcbiAgICBtYXhNZWwgPSBoZXJ0elRvTWVsKG1heEZyZXEpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtZWwgYmFuZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG5cbiAgY29uc3QgbWVsQmFuZERlc2NyaXB0aW9ucyA9IG5ldyBBcnJheShuYnJCYW5kcyk7XG4gIC8vIGNlbnRlciBmcmVxdWVuY2llcyBvZiBGRlQgYmluc1xuICBjb25zdCBmZnRGcmVxcyA9IG5ldyBGbG9hdDMyQXJyYXkobmJyQmlucyk7XG4gIC8vIGNlbnRlciBmcmVxdWVuY2llcyBvZiBtZWwgYmFuZHMgLSB1bmlmb3JtbHkgc3BhY2VkIGluIG1lbCBkb21haW4gYmV0d2VlblxuICAvLyBsaW1pdHMsIHRoZXJlIGFyZSAyIG1vcmUgZnJlcXVlbmNpZXMgdGhhbiB0aGUgYWN0dWFsIG51bWJlciBvZiBmaWx0ZXJzIGluXG4gIC8vIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgc2xvcGVzXG4gIGNvbnN0IGZpbHRlckZyZXFzID0gbmV3IEZsb2F0MzJBcnJheShuYnJCYW5kcyArIDIpO1xuXG4gIGNvbnN0IGZmdFNpemUgPSAobmJyQmlucyAtIDEpICogMjtcbiAgLy8gY29tcHV0ZSBiaW5zIGNlbnRlciBmcmVxdWVuY2llc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJpbnM7IGkrKylcbiAgICBmZnRGcmVxc1tpXSA9IHNhbXBsZVJhdGUgKiBpIC8gZmZ0U2l6ZTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickJhbmRzICsgMjsgaSsrKVxuICAgIGZpbHRlckZyZXFzW2ldID0gbWVsVG9IZXJ0eihtaW5NZWwgKyBpIC8gKG5ickJhbmRzICsgMSkgKiAobWF4TWVsIC0gbWluTWVsKSk7XG5cbiAgLy8gbG9vcCB0aHJvdWdodCBmaWx0ZXJzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmJyQmFuZHM7IGkrKykge1xuICAgIGxldCBtaW5XZWlnaHRJbmRleERlZmluZWQgPSAwO1xuXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB7XG4gICAgICBzdGFydEluZGV4OiBudWxsLFxuICAgICAgY2VudGVyRnJlcTogbnVsbCxcbiAgICAgIHdlaWdodHM6IFtdLFxuICAgIH1cblxuICAgIC8vIGRlZmluZSBjb250cmlidXRpb24gb2YgZWFjaCBiaW4gZm9yIHRoZSBmaWx0ZXIgYXQgaW5kZXggKGkgKyAxKVxuICAgIC8vIGRvIG5vdCBwcm9jZXNzIHRoZSBsYXN0IHNwZWN0cnVtIGNvbXBvbmVudCAoTnlxdWlzdClcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ickJpbnMgLSAxOyBqKyspIHtcbiAgICAgIGNvbnN0IHBvc1Nsb3BlQ29udHJpYiA9IChmZnRGcmVxc1tqXSAtIGZpbHRlckZyZXFzW2ldKSAvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlsdGVyRnJlcXNbaSsxXSAtIGZpbHRlckZyZXFzW2ldKTtcblxuICAgICAgY29uc3QgbmVnU2xvcGVDb250cmliID0gKGZpbHRlckZyZXFzW2krMl0gLSBmZnRGcmVxc1tqXSkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpbHRlckZyZXFzW2krMl0gLSBmaWx0ZXJGcmVxc1tpKzFdKTtcbiAgICAgIC8vIGxvd2VyU2xvcGUgYW5kIHVwcGVyIHNsb3BlIGludGVyc2VjdCBhdCB6ZXJvIGFuZCB3aXRoIGVhY2ggb3RoZXJcbiAgICAgIGNvbnN0IGNvbnRyaWJ1dGlvbiA9IG1heCgwLCBtaW4ocG9zU2xvcGVDb250cmliLCBuZWdTbG9wZUNvbnRyaWIpKTtcblxuICAgICAgaWYgKGNvbnRyaWJ1dGlvbiA+IDApIHtcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uLnN0YXJ0SW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5zdGFydEluZGV4ID0gajtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5jZW50ZXJGcmVxID0gZmlsdGVyRnJlcXNbaSsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc2NyaXB0aW9uLndlaWdodHMucHVzaChjb250cmlidXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVtcHR5IGZpbHRlclxuICAgIGlmIChkZXNjcmlwdGlvbi5zdGFydEluZGV4ID09PSBudWxsKSB7XG4gICAgICBkZXNjcmlwdGlvbi5zdGFydEluZGV4ID0gMDtcbiAgICAgIGRlc2NyaXB0aW9uLmNlbnRlckZyZXEgPSAwO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIC0gZG8gc29tZSBzY2FsaW5nIGZvciBTbGFuZXktc3R5bGUgbWVsXG4gICAgbWVsQmFuZERlc2NyaXB0aW9uc1tpXSA9IGRlc2NyaXB0aW9uO1xuICB9XG5cbiAgcmV0dXJuIG1lbEJhbmREZXNjcmlwdGlvbnM7XG59XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGxvZzoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBuYnJCYW5kczoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyNCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBtaW5GcmVxOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIG1heEZyZXE6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgcG93ZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBtZWwgYmFuZHMgc3BlY3RydW0gZnJvbSBhIGdpdmVuIHNwZWN0cnVtIChgdmVjdG9yYCB0eXBlKS5cbiAqIF9JbXBsZW1lbnQgdGhlIGBodGtgIG1lbCBiYW5kIHN0eWxlLl9cbiAqXG4gKiBfc3VwcG9ydCBgc3RhbmRhbG9uZWAgdXNhZ2VfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubG9nPWZhbHNlXSAtIEFwcGx5IGEgbG9nYXJpdGhtaWMgc2NhbGUgb24gdGhlIG91dHB1dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5uYnJCYW5kcz0yNF0gLSBOdW1iZXIgb2YgZmlsdGVycyBkZWZpbmluZyB0aGUgbWVsXG4gKiAgYmFuZHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluRnJlcT0wXSAtIE1pbmltdW0gZnJlcXVlbmN5IHRvIGNvbnNpZGVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heEZyZXE9bnVsbF0gLSBNYXhpbXVtIGZyZXF1ZW5jeSB0byBjb25zaWRlci5cbiAqICBJZiBgbnVsbGAsIGlzIHNldCB0byBOeXF1aXN0IGZyZXF1ZW5jeS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wb3dlcj0xXSAtIEFwcGx5IGEgcG93ZXIgc2NhbGluZyBvbiBlYWNoIG1lbCBiYW5kLlxuICpcbiAqIEB0b2RvIC0gaW1wbGVtZW50IFNsYW5leSBzdHlsZSBtZWwgYmFuZHNcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IGxmbyBmcm9tICd3YXZlcy1sZm8vbm9kZSdcbiAqXG4gKiAvLyByZWFkIGEgZmlsZSBmcm9tIHBhdGggKG5vZGUgb25seSBzb3VyY2UpXG4gKiBjb25zdCBhdWRpb0luRmlsZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5GaWxlKHtcbiAqICAgZmlsZW5hbWU6ICdwYXRoL3RvL2ZpbGUnLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNsaWNlciA9IG5ldyBsZm8ub3BlcmF0b3IuU2xpY2VyKHtcbiAqICAgZnJhbWVTaXplOiAyNTYsXG4gKiAgIGhvcFNpemU6IDI1NixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGZmdCA9IG5ldyBsZm8ub3BlcmF0b3IuRkZUKHtcbiAqICAgc2l6ZTogMTAyNCxcbiAqICAgd2luZG93OiAnaGFubicsXG4gKiAgIG1vZGU6ICdwb3dlcicsXG4gKiAgIG5vcm06ICdwb3dlcicsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBtZWwgPSBuZXcgbGZvLm9wZXJhdG9yLk1lbCh7XG4gKiAgIGxvZzogdHJ1ZSxcbiAqICAgbmJyQmFuZHM6IDI0LFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IGRhdGE6IHRydWUgfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QoZmZ0KTtcbiAqIGZmdC5jb25uZWN0KG1lbCk7XG4gKiBtZWwuY29ubmVjdChsb2dnZXIpO1xuICpcbiAqIGF1ZGlvSW5GaWxlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIE1lbCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbmJyQmlucyA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG5ickJhbmRzID0gdGhpcy5wYXJhbXMuZ2V0KCduYnJCYW5kcycpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pbkZyZXEgPSB0aGlzLnBhcmFtcy5nZXQoJ21pbkZyZXEnKTtcbiAgICBsZXQgbWF4RnJlcSA9IHRoaXMucGFyYW1zLmdldCgnbWF4RnJlcScpO1xuXG4gICAgLy9cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBuYnJCYW5kcztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAndmVjdG9yJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFtdO1xuXG4gICAgaWYgKG1heEZyZXEgPT09IG51bGwpXG4gICAgICBtYXhGcmVxID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSAvIDI7XG5cbiAgICB0aGlzLm1lbEJhbmREZXNjcmlwdGlvbnMgPSBnZXRNZWxCYW5kV2VpZ2h0cyhuYnJCaW5zLCBuYnJCYW5kcywgc2FtcGxlUmF0ZSwgbWluRnJlcSwgbWF4RnJlcSk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgYE1lbGAgb3BlcmF0b3IgaW4gYHN0YW5kYWxvbmVgIG1vZGUgKGkuZS4gb3V0c2lkZSBvZiBhIGdyYXBoKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gc3BlY3RydW0gLSBGRlQgYmlucy5cbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWVsIGJhbmRzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBtZWwgPSBuZXcgbGZvLm9wZXJhdG9yLk1lbCh7IG5ickJhbmRzOiAyNCB9KTtcbiAgICogLy8gbWFuZGF0b3J5IGZvciB1c2UgaW4gc3RhbmRhbG9uZSBtb2RlXG4gICAqIG1lbC5pbml0U3RyZWFtKHsgZnJhbWVTaXplOiAyNTYsIGZyYW1lVHlwZTogJ3ZlY3RvcicgfSk7XG4gICAqIG1lbC5pbnB1dFZlY3RvcihmZnRCaW5zKTtcbiAgICovXG4gIGlucHV0VmVjdG9yKGJpbnMpIHtcblxuICAgIGNvbnN0IHBvd2VyID0gdGhpcy5wYXJhbXMuZ2V0KCdwb3dlcicpO1xuICAgIGNvbnN0IGxvZyA9IHRoaXMucGFyYW1zLmdldCgnbG9nJyk7XG4gICAgY29uc3QgbWVsQmFuZHMgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgbmJyQmFuZHMgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgbGV0IHNjYWxlID0gMTtcblxuICAgIGNvbnN0IG1pbkxvZ1ZhbHVlID0gMWUtNDg7XG4gICAgY29uc3QgbWluTG9nID0gLTQ4MDtcblxuICAgIGlmIChsb2cpXG4gICAgICBzY2FsZSAqPSBuYnJCYW5kcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmJyQmFuZHM7IGkrKykge1xuICAgICAgY29uc3QgeyBzdGFydEluZGV4LCB3ZWlnaHRzIH0gPSB0aGlzLm1lbEJhbmREZXNjcmlwdGlvbnNbaV07XG4gICAgICBsZXQgdmFsdWUgPSAwO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHdlaWdodHMubGVuZ3RoOyBqKyspXG4gICAgICAgIHZhbHVlICs9IHdlaWdodHNbal0gKiBiaW5zW3N0YXJ0SW5kZXggKyBqXTtcblxuICAgICAgLy8gYXBwbHkgc2FtZSBsb2dpYyBhcyBpbiBQaVBvQmFuZHNcbiAgICAgIGlmIChzY2FsZSAhPT0gMSlcbiAgICAgICAgdmFsdWUgKj0gc2NhbGU7XG5cbiAgICAgIGlmIChsb2cpIHtcbiAgICAgICAgaWYgKHZhbHVlID4gbWluTG9nVmFsdWUpXG4gICAgICAgICAgdmFsdWUgPSAxMCAqIGxvZzEwKHZhbHVlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZhbHVlID0gbWluTG9nO1xuICAgICAgfVxuXG4gICAgICBpZiAocG93ZXIgIT09IDEpXG4gICAgICAgIHZhbHVlID0gcG93KHZhbHVlLCBwb3dlcik7XG5cbiAgICAgIG1lbEJhbmRzW2ldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbEJhbmRzO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLmlucHV0VmVjdG9yKGZyYW1lLmRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lbDtcbiJdfQ==