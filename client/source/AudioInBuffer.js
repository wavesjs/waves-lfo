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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = (0, _defineProperty3.default)({
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
}, 'progressCallback', {
  type: 'any',
  default: null,
  nullable: true,
  constant: true
});

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
 * @todo - Allow to pass raw buffer and sampleRate (simplified use server-side)
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

var AudioInBuffer = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInBuffer, _BaseLfo);

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
      this.initStream();

      var channel = this.params.get('channel');
      var audioBuffer = this.params.get('audioBuffer');
      var buffer = audioBuffer.getChannelData(channel);
      this.endTime = 0;

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
      var sampleRate = this.streamParams.sourceSampleRate;
      var frameSize = this.streamParams.frameSize;
      var progressCallback = this.params.get('progressCallback') || noop;
      var length = buffer.length;
      var nbrFrames = Math.ceil(buffer.length / frameSize);
      var data = this.frame.data;
      var that = this;
      var i = 0;

      (function slice() {
        var offset = i * frameSize;
        var nbrCopy = Math.min(length - offset, frameSize);

        for (var j = 0; j < frameSize; j++) {
          data[j] = j < nbrCopy ? buffer[offset + j] : 0;
        }that.frame.time = offset / sampleRate;
        that.endTime = that.frame.time + nbrCopy / sampleRate;
        that.propagateFrame();

        i += 1;
        progressCallback(i / nbrFrames);

        if (i < nbrFrames) setTimeout(slice, 0);else that.finalizeStream(that.endTime);
      })();
    }
  }]);
  return AudioInBuffer;
}(_BaseLfo3.default);

