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

var _av = require('av');

var _av2 = _interopRequireDefault(_av);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  filename: {
    type: 'string',
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
 * Read a file and propagate raw signal into the graph.
 *
 * This node is based on the
 * [`aurora.js`](https://github.com/audiocogs/aurora.js) library.
 *
 * @param {Object} options - Override default options.
 * @param {String} [options.filename=null] - Path to the file.
 * @param {Number} [options.frameSize=512] - Size of output frame.
 * @param {Number} [options.channel=0] - Channel number of the input file.
 *
 * @todo - define which channel should be loaded.
 *
 * @memberof module:node.source
 *
 * @example
 * import * as lfo from 'waves-lfo/node';
 * import path from 'path';
 *
 * const filename = path.join(process.cwd(), './my-file');
 *
 * const audioInFile = new AudioInFile({
 *   filename: filename,
 *   frameSize: 512,
 * });
 *
 * const logger = new Logger({
 *   data: true,
 * });
 *
 * audioInFile.connect(logger);
 * audioInFile.start();
 */

var AudioInFile = function (_BaseLfo) {
  (0, _inherits3.default)(AudioInFile, _BaseLfo);

  function AudioInFile(options) {
    (0, _classCallCheck3.default)(this, AudioInFile);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInFile.__proto__ || (0, _getPrototypeOf2.default)(AudioInFile)).call(this, definitions, options));

    _this.processStreamParams = _this.processStreamParams.bind(_this);
    return _this;
  }

  /**
   * Start the graph, load the file and start slicing it.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:node.source.AudioInFile#stop}
   */


  (0, _createClass3.default)(AudioInFile, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var filename = this.params.get('filename');
      this.asset = _av2.default.Asset.fromFile(filename);
      this.asset.on('error', function (err) {
        return console.log(err.stack);
      });
      // call `processStreamParams` because sampleRate is only available
      this.asset.decodeToBuffer(function (buffer) {
        _this2.initStream();
        _this2.processFrame(buffer);
      });
    }

    /**
     * Finalize the stream and stop the graph.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:node.source.AudioInFile#start}
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
      var frameSize = this.params.get('frameSize');
      var channel = this.params.get('channel');
      var sourceSampleRate = this.asset.format.sampleRate;
      var channelsPerFrame = this.asset.format.channelsPerFrame;

      if (channel >= channelsPerFrame) throw new Error('Invalid channel number, given file only contains ${channelsPerFrame} channels');

      this.streamParams.frameType = 'signal';
      this.streamParams.frameSize = frameSize;
      this.streamParams.sourceSampleRate = sourceSampleRate;
      this.streamParams.frameRate = sourceSampleRate / frameSize;
      this.streamParams.sourceSampleCount = frameSize;

      this.channelsPerFrame = channelsPerFrame;

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(buffer) {
      var frameSize = this.params.get('frameSize');
      var channel = this.params.get('channel');
      var sampleRate = this.streamParams.sourceSampleRate;
      var channelsPerFrame = this.channelsPerFrame;
      var length = buffer.length;
      var sourceFrameSize = frameSize * channelsPerFrame;
      var nbrFrames = Math.ceil(length / sourceFrameSize);
      var frameDuration = frameSize / sampleRate;
      var endTime = length / (channelsPerFrame * sampleRate);
      var data = this.frame.data;

      var sourceIndex = 0;

      // input buffer is interleaved, pick only values according to `channel`
      for (var frameIndex = 0; frameIndex < nbrFrames; frameIndex++) {
        for (var i = 0; i < frameSize; i++) {
          var index = sourceIndex + channel;
          data[i] = sourceIndex < length ? buffer[index] : 0;

          sourceIndex += channelsPerFrame;
        }

        this.frame.time = frameIndex * frameDuration;
        this.endTime = Math.min(this.frame.time + frameDuration, endTime);

        this.propagateFrame();
      }

      this.finalizeStream(this.endTime);
    }
  }]);
  return AudioInFile;
}(_BaseLfo3.default);

exports.default = AudioInFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5GaWxlLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZmlsZW5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiZnJhbWVTaXplIiwiY2hhbm5lbCIsIkF1ZGlvSW5GaWxlIiwib3B0aW9ucyIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJiaW5kIiwicGFyYW1zIiwiZ2V0IiwiYXNzZXQiLCJBc3NldCIsImZyb21GaWxlIiwib24iLCJlcnIiLCJjb25zb2xlIiwibG9nIiwic3RhY2siLCJkZWNvZGVUb0J1ZmZlciIsImJ1ZmZlciIsImluaXRTdHJlYW0iLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsImVuZFRpbWUiLCJzb3VyY2VTYW1wbGVSYXRlIiwiZm9ybWF0Iiwic2FtcGxlUmF0ZSIsImNoYW5uZWxzUGVyRnJhbWUiLCJFcnJvciIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwibGVuZ3RoIiwic291cmNlRnJhbWVTaXplIiwibmJyRnJhbWVzIiwiTWF0aCIsImNlaWwiLCJmcmFtZUR1cmF0aW9uIiwiZGF0YSIsImZyYW1lIiwic291cmNlSW5kZXgiLCJmcmFtZUluZGV4IiwiaSIsImluZGV4IiwidGltZSIsIm1pbiIsInByb3BhZ2F0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFlBQVU7QUFDUkMsVUFBTSxRQURFO0FBRVJDLGFBQVMsSUFGRDtBQUdSQyxjQUFVO0FBSEYsR0FEUTtBQU1sQkMsYUFBVztBQUNUSCxVQUFNLFNBREc7QUFFVEMsYUFBUyxHQUZBO0FBR1RDLGNBQVU7QUFIRCxHQU5PO0FBV2xCRSxXQUFTO0FBQ1BKLFVBQU0sU0FEQztBQUVQQyxhQUFTLENBRkY7QUFHUEMsY0FBVTtB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QW9DO0FBQ2xDLGNBQU1DLFFBQVFILGNBQWN2QyxPQUE1QjtBQUNBcUMsZUFBS0ksQ0FBTCxJQUFVRixjQUFjUixNQUFkLEdBQXVCZixPQUFPMEIsS0FBUCxDQUF2QixHQUF1QyxDQUFqRDs7QUFFQUgseUJBQWVmLGdCQUFmO0FBQ0Q7O0FBRUQsYUFBS2MsS0FBTCxDQUFXSyxJQUFYLEdBQWtCSCxhQUFhSixhQUEvQjtBQUNBLGFBQUtoQixPQUFMLEdBQWVjLEtBQUtVLEdBQUwsQ0FBUyxLQUFLTixLQUFMLENBQVdLLElBQVgsR0FBa0JQLGFBQTNCLEVBQTBDaEIsT0FBMUMsQ0FBZjs7QUFFQSxhQUFLeUIsY0FBTDtBQUNEOztBQUVELFdBQUsxQixjQUFMLENBQW9CLEtBQUtDLE9BQXpCO0FBQ0Q7Ozs7O2tCQUdZbkIsVyIsImZpbGUiOiJBdWRpb0luRmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IGF2IGZyb20gJ2F2JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZmlsZW5hbWU6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG59O1xuXG4vKipcbiAqIFJlYWQgYSBmaWxlIGFuZCBwcm9wYWdhdGUgcmF3IHNpZ25hbCBpbnRvIHRoZSBncmFwaC5cbiAqXG4gKiBUaGlzIG5vZGUgaXMgYmFzZWQgb24gdGhlXG4gKiBbYGF1cm9yYS5qc2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9hdWRpb2NvZ3MvYXVyb3JhLmpzKSBsaWJyYXJ5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBvcHRpb25zLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZpbGVuYW1lPW51bGxdIC0gUGF0aCB0byB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIFNpemUgb2Ygb3V0cHV0IGZyYW1lLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBDaGFubmVsIG51bWJlciBvZiB0aGUgaW5wdXQgZmlsZS5cbiAqXG4gKiBAdG9kbyAtIGRlZmluZSB3aGljaCBjaGFubmVsIHNob3VsZCBiZSBsb2FkZWQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpub2RlLnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnO1xuICogaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG4gKlxuICogY29uc3QgZmlsZW5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vbXktZmlsZScpO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5GaWxlID0gbmV3IEF1ZGlvSW5GaWxlKHtcbiAqICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoe1xuICogICBkYXRhOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChsb2dnZXIpO1xuICogYXVkaW9JbkZpbGUuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkZpbGUgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyA9IHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBncmFwaCwgbG9hZCB0aGUgZmlsZSBhbmQgc3RhcnQgc2xpY2luZyBpdC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZpbGVuYW1lJyk7XG4gICAgdGhpcy5hc3NldCA9IGF2LkFzc2V0LmZyb21GaWxlKGZpbGVuYW1lKTtcbiAgICB0aGlzLmFzc2V0Lm9uKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUubG9nKGVyci5zdGFjaykpO1xuICAgIC8vIGNhbGwgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGJlY2F1c2Ugc2FtcGxlUmF0ZSBpcyBvbmx5IGF2YWlsYWJsZVxuICAgIHRoaXMuYXNzZXQuZGVjb2RlVG9CdWZmZXIoKGJ1ZmZlcikgPT4ge1xuICAgICAgdGhpcy5pbml0U3RyZWFtKCk7XG4gICAgICB0aGlzLnByb2Nlc3NGcmFtZShidWZmZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOm5vZGUuc291cmNlLkF1ZGlvSW5GaWxlI3N0YXJ0fVxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmZpbmFsaXplU3RyZWFtKHRoaXMuZW5kVGltZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5hc3NldC5mb3JtYXQuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjaGFubmVsc1BlckZyYW1lID0gdGhpcy5hc3NldC5mb3JtYXQuY2hhbm5lbHNQZXJGcmFtZTtcblxuICAgIGlmIChjaGFubmVsID49IGNoYW5uZWxzUGVyRnJhbWUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY2hhbm5lbCBudW1iZXIsIGdpdmVuIGZpbGUgb25seSBjb250YWlucyAke2NoYW5uZWxzUGVyRnJhbWV9IGNoYW5uZWxzJyk7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2lnbmFsJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gc291cmNlU2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuY2hhbm5lbHNQZXJGcmFtZSA9IGNoYW5uZWxzUGVyRnJhbWU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShidWZmZXIpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjaGFubmVsc1BlckZyYW1lID0gdGhpcy5jaGFubmVsc1BlckZyYW1lO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3Qgc291cmNlRnJhbWVTaXplID0gZnJhbWVTaXplICogY2hhbm5lbHNQZXJGcmFtZTtcbiAgICBjb25zdCBuYnJGcmFtZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gc291cmNlRnJhbWVTaXplKTtcbiAgICBjb25zdCBmcmFtZUR1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBlbmRUaW1lID0gbGVuZ3RoIC8gKGNoYW5uZWxzUGVyRnJhbWUgKiBzYW1wbGVSYXRlKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgbGV0IHNvdXJjZUluZGV4ID0gMDtcblxuICAgIC8vIGlucHV0IGJ1ZmZlciBpcyBpbnRlcmxlYXZlZCwgcGljayBvbmx5IHZhbHVlcyBhY2NvcmRpbmcgdG8gYGNoYW5uZWxgXG4gICAgZm9yIChsZXQgZnJhbWVJbmRleCA9IDA7IGZyYW1lSW5kZXggPCBuYnJGcmFtZXM7IGZyYW1lSW5kZXgrKykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgICBjb25zdCBpbmRleCA9IHNvdXJjZUluZGV4ICsgY2hhbm5lbDtcbiAgICAgICAgZGF0YVtpXSA9IHNvdXJjZUluZGV4IDwgbGVuZ3RoID8gYnVmZmVyW2luZGV4XSA6IDA7XG5cbiAgICAgICAgc291cmNlSW5kZXggKz0gY2hhbm5lbHNQZXJGcmFtZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWVJbmRleCAqIGZyYW1lRHVyYXRpb247XG4gICAgICB0aGlzLmVuZFRpbWUgPSBNYXRoLm1pbih0aGlzLmZyYW1lLnRpbWUgKyBmcmFtZUR1cmF0aW9uLCBlbmRUaW1lKTtcblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luRmlsZTtcbiJdfQ==