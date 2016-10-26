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

var _BaseLfo2 = require('../../common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  duration: {
    type: 'float',
    default: 10,
    min: 0,
    metas: { kind: 'static' }
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  },
  ignoreLeadingZeros: {
    type: 'boolean',
    default: true,
    metas: { kind: 'static' }
  },
  retrieveAudioBuffer: {
    type: 'boolean',
    default: false,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    nullable: true
  }
};

/**
 * Record an `signal` input stream of arbitrary duration and retrieve it
 * when done.
 *
 * When recording is stopped (either when the `stop` method is called, the
 * defined duration has been recorded, or the source of the graph finalized
 * the stream), the callback given as parameter is executed  with the
 * `AudioBuffer` or `Float32Array` containing the recorded signal as argument.
 *
 * @todo - add option to return only the Float32Array and not an audio buffer
 *  (node compliant) `retrieveAudioBuffer: false`
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.duration=10] - Maximum duration of the recording.
 * @param {Number} [options.callback] - Callback to execute when a new record is
 *  ended. This can happen: `stop` is called on the recorder, `stop` is called
 *  on the source or when the buffer is full according to the given `duration`.
 * @param {Object} [options.ignoreLeadingZeros=true] - Start the effective
 *  recording on the first non-zero value.
 * @param {Boolean} [options.retrieveAudioBuffer=false] - Define if an `AudioBuffer`
 *  should be retrieved or only the raw Float32Array of data.
 *  (works only in browser)
 * @param {AudioContext} [options.audioContext=null] - If
 *  `retrieveAudioBuffer` is set to `true`, audio context to be used
 *  in order to create the final audio buffer.
 *  (works only in browser)
 *
 * @memberof module:common.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   const signalRecorder = new lfo.sink.SignalRecorder({
 *     duration: 6,
 *     retrieveAudioBuffer: true,
 *     audioContext: audioContext,
 *     callback: (buffer) => {
 *       const bufferSource = audioContext.createBufferSource();
 *       bufferSource.buffer = buffer;
 *       bufferSource.connect(audioContext.destination);
 *       bufferSource.start();
 *     }
 *   });
 *
 *   audioInNode.connect(signalRecorder);
 *   audioInNode.start();
 *   signalRecorder.start();
 * });
 */

var SignalRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(SignalRecorder, _BaseLfo);

  function SignalRecorder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SignalRecorder);

    /**
     * Define is the node is currently recording or not.
     *
     * @type {Boolean}
     * @name isRecording
     * @instance
     * @memberof module:client.sink.SignalRecorder
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SignalRecorder.__proto__ || (0, _getPrototypeOf2.default)(SignalRecorder)).call(this, definitions, options));

    _this.isRecording = false;

    var retrieveAudioBuffer = _this.params.get('retrieveAudioBuffer');
    var audioContext = _this.params.get('audioContext');
    // needed to retrieve an AudioBuffer
    if (retrieveAudioBuffer && audioContext === null) throw new Error('Invalid parameter "audioContext": and AudioContext must be provided when `retrieveAudioBuffer` is set to `true`');

    _this._audioContext = audioContext;
    _this._ignoreZeros = false;
    _this._isInfiniteBuffer = false;
    _this._stack = [];
    _this._buffer = null;
    _this._bufferLength = null;
    _this._currentIndex = null;
    return _this;
  }

  (0, _createClass3.default)(SignalRecorder, [{
    key: '_initBuffer',
    value: function _initBuffer() {
      this._buffer = new Float32Array(this._bufferLength);
      this._stack.length = 0;
      this._currentIndex = 0;
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      var duration = this.params.get('duration');
      var sampleRate = this.streamParams.sourceSampleRate;

      if (isFinite(duration)) {
        this._isInfiniteBuffer = false;
        this._bufferLength = sampleRate * duration;
      } else {
        this._isInfiniteBuffer = true;
        this._bufferLength = sampleRate * 10;
      }

      this._initBuffer();

      this.propagateStreamParams();
    }

    /**
     * Start recording.
     */

  }, {
    key: 'start',
    value: function start() {
      this.isRecording = true;
      this._ignoreZeros = this.params.get('ignoreLeadingZeros');
    }

    /**
     * Stop recording and execute the callback defined in parameters.
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.isRecording) {
        // ignore next incomming frame
        this.isRecording = false;

        var retrieveAudioBuffer = this.params.get('retrieveAudioBuffer');
        var callback = this.params.get('callback');
        var currentIndex = this._currentIndex;
        var buffer = this._buffer;
        var output = void 0;

        if (!this._isInfiniteBuffer) {
          output = new Float32Array(currentIndex);
          output.set(buffer.subarray(0, currentIndex), 0);
        } else {
          var bufferLength = this._bufferLength;
          var stack = this._stack;
          output = new Float32Array(stack.length * bufferLength + currentIndex);

          // copy all stacked buffers
          for (var i = 0; i < stack.length; i++) {
            var stackedBuffer = stack[i];
            output.set(stackedBuffer, bufferLength * i);
          };
          // copy data contained in current buffer
          output.set(buffer.subarray(0, currentIndex), stack.length * bufferLength);
        }

        if (retrieveAudioBuffer && this._audioContext) {
          var length = output.length;
          var sampleRate = this.streamParams.sourceSampleRate;
          var audioBuffer = this._audioContext.createBuffer(1, length, sampleRate);
          var channelData = audioBuffer.getChannelData(0);
          channelData.set(output, 0);

          callback(audioBuffer);
        } else {
          callback(output);
        }

        // reinit buffer, stack, and currentIndex
        this._initBuffer();
      }
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      this.stop();
    }

    /** @private */

  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      if (!this.isRecording) return;

      var block = null;
      var input = frame.data;
      var bufferLength = this._bufferLength;
      var buffer = this._buffer;

      if (this._ignoreZeros === false) {
        block = new Float32Array(input);
      } else if (input[input.length - 1] !== 0) {
        // find first index where value !== 0
        var i = void 0;

        for (i = 0; i < input.length; i++) {
          if (input[i] !== 0) break;
        } // copy non zero segment
        block = new Float32Array(input.subarray(i));
        // don't repeat this logic once a non-zero value has been found
        this._ignoreZeros = false;
      }

      if (block !== null) {
        var availableSpace = bufferLength - this._currentIndex;
        var currentBlock = void 0;
        // return if already full (can it happen ?)
        // if (availableSpace <= 0) return;

        if (availableSpace < block.length) currentBlock = block.subarray(0, availableSpace);else currentBlock = block;

        buffer.set(currentBlock, this._currentIndex);
        this._currentIndex += currentBlock.length;

        if (this._isInfiniteBuffer && this._currentIndex === bufferLength) {
          this._stack.push(buffer);

          currentBlock = block.subarray(availableSpace);
          this._buffer = new Float32Array(bufferLength);
          this._buffer.set(currentBlock, 0);
          this._currentIndex = currentBlock.length;
        }
      }

      //  stop if the buffer is finite and full
      if (!this._isInfiniteBuffer && this._currentIndex === bufferLength) this.stop();
    }
  }]);
  return SignalRecorder;
}(_BaseLfo3.default);

