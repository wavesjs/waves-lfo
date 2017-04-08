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

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _definitions;

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = (_definitions = {
  audioBuffer: {
    type: 'any',
    default: null,
    constant: true
  },
  frameSize: {
    type: 'integer',
    default: 512,
    constant: true
  },
  channel: {
    type: 'integer',
    default: 0,
    constant: true
  },
  progressCallback: {
    type: 'any',
    default: null,
    nullable: true,
    constant: true
  }
}, (0, _defineProperty3.default)(_definitions, 'progressCallback', {
  type: 'any',
  default: null,
  nullable: true,
  constant: true
}), (0, _defineProperty3.default)(_definitions, 'async', {
  type: 'boolean',
  default: false
}), _definitions);

var noop = function noop() {};

/**
 * Slice an `AudioBuffer` into signal blocks and propagate the resulting frames
 * through the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioBuffer} [options.audioBuffer] - Audio buffer to process.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [options.channel=0] - Number of the channel to process.
 * @param {Number} [options.progressCallback=null] - Callback to be excuted on each
 *  frame output, receive as argument the current progress ratio.
 *
 * @memberof module:client.source
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const waveform = new lfo.sink.Waveform({
 *   canvas: '#waveform',
 *   duration: 1,
 *   color: 'steelblue',
 *   rms: true,
 * });
 *
 * audioInBuffer.connect(waveform);
 * audioInBuffer.start();
 */

