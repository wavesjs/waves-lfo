'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _BaseLfo = require('../../core/BaseLfo');

var _BaseLfo2 = _interopRequireDefault(_BaseLfo);

var _SourceMixin2 = require('../../core/SourceMixin');

var _SourceMixin3 = _interopRequireDefault(_SourceMixin2);

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
  },
  async: {
    type: 'boolean',
    default: false
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

var AudioInFile = function (_SourceMixin) {
  (0, _inherits3.default)(AudioInFile, _SourceMixin);

  function AudioInFile(options) {
    (0, _classCallCheck3.default)(this, AudioInFile);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioInFile.__proto__ || (0, _getPrototypeOf2.default)(AudioInFile)).call(this, definitions, options));

    _this.buffer = null;
    _this.processStreamParams = _this.processStreamParams.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(AudioInFile, [{
    key: 'initModule',
    value: function initModule() {
      var _this2 = this;

      var promises = this.nextModules.map(function (module) {
        return module.initModule();
      });

      var decoded = new _promise2.default(function (resolve, reject) {
        var filename = _this2.params.get('filename');
        _this2.asset = _av2.default.Asset.fromFile(filename);
        _this2.asset.on('error', function (err) {
          return console.log(err.stack);
        });
        // call `processStreamParams` because sampleRate is only available
        _this2.asset.decodeToBuffer(function (buffer) {
          _this2.buffer = buffer;
          resolve();
        });
      });

      promises.push(decoded);

      return _promise2.default.all(promises);
    }

    /**
     * Start the graph, load the file and start slicing it.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#resetStream}
     * @see {@link module:node.source.AudioInFile#stop}
     */

  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      if (!this.initialized) {
        this.initialized = this.init();
        this.initialized.then(function () {
          return _this3.start(startTime);
        });
        return;
      }

      this.ready = true;
      this.processFrame(this.buffer);
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
      this.ready = false;
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
      var async = this.params.get('async');
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
      function slice() {
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

        if (frameIndex < nbrFrames) {
          if (async) setTimeout(slice, 0);else slice();
        } else {
          that.finalizeStream(that.endTime);
        }
      }

      // allow the following to do the expected thing:
      // audioIn.connect(recorder);
      // audioIn.start();
      // recorder.start();
      setTimeout(slice, 0);
    }
  }]);
  return AudioInFile;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = AudioInFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5GaWxlLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZmlsZW5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiZnJhbWVTaXplIiwiY2hhbm5lbCIsInByb2dyZXNzQ2FsbGJhY2siLCJudWxsYWJsZSIsImFzeW5jIiwibm9vcCIsIkF1ZGlvSW5GaWxlIiwib3B0aW9ucyIsImJ1ZmZlciIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJiaW5kIiwicHJvbWlzZXMiLCJuZXh0TW9kdWxlcyIsIm1hcCIsIm1vZHVsZSIsImluaXRNb2R1bGUiLCJkZWNvZGVkIiwicmVzb2x2ZSIsInJlamVjdCIsInBhcmFtcyIsImdldCIsImFzc2V0IiwiQXNzZXQiLCJmcm9tRmlsZSIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInN0YWNrIiwiZGVjb2RlVG9CdWZmZXIiLCJwdXNoIiwiYWxsIiwiaW5pdGlhbGl6ZWQiLCJpbml0IiwidGhlbiIsInN0YXJ0Iiwic3RhcnRUaW1lIiwicmVhZHkiLCJwcm9jZXNzRnJhbWUiLCJmaW5hbGl6ZVN0cmVhbSIsImVuZFRpbWUiLCJzb3VyY2VTYW1wbGVSYXRlIiwiZm9ybWF0Iiwic2FtcGxlUmF0ZSIsImNoYW5uZWxzUGVyRnJhbWUiLCJFcnJvciIsInN0cmVhbVBhcmFtcyIsImZyYW1lVHlwZSIsImZyYW1lUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwibGVuZ3RoIiwic291cmNlRnJhbWVTaXplIiwibmJyRnJhbWVzIiwiTWF0aCIsImNlaWwiLCJmcmFtZUR1cmF0aW9uIiwiZGF0YSIsImZyYW1lIiwidGhhdCIsInNvdXJjZUluZGV4IiwiZnJhbWVJbmRleCIsInNsaWNlIiwiaSIsImluZGV4IiwidGltZSIsIm1pbiIsInByb3BhZ2F0ZUZyYW1lIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7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LE9BQU8sS0FBS0MsS0FBTCxDQUFXRCxJQUF4QjtBQUNBLFVBQU1FLE9BQU8sSUFBYjs7QUFFQSxVQUFJQyxjQUFjLENBQWxCO0FBQ0EsVUFBSUMsYUFBYSxDQUFqQjs7QUFFQTtBQUNBLGVBQVNDLEtBQVQsR0FBaUI7QUFDZixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSS9ELFNBQXBCLEVBQStCK0QsR0FBL0IsRUFBb0M7QUFDbEMsY0FBTUMsUUFBUUosY0FBYzNELE9BQTVCO0FBQ0F3RCxlQUFLTSxDQUFMLElBQVVILGNBQWNULE1BQWQsR0FBdUIzQyxPQUFPd0QsS0FBUCxDQUF2QixHQUF1QyxDQUFqRDs7QUFFQUoseUJBQWVoQixnQkFBZjtBQUNEOztBQUVEZSxhQUFLRCxLQUFMLENBQVdPLElBQVgsR0FBa0JKLGFBQWFMLGFBQS9CO0FBQ0FHLGFBQUtuQixPQUFMLEdBQWVjLEtBQUtZLEdBQUwsQ0FBU1AsS0FBS0QsS0FBTCxDQUFXTyxJQUFYLEdBQWtCVCxhQUEzQixFQUEwQ2hCLE9BQTFDLENBQWY7QUFDQW1CLGFBQUtRLGNBQUw7O0FBRUFOLHNCQUFjLENBQWQ7QUFDQTNELHlCQUFpQjJELGFBQWFSLFNBQTlCOztBQUVBLFlBQUlRLGFBQWFSLFNBQWpCLEVBQTRCO0FBQzFCLGNBQUlqRCxLQUFKLEVBQ0VnRSxXQUFXTixLQUFYLEVBQWtCLENBQWxCLEVBREYsS0FHRUE7QUFDSCxTQUxELE1BS087QUFDTEgsZUFBS3BCLGNBQUwsQ0FBb0JvQixLQUFLbkIsT0FBekI7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E0QixpQkFBV04sS0FBWCxFQUFrQixDQUFsQjtBQUNEOzs7RUFqSXVCLDZDOztrQkFvSVh4RCxXIiwiZmlsZSI6IkF1ZGlvSW5GaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcbmltcG9ydCBhdiBmcm9tICdhdic7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZpbGVuYW1lOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2hhbm5lbDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXN5bmM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG59O1xuXG5jb25zdCBub29wID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBSZWFkIGEgZmlsZSBhbmQgcHJvcGFnYXRlIHJhdyBzaWduYWwgaW50byB0aGUgZ3JhcGguXG4gKlxuICogVGhpcyBub2RlIGlzIGJhc2VkIG9uIHRoZVxuICogW2BhdXJvcmEuanNgXShodHRwczovL2dpdGh1Yi5jb20vYXVkaW9jb2dzL2F1cm9yYS5qcykgbGlicmFyeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgb3B0aW9ucy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5maWxlbmFtZT1udWxsXSAtIFBhdGggdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIG91dHB1dCBmcmFtZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gQ2hhbm5lbCBudW1iZXIgb2YgdGhlIGlucHV0IGZpbGUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucHJvZ3Jlc3NDYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4Y3V0ZWQgb24gZWFjaFxuICogIGZyYW1lIG91dHB1dCwgcmVjZWl2ZSBhcyBhcmd1bWVudCB0aGUgY3VycmVudCBwcm9ncmVzcyByYXRpby5cbiAqXG4gKiBAdG9kbyAtIGRlZmluZSB3aGljaCBjaGFubmVsIHNob3VsZCBiZSBsb2FkZWQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpub2RlLnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnO1xuICogaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG4gKlxuICogY29uc3QgZmlsZW5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vbXktZmlsZScpO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5GaWxlID0gbmV3IEF1ZGlvSW5GaWxlKHtcbiAqICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoe1xuICogICBkYXRhOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChsb2dnZXIpO1xuICogYXVkaW9JbkZpbGUuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkZpbGUgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zID0gdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0TW9kdWxlKCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gdGhpcy5uZXh0TW9kdWxlcy5tYXAoKG1vZHVsZSkgPT4ge1xuICAgICAgcmV0dXJuIG1vZHVsZS5pbml0TW9kdWxlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWNvZGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZpbGVuYW1lJyk7XG4gICAgICB0aGlzLmFzc2V0ID0gYXYuQXNzZXQuZnJvbUZpbGUoZmlsZW5hbWUpO1xuICAgICAgdGhpcy5hc3NldC5vbignZXJyb3InLCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIuc3RhY2spKTtcbiAgICAgIC8vIGNhbGwgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGJlY2F1c2Ugc2FtcGxlUmF0ZSBpcyBvbmx5IGF2YWlsYWJsZVxuICAgICAgdGhpcy5hc3NldC5kZWNvZGVUb0J1ZmZlcigoYnVmZmVyKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHByb21pc2VzLnB1c2goZGVjb2RlZCk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBncmFwaCwgbG9hZCB0aGUgZmlsZSBhbmQgc3RhcnQgc2xpY2luZyBpdC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdGhpcy5pbml0KCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVkLnRoZW4oKCkgPT4gdGhpcy5zdGFydChzdGFydFRpbWUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICB0aGlzLnByb2Nlc3NGcmFtZSh0aGlzLmJ1ZmZlcik7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2ZpbmFsaXplU3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6bm9kZS5zb3VyY2UuQXVkaW9JbkZpbGUjc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuZmluYWxpemVTdHJlYW0odGhpcy5lbmRUaW1lKTtcbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5hc3NldC5mb3JtYXQuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBjaGFubmVsc1BlckZyYW1lID0gdGhpcy5hc3NldC5mb3JtYXQuY2hhbm5lbHNQZXJGcmFtZTtcblxuICAgIGlmIChjaGFubmVsID49IGNoYW5uZWxzUGVyRnJhbWUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY2hhbm5lbCBudW1iZXIsIGdpdmVuIGZpbGUgb25seSBjb250YWlucyAke2NoYW5uZWxzUGVyRnJhbWV9IGNoYW5uZWxzJyk7XG5cbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSAnc2lnbmFsJztcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gc291cmNlU2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIHRoaXMuY2hhbm5lbHNQZXJGcmFtZSA9IGNoYW5uZWxzUGVyRnJhbWU7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShidWZmZXIpIHtcbiAgICBjb25zdCBhc3luYyA9IHRoaXMucGFyYW1zLmdldCgnYXN5bmMnKTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ2NoYW5uZWwnKTtcbiAgICBjb25zdCBwcm9ncmVzc0NhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdwcm9ncmVzc0NhbGxiYWNrJykgfHzCoG5vb3A7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGU7XG4gICAgY29uc3QgY2hhbm5lbHNQZXJGcmFtZSA9IHRoaXMuY2hhbm5lbHNQZXJGcmFtZTtcbiAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgIGNvbnN0IHNvdXJjZUZyYW1lU2l6ZSA9IGZyYW1lU2l6ZSAqIGNoYW5uZWxzUGVyRnJhbWU7XG4gICAgY29uc3QgbmJyRnJhbWVzID0gTWF0aC5jZWlsKGxlbmd0aCAvIHNvdXJjZUZyYW1lU2l6ZSk7XG4gICAgY29uc3QgZnJhbWVEdXJhdGlvbiA9IGZyYW1lU2l6ZSAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgZW5kVGltZSA9IGxlbmd0aCAvIChjaGFubmVsc1BlckZyYW1lICogc2FtcGxlUmF0ZSk7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIGxldCBzb3VyY2VJbmRleCA9IDA7XG4gICAgbGV0IGZyYW1lSW5kZXggPSAwO1xuXG4gICAgLy8gaW5wdXQgYnVmZmVyIGlzIGludGVybGVhdmVkLCBwaWNrIG9ubHkgdmFsdWVzIGFjY29yZGluZyB0byBgY2hhbm5lbGBcbiAgICBmdW5jdGlvbiBzbGljZSgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBzb3VyY2VJbmRleCArIGNoYW5uZWw7XG4gICAgICAgIGRhdGFbaV0gPSBzb3VyY2VJbmRleCA8IGxlbmd0aCA/IGJ1ZmZlcltpbmRleF0gOiAwO1xuXG4gICAgICAgIHNvdXJjZUluZGV4ICs9IGNoYW5uZWxzUGVyRnJhbWU7XG4gICAgICB9XG5cbiAgICAgIHRoYXQuZnJhbWUudGltZSA9IGZyYW1lSW5kZXggKiBmcmFtZUR1cmF0aW9uO1xuICAgICAgdGhhdC5lbmRUaW1lID0gTWF0aC5taW4odGhhdC5mcmFtZS50aW1lICsgZnJhbWVEdXJhdGlvbiwgZW5kVGltZSk7XG4gICAgICB0aGF0LnByb3BhZ2F0ZUZyYW1lKCk7XG5cbiAgICAgIGZyYW1lSW5kZXggKz0gMTtcbiAgICAgIHByb2dyZXNzQ2FsbGJhY2soZnJhbWVJbmRleCAvIG5ickZyYW1lcyk7XG5cbiAgICAgIGlmIChmcmFtZUluZGV4IDwgbmJyRnJhbWVzKSB7XG4gICAgICAgIGlmIChhc3luYylcbiAgICAgICAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNsaWNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0LmZpbmFsaXplU3RyZWFtKHRoYXQuZW5kVGltZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgdGhlIGZvbGxvd2luZyB0byBkbyB0aGUgZXhwZWN0ZWQgdGhpbmc6XG4gICAgLy8gYXVkaW9Jbi5jb25uZWN0KHJlY29yZGVyKTtcbiAgICAvLyBhdWRpb0luLnN0YXJ0KCk7XG4gICAgLy8gcmVjb3JkZXIuc3RhcnQoKTtcbiAgICBzZXRUaW1lb3V0KHNsaWNlLCAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0luRmlsZTtcbiJdfQ==