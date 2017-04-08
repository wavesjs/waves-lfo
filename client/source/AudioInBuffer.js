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
      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(this.start);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJhdWRpb0J1ZmZlciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm51bGxhYmxlIiwibm9vcCIsIkF1ZGlvSW5CdWZmZXIiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJlbmRUaW1lIiwiaW5pdGlhbGl6ZWQiLCJpbml0UHJvbWlzZSIsImluaXQiLCJ0aGVuIiwic3RhcnQiLCJidWZmZXIiLCJnZXRDaGFubmVsRGF0YSIsInN0YXJ0ZWQiLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInNvdXJjZVNhbXBsZVJhdGUiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwic291cmNlU2FtcGxlQ291bnQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJhc3luYyIsImxlbmd0aCIsIm5ickZyYW1lcyIsIk1hdGgiLCJjZWlsIiwiZGF0YSIsImZyYW1lIiwidGhhdCIsImkiLCJzbGljZSIsIm9mZnNldCIsIm5ickNvcHkiLCJtaW4iLCJqIiwidGltZSIsInByb3BhZ2F0ZUZyYW1lIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQTtBQUNKQyxlQUFhO0FBQ1hDLFVBQU0sS0FESztBQUVYQyxhQUFTLElBRkU7QUFHWEMsY0FBVTtBQUhDLEdBRFQ7QUFNSkMsYUFBVztBQUNUSCxVQUFNLFNBREc7QUFFVEMsYUFBUyxHQUZBO0FBR1RDLGNBQVU7QUFIRCxHQU5QO0FBV0pFLFdBQVM7QUFDUEosVUFBTSxTQURDO0FBRVBDLGFBQVMsQ0FGRjtBQUdQQyxjQUFVO0FBSEgsR0FYTDtBQWdCSkcsb0JBQWtCO0FBQ2hCTCxVQUFNLEtBRFU7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QUExQixDQUFsQjtBQUNBLFVBQU1pQyxPQUFPLEtBQUtDLEtBQUwsQ0FBV0QsSUFBeEI7QUFDQSxVQUFNRSxPQUFPLElBQWI7QUFDQSxVQUFJQyxJQUFJLENBQVI7O0FBRUEsZUFBU0MsS0FBVCxHQUFpQjtBQUNmLFlBQU1DLFNBQVNGLElBQUlwQyxTQUFuQjtBQUNBLFlBQU11QyxVQUFVUixLQUFLUyxHQUFMLENBQVNYLFNBQVNTLE1BQWxCLEVBQTBCdEMsU0FBMUIsQ0FBaEI7O0FBRUEsYUFBSyxJQUFJeUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJekMsU0FBcEIsRUFBK0J5QyxHQUEvQjtBQUNFUixlQUFLUSxDQUFMLElBQVVBLElBQUlGLE9BQUosR0FBY3ZCLE9BQU9zQixTQUFTRyxDQUFoQixDQUFkLEdBQW1DLENBQTdDO0FBREYsU0FHQU4sS0FBS0QsS0FBTCxDQUFXUSxJQUFYLEdBQWtCSixTQUFTaEIsVUFBM0I7QUFDQWEsYUFBS3pCLE9BQUwsR0FBZXlCLEtBQUtELEtBQUwsQ0FBV1EsSUFBWCxHQUFrQkgsVUFBVWpCLFVBQTNDO0FBQ0FhLGFBQUtRLGNBQUw7O0FBRUFQLGFBQUssQ0FBTDtBQUNBbEMseUJBQWlCa0MsSUFBSU4sU0FBckI7O0FBRUEsWUFBSU0sSUFBSU4sU0FBUixFQUFtQjtBQUNqQixjQUFJRixLQUFKLEVBQ0VnQixXQUFXUCxLQUFYLEVBQWtCLENBQWxCLEVBREYsS0FHRUE7QUFDSCxTQUxELE1BS087QUFDTEYsZUFBS2YsY0FBTCxDQUFvQmUsS0FBS3pCLE9BQXpCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBa0MsaUJBQVdQLEtBQVgsRUFBa0IsQ0FBbEI7QUFDRDs7O0VBNUd5Qiw2Qzs7a0JBK0diaEMsYSIsImZpbGUiOiJBdWRpb0luQnVmZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYXVkaW9CdWZmZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXN5bmM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG59O1xuXG5jb25zdCBub29wID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBTbGljZSBhbiBgQXVkaW9CdWZmZXJgIGludG8gc2lnbmFsIGJsb2NrcyBhbmQgcHJvcGFnYXRlIHRoZSByZXN1bHRpbmcgZnJhbWVzXG4gKiB0aHJvdWdoIHRoZSBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcicgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBbb3B0aW9ucy5hdWRpb0J1ZmZlcl0gLSBBdWRpbyBidWZmZXIgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIFNpemUgb2YgdGhlIG91dHB1dCBibG9ja3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2hhbm5lbD0wXSAtIE51bWJlciBvZiB0aGUgY2hhbm5lbCB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnByb2dyZXNzQ2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGN1dGVkIG9uIGVhY2hcbiAqICBmcmFtZSBvdXRwdXQsIHJlY2VpdmUgYXMgYXJndW1lbnQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgcmF0aW8uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc291cmNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0luQnVmZmVyID0gbmV3IGxmby5zb3VyY2UuQXVkaW9JbkJ1ZmZlcih7XG4gKiAgIGF1ZGlvQnVmZmVyOiBhdWRpb0J1ZmZlcixcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybSA9IG5ldyBsZm8uc2luay5XYXZlZm9ybSh7XG4gKiAgIGNhbnZhczogJyN3YXZlZm9ybScsXG4gKiAgIGR1cmF0aW9uOiAxLFxuICogICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gKiAgIHJtczogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdCh3YXZlZm9ybSk7XG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuXG4gICAgaWYgKCFhdWRpb0J1ZmZlcilcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcImF1ZGlvQnVmZmVyXCIgcGFyYW1ldGVyJyk7XG5cbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBzdGFydCBwcm9wYWdhdGluZyBmcmFtZXMuXG4gICAqIFdoZW4gY2FsbGVkLCB0aGUgc2xpY2luZyBvZiB0aGUgZ2l2ZW4gYGF1ZGlvQnVmZmVyYCBzdGFydHMgaW1tZWRpYXRlbHkgYW5kXG4gICAqIGVhY2ggcmVzdWx0aW5nIGZyYW1lIGlzIHByb3BhZ2F0ZWQgaW4gZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luQnVmZmVyI3N0b3B9XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcblxuICAgICAgdGhpcy5pbml0UHJvbWlzZS50aGVuKHRoaXMuc3RhcnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBidWZmZXIgPSBhdWRpb0J1ZmZlci5nZXRDaGFubmVsRGF0YShjaGFubmVsKTtcbiAgICB0aGlzLmVuZFRpbWUgPSAwO1xuICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICB0aGlzLnByb2Nlc3NGcmFtZShidWZmZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2ZcbiAgICogdGhlIGBhdWRpb0J1ZmZlcmAgc3RvcHMgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luQnVmZmVyI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZW5kVGltZSk7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSBhdWRpb0J1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzaWduYWwnO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgYXN5bmMgPSB0aGlzLnBhcmFtcy5nZXQoJ2FzeW5jJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ3Byb2dyZXNzQ2FsbGJhY2snKSB8fMKgbm9vcDtcbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChidWZmZXIubGVuZ3RoIC8gZnJhbWVTaXplKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBpID0gMDtcblxuICAgIGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gaSAqIGZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IG5ickNvcHkgPSBNYXRoLm1pbihsZW5ndGggLSBvZmZzZXQsIGZyYW1lU2l6ZSk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspXG4gICAgICAgIGRhdGFbal0gPSBqIDwgbmJyQ29weSA/IGJ1ZmZlcltvZmZzZXQgKyBqXSA6IDA7XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IG9mZnNldCAvIHNhbXBsZVJhdGU7XG4gICAgICB0aGF0LmVuZFRpbWUgPSB0aGF0LmZyYW1lLnRpbWUgKyBuYnJDb3B5IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoYXQucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgaSArPSAxO1xuICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhpIC8gbmJyRnJhbWVzKTtcblxuICAgICAgaWYgKGkgPCBuYnJGcmFtZXMpIHtcbiAgICAgICAgaWYgKGFzeW5jKVxuICAgICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgc2xpY2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuZmluYWxpemVTdHJlYW0odGhhdC5lbmRUaW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gYWxsb3cgdGhlIGZvbGxvd2luZyB0byBkbyB0aGUgZXhwZWN0ZWQgdGhpbmc6XG4gICAgLy8gYXVkaW9Jbi5jb25uZWN0KHJlY29yZGVyKTtcbiAgICAvLyBhdWRpb0luLnN0YXJ0KCk7XG4gICAgLy8gcmVjb3JkZXIuc3RhcnQoKTtcbiAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luQnVmZmVyO1xuIl19