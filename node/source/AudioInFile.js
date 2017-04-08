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
  },
  progressCallback: {
    type: 'any',
    default: null,
    nullable: true,
    constant: true
  }
};

var noop = function noop() {};

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
 * @param {Number} [options.progressCallback=null] - Callback to be excuted on each
 *  frame output, receive as argument the current progress ratio.
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
      var progressCallback = this.params.get('progressCallback') || noop;
      var sampleRate = this.streamParams.sourceSampleRate;
      var channelsPerFrame = this.channelsPerFrame;
      var length = buffer.length;
      var sourceFrameSize = frameSize * channelsPerFrame;
      var nbrFrames = Math.ceil(length / sourceFrameSize);
      var frameDuration = frameSize / sampleRate;
      var endTime = length / (channelsPerFrame * sampleRate);
      var data = this.frame.data;
      var that = this;

      var sourceIndex = 0;
      var frameIndex = 0;

      // input buffer is interleaved, pick only values according to `channel`
      (function slice() {
        for (var i = 0; i < frameSize; i++) {
          var index = sourceIndex + channel;
          data[i] = sourceIndex < length ? buffer[index] : 0;

          sourceIndex += channelsPerFrame;
        }

        that.frame.time = frameIndex * frameDuration;
        that.endTime = Math.min(that.frame.time + frameDuration, endTime);
        that.propagateFrame();

        frameIndex += 1;
        progressCallback(frameIndex / nbrFrames);

        if (frameIndex < nbrFrames) setTimeout(slice, 0);else that.finalizeStream(that.endTime);
      })();
    }
  }]);
  return AudioInFile;
}(_BaseLfo3.default);