var AudioInBuffer = function (_SourceMixin) {
  (0, _inherits3.default)(AudioInBuffer, _SourceMixin);

  function AudioInBuffer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, AudioInBuffer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInBuffer.__proto__ || (0, _getPrototypeOf2.default)(AudioInBuffer)).call(this, definitions, options));

    var audioBuffer = _this.params.get('audioBuffer');

    if (!audioBuffer) throw new Error('Invalid "audioBuffer" parameter');

    _this.endTime = 0;
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and start propagating frames.
   * When called, the slicing of the given `audioBuffer` starts immediately and
   * each resulting frame is propagated in graph.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:client.source.AudioInBuffer#stop}
   */


  (0, _createClass3.default)(AudioInBuffer, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(function () {
          return _this2.start(startTime);
        });
        return;
      }

      var channel = this.params.get('channel');
      var audioBuffer = this.params.get('audioBuffer');
      var buffer = audioBuffer.getChannelData(channel);
      this.endTime = 0;
      this.started = true;

      this.processFrame(buffer);
    }

    /**
     * Finalize the stream and stop the whole graph. When called, the slicing of
     * the `audioBuffer` stops immediately.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:client.source.AudioInBuffer#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.finalizeStream(this.endTime);
      this.started = false;
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var audioBuffer = this.params.get('audioBuffer');
      var frameSize = this.params.get('frameSize');
      var sourceSampleRate = audioBuffer.sampleRate;
      var frameRate = sourceSampleRate / frameSize;

      this.streamParams.frameSize = frameSize;
      this.streamParams.frameRate = frameRate;
      this.streamParams.frameType = 'signal';
      this.streamParams.sourceSampleRate = sourceSampleRate;
      this.streamParams.sourceSampleCount = frameSize;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(buffer) {
      var async = this.params.get('async');
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameSize = this.streamParams.frameSize;
      var progressCallback = this.params.get('progressCallback') || noop;
      var length = buffer.length;
      var nbrFrames = Math.ceil(buffer.length / frameSize);
      var data = this.frame.data;
      var that = this;
      var i = 0;

      function slice() {
        var offset = i * frameSize;
        var nbrCopy = Math.min(length - offset, frameSize);

        for (var j = 0; j < frameSize; j++) {
          data[j] = j < nbrCopy ? buffer[offset + j] : 0;
        }that.frame.time = offset / sampleRate;
        that.endTime = that.frame.time + nbrCopy / sampleRate;
        that.propagateFrame();

        i += 1;
        progressCallback(i / nbrFrames);

        if (i < nbrFrames) {
          if (async) setTimeout(slice, 0);else slice();
        } else {
          that.finalizeStream(that.endTime);
        }
      };

      // allow the following to do the expected thing:
      // audioIn.connect(recorder);
      // audioIn.start();
      // recorder.start();
      setTimeout(slice, 0);
    }
  }]);
  return AudioInBuffer;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJhdWRpb0J1ZmZlciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm51bGxhYmxlIiwibm9vcCIsIkF1ZGlvSW5CdWZmZXIiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJlbmRUaW1lIiwiaW5pdGlhbGl6ZWQiLCJpbml0UHJvbWlzZSIsImluaXQiLCJ0aGVuIiwic3RhcnQiLCJzdGFydFRpbWUiLCJidWZmZXIiLCJnZXRDaGFubmVsRGF0YSIsInN0YXJ0ZWQiLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInNvdXJjZVNhbXBsZVJhdGUiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwic291cmNlU2FtcGxlQ291bnQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJhc3luYyIsImxlbmd0aCIsIm5ickZyYW1lcyIsIk1hdGgiLCJjZWlsIiwiZGF0YSIsImZyYW1lIiwidGhhdCIsImkiLCJzbGljZSIsIm9mZnNldCIsIm5ickNvcHkiLCJtaW4iLCJqIiwidGltZSIsInByb3BhZ2F0ZUZyYW1lIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQTtBQUNKQyxlQUFhO0FBQ1hDLFVBQU0sS0FESztBQUVYQyxhQUFTLElBRkU7QUFHWEMsY0FBVTtBQUhDLEdBRFQ7QUFNSkMsYUFBVztBQUNUSCxVQUFNLFNBREc7QUFFVEMsYUFBUyxHQUZBO0FBR1RDLGNBQVU7QUFIRCxHQU5QO0FBV0pFLFdBQVM7QUFDUEosVUFBTSxTQURDO0FBRVBDLGFBQVMsQ0FGRjtBQUdQQyxjQUFVO0FBSEgsR0FYTDtBQWdCSkcsb0JBQWtCO0FBQ2hC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QUFDQSxVQUFNQyxZQUFZQyxLQUFLQyxJQUFMLENBQVVoQixPQUFPYSxNQUFQLEdBQWdCOUIsU0FBMUIsQ0FBbEI7QUFDQSxVQUFNa0MsT0FBTyxLQUFLQyxLQUFMLENBQVdELElBQXhCO0FBQ0EsVUFBTUUsT0FBTyxJQUFiO0FBQ0EsVUFBSUMsSUFBSSxDQUFSOztBQUVBLGVBQVNDLEtBQVQsR0FBaUI7QUFDZixZQUFNQyxTQUFTRixJQUFJckMsU0FBbkI7QUFDQSxZQUFNd0MsVUFBVVIsS0FBS1MsR0FBTCxDQUFTWCxTQUFTUyxNQUFsQixFQUEwQnZDLFNBQTFCLENBQWhCOztBQUVBLGFBQUssSUFBSTBDLElBQUksQ0FBYixFQUFnQkEsSUFBSTFDLFNBQXBCLEVBQStCMEMsR0FBL0I7QUFDRVIsZUFBS1EsQ0FBTCxJQUFVQSxJQUFJRixPQUFKLEdBQWN2QixPQUFPc0IsU0FBU0csQ0FBaEIsQ0FBZCxHQUFtQyxDQUE3QztBQURGLFNBR0FOLEtBQUtELEtBQUwsQ0FBV1EsSUFBWCxHQUFrQkosU0FBU2hCLFVBQTNCO0FBQ0FhLGFBQUsxQixPQUFMLEdBQWUwQixLQUFLRCxLQUFMLENBQVdRLElBQVgsR0FBa0JILFVBQVVqQixVQUEzQztBQUNBYSxhQUFLUSxjQUFMOztBQUVBUCxhQUFLLENBQUw7QUFDQW5DLHlCQUFpQm1DLElBQUlOLFNBQXJCOztBQUVBLFlBQUlNLElBQUlOLFNBQVIsRUFBbUI7QUFDakIsY0FBSUYsS0FBSixFQUNFZ0IsV0FBV1AsS0FBWCxFQUFrQixDQUFsQixFQURGLEtBR0VBO0FBQ0gsU0FMRCxNQUtPO0FBQ0xGLGVBQUtmLGNBQUwsQ0FBb0JlLEtBQUsxQixPQUF6QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQW1DLGlCQUFXUCxLQUFYLEVBQWtCLENBQWxCO0FBQ0Q7OztFQTVHeUIsNkM7O2tCQStHYmpDLGEiLCJmaWxlIjoiQXVkaW9JbkJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgU291cmNlTWl4aW4gZnJvbSAnLi4vLi4vY29yZS9Tb3VyY2VNaXhpbic7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGF1ZGlvQnVmZmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2hhbm5lbDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgcHJvZ3Jlc3NDYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGFzeW5jOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogU2xpY2UgYW4gYEF1ZGlvQnVmZmVyYCBpbnRvIHNpZ25hbCBibG9ja3MgYW5kIHByb3BhZ2F0ZSB0aGUgcmVzdWx0aW5nIGZyYW1lc1xuICogdGhyb3VnaCB0aGUgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXInIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gW29wdGlvbnMuYXVkaW9CdWZmZXJdIC0gQXVkaW8gYnVmZmVyIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIHRoZSBvdXRwdXQgYmxvY2tzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBOdW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wcm9ncmVzc0NhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhjdXRlZCBvbiBlYWNoXG4gKiAgZnJhbWUgb3V0cHV0LCByZWNlaXZlIGFzIGFyZ3VtZW50IHRoZSBjdXJyZW50IHByb2dyZXNzIHJhdGlvLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9JbkJ1ZmZlciA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5CdWZmZXIoe1xuICogICBhdWRpb0J1ZmZlcjogYXVkaW9CdWZmZXIsXG4gKiAgIGZyYW1lU2l6ZTogNTEyLFxuICogfSk7XG4gKlxuICogY29uc3Qgd2F2ZWZvcm0gPSBuZXcgbGZvLnNpbmsuV2F2ZWZvcm0oe1xuICogICBjYW52YXM6ICcjd2F2ZWZvcm0nLFxuICogICBkdXJhdGlvbjogMSxcbiAqICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICogICBybXM6IHRydWUsXG4gKiB9KTtcbiAqXG4gKiBhdWRpb0luQnVmZmVyLmNvbm5lY3Qod2F2ZWZvcm0pO1xuICogYXVkaW9JbkJ1ZmZlci5zdGFydCgpO1xuICovXG5jbGFzcyBBdWRpb0luQnVmZmVyIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcblxuICAgIGlmICghYXVkaW9CdWZmZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJhdWRpb0J1ZmZlclwiIHBhcmFtZXRlcicpO1xuXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgcHJvcGFnYXRpbmcgZnJhbWVzLlxuICAgKiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2YgdGhlIGdpdmVuIGBhdWRpb0J1ZmZlcmAgc3RhcnRzIGltbWVkaWF0ZWx5IGFuZFxuICAgKiBlYWNoIHJlc3VsdGluZyBmcmFtZSBpcyBwcm9wYWdhdGVkIGluIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9JbkJ1ZmZlciNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodGhpcy5pbml0UHJvbWlzZSA9PT0gbnVsbCkgLy8gaW5pdCBoYXMgbm90IHlldCBiZWVuIGNhbGxlZFxuICAgICAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG5cbiAgICAgIHRoaXMuaW5pdFByb21pc2UudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBidWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YShjaGFubmVsKTtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICB0aGlzLnByb2Nlc3NGcmFtZShidWZmZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2ZcbiAgICogdGhlIGBhdWRpb0J1ZmZlcmAgc3RvcHMgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luQnVmZmVyI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZW5kVGltZSk7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSBhdWRpb0J1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzaWduYWwnO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgYXN5bmMgPSB0aGlzLnBhcmFtcy5nZXQoJ2FzeW5jJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ3Byb2dyZXNzQ2FsbGJhY2snKSB8fMKgbm9vcDtcbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChidWZmZXIubGVuZ3RoIC8gZnJhbWVTaXplKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBpID0gMDtcblxuICAgIGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gaSAqIGZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IG5ickNvcHkgPSBNYXRoLm1pbihsZW5ndGggLSBvZmZzZXQsIGZyYW1lU2l6ZSk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspXG4gICAgICAgIGRhdGFbal0gPSBqIDwgbmJyQ29weSA/IGJ1ZmZlcltvZmZzZXQgKyBqXSA6IDA7XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IG9mZnNldCAvIHNhbXBsZVJhdGU7XG4gICAgICB0aGF0LmVuZFRpbWUgPSB0aGF0LmZyYW1lLnRpbWUgKyBuYnJDb3B5IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoYXQucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgaSArPSAxO1xuICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhpIC8gbmJyRnJhbWVzKTtcblxuICAgICAgaWYgKGkgPCBuYnJGcmFtZXMpIHtcbiAgICAgICAgaWYgKGFzeW5jKVxuICAgICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2xpY2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuZmluYWxpemVTdHJlYW0odGhhdC5lbmRUaW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gYWxsb3cgdGhlIGZvbGxvd2luZyB0byBkbyB0aGUgZXhwZWN0ZWQgdGhpbmc6XG4gICAgLy8gYXVkaW9Jbi5jb25uZWN0KHJlY29yZGVyKTtcbiAgICAvLyBhdWRpb0luLnN0YXJ0KCk7XG4gICAgLy8gcmVjb3JkZXIuc3RhcnQoKTtcbiAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luQnVmZmVyO1xuIl19