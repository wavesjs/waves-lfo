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
  }
};

/**
 * Slice an `AudioBuffer` into signal blocks and propagate the resulting frames
 * through the graph.
 *
 * @param {Object} options - Override parameter' default values.
 * @param {AudioBuffer} [options.audioBuffer] - Audio buffer to process.
 * @param {Number} [options.frameSize=512] - Size of the output blocks.
 * @param {Number} [options.channel=0] - Number of the channel to process.
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
      var length = buffer.length;
      var nbrFrames = Math.ceil(buffer.length / frameSize);
      var data = this.frame.data;

      for (var i = 0; i < nbrFrames; i++) {
        var offset = i * frameSize;
        var nbrCopy = Math.min(length - offset, frameSize);

        for (var j = 0; j < frameSize; j++) {
          data[j] = j < nbrCopy ? buffer[offset + j] : 0;
        }this.frame.time = offset / sampleRate;
        this.endTime = this.frame.time + nbrCopy / sampleRate;
        this.propagateFrame();
      }

      this.finalizeStream(this.endTime);
    }
  }]);
  return AudioInBuffer;
}(_BaseLfo3.default);

exports.default = AudioInBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJhdWRpb0J1ZmZlciIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwiQXVkaW9JbkJ1ZmZlciIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJFcnJvciIsImVuZFRpbWUiLCJpbml0U3RyZWFtIiwiYnVmZmVyIiwiZ2V0Q2hhbm5lbERhdGEiLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInNvdXJjZVNhbXBsZVJhdGUiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwic291cmNlU2FtcGxlQ291bnQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJsZW5ndGgiLCJuYnJGcmFtZXMiLCJNYXRoIiwiY2VpbCIsImRhdGEiLCJmcmFtZSIsImkiLCJvZmZzZXQiLCJuYnJDb3B5IiwibWluIiwiaiIsInRpbWUiLCJwcm9wYWdhdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsZUFBYTtBQUNYQyxVQUFNLEtBREs7QUFFWEMsYUFBUyxJQUZFO0FBR1hDLGNBQVU7QUFIQyxHQURLO0FBTWxCQyxhQUFXO0FBQ1RILFVBQU0sU0FERztBQUVUQyxhQUFTLEdBRkE7QUFHVEMsY0FBVTtBQUhELEdBTk87QUFXbEJFLFdBQVM7QUFDUEosVUFBTSxTQURDO0FBRVBDLGFBQVMsQ0FGRjtBQUdQQyxjQUFVO0FBSEg7QUFYUyxDQUFwQjs7QUFrQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0JNRyxhOzs7QUFDSiwyQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxvSkFDbEJSLFdBRGtCLEVBQ0xRLE9BREs7O0FBR3hCLFFBQU1QLGNBQWMsTUFBS1EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLGFBQWhCLENBQXBCOztBQUVBLFFBQUksQ0FBQ1QsV0FBTCxFQUNFLE1BQU0sSUFBSVUsS0FBSixDQUFVLGlDQUFWLENBQU47O0FBRUYsVUFBS0MsT0FBTCxHQUFlLENBQWY7QUFSd0I7QUFTekI7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7NEJBU1E7QUFDTixXQUFLQyxVQUFMOztBQUVBLFVBQU1QLFVBQVUsS0FBS0csTUFBTCxDQUFZQyxHQUFaLENBQWdCLFNBQWhCLENBQWhCO0FBQ0EsVUFBTVQsY0FBYyxLQUFLUSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBcEI7QUFDQSxVQUFNSSxTQUFTYixZQUFZYyxjQUFaLENBQTJCVCxPQUEzQixDQUFmO0FBQ0EsV0FBS00sT0FBTCxHQUFlLENBQWY7O0FBRUEsV0FBS0ksWUFBTCxDQUFrQkYsTUFBbEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OzsyQkFPTztBQUNMLFdBQUtHLGNBQUwsQ0FBb0IsS0FBS0wsT0FBekI7QUFDRDs7QUFFRDs7OzswQ0FDc0I7QUFDcEIsVUFBTVgsY0FBYyxLQUFLUSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBcEI7QUFDQSxVQUFNTCxZQUFZLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixDQUFsQjtBQUNBLFVBQU1RLG1CQUFtQmpCLFlBQVlrQixVQUFyQztBQUNBLFVBQU1DLFlBQVlGLG1CQUFtQmIsU0FBckM7O0FBRUEsV0FBS2dCLFlBQUwsQ0FBa0JoQixTQUFsQixHQUE4QkEsU0FBOUI7QUFDQSxXQUFLZ0IsWUFBTCxDQUFrQkQsU0FBbEIsR0FBOEJBLFNBQTlCO0FBQ0EsV0FBS0MsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsUUFBOUI7QUFDQSxXQUFLRCxZQUFMLENBQWtCSCxnQkFBbEIsR0FBcUNBLGdCQUFyQztBQUNBLFdBQUtHLFlBQUwsQ0FBa0JFLGlCQUFsQixHQUFzQ2xCLFNBQXRDOztBQUVBLFdBQUttQixxQkFBTDtBQUNEOztBQUVEOzs7O2lDQUNhVixNLEVBQVE7QUFDbkIsVUFBTUssYUFBYSxLQUFLRSxZQUFMLENBQWtCSCxnQkFBckM7QUFDQSxVQUFNYixZQUFZLEtBQUtnQixZQUFMLENBQWtCaEIsU0FBcEM7QUFDQSxVQUFNb0IsU0FBU1gsT0FBT1csTUFBdEI7QUFDQSxVQUFNQyxZQUFZQyxLQUFLQyxJQUFMLENBQVVkLE9BQU9XLE1BQVAsR0FBZ0JwQixTQUExQixDQUFsQjtBQUNBLFVBQU13QixPQUFPLEtBQUtDLEtBQUwsQ0FBV0QsSUFBeEI7O0FBRUEsV0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlMLFNBQXBCLEVBQStCSyxHQUEvQixFQUFvQztBQUNsQyxZQUFNQyxTQUFTRCxJQUFJMUIsU0FBbkI7QUFDQSxZQUFNNEIsVUFBVU4sS0FBS08sR0FBTCxDQUFTVCxTQUFTTyxNQUFsQixFQUEwQjNCLFNBQTFCLENBQWhCOztBQUVBLGFBQUssSUFBSThCLElBQUksQ0FBYixFQUFnQkEsSUFBSTlCLFNBQXBCLEVBQStCOEIsR0FBL0I7QUFDRU4sZUFBS00sQ0FBTCxJQUFVQSxJQUFJRixPQUFKLEdBQWNuQixPQUFPa0IsU0FBU0csQ0FBaEIsQ0FBZCxHQUFtQyxDQUE3QztBQURGLFNBR0EsS0FBS0wsS0FBTCxDQUFXTSxJQUFYLEdBQWtCSixTQUFTYixVQUEzQjtBQUNBLGFBQUtQLE9BQUwsR0FBZSxLQUFLa0IsS0FBTCxDQUFXTSxJQUFYLEdBQWtCSCxVQUFVZCxVQUEzQztBQUNBLGFBQUtrQixjQUFMO0FBQ0Q7O0FBRUQsV0FBS3BCLGNBQUwsQ0FBb0IsS0FBS0wsT0FBekI7QUFDRDs7Ozs7a0JBR1lMLGEiLCJmaWxlIjoiQXVkaW9JbkJ1ZmZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBhdWRpb0J1ZmZlcjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogU2xpY2UgYW4gYEF1ZGlvQnVmZmVyYCBpbnRvIHNpZ25hbCBibG9ja3MgYW5kIHByb3BhZ2F0ZSB0aGUgcmVzdWx0aW5nIGZyYW1lc1xuICogdGhyb3VnaCB0aGUgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXInIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gW29wdGlvbnMuYXVkaW9CdWZmZXJdIC0gQXVkaW8gYnVmZmVyIHRvIHByb2Nlc3MuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIHRoZSBvdXRwdXQgYmxvY2tzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBOdW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gcHJvY2Vzcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zb3VyY2VcbiAqXG4gKiBAdG9kbyAtIEFsbG93IHRvIHBhc3MgcmF3IGJ1ZmZlciBhbmQgc2FtcGxlUmF0ZSAoc2ltcGxpZmllZCB1c2Ugc2VydmVyLXNpZGUpXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBhdWRpb0luQnVmZmVyID0gbmV3IGxmby5zb3VyY2UuQXVkaW9JbkJ1ZmZlcih7XG4gKiAgIGF1ZGlvQnVmZmVyOiBhdWRpb0J1ZmZlcixcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCB3YXZlZm9ybSA9IG5ldyBsZm8uc2luay5XYXZlZm9ybSh7XG4gKiAgIGNhbnZhczogJyN3YXZlZm9ybScsXG4gKiAgIGR1cmF0aW9uOiAxLFxuICogICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gKiAgIHJtczogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5CdWZmZXIuY29ubmVjdCh3YXZlZm9ybSk7XG4gKiBhdWRpb0luQnVmZmVyLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5CdWZmZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQnVmZmVyJyk7XG5cbiAgICBpZiAoIWF1ZGlvQnVmZmVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwiYXVkaW9CdWZmZXJcIiBwYXJhbWV0ZXInKTtcblxuICAgIHRoaXMuZW5kVGltZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRoZSBgc3RyZWFtUGFyYW1zYCBpbiB0aGUgZ3JhcGggYW5kIHN0YXJ0IHByb3BhZ2F0aW5nIGZyYW1lcy5cbiAgICogV2hlbiBjYWxsZWQsIHRoZSBzbGljaW5nIG9mIHRoZSBnaXZlbiBgYXVkaW9CdWZmZXJgIHN0YXJ0cyBpbW1lZGlhdGVseSBhbmRcbiAgICogZWFjaCByZXN1bHRpbmcgZnJhbWUgaXMgcHJvcGFnYXRlZCBpbiBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjbGllbnQuc291cmNlLkF1ZGlvSW5CdWZmZXIjc3RvcH1cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuXG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIGNvbnN0IGF1ZGlvQnVmZmVyID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0J1ZmZlcicpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGF1ZGlvQnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuICAgIHRoaXMuZW5kVGltZSA9IDA7XG5cbiAgICB0aGlzLnByb2Nlc3NGcmFtZShidWZmZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBXaGVuIGNhbGxlZCwgdGhlIHNsaWNpbmcgb2ZcbiAgICogdGhlIGBhdWRpb0J1ZmZlcmAgc3RvcHMgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y2xpZW50LnNvdXJjZS5BdWRpb0luQnVmZmVyI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IHRoaXMucGFyYW1zLmdldCgnYXVkaW9CdWZmZXInKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSBhdWRpb0J1ZmZlci5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzaWduYWwnO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3QgbmJyRnJhbWVzID0gTWF0aC5jZWlsKGJ1ZmZlci5sZW5ndGggLyBmcmFtZVNpemUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ickZyYW1lczsgaSsrKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBpICogZnJhbWVTaXplO1xuICAgICAgY29uc3QgbmJyQ29weSA9IE1hdGgubWluKGxlbmd0aCAtIG9mZnNldCwgZnJhbWVTaXplKTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmcmFtZVNpemU7IGorKylcbiAgICAgICAgZGF0YVtqXSA9IGogPCBuYnJDb3B5ID8gYnVmZmVyW29mZnNldCArIGpdIDogMDtcblxuICAgICAgdGhpcy5mcmFtZS50aW1lID0gb2Zmc2V0IC8gc2FtcGxlUmF0ZTtcbiAgICAgIHRoaXMuZW5kVGltZSA9IHRoaXMuZnJhbWUudGltZSArIG5ickNvcHkgLyBzYW1wbGVSYXRlO1xuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luQnVmZmVyO1xuIl19