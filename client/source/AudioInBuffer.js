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

var _BaseLfo2 = require('../../common/core/BaseLfo');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJhdWRpb0J1ZmZlciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm51bGxhYmxlIiwibm9vcCIsIkF1ZGlvSW5CdWZmZXIiLCJvcHRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJlbmRUaW1lIiwiaW5pdFN0cmVhbSIsImJ1ZmZlciIsImdldENoYW5uZWxEYXRhIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJzb3VyY2VTYW1wbGVSYXRlIiwic2FtcGxlUmF0ZSIsImZyYW1lUmF0ZSIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwibGVuZ3RoIiwibmJyRnJhbWVzIiwiTWF0aCIsImNlaWwiLCJkYXRhIiwiZnJhbWUiLCJ0aGF0IiwiaSIsInNsaWNlIiwib2Zmc2V0IiwibmJyQ29weSIsIm1pbiIsImoiLCJ0aW1lIiwicHJvcGFnYXRlRnJhbWUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsSUFBTUE7QUFDSkMsZUFBYTtBQUNYQyxVQUFNLEtBREs7QUFFWEMsYUFBUyxJQUZFO0FBR1hDLGNBQVU7QUFIQyxHQURUO0FBTUpDLGFBQVc7QUFDVEgsVUFBTSxTQURHO0FBRVRDLGFBQVMsR0FGQTtBQUdUQyxjQUFVO0FBSEQsR0FOUDtBQVdKRSxXQUFTO0FBQ1BKLFVBQU0sU0FEQztBQUVQQyxhQUFTLENBRkY7QUFHUEMsY0FBVTtBQUhILEdBWEw7QUFnQkpHLG9CQUFrQjtBQUNoQkwsVUFBTSxLQURVO0FBRWhCQyxhQUFTLElBRk87QUFHaEJLLGNBQVUsSUFITTtBQUloQkosY0FBVTtBQUpNO0FBaEJkLHVCQXNCYztB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LElBQVgsR0FBa0JKLFNBQVNmLFVBQTNCO0FBQ0FZLGFBQUtuQixPQUFMLEdBQWVtQixLQUFLRCxLQUFMLENBQVdRLElBQVgsR0FBa0JILFVBQVVoQixVQUEzQztBQUNBWSxhQUFLUSxjQUFMOztBQUVBUCxhQUFLLENBQUw7QUFDQTVCLHlCQUFpQjRCLElBQUlOLFNBQXJCOztBQUVBLFlBQUlNLElBQUlOLFNBQVIsRUFDRWMsV0FBV1AsS0FBWCxFQUFrQixDQUFsQixFQURGLEtBR0VGLEtBQUtkLGNBQUwsQ0FBb0JjLEtBQUtuQixPQUF6QjtBQUNILE9BbEJBLEdBQUQ7QUFtQkQ7Ozs7O2tCQUdZTCxhIiwiZmlsZSI6IkF1ZGlvSW5CdWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb21tb24vY29yZS9CYXNlTGZvJztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYXVkaW9CdWZmZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIFNsaWNlIGFuIGBBdWRpb0J1ZmZlcmAgaW50byBzaWduYWwgYmxvY2tzIGFuZCBwcm9wYWdhdGUgdGhlIHJlc3VsdGluZyBmcmFtZXNcbiAqIHRocm91Z2ggdGhlIGdyYXBoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVyJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IFtvcHRpb25zLmF1ZGlvQnVmZmVyXSAtIEF1ZGlvIGJ1ZmZlciB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGJsb2Nrcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gTnVtYmVyIG9mIHRoZSBjaGFubmVsIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucHJvZ3Jlc3NDYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4Y3V0ZWQgb24gZWFjaFxuICogIGZyYW1lIG91dHB1dCwgcmVjZWl2ZSBhcyBhcmd1bWVudCB0aGUgY3VycmVudCBwcm9ncmVzcyByYXRpby5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zb3VyY2VcbiAqXG4gKiBAdG9kbyAtIEFsbG93IHRvIHBhc3MgcmF3IGJ1ZmZlciBhbmQgc2FtcGxlUmF0ZSAoc2ltcGxpZmllZCB1c2Ugc2VydmVyLXNpZGUpXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0luQnVmZmVyID0gbmV3IGxmby5zb3VyY2UuQXVkaW9JbkJ1ZmZlcih7XG4gKiAgIGF1ZGlvQnVmZmVyOiBhdWRpb0J1ZmZlcixcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybSA9IG5ldyBsZm8uc2luay5XYXZlZm9ybSh7XG4gKiAgIGNhbnZhczogJyN3YXZlZm9ybScsXG4gKiAgIGR1cmF0aW9uOiAxLFxuICogICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gKiAgIHJtczogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdCh3YXZlZm9ybSk7XG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQnVmZmVyJyk7XG5cbiAgICBpZiAoIWF1ZGlvQnVmZmVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwiYXVkaW9CdWZmZXJcIiBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRoZSBgc3RyZWFtUGFyYW1zYCBpbiB0aGUgZ3JhcGggYW5kIHN0YXJ0IHByb3BhZ2F0aW5nIGZyYW1lcy5cbiAgICogV2hlbiBjYWxsZWQsIHRoZSBzbGljaW5nIG9mIHRoZSBnaXZlbiBgYXVkaW9CdWZmZXJgIHN0YXJ0cyBpbW1lZGlhdGVseSBhbmRcbiAgICogZWFjaCByZXN1bHRpbmcgZnJhbWUgaXMgcHJvcGFnYXRlZCBpbiBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RvcH1cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgIHRoaXMuZW5kVGltZSA9IDA7XG5cbiAgICB0aGlzLnByb2Nlc3NGcmFtZShidWZmZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2ZcbiAgICogdGhlIGBhdWRpb0J1ZmZlcmAgc3RvcHMgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luQnVmZmVyI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSBhdWRpb0J1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzaWduYWwnO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ3Byb2dyZXNzQ2FsbGJhY2snKSB8fMKgbm9vcDtcbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChidWZmZXIubGVuZ3RoIC8gZnJhbWVTaXplKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBpID0gMDtcblxuICAgIChmdW5jdGlvbiBzbGljZSgpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGkgKiBmcmFtZVNpemU7XG4gICAgICBjb25zdCBuYnJDb3B5ID0gTWF0aC5taW4obGVuZ3RoIC0gb2Zmc2V0LCBmcmFtZVNpemUpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZyYW1lU2l6ZTsgaisrKVxuICAgICAgICBkYXRhW2pdID0gaiA8IG5ickNvcHkgPyBidWZmZXJbb2Zmc2V0ICsgal0gOiAwO1xuXG4gICAgICB0aGF0LmZyYW1lLnRpbWUgPSBvZmZzZXQgLyBzYW1wbGVSYXRlO1xuICAgICAgdGhhdC5lbmRUaW1lID0gdGhhdC5mcmFtZS50aW1lICsgbmJyQ29weSAvIHNhbXBsZVJhdGU7XG4gICAgICB0aGF0LnByb3BhZ2F0ZUZyYW1lKCk7XG5cbiAgICAgIGkgKz0gMTtcbiAgICAgIHByb2dyZXNzQ2FsbGJhY2soaSAvIG5ickZyYW1lcyk7XG5cbiAgICAgIGlmIChpIDwgbmJyRnJhbWVzKVxuICAgICAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhhdC5maW5hbGl6ZVN0cmVhbSh0aGF0LmVuZFRpbWUpO1xuICAgIH0oKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9JbkJ1ZmZlcjtcbiJdfQ==