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

        // @todo - replace for http://www.mega-nerd.com/libsndfile/
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
      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(this.start);
        return;
      }

      this.started = true;
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
      this.started = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5GaWxlLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZmlsZW5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiZnJhbWVTaXplIiwiY2hhbm5lbCIsInByb2dyZXNzQ2FsbGJhY2siLCJudWxsYWJsZSIsImFzeW5jIiwibm9vcCIsIkF1ZGlvSW5GaWxlIiwib3B0aW9ucyIsImJ1ZmZlciIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJiaW5kIiwicHJvbWlzZXMiLCJuZXh0TW9kdWxlcyIsIm1hcCIsIm1vZHVsZSIsImluaXRNb2R1bGUiLCJkZWNvZGVkIiwicmVzb2x2ZSIsInJlamVjdCIsInBhcmFtcyIsImdldCIsImFzc2V0IiwiQXNzZXQiLCJmcm9tRmlsZSIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInN0YWNrIiwiZGVjb2RlVG9CdWZmZXIiLCJwdXNoIiwiYWxsIiwiaW5pdGlhbGl6ZWQiLCJpbml0UHJvbWlzZSIsImluaXQiLCJ0aGVuIiwic3RhcnQiLCJzdGFydGVkIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJlbmRUaW1lIiwic291cmNlU2FtcGxlUmF0ZSIsImZvcm1hdCIsInNhbXBsZVJhdGUiLCJjaGFubmVsc1BlckZyYW1lIiwiRXJyb3IiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVJhdGUiLCJzb3VyY2VTYW1wbGVDb3VudCIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImxlbmd0aCIsInNvdXJjZUZyYW1lU2l6ZSIsIm5ickZyYW1lcyIsIk1hdGgiLCJjZWlsIiwiZnJhbWVEdXJhdGlvbiIsImRhdGEiLCJmcmFtZSIsInRoYXQiLCJzb3VyY2VJbmRleCIsImZyYW1lSW5kZXgiLCJzbGljZSIsImkiLCJpbmRleCIsInRpbWUiLCJtaW4iLCJwcm9wYWdhdGVGcmFtZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztB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QUFoQjtBQUNBLFVBQU1jLE9BQU8sS0FBS0MsS0FBTCxDQUFXRCxJQUF4QjtBQUNBLFVBQU1FLE9BQU8sSUFBYjs7QUFFQSxVQUFJQyxjQUFjLENBQWxCO0FBQ0EsVUFBSUMsYUFBYSxDQUFqQjs7QUFFQTtBQUNBLGVBQVNDLEtBQVQsR0FBaUI7QUFDZixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSS9ELFNBQXBCLEVBQStCK0QsR0FBL0IsRUFBb0M7QUFDbEMsY0FBTUMsUUFBUUosY0FBYzNELE9BQTVCO0FBQ0F3RCxlQUFLTSxDQUFMLElBQVVILGNBQWNULE1BQWQsR0FBdUIzQyxPQUFPd0QsS0FBUCxDQUF2QixHQUF1QyxDQUFqRDs7QUFFQUoseUJBQWVoQixnQkFBZjtBQUNEOztBQUVEZSxhQUFLRCxLQUFMLENBQVdPLElBQVgsR0FBa0JKLGFBQWFMLGFBQS9CO0FBQ0FHLGFBQUtuQixPQUFMLEdBQWVjLEtBQUtZLEdBQUwsQ0FBU1AsS0FBS0QsS0FBTCxDQUFXTyxJQUFYLEdBQWtCVCxhQUEzQixFQUEwQ2hCLE9BQTFDLENBQWY7QUFDQW1CLGFBQUtRLGNBQUw7O0FBRUFOLHNCQUFjLENBQWQ7QUFDQTNELHlCQUFpQjJELGFBQWFSLFNBQTlCOztBQUVBLFlBQUlRLGFBQWFSLFNBQWpCLEVBQTRCO0FBQzFCLGNBQUlqRCxLQUFKLEVBQ0VnRSxXQUFXTixLQUFYLEVBQWtCLENBQWxCLEVBREYsS0FHRUE7QUFDSCxTQUxELE1BS087QUFDTEgsZUFBS3BCLGNBQUwsQ0FBb0JvQixLQUFLbkIsT0FBekI7QUFDRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E0QixpQkFBV04sS0FBWCxFQUFrQixDQUFsQjtBQUNEOzs7RUFySXVCLDZDOztrQkF3SVh4RCxXIiwiZmlsZSI6IkF1ZGlvSW5GaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcbmltcG9ydCBhdiBmcm9tICdhdic7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGZpbGVuYW1lOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDUxMixcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2hhbm5lbDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBwcm9ncmVzc0NhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXN5bmM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG59O1xuXG5jb25zdCBub29wID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBSZWFkIGEgZmlsZSBhbmQgcHJvcGFnYXRlIHJhdyBzaWduYWwgaW50byB0aGUgZ3JhcGguXG4gKlxuICogVGhpcyBub2RlIGlzIGJhc2VkIG9uIHRoZVxuICogW2BhdXJvcmEuanNgXShodHRwczovL2dpdGh1Yi5jb20vYXVkaW9jb2dzL2F1cm9yYS5qcykgbGlicmFyeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgb3B0aW9ucy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5maWxlbmFtZT1udWxsXSAtIFBhdGggdG8gdGhlIGZpbGUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTUxMl0gLSBTaXplIG9mIG91dHB1dCBmcmFtZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jaGFubmVsPTBdIC0gQ2hhbm5lbCBudW1iZXIgb2YgdGhlIGlucHV0IGZpbGUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucHJvZ3Jlc3NDYWxsYmFjaz1udWxsXSAtIENhbGxiYWNrIHRvIGJlIGV4Y3V0ZWQgb24gZWFjaFxuICogIGZyYW1lIG91dHB1dCwgcmVjZWl2ZSBhcyBhcmd1bWVudCB0aGUgY3VycmVudCBwcm9ncmVzcyByYXRpby5cbiAqXG4gKiBAdG9kbyAtIGRlZmluZSB3aGljaCBjaGFubmVsIHNob3VsZCBiZSBsb2FkZWQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpub2RlLnNvdXJjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL25vZGUnO1xuICogaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG4gKlxuICogY29uc3QgZmlsZW5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vbXktZmlsZScpO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5GaWxlID0gbmV3IEF1ZGlvSW5GaWxlKHtcbiAqICAgZmlsZW5hbWU6IGZpbGVuYW1lLFxuICogICBmcmFtZVNpemU6IDUxMixcbiAqIH0pO1xuICpcbiAqIGNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoe1xuICogICBkYXRhOiB0cnVlLFxuICogfSk7XG4gKlxuICogYXVkaW9JbkZpbGUuY29ubmVjdChsb2dnZXIpO1xuICogYXVkaW9JbkZpbGUuc3RhcnQoKTtcbiAqL1xuY2xhc3MgQXVkaW9JbkZpbGUgZXh0ZW5kcyBTb3VyY2VNaXhpbihCYXNlTGZvKSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zID0gdGhpcy5wcm9jZXNzU3RyZWFtUGFyYW1zLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0TW9kdWxlKCkge1xuICAgIGNvbnN0IHByb21pc2VzID0gdGhpcy5uZXh0TW9kdWxlcy5tYXAoKG1vZHVsZSkgPT4ge1xuICAgICAgcmV0dXJuIG1vZHVsZS5pbml0TW9kdWxlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWNvZGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZpbGVuYW1lJyk7XG5cbiAgICAgIC8vIEB0b2RvIC0gcmVwbGFjZSBmb3IgaHR0cDovL3d3dy5tZWdhLW5lcmQuY29tL2xpYnNuZGZpbGUvXG4gICAgICB0aGlzLmFzc2V0ID0gYXYuQXNzZXQuZnJvbUZpbGUoZmlsZW5hbWUpO1xuICAgICAgdGhpcy5hc3NldC5vbignZXJyb3InLCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIuc3RhY2spKTtcbiAgICAgIC8vIGNhbGwgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGJlY2F1c2Ugc2FtcGxlUmF0ZSBpcyBvbmx5IGF2YWlsYWJsZVxuICAgICAgdGhpcy5hc3NldC5kZWNvZGVUb0J1ZmZlcigoYnVmZmVyKSA9PiB7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHByb21pc2VzLnB1c2goZGVjb2RlZCk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBncmFwaCwgbG9hZCB0aGUgZmlsZSBhbmQgc3RhcnQgc2xpY2luZyBpdC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdG9wfVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodGhpcy5pbml0UHJvbWlzZSA9PT0gbnVsbCkgLy8gaW5pdCBoYXMgbm90IHlldCBiZWVuIGNhbGxlZFxuICAgICAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5pbml0KCk7XG5cbiAgICAgIHRoaXMuaW5pdFByb21pc2UudGhlbih0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKHRoaXMuYnVmZmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtIGFuZCBzdG9wIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZVN0cmVhbSh0aGlzLmVuZFRpbWUpO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuYXNzZXQuZm9ybWF0LnNhbXBsZVJhdGU7XG4gICAgY29uc3QgY2hhbm5lbHNQZXJGcmFtZSA9IHRoaXMuYXNzZXQuZm9ybWF0LmNoYW5uZWxzUGVyRnJhbWU7XG5cbiAgICBpZiAoY2hhbm5lbCA+PSBjaGFubmVsc1BlckZyYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNoYW5uZWwgbnVtYmVyLCBnaXZlbiBmaWxlIG9ubHkgY29udGFpbnMgJHtjaGFubmVsc1BlckZyYW1lfSBjaGFubmVscycpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLmNoYW5uZWxzUGVyRnJhbWUgPSBjaGFubmVsc1BlckZyYW1lO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgYXN5bmMgPSB0aGlzLnBhcmFtcy5nZXQoJ2FzeW5jJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IGNoYW5uZWxzUGVyRnJhbWUgPSB0aGlzLmNoYW5uZWxzUGVyRnJhbWU7XG4gICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICBjb25zdCBzb3VyY2VGcmFtZVNpemUgPSBmcmFtZVNpemUgKiBjaGFubmVsc1BlckZyYW1lO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBzb3VyY2VGcmFtZVNpemUpO1xuICAgIGNvbnN0IGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzYW1wbGVSYXRlO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsZW5ndGggLyAoY2hhbm5lbHNQZXJGcmFtZSAqIHNhbXBsZVJhdGUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICBsZXQgc291cmNlSW5kZXggPSAwO1xuICAgIGxldCBmcmFtZUluZGV4ID0gMDtcblxuICAgIC8vIGlucHV0IGJ1ZmZlciBpcyBpbnRlcmxlYXZlZCwgcGljayBvbmx5IHZhbHVlcyBhY2NvcmRpbmcgdG8gYGNoYW5uZWxgXG4gICAgZnVuY3Rpb24gc2xpY2UoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc291cmNlSW5kZXggKyBjaGFubmVsO1xuICAgICAgICBkYXRhW2ldID0gc291cmNlSW5kZXggPCBsZW5ndGggPyBidWZmZXJbaW5kZXhdIDogMDtcblxuICAgICAgICBzb3VyY2VJbmRleCArPSBjaGFubmVsc1BlckZyYW1lO1xuICAgICAgfVxuXG4gICAgICB0aGF0LmZyYW1lLnRpbWUgPSBmcmFtZUluZGV4ICogZnJhbWVEdXJhdGlvbjtcbiAgICAgIHRoYXQuZW5kVGltZSA9IE1hdGgubWluKHRoYXQuZnJhbWUudGltZSArIGZyYW1lRHVyYXRpb24sIGVuZFRpbWUpO1xuICAgICAgdGhhdC5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICBwcm9ncmVzc0NhbGxiYWNrKGZyYW1lSW5kZXggLyBuYnJGcmFtZXMpO1xuXG4gICAgICBpZiAoZnJhbWVJbmRleCA8IG5ickZyYW1lcykge1xuICAgICAgICBpZiAoYXN5bmMpXG4gICAgICAgICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzbGljZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5maW5hbGl6ZVN0cmVhbSh0aGF0LmVuZFRpbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFsbG93IHRoZSBmb2xsb3dpbmcgdG8gZG8gdGhlIGV4cGVjdGVkIHRoaW5nOlxuICAgIC8vIGF1ZGlvSW4uY29ubmVjdChyZWNvcmRlcik7XG4gICAgLy8gYXVkaW9Jbi5zdGFydCgpO1xuICAgIC8vIHJlY29yZGVyLnN0YXJ0KCk7XG4gICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9JbkZpbGU7XG4iXX0=