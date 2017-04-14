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
    if (retrieveAudioBuffer && audioContext === null) throw new Error('Invalid parameter "audioContext": an AudioContext must be provided when `retrieveAudioBuffer` is set to `true`');

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

        //  stop if the buffer is finite and full
        if (!this._isInfiniteBuffer && this._currentIndex === bufferLength) this.stop();
      }
    }
  }]);
  return SignalRecorder;
}(_BaseLfo3.default);

exports.default = SignalRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpZ25hbFJlY29yZGVyLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZHVyYXRpb24iLCJ0eXBlIiwiZGVmYXVsdCIsIm1pbiIsIm1ldGFzIiwia2luZCIsImNhbGxiYWNrIiwibnVsbGFibGUiLCJpZ25vcmVMZWFkaW5nWmVyb3MiLCJyZXRyaWV2ZUF1ZGlvQnVmZmVyIiwiY29uc3RhbnQiLCJhdWRpb0NvbnRleHQiLCJTaWduYWxSZWNvcmRlciIsIm9wdGlvbnMiLCJpc1JlY29yZGluZyIsInBhcmFtcyIsImdldCIsIkVycm9yIiwiX2F1ZGlvQ29udGV4dCIsIl9pZ25vcmVaZXJvcyIsIl9pc0luZmluaXRlQnVmZmVyIiwiX3N0YWNrIiwiX2J1ZmZlciIsIl9idWZmZXJMZW5ndGgiLCJfY3VycmVudEluZGV4IiwiRmxvYXQzMkFycmF5IiwibGVuZ3RoIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJzYW1wbGVSYXRlIiwic3RyZWFtUGFyYW1zIiwic291cmNlU2FtcGxlUmF0ZSIsImlzRmluaXRlIiwiX2luaXRCdWZmZXIiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJjdXJyZW50SW5kZXgiLCJidWZmZXIiLCJvdXRwdXQiLCJzZXQiLCJzdWJhcnJheSIsImJ1ZmZlckxlbmd0aCIsInN0YWNrIiwiaSIsInN0YWNrZWRCdWZmZXIiLCJhdWRpb0J1ZmZlciIsImNyZWF0ZUJ1ZmZlciIsImNoYW5uZWxEYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJlbmRUaW1lIiwic3RvcCIsImZyYW1lIiwiYmxvY2siLCJpbnB1dCIsImRhdGEiLCJhdmFpbGFibGVTcGFjZSIsImN1cnJlbnRCbG9jayIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGNBQWM7QUFDbEJDLFlBQVU7QUFDUkMsVUFBTSxPQURFO0FBRVJDLGFBQVMsRUFGRDtBQUdSQyxTQUFLLENBSEc7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RixLQUdFQyxlQUFlSixLQUFmOztBQUVGZixlQUFPRSxHQUFQLENBQVdpQixZQUFYLEVBQXlCLEtBQUsvQixhQUE5QjtBQUNBLGFBQUtBLGFBQUwsSUFBc0IrQixhQUFhN0IsTUFBbkM7O0FBRUEsWUFBSSxLQUFLTixpQkFBTCxJQUEwQixLQUFLSSxhQUFMLEtBQXVCZ0IsWUFBckQsRUFBbUU7QUFDakUsZUFBS25CLE1BQUwsQ0FBWW1DLElBQVosQ0FBaUJwQixNQUFqQjs7QUFFQW1CLHlCQUFlSixNQUFNWixRQUFOLENBQWVlLGNBQWYsQ0FBZjtBQUNBLGVBQUtoQyxPQUFMLEdBQWUsSUFBSUcsWUFBSixDQUFpQmUsWUFBakIsQ0FBZjtBQUNBLGVBQUtsQixPQUFMLENBQWFnQixHQUFiLENBQWlCaUIsWUFBakIsRUFBK0IsQ0FBL0I7QUFDQSxlQUFLL0IsYUFBTCxHQUFxQitCLGFBQWE3QixNQUFsQztBQUNEOztBQUVEO0FBQ0EsWUFBSSxDQUFDLEtBQUtOLGlCQUFOLElBQTJCLEtBQUtJLGFBQUwsS0FBdUJnQixZQUF0RCxFQUNFLEtBQUtTLElBQUw7QUFDSDtBQUNGOzs7OztrQkFHWXJDLGMiLCJmaWxlIjoiU2lnbmFsUmVjb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZHVyYXRpb246IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEwLFxuICAgIG1pbjogMCxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIGlnbm9yZUxlYWRpbmdaZXJvczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHJldHJpZXZlQXVkaW9CdWZmZXI6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGF1ZGlvQ29udGV4dDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFJlY29yZCBhbiBgc2lnbmFsYCBpbnB1dCBzdHJlYW0gb2YgYXJiaXRyYXJ5IGR1cmF0aW9uIGFuZCByZXRyaWV2ZSBpdFxuICogd2hlbiBkb25lLlxuICpcbiAqIFdoZW4gcmVjb3JkaW5nIGlzIHN0b3BwZWQgKGVpdGhlciB3aGVuIHRoZSBgc3RvcGAgbWV0aG9kIGlzIGNhbGxlZCwgdGhlXG4gKiBkZWZpbmVkIGR1cmF0aW9uIGhhcyBiZWVuIHJlY29yZGVkLCBvciB0aGUgc291cmNlIG9mIHRoZSBncmFwaCBmaW5hbGl6ZWRcbiAqIHRoZSBzdHJlYW0pLCB0aGUgY2FsbGJhY2sgZ2l2ZW4gYXMgcGFyYW1ldGVyIGlzIGV4ZWN1dGVkICB3aXRoIHRoZVxuICogYEF1ZGlvQnVmZmVyYCBvciBgRmxvYXQzMkFycmF5YCBjb250YWluaW5nIHRoZSByZWNvcmRlZCBzaWduYWwgYXMgYXJndW1lbnQuXG4gKlxuICogQHRvZG8gLSBhZGQgb3B0aW9uIHRvIHJldHVybiBvbmx5IHRoZSBGbG9hdDMyQXJyYXkgYW5kIG5vdCBhbiBhdWRpbyBidWZmZXJcbiAqICAobm9kZSBjb21wbGlhbnQpIGByZXRyaWV2ZUF1ZGlvQnVmZmVyOiBmYWxzZWBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xMF0gLSBNYXhpbXVtIGR1cmF0aW9uIG9mIHRoZSByZWNvcmRpbmcuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2FsbGJhY2tdIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbmV3IHJlY29yZCBpc1xuICogIGVuZGVkLiBUaGlzIGNhbiBoYXBwZW46IGBzdG9wYCBpcyBjYWxsZWQgb24gdGhlIHJlY29yZGVyLCBgc3RvcGAgaXMgY2FsbGVkXG4gKiAgb24gdGhlIHNvdXJjZSBvciB3aGVuIHRoZSBidWZmZXIgaXMgZnVsbCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGBkdXJhdGlvbmAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaWdub3JlTGVhZGluZ1plcm9zPXRydWVdIC0gU3RhcnQgdGhlIGVmZmVjdGl2ZVxuICogIHJlY29yZGluZyBvbiB0aGUgZmlyc3Qgbm9uLXplcm8gdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJldHJpZXZlQXVkaW9CdWZmZXI9ZmFsc2VdIC0gRGVmaW5lIGlmIGFuIGBBdWRpb0J1ZmZlcmBcbiAqICBzaG91bGQgYmUgcmV0cmlldmVkIG9yIG9ubHkgdGhlIHJhdyBGbG9hdDMyQXJyYXkgb2YgZGF0YS5cbiAqICAod29ya3Mgb25seSBpbiBicm93c2VyKVxuICogQHBhcmFtIHtBdWRpb0NvbnRleHR9IFtvcHRpb25zLmF1ZGlvQ29udGV4dD1udWxsXSAtIElmXG4gKiAgYHJldHJpZXZlQXVkaW9CdWZmZXJgIGlzIHNldCB0byBgdHJ1ZWAsIGF1ZGlvIGNvbnRleHQgdG8gYmUgdXNlZFxuICogIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgZmluYWwgYXVkaW8gYnVmZmVyLlxuICogICh3b3JrcyBvbmx5IGluIGJyb3dzZXIpXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uc2lua1xuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICpcbiAqIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAqICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gKiAgIC50aGVuKGluaXQpXG4gKiAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuICpcbiAqIGZ1bmN0aW9uIGluaXQoc3RyZWFtKSB7XG4gKiAgIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqICAgY29uc3QgYXVkaW9Jbk5vZGUgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luTm9kZSh7XG4gKiAgICAgc291cmNlTm9kZTogc291cmNlLFxuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICB9KTtcbiAqXG4gKiAgIGNvbnN0IHNpZ25hbFJlY29yZGVyID0gbmV3IGxmby5zaW5rLlNpZ25hbFJlY29yZGVyKHtcbiAqICAgICBkdXJhdGlvbjogNixcbiAqICAgICByZXRyaWV2ZUF1ZGlvQnVmZmVyOiB0cnVlLFxuICogICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogICAgIGNhbGxiYWNrOiAoYnVmZmVyKSA9PiB7XG4gKiAgICAgICBjb25zdCBidWZmZXJTb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gKiAgICAgICBidWZmZXJTb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICogICAgICAgYnVmZmVyU291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAqICAgICAgIGJ1ZmZlclNvdXJjZS5zdGFydCgpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogICBhdWRpb0luTm9kZS5jb25uZWN0KHNpZ25hbFJlY29yZGVyKTtcbiAqICAgYXVkaW9Jbk5vZGUuc3RhcnQoKTtcbiAqICAgc2lnbmFsUmVjb3JkZXIuc3RhcnQoKTtcbiAqIH0pO1xuICovXG5jbGFzcyBTaWduYWxSZWNvcmRlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgaXMgdGhlIG5vZGUgaXMgY3VycmVudGx5IHJlY29yZGluZyBvciBub3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBpc1JlY29yZGluZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNpbmsuU2lnbmFsUmVjb3JkZXJcbiAgICAgKi9cbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCByZXRyaWV2ZUF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdyZXRyaWV2ZUF1ZGlvQnVmZmVyJyk7XG4gICAgbGV0IGF1ZGlvQ29udGV4dCA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9Db250ZXh0Jyk7XG4gICAgLy8gbmVlZGVkIHRvIHJldHJpZXZlIGFuIEF1ZGlvQnVmZmVyXG4gICAgaWYgKHJldHJpZXZlQXVkaW9CdWZmZXIgJiYgYXVkaW9Db250ZXh0ID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtZXRlciBcImF1ZGlvQ29udGV4dFwiOiBhbiBBdWRpb0NvbnRleHQgbXVzdCBiZSBwcm92aWRlZCB3aGVuIGByZXRyaWV2ZUF1ZGlvQnVmZmVyYCBpcyBzZXQgdG8gYHRydWVgJylcblxuICAgIHRoaXMuX2F1ZGlvQ29udGV4dCA9IGF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLl9pZ25vcmVaZXJvcyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5fYnVmZmVyTGVuZ3RoID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50SW5kZXggPSBudWxsO1xuICB9XG5cbiAgX2luaXRCdWZmZXIoKSB7XG4gICAgdGhpcy5fYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9idWZmZXJMZW5ndGgpO1xuICAgIHRoaXMuX3N0YWNrLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fY3VycmVudEluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmdldCgnZHVyYXRpb24nKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGlmIChpc0Zpbml0ZShkdXJhdGlvbikpIHtcbiAgICAgIHRoaXMuX2lzSW5maW5pdGVCdWZmZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2J1ZmZlckxlbmd0aCA9IHNhbXBsZVJhdGUgKiBkdXJhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciA9IHRydWU7XG4gICAgICB0aGlzLl9idWZmZXJMZW5ndGggPSBzYW1wbGVSYXRlICogMTA7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgdGhpcy5faWdub3JlWmVyb3MgPSB0aGlzLnBhcmFtcy5nZXQoJ2lnbm9yZUxlYWRpbmdaZXJvcycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgcmVjb3JkaW5nIGFuZCBleGVjdXRlIHRoZSBjYWxsYmFjayBkZWZpbmVkIGluIHBhcmFtZXRlcnMuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLmlzUmVjb3JkaW5nKSB7XG4gICAgICAvLyBpZ25vcmUgbmV4dCBpbmNvbW1pbmcgZnJhbWVcbiAgICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcblxuICAgICAgY29uc3QgcmV0cmlldmVBdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgncmV0cmlldmVBdWRpb0J1ZmZlcicpO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLl9jdXJyZW50SW5kZXg7XG4gICAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9idWZmZXI7XG4gICAgICBsZXQgb3V0cHV0O1xuXG4gICAgICBpZiAoIXRoaXMuX2lzSW5maW5pdGVCdWZmZXIpIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheShjdXJyZW50SW5kZXgpO1xuICAgICAgICBvdXRwdXQuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBjdXJyZW50SW5kZXgpLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuX2J1ZmZlckxlbmd0aDtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLl9zdGFjaztcblxuICAgICAgICBvdXRwdXQgPSBuZXcgRmxvYXQzMkFycmF5KHN0YWNrLmxlbmd0aCAqIGJ1ZmZlckxlbmd0aCArIGN1cnJlbnRJbmRleCk7XG5cbiAgICAgICAgLy8gY29weSBhbGwgc3RhY2tlZCBidWZmZXJzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBzdGFja2VkQnVmZmVyID0gc3RhY2tbaV07XG4gICAgICAgICAgb3V0cHV0LnNldChzdGFja2VkQnVmZmVyLCBidWZmZXJMZW5ndGggKiBpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29weSBkYXRhIGNvbnRhaW5lZCBpbiBjdXJyZW50IGJ1ZmZlclxuICAgICAgICBvdXRwdXQuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBjdXJyZW50SW5kZXgpLCBzdGFjay5sZW5ndGggKiBidWZmZXJMZW5ndGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmV0cmlldmVBdWRpb0J1ZmZlciAmJiB0aGlzLl9hdWRpb0NvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5fYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCBsZW5ndGgsIHNhbXBsZVJhdGUpO1xuICAgICAgICBjb25zdCBjaGFubmVsRGF0YSA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgICBjaGFubmVsRGF0YS5zZXQob3V0cHV0LCAwKTtcblxuICAgICAgICBjYWxsYmFjayhhdWRpb0J1ZmZlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhvdXRwdXQpO1xuICAgICAgfVxuXG4gICAgICAvLyByZWluaXQgYnVmZmVyLCBzdGFjaywgYW5kIGN1cnJlbnRJbmRleFxuICAgICAgdGhpcy5faW5pdEJ1ZmZlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGlmICghdGhpcy5pc1JlY29yZGluZylcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBibG9jayA9IG51bGw7XG4gICAgY29uc3QgaW5wdXQgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IHRoaXMuX2J1ZmZlckxlbmd0aDtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9idWZmZXI7XG5cbiAgICBpZiAodGhpcy5faWdub3JlWmVyb3MgPT09IGZhbHNlKSB7XG4gICAgICBibG9jayA9IG5ldyBGbG9hdDMyQXJyYXkoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRbaW5wdXQubGVuZ3RoIC0gMV0gIT09IDApIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgaW5kZXggd2hlcmUgdmFsdWUgIT09IDBcbiAgICAgIGxldCBpO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspXG4gICAgICAgIGlmIChpbnB1dFtpXSAhPT0gMCkgYnJlYWs7XG5cbiAgICAgIC8vIGNvcHkgbm9uIHplcm8gc2VnbWVudFxuICAgICAgYmxvY2sgPSBuZXcgRmxvYXQzMkFycmF5KGlucHV0LnN1YmFycmF5KGkpKTtcbiAgICAgIC8vIGRvbid0IHJlcGVhdCB0aGlzIGxvZ2ljIG9uY2UgYSBub24temVybyB2YWx1ZSBoYXMgYmVlbiBmb3VuZFxuICAgICAgdGhpcy5faWdub3JlWmVyb3MgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYmxvY2sgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGF2YWlsYWJsZVNwYWNlID0gYnVmZmVyTGVuZ3RoIC0gdGhpcy5fY3VycmVudEluZGV4O1xuICAgICAgbGV0IGN1cnJlbnRCbG9jaztcblxuICAgICAgaWYgKGF2YWlsYWJsZVNwYWNlIDwgYmxvY2subGVuZ3RoKVxuICAgICAgICBjdXJyZW50QmxvY2sgPSBibG9jay5zdWJhcnJheSgwLCBhdmFpbGFibGVTcGFjZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGN1cnJlbnRCbG9jayA9IGJsb2NrO1xuXG4gICAgICBidWZmZXIuc2V0KGN1cnJlbnRCbG9jaywgdGhpcy5fY3VycmVudEluZGV4KTtcbiAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCArPSBjdXJyZW50QmxvY2subGVuZ3RoO1xuXG4gICAgICBpZiAodGhpcy5faXNJbmZpbml0ZUJ1ZmZlciAmJiB0aGlzLl9jdXJyZW50SW5kZXggPT09IGJ1ZmZlckxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKGJ1ZmZlcik7XG5cbiAgICAgICAgY3VycmVudEJsb2NrID0gYmxvY2suc3ViYXJyYXkoYXZhaWxhYmxlU3BhY2UpO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2J1ZmZlci5zZXQoY3VycmVudEJsb2NrLCAwKTtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gY3VycmVudEJsb2NrLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgLy8gIHN0b3AgaWYgdGhlIGJ1ZmZlciBpcyBmaW5pdGUgYW5kIGZ1bGxcbiAgICAgIGlmICghdGhpcy5faXNJbmZpbml0ZUJ1ZmZlciAmJiB0aGlzLl9jdXJyZW50SW5kZXggPT09IGJ1ZmZlckxlbmd0aClcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ25hbFJlY29yZGVyO1xuXG4iXX0=