exports.default = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJhdWRpb0J1ZmZlciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm51bGxhYmxlIiwibm9vcCIsIkF1ZGlvSW5CdWZmZXIiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJlbmRUaW1lIiwiaW5pdFN0cmVhbSIsImJ1ZmZlciIsImdldENoYW5uZWxEYXRhIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJzb3VyY2VTYW1wbGVSYXRlIiwic2FtcGxlUmF0ZSIsImZyYW1lUmF0ZSIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwibGVuZ3RoIiwibmJyRnJhbWVzIiwiTWF0aCIsImNlaWwiLCJkYXRhIiwiZnJhbWUiLCJ0aGF0IiwiaSIsInNsaWNlIiwib2Zmc2V0IiwibmJyQ29weSIsIm1pbiIsImoiLCJ0aW1lIiwicHJvcGFnYXRlRnJhbWUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsSUFBTUE7QUFDSkMsZUFBYTtBQUNYQyxVQUFNLEtBREs7QUFFWEMsYUFBUyxJQUZFO0FBR1hDLGNBQVU7QUFIQyxHQURUO0FBTUpDLGFBQVc7QUFDVEgsVUFBTSxTQURHO0FBRVRDLGFBQVMsR0FGQTtBQUdUQyxjQUFVO0FBSEQsR0FOUDtBQVdKRSxXQUFTO0FBQ1BKLFVBQU0sU0FEQztBQUVQQyxhQUFTLENBRkY7QUFHUEMsY0FBVTtBQUhILEdBWEw7QUFnQkpHLG9CQUFrQjtBQUNoQkwsVUFBTSxLQURVO0FBRWhCQyxhQUFTLElBRk87QUFHaEJLLGNBQVUsSUFITTtBQUloQkosY0FBVTtBQUpNO0FBaEJkLHVCQXNCYztB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LElBQVgsR0FBa0JKLFNBQVNmLFVBQTNCO0FBQ0FZLGFBQUtuQixPQUFMLEdBQWVtQixLQUFLRCxLQUFMLENBQVdRLElBQVgsR0FBa0JILFVBQVVoQixVQUEzQztBQUNBWSxhQUFLUSxjQUFMOztBQUVBUCxhQUFLLENBQUw7QUFDQTVCLHlCQUFpQjRCLElBQUlOLFNBQXJCOztBQUVBLFlBQUlNLElBQUlOLFNBQVIsRUFDRWMsV0FBV1AsS0FBWCxFQUFrQixDQUFsQixFQURGLEtBR0VGLEtBQUtkLGNBQUwsQ0FBb0JjLEtBQUtuQixPQUF6QjtBQUNILE9BbEJBLEdBQUQ7QUFtQkQ7Ozs7O2tCQUdZTCxhIiwiZmlsZSI6IkF1ZGlvSW5CdWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBhdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgcHJvZ3Jlc3NDYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogU2xpY2UgYW4gYEF1ZGlvQnVmZmVyYCBpbnRvIHNpZ25hbCBibG9ja3MgYW5kIHByb3BhZ2F0ZSB0aGUgcmVzdWx0aW5nIGZyYW1lc1xuICogdGhyb3VnaCB0aGUgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXInIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gW29wdGlvbnMuYXVkaW9CdWZmZXJdIC0gQXVkaW8gYnVmZmVyIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIHRoZSBvdXRwdXQgYmxvY2tzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBOdW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gcHJvY2Vzcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wcm9ncmVzc0NhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhjdXRlZCBvbiBlYWNoXG4gKiAgZnJhbWUgb3V0cHV0LCByZWNlaXZlIGFzIGFyZ3VtZW50IHRoZSBjdXJyZW50IHByb2dyZXNzIHJhdGlvLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y2xpZW50LnNvdXJjZVxuICpcbiAqIEB0b2RvIC0gQWxsb3cgdG8gcGFzcyByYXcgYnVmZmVyIGFuZCBzYW1wbGVSYXRlIChzaW1wbGlmaWVkIHVzZSBzZXJ2ZXItc2lkZSlcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5CdWZmZXIgPSBuZXcgbGZvLnNvdXJjZS5BdWRpb0luQnVmZmVyKHtcbiAqICAgYXVkaW9CdWZmZXI6IGF1ZGlvQnVmZmVyLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IHdhdmVmb3JtID0gbmV3IGxmby5zaW5rLldhdmVmb3JtKHtcbiAqICAgY2FudmFzOiAnI3dhdmVmb3JtJyxcbiAqICAgZHVyYXRpb246IDEsXG4gKiAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAqICAgcm1zOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkJ1ZmZlci5jb25uZWN0KHdhdmVmb3JtKTtcbiAqIGF1ZGlvSW5CdWZmZXIuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkJ1ZmZlciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcblxuICAgIGlmICghYXVkaW9CdWZmZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJhdWRpb0J1ZmZlclwiIHBhcmFtZXRlcicpO1xuXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgc3RhcnQgcHJvcGFnYXRpbmcgZnJhbWVzLlxuICAgKiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2YgdGhlIGdpdmVuIGBhdWRpb0J1ZmZlcmAgc3RhcnRzIGltbWVkaWF0ZWx5IGFuZFxuICAgKiBlYWNoIHJlc3VsdGluZyBmcmFtZSBpcyBwcm9wYWdhdGVkIGluIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNsaWVudC5zb3VyY2UuQXVkaW9JbkJ1ZmZlciNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5pbml0U3RyZWFtKCk7XG5cbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQnVmZmVyJyk7XG4gICAgY29uc3QgYnVmZmVyID0gYXVkaW9CdWZmZXIuZ2V0Q2hhbm5lbERhdGEoY2hhbm5lbCk7XG4gICAgdGhpcy5lbmRUaW1lID0gMDtcblxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKGJ1ZmZlcik7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIFdoZW4gY2FsbGVkLCB0aGUgc2xpY2luZyBvZlxuICAgKiB0aGUgYGF1ZGlvQnVmZmVyYCBzdG9wcyBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IGF1ZGlvQnVmZmVyLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gc291cmNlU2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShidWZmZXIpIHtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3QgbmJyRnJhbWVzID0gTWF0aC5jZWlsKGJ1ZmZlci5sZW5ndGggLyBmcmFtZVNpemUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgKGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gaSAqIGZyYW1lU2l6ZTtcbiAgICAgIGNvbnN0IG5ickNvcHkgPSBNYXRoLm1pbihsZW5ndGggLSBvZmZzZXQsIGZyYW1lU2l6ZSk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZnJhbWVTaXplOyBqKyspXG4gICAgICAgIGRhdGFbal0gPSBqIDwgbmJyQ29weSA/IGJ1ZmZlcltvZmZzZXQgKyBqXSA6IDA7XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IG9mZnNldCAvIHNhbXBsZVJhdGU7XG4gICAgICB0aGF0LmVuZFRpbWUgPSB0aGF0LmZyYW1lLnRpbWUgKyBuYnJDb3B5IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoYXQucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgaSArPSAxO1xuICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhpIC8gbmJyRnJhbWVzKTtcblxuICAgICAgaWYgKGkgPCBuYnJGcmFtZXMpXG4gICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgZWxzZVxuICAgICAgICB0aGF0LmZpbmFsaXplU3RyZWFtKHRoYXQuZW5kVGltZSk7XG4gICAgfSgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luQnVmZmVyO1xuIl19