exports.default = SignalRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbFJlY29yZGVyLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZHVyYXRpb24iLCJ0eXBlIiwiZGVmYXVsdCIsIm1pbiIsIm1ldGFzIiwia2luZCIsImNhbGxiYWNrIiwibnVsbGFibGUiLCJpZ25vcmVMZWFkaW5nWmVyb3MiLCJyZXRyaWV2ZUF1ZGlvQnVmZmVyIiwiY29uc3RhbnQiLCJhdWRpb0NvbnRleHQiLCJTaWduYWxSZWNvcmRlciIsIm9wdGlvbnMiLCJpc1JlY29yZGluZyIsInBhcmFtcyIsImdldCIsIkVycm9yIiwiX2F1ZGlvQ29udGV4dCIsIl9pZ25vcmVaZXJvcyIsIl9pc0luZmluaXRlQnVmZmVyIiwiX3N0YWNrIiwiX2J1ZmZlciIsIl9idWZmZXJMZW5ndGgiLCJfY3VycmVudEluZGV4IiwiRmxvYXQzMkFycmF5IiwibGVuZ3RoIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzYW1wbGVSYXRlIiwic3RyZWFtUGFyYW1zIiwic291cmNlU2FtcGxlUmF0ZSIsImlzRmluaXRlIiwiX2luaXRCdWZmZXIiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJjdXJyZW50SW5kZXgiLCJidWZmZXIiLCJvdXRwdXQiLCJzZXQiLCJzdWJhcnJheSIsImJ1ZmZlckxlbmd0aCIsInN0YWNrIiwiaSIsInN0YWNrZWRCdWZmZXIiLCJhdWRpb0J1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsImNoYW5uZWxEYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJlbmRUaW1lIiwic3RvcCIsImZyYW1lIiwiYmxvY2siLCJpbnB1dCIsImRhdGEiLCJhdmFpbGFibGVTcGFjZSIsImN1cnJlbnRCbG9jayIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGNBQWM7QUFDbEJDLFlBQVU7QUFDUkMsVUFBTSxPQURFO0FBRVJDLGFBQVMsRUFGRDtBQUdSQyxTQUFLLENBSEc7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QixDQUFmLENBREYsS0FHRUMsZUFBZUosS0FBZjs7QUFFRmYsZUFBT0UsR0FBUCxDQUFXaUIsWUFBWCxFQUF5QixLQUFLL0IsYUFBOUI7QUFDQSxhQUFLQSxhQUFMLElBQXNCK0IsYUFBYTdCLE1BQW5DOztBQUVBLFlBQUksS0FBS04saUJBQUwsSUFBMEIsS0FBS0ksYUFBTCxLQUF1QmdCLFlBQXJELEVBQW1FO0FBQ2pFLGVBQUtuQixNQUFMLENBQVltQyxJQUFaLENBQWlCcEIsTUFBakI7O0FBRUFtQix5QkFBZUosTUFBTVosUUFBTixDQUFlZSxjQUFmLENBQWY7QUFDQSxlQUFLaEMsT0FBTCxHQUFlLElBQUlHLFlBQUosQ0FBaUJlLFlBQWpCLENBQWY7QUFDQSxlQUFLbEIsT0FBTCxDQUFhZ0IsR0FBYixDQUFpQmlCLFlBQWpCLEVBQStCLENBQS9CO0FBQ0EsZUFBSy9CLGFBQUwsR0FBcUIrQixhQUFhN0IsTUFBbEM7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSSxDQUFDLEtBQUtOLGlCQUFOLElBQTJCLEtBQUtJLGFBQUwsS0FBdUJnQixZQUF0RCxFQUNFLEtBQUtTLElBQUw7QUFDSDs7Ozs7a0JBR1lyQyxjIiwiZmlsZSI6IlNpZ25hbFJlY29yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBkdXJhdGlvbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMTAsXG4gICAgbWluOiAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgaWdub3JlTGVhZGluZ1plcm9zOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgcmV0cmlldmVBdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXVkaW9Db250ZXh0OiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogUmVjb3JkIGFuIGBzaWduYWxgIGlucHV0IHN0cmVhbSBvZiBhcmJpdHJhcnkgZHVyYXRpb24gYW5kIHJldHJpZXZlIGl0XG4gKiB3aGVuIGRvbmUuXG4gKlxuICogV2hlbiByZWNvcmRpbmcgaXMgc3RvcHBlZCAoZWl0aGVyIHdoZW4gdGhlIGBzdG9wYCBtZXRob2QgaXMgY2FsbGVkLCB0aGVcbiAqIGRlZmluZWQgZHVyYXRpb24gaGFzIGJlZW4gcmVjb3JkZWQsIG9yIHRoZSBzb3VyY2Ugb2YgdGhlIGdyYXBoIGZpbmFsaXplZFxuICogdGhlIHN0cmVhbSksIHRoZSBjYWxsYmFjayBnaXZlbiBhcyBwYXJhbWV0ZXIgaXMgZXhlY3V0ZWQgIHdpdGggdGhlXG4gKiBgQXVkaW9CdWZmZXJgIG9yIGBGbG9hdDMyQXJyYXlgIGNvbnRhaW5pbmcgdGhlIHJlY29yZGVkIHNpZ25hbCBhcyBhcmd1bWVudC5cbiAqXG4gKiBAdG9kbyAtIGFkZCBvcHRpb24gdG8gcmV0dXJuIG9ubHkgdGhlIEZsb2F0MzJBcnJheSBhbmQgbm90IGFuIGF1ZGlvIGJ1ZmZlclxuICogIChub2RlIGNvbXBsaWFudCkgYHJldHJpZXZlQXVkaW9CdWZmZXI6IGZhbHNlYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmR1cmF0aW9uPTEwXSAtIE1heGltdW0gZHVyYXRpb24gb2YgdGhlIHJlY29yZGluZy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jYWxsYmFja10gLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBuZXcgcmVjb3JkIGlzXG4gKiAgZW5kZWQuIFRoaXMgY2FuIGhhcHBlbjogYHN0b3BgIGlzIGNhbGxlZCBvbiB0aGUgcmVjb3JkZXIsIGBzdG9wYCBpcyBjYWxsZWRcbiAqICBvbiB0aGUgc291cmNlIG9yIHdoZW4gdGhlIGJ1ZmZlciBpcyBmdWxsIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gYGR1cmF0aW9uYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pZ25vcmVMZWFkaW5nWmVyb3M9dHJ1ZV0gLSBTdGFydCB0aGUgZWZmZWN0aXZlXG4gKiAgcmVjb3JkaW5nIG9uIHRoZSBmaXJzdCBub24temVybyB2YWx1ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmV0cmlldmVBdWRpb0J1ZmZlcj1mYWxzZV0gLSBEZWZpbmUgaWYgYW4gYEF1ZGlvQnVmZmVyYFxuICogIHNob3VsZCBiZSByZXRyaWV2ZWQgb3Igb25seSB0aGUgcmF3IEZsb2F0MzJBcnJheSBvZiBkYXRhLlxuICogICh3b3JrcyBvbmx5IGluIGJyb3dzZXIpXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW29wdGlvbnMuYXVkaW9Db250ZXh0PW51bGxdIC0gSWZcbiAqICBgcmV0cmlldmVBdWRpb0J1ZmZlcmAgaXMgc2V0IHRvIGB0cnVlYCwgYXVkaW8gY29udGV4dCB0byBiZSB1c2VkXG4gKiAgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSBmaW5hbCBhdWRpbyBidWZmZXIuXG4gKiAgKHdvcmtzIG9ubHkgaW4gYnJvd3NlcilcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zaW5rXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gKlxuICogbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xuICogICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAqICAgLnRoZW4oaW5pdClcbiAqICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gKlxuICogZnVuY3Rpb24gaW5pdChzdHJlYW0pIHtcbiAqICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gKlxuICogICBjb25zdCBhdWRpb0luTm9kZSA9IG5ldyBsZm8uc291cmNlLkF1ZGlvSW5Ob2RlKHtcbiAqICAgICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgIH0pO1xuICpcbiAqICAgY29uc3Qgc2lnbmFsUmVjb3JkZXIgPSBuZXcgbGZvLnNpbmsuU2lnbmFsUmVjb3JkZXIoe1xuICogICAgIGR1cmF0aW9uOiA2LFxuICogICAgIHJldHJpZXZlQXVkaW9CdWZmZXI6IHRydWUsXG4gKiAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gKiAgICAgY2FsbGJhY2s6IChidWZmZXIpID0+IHtcbiAqICAgICAgIGNvbnN0IGJ1ZmZlclNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAqICAgICAgIGJ1ZmZlclNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gKiAgICAgICBidWZmZXJTb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICogICAgICAgYnVmZmVyU291cmNlLnN0YXJ0KCk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiAgIGF1ZGlvSW5Ob2RlLmNvbm5lY3Qoc2lnbmFsUmVjb3JkZXIpO1xuICogICBhdWRpb0luTm9kZS5zdGFydCgpO1xuICogICBzaWduYWxSZWNvcmRlci5zdGFydCgpO1xuICogfSk7XG4gKi9cbmNsYXNzIFNpZ25hbFJlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZSBpcyB0aGUgbm9kZSBpcyBjdXJyZW50bHkgcmVjb3JkaW5nIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGlzUmVjb3JkaW5nXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2luay5TaWduYWxSZWNvcmRlclxuICAgICAqL1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IHJldHJpZXZlQXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ3JldHJpZXZlQXVkaW9CdWZmZXInKTtcbiAgICBsZXQgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICAvLyBuZWVkZWQgdG8gcmV0cmlldmUgYW4gQXVkaW9CdWZmZXJcbiAgICBpZiAocmV0cmlldmVBdWRpb0J1ZmZlciAmJiBhdWRpb0NvbnRleHQgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyIFwiYXVkaW9Db250ZXh0XCI6IGFuZCBBdWRpb0NvbnRleHQgbXVzdCBiZSBwcm92aWRlZCB3aGVuIGByZXRyaWV2ZUF1ZGlvQnVmZmVyYCBpcyBzZXQgdG8gYHRydWVgJylcblxuICAgIHRoaXMuX2F1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5fYnVmZmVyTGVuZ3RoID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50SW5kZXggPSBudWxsO1xuICB9XG5cbiAgX2luaXRCdWZmZXIoKSB7XG4gICAgdGhpcy5fYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9idWZmZXJMZW5ndGgpO1xuICAgIHRoaXMuX3N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fY3VycmVudEluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmdldCgnZHVyYXRpb24nKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGlmIChpc0Zpbml0ZShkdXJhdGlvbikpIHtcbiAgICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IHNhbXBsZVJhdGUgKiBkdXJhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciA9IHRydWU7XG4gICAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBzYW1wbGVSYXRlICogMTA7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCByZWNvcmRpbmcuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IHRoaXMucGFyYW1zLmdldCgnaWdub3JlTGVhZGluZ1plcm9zJyk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCByZWNvcmRpbmcgYW5kIGV4ZWN1dGUgdGhlIGNhbGxiYWNrIGRlZmluZWQgaW4gcGFyYW1ldGVycy5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuaXNSZWNvcmRpbmcpIHtcbiAgICAgIC8vIGlnbm9yZSBuZXh0IGluY29tbWluZyBmcmFtZVxuICAgICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuXG4gICAgICBjb25zdCByZXRyaWV2ZUF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdyZXRyaWV2ZUF1ZGlvQnVmZmVyJyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuX2N1cnJlbnRJbmRleDtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcjtcbiAgICAgIGxldCBvdXRwdXQ7XG5cbiAgICAgIGlmICghdGhpcy5faXNJbmZpbml0ZUJ1ZmZlcikge1xuICAgICAgICBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KGN1cnJlbnRJbmRleCk7XG4gICAgICAgIG91dHB1dC5zZXQoYnVmZmVyLnN1YmFycmF5KDAsIGN1cnJlbnRJbmRleCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgYnVmZmVyTGVuZ3RoID0gdGhpcy5fYnVmZmVyTGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgICAgICBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCArIGN1cnJlbnRJbmRleCk7XG5cbiAgICAgICAgLy8gY29weSBhbGwgc3RhY2tlZCBidWZmZXJzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzdGFja2VkQnVmZmVyID0gc3RhY2tbaV07XG4gICAgICAgICAgb3V0cHV0LnNldChzdGFja2VkQnVmZmVyLCBidWZmZXJMZW5ndGggKiBpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29weSBkYXRhIGNvbnRhaW5lZCBpbiBjdXJyZW50IGJ1ZmZlclxuICAgICAgICBvdXRwdXQuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBjdXJyZW50SW5kZXgpLCBzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmV0cmlldmVBdWRpb0J1ZmZlciAmJiB0aGlzLl9hdWRpb0NvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIHNhbXBsZVJhdGUpO1xuICAgICAgICBjb25zdCBjaGFubmVsRGF0YSA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBjaGFubmVsRGF0YS5zZXQob3V0cHV0LCAwKTtcblxuICAgICAgICBjYWxsYmFjayhhdWRpb0J1ZmZlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhvdXRwdXQpO1xuICAgICAgfVxuXG4gICAgICAvLyByZWluaXQgYnVmZmVyLCBzdGFjaywgYW5kIGN1cnJlbnRJbmRleFxuICAgICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlY29yZGluZylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBibG9jayA9IG51bGw7XG4gICAgY29uc3QgaW5wdXQgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuX2J1ZmZlckxlbmd0aDtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9idWZmZXI7XG5cbiAgICBpZiAodGhpcy5faWdub3JlWmVyb3MgPT09IGZhbHNlKSB7XG4gICAgICBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRbaW5wdXQubGVuZ3RoIC0gMV0gIT09IDApIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgaW5kZXggd2hlcmUgdmFsdWUgIT09IDBcbiAgICAgIGxldCBpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmIChpbnB1dFtpXSAhPT0gMCkgYnJlYWs7XG5cbiAgICAgIC8vIGNvcHkgbm9uIHplcm8gc2VnbWVudFxuICAgICAgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGlucHV0LnN1YmFycmF5KGkpKTtcbiAgICAgIC8vIGRvbid0IHJlcGVhdCB0aGlzIGxvZ2ljIG9uY2UgYSBub24temVybyB2YWx1ZSBoYXMgYmVlbiBmb3VuZFxuICAgICAgdGhpcy5faWdub3JlWmVyb3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYmxvY2sgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVNwYWNlID0gYnVmZmVyTGVuZ3RoIC0gdGhpcy5fY3VycmVudEluZGV4O1xuICAgICAgbGV0IGN1cnJlbnRCbG9jaztcbiAgICAgIC8vIHJldHVybiBpZiBhbHJlYWR5IGZ1bGwgKGNhbiBpdCBoYXBwZW4gPylcbiAgICAgIC8vIGlmIChhdmFpbGFibGVTcGFjZSA8PSAwKSByZXR1cm47XG5cbiAgICAgIGlmIChhdmFpbGFibGVTcGFjZSA8IGJsb2NrLmxlbmd0aClcbiAgICAgICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoMCwgYXZhaWxhYmxlU3BhY2UpO1xuICAgICAgZWxzZVxuICAgICAgICBjdXJyZW50QmxvY2sgPSBibG9jaztcblxuICAgICAgYnVmZmVyLnNldChjdXJyZW50QmxvY2ssIHRoaXMuX2N1cnJlbnRJbmRleCk7XG4gICAgICB0aGlzLl9jdXJyZW50SW5kZXggKz0gY3VycmVudEJsb2NrLmxlbmd0aDtcblxuICAgICAgaWYgKHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgJiYgdGhpcy5fY3VycmVudEluZGV4ID09PSBidWZmZXJMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fc3RhY2sucHVzaChidWZmZXIpO1xuXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrLnN1YmFycmF5KGF2YWlsYWJsZVNwYWNlKTtcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJMZW5ndGgpO1xuICAgICAgICB0aGlzLl9idWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgMCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCA9IGN1cnJlbnRCbG9jay5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gIHN0b3AgaWYgdGhlIGJ1ZmZlciBpcyBmaW5pdGUgYW5kIGZ1bGxcbiAgICBpZiAoIXRoaXMuX2lzSW5maW5pdGVCdWZmZXIgJiYgdGhpcy5fY3VycmVudEluZGV4ID09PSBidWZmZXJMZW5ndGgpXG4gICAgICB0aGlzLnN0b3AoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWduYWxSZWNvcmRlcjtcblxuIl19