exports.default = AudioInFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5CdWZmZXIuanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJmaWxlbmFtZSIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJmcmFtZVNpemUiLCJjaGFubmVsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm51bGxhYmxlIiwibm9vcCIsIkF1ZGlvSW5GaWxlIiwib3B0aW9ucyIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJiaW5kIiwicGFyYW1zIiwiZ2V0IiwiYXNzZXQiLCJBc3NldCIsImZyb21GaWxlIiwib24iLCJlcnIiLCJjb25zb2xlIiwibG9nIiwic3RhY2siLCJkZWNvZGVUb0J1ZmZlciIsImJ1ZmZlciIsImluaXRTdHJlYW0iLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsImVuZFRpbWUiLCJzb3VyY2VTYW1wbGVSYXRlIiwiZm9ybWF0Iiwic2FtcGxlUmF0ZSIsImNoYW5uZWxzUGVyRnJhbWUiLCJFcnJvciIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwibGVuZ3RoIiwic291cmNlRnJhbWVTaXplIiwibmJyRnJhbWVzIiwiTWF0aCIsImNlaWwiLCJmcmFtZUR1cmF0aW9uIiwiZGF0YSIsImZyYW1lIiwidGhhdCIsInNvdXJjZUluZGV4IiwiZnJhbWVJbmRleCIsInNsaWNlIiwiaSIsImluZGV4IiwidGltZSIsIm1pbiIsInByb3BhZ2F0ZUZyYW1lIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxZQUFVO0FBQ1JDLFVBQU0sUUFERTtBQUVSQyxhQUFTLElBRkQ7QUFHUkMsY0FBVTtBQUhGLEdBRFE7QUFNbEJDLGFBQVc7QUFDVEgsVUFBTSxTQURHO0FBRVRDLGFBQVMsR0FGQTtBQUdUQyxjQUFV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QSxVQUFNSSxnQkFBZ0J4QyxZQUFZMkIsVUFBbEM7QUFDQSxVQUFNSCxVQUFVVyxVQUFVUCxtQkFBbUJELFVBQTdCLENBQWhCO0FBQ0EsVUFBTWMsT0FBTyxLQUFLQyxLQUFMLENBQVdELElBQXhCO0FBQ0EsVUFBTUUsT0FBTyxJQUFiOztBQUVBLFVBQUlDLGNBQWMsQ0FBbEI7QUFDQSxVQUFJQyxhQUFhLENBQWpCOztBQUVBO0FBQ0MsZ0JBQVNDLEtBQVQsR0FBaUI7QUFDaEIsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUkvQyxTQUFwQixFQUErQitDLEdBQS9CLEVBQW9DO0FBQ2xDLGNBQU1DLFFBQVFKLGNBQWMzQyxPQUE1QjtBQUNBd0MsZUFBS00sQ0FBTCxJQUFVSCxjQUFjVCxNQUFkLEdBQXVCZixPQUFPNEIsS0FBUCxDQUF2QixHQUF1QyxDQUFqRDs7QUFFQUoseUJBQWVoQixnQkFBZjtBQUNEOztBQUVEZSxhQUFLRCxLQUFMLENBQVdPLElBQVgsR0FBa0JKLGFBQWFMLGFBQS9CO0FBQ0FHLGFBQUtuQixPQUFMLEdBQWVjLEtBQUtZLEdBQUwsQ0FBU1AsS0FBS0QsS0FBTCxDQUFXTyxJQUFYLEdBQWtCVCxhQUEzQixFQUEwQ2hCLE9BQTFDLENBQWY7QUFDQW1CLGFBQUtRLGNBQUw7O0FBRUFOLHNCQUFjLENBQWQ7QUFDQTNDLHlCQUFpQjJDLGFBQWFSLFNBQTlCOztBQUVBLFlBQUlRLGFBQWFSLFNBQWpCLEVBQ0VlLFdBQVdOLEtBQVgsRUFBa0IsQ0FBbEIsRUFERixLQUdFSCxLQUFLcEIsY0FBTCxDQUFvQm9CLEtBQUtuQixPQUF6QjtBQUNILE9BbkJBLEdBQUQ7QUFxQkQ7Ozs7O2tCQUdZbkIsVyIsImZpbGUiOiJBdWRpb0luQnVmZmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBhdiBmcm9tICdhdic7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZpbGVuYW1lOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2hhbm5lbDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIFJlYWQgYSBmaWxlIGFuZCBwcm9wYWdhdGUgcmF3IHNpZ25hbCBpbnRvIHRoZSBncmFwaC5cbiAqXG4gKiBUaGlzIG5vZGUgaXMgYmFzZWQgb24gdGhlXG4gKiBbYGF1cm9yYS5qc2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9hdWRpb2NvZ3MvYXVyb3JhLmpzKSBsaWJyYXJ5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBvcHRpb25zLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZpbGVuYW1lPW51bGxdIC0gUGF0aCB0byB0aGUgZmlsZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9NTEyXSAtIFNpemUgb2Ygb3V0cHV0IGZyYW1lLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNoYW5uZWw9MF0gLSBDaGFubmVsIG51bWJlciBvZiB0aGUgaW5wdXQgZmlsZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wcm9ncmVzc0NhbGxiYWNrPW51bGxdIC0gQ2FsbGJhY2sgdG8gYmUgZXhjdXRlZCBvbiBlYWNoXG4gKiAgZnJhbWUgb3V0cHV0LCByZWNlaXZlIGFzIGFyZ3VtZW50IHRoZSBjdXJyZW50IHByb2dyZXNzIHJhdGlvLlxuICpcbiAqIEB0b2RvIC0gZGVmaW5lIHdoaWNoIGNoYW5uZWwgc2hvdWxkIGJlIGxvYWRlZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOm5vZGUuc291cmNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vbm9kZSc7XG4gKiBpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbiAqXG4gKiBjb25zdCBmaWxlbmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi9teS1maWxlJyk7XG4gKlxuICogY29uc3QgYXVkaW9JbkZpbGUgPSBuZXcgQXVkaW9JbkZpbGUoe1xuICogICBmaWxlbmFtZTogZmlsZW5hbWUsXG4gKiAgIGZyYW1lU2l6ZTogNTEyLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcih7XG4gKiAgIGRhdGE6IHRydWUsXG4gKiB9KTtcbiAqXG4gKiBhdWRpb0luRmlsZS5jb25uZWN0KGxvZ2dlcik7XG4gKiBhdWRpb0luRmlsZS5zdGFydCgpO1xuICovXG5jbGFzcyBBdWRpb0luRmlsZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zID0gdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIGdyYXBoLCBsb2FkIHRoZSBmaWxlIGFuZCBzdGFydCBzbGljaW5nIGl0LlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOm5vZGUuc291cmNlLkF1ZGlvSW5GaWxlI3N0b3B9XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IHRoaXMucGFyYW1zLmdldCgnZmlsZW5hbWUnKTtcbiAgICB0aGlzLmFzc2V0ID0gYXYuQXNzZXQuZnJvbUZpbGUoZmlsZW5hbWUpO1xuICAgIHRoaXMuYXNzZXQub24oJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5sb2coZXJyLnN0YWNrKSk7XG4gICAgLy8gY2FsbCBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgYmVjYXVzZSBzYW1wbGVSYXRlIGlzIG9ubHkgYXZhaWxhYmxlXG4gICAgdGhpcy5hc3NldC5kZWNvZGVUb0J1ZmZlcigoYnVmZmVyKSA9PiB7XG4gICAgICB0aGlzLmluaXRTdHJlYW0oKTtcbiAgICAgIHRoaXMucHJvY2Vzc0ZyYW1lKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6bm9kZS5zb3VyY2UuQXVkaW9JbkZpbGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLmFzc2V0LmZvcm1hdC5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IGNoYW5uZWxzUGVyRnJhbWUgPSB0aGlzLmFzc2V0LmZvcm1hdC5jaGFubmVsc1BlckZyYW1lO1xuXG4gICAgaWYgKGNoYW5uZWwgPj0gY2hhbm5lbHNQZXJGcmFtZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjaGFubmVsIG51bWJlciwgZ2l2ZW4gZmlsZSBvbmx5IGNvbnRhaW5zICR7Y2hhbm5lbHNQZXJGcmFtZX0gY2hhbm5lbHMnKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICdzaWduYWwnO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc291cmNlU2FtcGxlUmF0ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlIC8gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgdGhpcy5jaGFubmVsc1BlckZyYW1lID0gY2hhbm5lbHNQZXJGcmFtZTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGJ1ZmZlcikge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3QgY2hhbm5lbCA9IHRoaXMucGFyYW1zLmdldCgnY2hhbm5lbCcpO1xuICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ3Byb2dyZXNzQ2FsbGJhY2snKSB8fMKgbm9vcDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjaGFubmVsc1BlckZyYW1lID0gdGhpcy5jaGFubmVsc1BlckZyYW1lO1xuICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgY29uc3Qgc291cmNlRnJhbWVTaXplID0gZnJhbWVTaXplICogY2hhbm5lbHNQZXJGcmFtZTtcbiAgICBjb25zdCBuYnJGcmFtZXMgPSBNYXRoLmNlaWwobGVuZ3RoIC8gc291cmNlRnJhbWVTaXplKTtcbiAgICBjb25zdCBmcmFtZUR1cmF0aW9uID0gZnJhbWVTaXplIC8gc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBlbmRUaW1lID0gbGVuZ3RoIC8gKGNoYW5uZWxzUGVyRnJhbWUgKiBzYW1wbGVSYXRlKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgbGV0IHNvdXJjZUluZGV4ID0gMDtcbiAgICBsZXQgZnJhbWVJbmRleCA9IDA7XG5cbiAgICAvLyBpbnB1dCBidWZmZXIgaXMgaW50ZXJsZWF2ZWQsIHBpY2sgb25seSB2YWx1ZXMgYWNjb3JkaW5nIHRvIGBjaGFubmVsYFxuICAgIChmdW5jdGlvbiBzbGljZSgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBzb3VyY2VJbmRleCArIGNoYW5uZWw7XG4gICAgICAgIGRhdGFbaV0gPSBzb3VyY2VJbmRleCA8IGxlbmd0aCA/IGJ1ZmZlcltpbmRleF0gOiAwO1xuXG4gICAgICAgIHNvdXJjZUluZGV4ICs9IGNoYW5uZWxzUGVyRnJhbWU7XG4gICAgICB9XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IGZyYW1lSW5kZXggKiBmcmFtZUR1cmF0aW9uO1xuICAgICAgdGhhdC5lbmRUaW1lID0gTWF0aC5taW4odGhhdC5mcmFtZS50aW1lICsgZnJhbWVEdXJhdGlvbiwgZW5kVGltZSk7XG4gICAgICB0aGF0LnByb3BhZ2F0ZUZyYW1lKCk7XG5cbiAgICAgIGZyYW1lSW5kZXggKz0gMTtcbiAgICAgIHByb2dyZXNzQ2FsbGJhY2soZnJhbWVJbmRleCAvIG5ickZyYW1lcyk7XG5cbiAgICAgIGlmIChmcmFtZUluZGV4IDwgbmJyRnJhbWVzKVxuICAgICAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhhdC5maW5hbGl6ZVN0cmVhbSh0aGF0LmVuZFRpbWUpO1xuICAgIH0oKSk7XG5cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luRmlsZTtcbiJdfQ==