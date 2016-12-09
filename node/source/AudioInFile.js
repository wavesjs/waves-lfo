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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvSW5GaWxlLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiZmlsZW5hbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwiZnJhbWVTaXplIiwiY2hhbm5lbCIsInByb2dyZXNzQ2FsbGJhY2siLCJudWxsYWJsZSIsIm5vb3AiLCJBdWRpb0luRmlsZSIsIm9wdGlvbnMiLCJwcm9jZXNzU3RyZWFtUGFyYW1zIiwiYmluZCIsInBhcmFtcyIsImdldCIsImFzc2V0IiwiQXNzZXQiLCJmcm9tRmlsZSIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInN0YWNrIiwiZGVjb2RlVG9CdWZmZXIiLCJidWZmZXIiLCJpbml0U3RyZWFtIiwicHJvY2Vzc0ZyYW1lIiwiZmluYWxpemVTdHJlYW0iLCJlbmRUaW1lIiwic291cmNlU2FtcGxlUmF0ZSIsImZvcm1hdCIsInNhbXBsZVJhdGUiLCJjaGFubmVsc1BlckZyYW1lIiwiRXJyb3IiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVR5cGUiLCJmcmFtZVJhdGUiLCJzb3VyY2VTYW1wbGVDb3VudCIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImxlbmd0aCIsInNvdXJjZUZyYW1lU2l6ZSIsIm5ickZyYW1lcyIsIk1hdGgiLCJjZWlsIiwiZnJhbWVEdXJhdGlvbiIsImRhdGEiLCJmcmFtZSIsInRoYXQiLCJzb3VyY2VJbmRleCIsImZyYW1lSW5kZXgiLCJzbGljZSIsImkiLCJpbmRleCIsInRpbWUiLCJtaW4iLCJwcm9wYWdhdGVGcmFtZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsWUFBVTtBQUNSQyxVQUFNLFFBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVU7QUFIRixHQURRO0FBTWxCQyxhQUFXO0FBQ1RILFVBQU0sU0FERztBQUVUQyxhQUFTLEdBRkE7QUFHVEMsY0FBVTtB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VUFBTUksZ0JBQWdCeEMsWUFBWTJCLFVBQWxDO0FBQ0EsVUFBTUgsVUFBVVcsVUFBVVAsbUJBQW1CRCxVQUE3QixDQUFoQjtBQUNBLFVBQU1jLE9BQU8sS0FBS0MsS0FBTCxDQUFXRCxJQUF4QjtBQUNBLFVBQU1FLE9BQU8sSUFBYjs7QUFFQSxVQUFJQyxjQUFjLENBQWxCO0FBQ0EsVUFBSUMsYUFBYSxDQUFqQjs7QUFFQTtBQUNDLGdCQUFTQyxLQUFULEdBQWlCO0FBQ2hCLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJL0MsU0FBcEIsRUFBK0IrQyxHQUEvQixFQUFvQztBQUNsQyxjQUFNQyxRQUFRSixjQUFjM0MsT0FBNUI7QUFDQXdDLGVBQUtNLENBQUwsSUFBVUgsY0FBY1QsTUFBZCxHQUF1QmYsT0FBTzRCLEtBQVAsQ0FBdkIsR0FBdUMsQ0FBakQ7O0FBRUFKLHlCQUFlaEIsZ0JBQWY7QUFDRDs7QUFFRGUsYUFBS0QsS0FBTCxDQUFXTyxJQUFYLEdBQWtCSixhQUFhTCxhQUEvQjtBQUNBRyxhQUFLbkIsT0FBTCxHQUFlYyxLQUFLWSxHQUFMLENBQVNQLEtBQUtELEtBQUwsQ0FBV08sSUFBWCxHQUFrQlQsYUFBM0IsRUFBMENoQixPQUExQyxDQUFmO0FBQ0FtQixhQUFLUSxjQUFMOztBQUVBTixzQkFBYyxDQUFkO0FBQ0EzQyx5QkFBaUIyQyxhQUFhUixTQUE5Qjs7QUFFQSxZQUFJUSxhQUFhUixTQUFqQixFQUNFZSxXQUFXTixLQUFYLEVBQWtCLENBQWxCLEVBREYsS0FHRUgsS0FBS3BCLGNBQUwsQ0FBb0JvQixLQUFLbkIsT0FBekI7QUFDSCxPQW5CQSxHQUFEO0FBcUJEOzs7OztrQkFHWW5CLFciLCJmaWxlIjoiQXVkaW9JbkZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IGF2IGZyb20gJ2F2JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgZmlsZW5hbWU6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTEyLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjaGFubmVsOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIHByb2dyZXNzQ2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogUmVhZCBhIGZpbGUgYW5kIHByb3BhZ2F0ZSByYXcgc2lnbmFsIGludG8gdGhlIGdyYXBoLlxuICpcbiAqIFRoaXMgbm9kZSBpcyBiYXNlZCBvbiB0aGVcbiAqIFtgYXVyb3JhLmpzYF0oaHR0cHM6Ly9naXRodWIuY29tL2F1ZGlvY29ncy9hdXJvcmEuanMpIGxpYnJhcnkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IG9wdGlvbnMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZmlsZW5hbWU9bnVsbF0gLSBQYXRoIHRvIHRoZSBmaWxlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT01MTJdIC0gU2l6ZSBvZiBvdXRwdXQgZnJhbWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2hhbm5lbD0wXSAtIENoYW5uZWwgbnVtYmVyIG9mIHRoZSBpbnB1dCBmaWxlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnByb2dyZXNzQ2FsbGJhY2s9bnVsbF0gLSBDYWxsYmFjayB0byBiZSBleGN1dGVkIG9uIGVhY2hcbiAqICBmcmFtZSBvdXRwdXQsIHJlY2VpdmUgYXMgYXJndW1lbnQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgcmF0aW8uXG4gKlxuICogQHRvZG8gLSBkZWZpbmUgd2hpY2ggY2hhbm5lbCBzaG91bGQgYmUgbG9hZGVkLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6bm9kZS5zb3VyY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9ub2RlJztcbiAqIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuICpcbiAqIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuL215LWZpbGUnKTtcbiAqXG4gKiBjb25zdCBhdWRpb0luRmlsZSA9IG5ldyBBdWRpb0luRmlsZSh7XG4gKiAgIGZpbGVuYW1lOiBmaWxlbmFtZSxcbiAqICAgZnJhbWVTaXplOiA1MTIsXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKHtcbiAqICAgZGF0YTogdHJ1ZSxcbiAqIH0pO1xuICpcbiAqIGF1ZGlvSW5GaWxlLmNvbm5lY3QobG9nZ2VyKTtcbiAqIGF1ZGlvSW5GaWxlLnN0YXJ0KCk7XG4gKi9cbmNsYXNzIEF1ZGlvSW5GaWxlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMgPSB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgZ3JhcGgsIGxvYWQgdGhlIGZpbGUgYW5kIHN0YXJ0IHNsaWNpbmcgaXQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6bm9kZS5zb3VyY2UuQXVkaW9JbkZpbGUjc3RvcH1cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IGZpbGVuYW1lID0gdGhpcy5wYXJhbXMuZ2V0KCdmaWxlbmFtZScpO1xuICAgIHRoaXMuYXNzZXQgPSBhdi5Bc3NldC5mcm9tRmlsZShmaWxlbmFtZSk7XG4gICAgdGhpcy5hc3NldC5vbignZXJyb3InLCAoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIuc3RhY2spKTtcbiAgICAvLyBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBiZWNhdXNlIHNhbXBsZVJhdGUgaXMgb25seSBhdmFpbGFibGVcbiAgICB0aGlzLmFzc2V0LmRlY29kZVRvQnVmZmVyKChidWZmZXIpID0+IHtcbiAgICAgIHRoaXMuaW5pdFN0cmVhbSgpO1xuICAgICAgdGhpcy5wcm9jZXNzRnJhbWUoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtIGFuZCBzdG9wIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpub2RlLnNvdXJjZS5BdWRpb0luRmlsZSNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5maW5hbGl6ZVN0cmVhbSh0aGlzLmVuZFRpbWUpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3Qgc291cmNlU2FtcGxlUmF0ZSA9IHRoaXMuYXNzZXQuZm9ybWF0LnNhbXBsZVJhdGU7XG4gICAgY29uc3QgY2hhbm5lbHNQZXJGcmFtZSA9IHRoaXMuYXNzZXQuZm9ybWF0LmNoYW5uZWxzUGVyRnJhbWU7XG5cbiAgICBpZiAoY2hhbm5lbCA+PSBjaGFubmVsc1BlckZyYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNoYW5uZWwgbnVtYmVyLCBnaXZlbiBmaWxlIG9ubHkgY29udGFpbnMgJHtjaGFubmVsc1BlckZyYW1lfSBjaGFubmVscycpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3NpZ25hbCc7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNvdXJjZVNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB0aGlzLmNoYW5uZWxzUGVyRnJhbWUgPSBjaGFubmVsc1BlckZyYW1lO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoYnVmZmVyKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBjaGFubmVsID0gdGhpcy5wYXJhbXMuZ2V0KCdjaGFubmVsJyk7XG4gICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgncHJvZ3Jlc3NDYWxsYmFjaycpIHx8wqBub29wO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuICAgIGNvbnN0IGNoYW5uZWxzUGVyRnJhbWUgPSB0aGlzLmNoYW5uZWxzUGVyRnJhbWU7XG4gICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICBjb25zdCBzb3VyY2VGcmFtZVNpemUgPSBmcmFtZVNpemUgKiBjaGFubmVsc1BlckZyYW1lO1xuICAgIGNvbnN0IG5ickZyYW1lcyA9IE1hdGguY2VpbChsZW5ndGggLyBzb3VyY2VGcmFtZVNpemUpO1xuICAgIGNvbnN0IGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzYW1wbGVSYXRlO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsZW5ndGggLyAoY2hhbm5lbHNQZXJGcmFtZSAqIHNhbXBsZVJhdGUpO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICBsZXQgc291cmNlSW5kZXggPSAwO1xuICAgIGxldCBmcmFtZUluZGV4ID0gMDtcblxuICAgIC8vIGlucHV0IGJ1ZmZlciBpcyBpbnRlcmxlYXZlZCwgcGljayBvbmx5IHZhbHVlcyBhY2NvcmRpbmcgdG8gYGNoYW5uZWxgXG4gICAgKGZ1bmN0aW9uIHNsaWNlKCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgICBjb25zdCBpbmRleCA9IHNvdXJjZUluZGV4ICsgY2hhbm5lbDtcbiAgICAgICAgZGF0YVtpXSA9IHNvdXJjZUluZGV4IDwgbGVuZ3RoID8gYnVmZmVyW2luZGV4XSA6IDA7XG5cbiAgICAgICAgc291cmNlSW5kZXggKz0gY2hhbm5lbHNQZXJGcmFtZTtcbiAgICAgIH1cblxuICAgICAgdGhhdC5mcmFtZS50aW1lID0gZnJhbWVJbmRleCAqIGZyYW1lRHVyYXRpb247XG4gICAgICB0aGF0LmVuZFRpbWUgPSBNYXRoLm1pbih0aGF0LmZyYW1lLnRpbWUgKyBmcmFtZUR1cmF0aW9uLCBlbmRUaW1lKTtcbiAgICAgIHRoYXQucHJvcGFnYXRlRnJhbWUoKTtcblxuICAgICAgZnJhbWVJbmRleCArPSAxO1xuICAgICAgcHJvZ3Jlc3NDYWxsYmFjayhmcmFtZUluZGV4IC8gbmJyRnJhbWVzKTtcblxuICAgICAgaWYgKGZyYW1lSW5kZXggPCBuYnJGcmFtZXMpXG4gICAgICAgIHNldFRpbWVvdXQoc2xpY2UsIDApO1xuICAgICAgZWxzZVxuICAgICAgICB0aGF0LmZpbmFsaXplU3RyZWFtKHRoYXQuZW5kVGltZSk7XG4gICAgfSgpKTtcblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1ZGlvSW5GaWxlO1xuIl19