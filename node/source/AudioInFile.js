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

      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(function () {
          return _this3.start(startTime);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5GaWxlLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZmlsZW5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiZnJhbWVTaXplIiwiY2hhbm5lbCIsInByb2dyZXNzQ2FsbGJhY2siLCJudWxsYWJsZSIsImFzeW5jIiwibm9vcCIsIkF1ZGlvSW5GaWxlIiwib3B0aW9ucyIsImJ1ZmZlciIsInByb2Nlc3NTdHJlYW1QYXJhbXMiLCJiaW5kIiwicHJvbWlzZXMiLCJuZXh0TW9kdWxlcyIsIm1hcCIsIm1vZHVsZSIsImluaXRNb2R1bGUiLCJkZWNvZGVkIiwicmVzb2x2ZSIsInJlamVjdCIsInBhcmFtcyIsImdldCIsImFzc2V0IiwiQXNzZXQiLCJmcm9tRmlsZSIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInN0YWNrIiwiZGVjb2RlVG9CdWZmZXIiLCJwdXNoIiwiYWxsIiwiaW5pdGlhbGl6ZWQiLCJpbml0UHJvbWlzZSIsImluaXQiLCJ0aGVuIiwic3RhcnQiLCJzdGFydFRpbWUiLCJzdGFydGVkIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJlbmRUaW1lIiwic291cmNlU2FtcGxlUmF0ZSIsImZvcm1hdCIsInNhbXBsZVJhdGUiLCJjaGFubmVsc1BlckZyYW1lIiwiRXJyb3IiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVJhdGUiLCJzb3VyY2VTYW1wbGVDb3VudCIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImxlbmd0aCIsInNvdXJjZUZyYW1lU2l6ZSIsIm5ickZyYW1lcyIsIk1hdGgiLCJjZWlsIiwiZnJhbWVEdXJhdGlvbiIsImRhdGEiLCJmcmFtZSIsInRoYXQiLCJzb3VyY2VJbmRleCIsImZyYW1lSW5kZXgiLCJzbGljZSIsImkiLCJpbmRleCIsInRpbWUiLCJtaW4iLCJwcm9wYWdhdGVGcmFtZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QVk0QyxVQUFsQztBQUNBLFVBQU1ILFVBQVVXLFVBQVVQLG1CQUFtQkQsVUFBN0IsQ0FBaEI7QUFDQSxVQUFNYyxPQUFPLEtBQUtDLEtBQUwsQ0FBV0QsSUFBeEI7QUFDQSxVQUFNRSxPQUFPLElBQWI7O0FBRUEsVUFBSUMsY0FBYyxDQUFsQjtBQUNBLFVBQUlDLGFBQWEsQ0FBakI7O0FBRUE7QUFDQSxlQUFTQyxLQUFULEdBQWlCO0FBQ2YsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUloRSxTQUFwQixFQUErQmdFLEdBQS9CLEVBQW9DO0FBQ2xDLGNBQU1DLFFBQVFKLGNBQWM1RCxPQUE1QjtBQUNBeUQsZUFBS00sQ0FBTCxJQUFVSCxjQUFjVCxNQUFkLEdBQXVCNUMsT0FBT3lELEtBQVAsQ0FBdkIsR0FBdUMsQ0FBakQ7O0FBRUFKLHlCQUFlaEIsZ0JBQWY7QUFDRDs7QUFFRGUsYUFBS0QsS0FBTCxDQUFXTyxJQUFYLEdBQWtCSixhQUFhTCxhQUEvQjtBQUNBRyxhQUFLbkIsT0FBTCxHQUFlYyxLQUFLWSxHQUFMLENBQVNQLEtBQUtELEtBQUwsQ0FBV08sSUFBWCxHQUFrQlQsYUFBM0IsRUFBMENoQixPQUExQyxDQUFmO0FBQ0FtQixhQUFLUSxjQUFMOztBQUVBTixzQkFBYyxDQUFkO0FBQ0E1RCx5QkFBaUI0RCxhQUFhUixTQUE5Qjs7QUFFQSxZQUFJUSxhQUFhUixTQUFqQixFQUE0QjtBQUMxQixjQUFJbEQsS0FBSixFQUNFaUUsV0FBV04sS0FBWCxFQUFrQixDQUFsQixFQURGLEtBR0VBO0FBQ0gsU0FMRCxNQUtPO0FBQ0xILGVBQUtwQixjQUFMLENBQW9Cb0IsS0FBS25CLE9BQXpCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBNEIsaUJBQVdOLEtBQVgsRUFBa0IsQ0FBbEI7QUFDRDs7O0VBbkl1Qiw2Qzs7a0JBc0lYekQsVyIsImZpbGUiOiJBdWRpb0luRmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uLy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgU291cmNlTWl4aW4gZnJvbSAnLi4vLi4vY29yZS9Tb3VyY2VNaXhpbic7XG5pbXBvcnQgYXYgZnJvbSAnYXYnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBmaWxlbmFtZToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1MTIsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNoYW5uZWw6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgcHJvZ3Jlc3NDYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGFzeW5jOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogUmVhZCBhIGZpbGUgYW5kIHByb3BhZ2F0ZSByYXcgc2lnbmFsIGludG8gdGhlIGdyYXBoLlxuICpcbiAqIFRoaXMgbm9kZSBpcyBiYXNlZCBvbiB0aGVcbiAqIFtgYXVyb3JhLmpzYF0oaHR0cHM6Ly9naXRodWIuY29tL2F1ZGlvY29ncy9hdXJvcmEuanMpIGxpYnJhcnkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IG9wdGlvbnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZmlsZW5hbWU9bnVsbF0gLSBQYXRoIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiBvdXRwdXQgZnJhbWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2hhbm5lbD0wXSAtIENoYW5uZWwgbnVtYmVyIG9mIHRoZSBpbnB1dCBmaWxlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnByb2dyZXNzQ2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGN1dGVkIG9uIGVhY2hcbiAqICBmcmFtZSBvdXRwdXQsIHJlY2VpdmUgYXMgYXJndW1lbnQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgcmF0aW8uXG4gKlxuICogQHRvZG8gLSBkZWZpbmUgd2hpY2ggY2hhbm5lbCBzaG91bGQgYmUgbG9hZGVkLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6bm9kZS5zb3VyY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9ub2RlJztcbiAqIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuICpcbiAqIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuL215LWZpbGUnKTtcbiAqXG4gKiBjb25zdCBhdWRpb0luRmlsZSA9IG5ldyBBdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiBmaWxlbmFtZSxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAqICAgZGF0YTogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5GaWxlLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGF1ZGlvSW5GaWxlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5GaWxlIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5idWZmZXIgPSBudWxsO1xuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyA9IHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdE1vZHVsZSgpIHtcbiAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMubmV4dE1vZHVsZXMubWFwKChtb2R1bGUpID0+IHtcbiAgICAgIHJldHVybiBtb2R1bGUuaW5pdE1vZHVsZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZGVjb2RlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxlbmFtZScpO1xuICAgICAgdGhpcy5hc3NldCA9IGF2LkFzc2V0LmZyb21GaWxlKGZpbGVuYW1lKTtcbiAgICAgIHRoaXMuYXNzZXQub24oJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5sb2coZXJyLnN0YWNrKSk7XG4gICAgICAvLyBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBiZWNhdXNlIHNhbXBsZVJhdGUgaXMgb25seSBhdmFpbGFibGVcbiAgICAgIHRoaXMuYXNzZXQuZGVjb2RlVG9CdWZmZXIoKGJ1ZmZlcikgPT4ge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBwcm9taXNlcy5wdXNoKGRlY29kZWQpO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgZ3JhcGgsIGxvYWQgdGhlIGZpbGUgYW5kIHN0YXJ0IHNsaWNpbmcgaXQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6bm9kZS5zb3VyY2UuQXVkaW9JbkZpbGUjc3RvcH1cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRoaXMuaW5pdFByb21pc2UgPT09IG51bGwpIC8vIGluaXQgaGFzIG5vdCB5ZXQgYmVlbiBjYWxsZWRcbiAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdCgpO1xuXG4gICAgICB0aGlzLmluaXRQcm9taXNlLnRoZW4oKCkgPT4gdGhpcy5zdGFydChzdGFydFRpbWUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKHRoaXMuYnVmZmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtIGFuZCBzdG9wIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZVN0cmVhbSh0aGlzLmVuZFRpbWUpO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuYXNzZXQuZm9ybWF0LnNhbXBsZVJhdGU7XG4gICAgY29uc3QgY2hhbm5lbHNQZXJGcmFtZSA9IHRoaXMuYXNzZXQuZm9ybWF0LmNoYW5uZWxzUGVyRnJhbWU7XG5cbiAgICBpZiAoY2hhbm5lbCA+PSBjaGFubmVsc1BlckZyYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNoYW5uZWwgbnVtYmVyLCBnaXZlbiBmaWxlIG9ubHkgY29udGFpbnMgJHtjaGFubmVsc1BlckZyYW1lfSBjaGFubmVscycpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLmNoYW5uZWxzUGVyRnJhbWUgPSBjaGFubmVsc1BlckZyYW1lO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgYXN5bmMgPSB0aGlzLnBhcmFtcy5nZXQoJ2FzeW5jJyk7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IGNoYW5uZWxzUGVyRnJhbWUgPSB0aGlzLmNoYW5uZWxzUGVyRnJhbWU7XG4gICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICBjb25zdCBzb3VyY2VGcmFtZVNpemUgPSBmcmFtZVNpemUgKiBjaGFubmVsc1BlckZyYW1lO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBzb3VyY2VGcmFtZVNpemUpO1xuICAgIGNvbnN0IGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzYW1wbGVSYXRlO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsZW5ndGggLyAoY2hhbm5lbHNQZXJGcmFtZSAqIHNhbXBsZVJhdGUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICBsZXQgc291cmNlSW5kZXggPSAwO1xuICAgIGxldCBmcmFtZUluZGV4ID0gMDtcblxuICAgIC8vIGlucHV0IGJ1ZmZlciBpcyBpbnRlcmxlYXZlZCwgcGljayBvbmx5IHZhbHVlcyBhY2NvcmRpbmcgdG8gYGNoYW5uZWxgXG4gICAgZnVuY3Rpb24gc2xpY2UoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc291cmNlSW5kZXggKyBjaGFubmVsO1xuICAgICAgICBkYXRhW2ldID0gc291cmNlSW5kZXggPCBsZW5ndGggPyBidWZmZXJbaW5kZXhdIDogMDtcblxuICAgICAgICBzb3VyY2VJbmRleCArPSBjaGFubmVsc1BlckZyYW1lO1xuICAgICAgfVxuXG4gICAgICB0aGF0LmZyYW1lLnRpbWUgPSBmcmFtZUluZGV4ICogZnJhbWVEdXJhdGlvbjtcbiAgICAgIHRoYXQuZW5kVGltZSA9IE1hdGgubWluKHRoYXQuZnJhbWUudGltZSArIGZyYW1lRHVyYXRpb24sIGVuZFRpbWUpO1xuICAgICAgdGhhdC5wcm9wYWdhdGVGcmFtZSgpO1xuXG4gICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICBwcm9ncmVzc0NhbGxiYWNrKGZyYW1lSW5kZXggLyBuYnJGcmFtZXMpO1xuXG4gICAgICBpZiAoZnJhbWVJbmRleCA8IG5ickZyYW1lcykge1xuICAgICAgICBpZiAoYXN5bmMpXG4gICAgICAgICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzbGljZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5maW5hbGl6ZVN0cmVhbSh0aGF0LmVuZFRpbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFsbG93IHRoZSBmb2xsb3dpbmcgdG8gZG8gdGhlIGV4cGVjdGVkIHRoaW5nOlxuICAgIC8vIGF1ZGlvSW4uY29ubmVjdChyZWNvcmRlcik7XG4gICAgLy8gYXVkaW9Jbi5zdGFydCgpO1xuICAgIC8vIHJlY29yZGVyLnN0YXJ0KCk7XG4gICAgc2V0VGltZW91dChzbGljZSwgMCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9JbkZpbGU7XG4iXX0=