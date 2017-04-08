'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFinite = require('babel-runtime/core-js/number/is-finite');

var _isFinite2 = _interopRequireDefault(_isFinite);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
var isNode = new Function('try { return this === global; } catch(e) { return false }');

/**
 * Create a function that returns time in seconds according to the current
 * environnement (node or browser).
 * If running in node the time rely on `process.hrtime`, while if in the browser
 * it is provided by the `currentTime` of an `AudioContext`, this context can
 * optionnaly be provided to keep time consistency between several `EventIn`
 * nodes.
 *
 * @param {AudioContext} [audioContext=null] - Optionnal audio context.
 * @return {Function}
 * @private
 */
function getTimeFunction() {
  var audioContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (isNode()) {
    return function () {
      var t = process.hrtime();
      return t[0] + t[1] * 1e-9;
    };
  } else {
    if (audioContext === null || !audioContext instanceof AudioContext) {
      var _AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new _AudioContext();
    }

    return function () {
      return audioContext.currentTime;
    };
  }
}

var definitions = {
  absoluteTime: {
    type: 'boolean',
    default: false,
    constant: true
  },
  audioContext: {
    type: 'any',
    default: null,
    constant: true,
    nullable: true
  },
  frameType: {
    type: 'enum',
    list: ['signal', 'vector', 'scalar'],
    default: 'signal',
    constant: true
  },
  frameSize: {
    type: 'integer',
    default: 1,
    min: 1,
    max: +Infinity, // not recommended...
    metas: { kind: 'static' }
  },
  sampleRate: {
    type: 'float',
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
    metas: { kind: 'static' }
  },
  frameRate: {
    type: 'float',
    default: null,
    min: 0,
    max: +Infinity, // same here
    nullable: true,
    metas: { kind: 'static' }
  },
  description: {
    type: 'any',
    default: null,
    constant: true
  }
};

/**
 * The `EventIn` operator allows to manually create a stream of data or to feed
 * a stream from another source (e.g. sensors) into a processing graph.
 *
 * @param {Object} options - Override parameters' default values.
 * @param {String} [options.frameType='signal'] - Type of the input - allowed
 * values: `signal`,  `vector` or `scalar`.
 * @param {Number} [options.frameSize=1] - Size of the output frame.
 * @param {Number} [options.sampleRate=null] - Sample rate of the source stream,
 *  if of type `signal`.
 * @param {Number} [options.frameRate=null] - Rate of the source stream, if of
 *  type `vector`.
 * @param {Array|String} [options.description] - Optionnal description
 *  describing the dimensions of the output frame
 * @param {Boolean} [options.absoluteTime=false] - Define if time should be used
 *  as forwarded as given in the process method, or relatively to the time of
 *  the first `process` call after start.
 *
 * @memberof module:common.source
 *
 * @todo - Add a `logicalTime` parameter to tag frame according to frame rate.
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   frameSize: 3,
 *   frameRate: 1 / 50,
 *   description: ['alpha', 'beta', 'gamma'],
 * });
 *
 * // connect source to operators and sink(s)
 *
 * // initialize and start the graph
 * eventIn.start();
 *
 * // feed `deviceorientation` data into the graph
 * window.addEventListener('deviceorientation', (e) => {
 *   const frame = {
 *     time: new Date().getTime(),
 *     data: [e.alpha, e.beta, e.gamma],
 *   };
 *
 *   eventIn.processFrame(frame);
 * }, false);
 */

var EventIn = function (_SourceMixin) {
  (0, _inherits3.default)(EventIn, _SourceMixin);

  function EventIn() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, EventIn);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventIn.__proto__ || (0, _getPrototypeOf2.default)(EventIn)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    _this._getTime = getTimeFunction(audioContext);
    _this.ready = false;
    _this._startTime = null;
    _this._systemTime = null;
    _this._absoluteTime = _this.params.get('absoluteTime');
    return _this;
  }

  /**
   * Propagate the `streamParams` in the graph and allow to push frames into
   * the graph. Any call to `process` or `processFrame` before `start` will be
   * ignored.
   *
   * @see {@link module:common.core.BaseLfo#processStreamParams}
   * @see {@link module:common.core.BaseLfo#resetStream}
   * @see {@link module:common.source.EventIn#stop}
   */


  (0, _createClass3.default)(EventIn, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!this._initPromise) {
        this._initPromise = this.init();
        this._initPromise.then(function () {
          return _this2.start(startTime);
        });
        return;
      }

      this._startTime = startTime;
      this._systemTime = null; // value set in the first `process` call

      this.ready = true;
    }

    /**
     * Finalize the stream and stop the whole graph. Any call to `process` or
     * `processFrame` after `stop` will be ignored.
     *
     * @see {@link module:common.core.BaseLfo#finalizeStream}
     * @see {@link module:common.source.EventIn#start}
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.ready && this._startTime !== null) {
        var currentTime = this._getTime();
        var endTime = this.frame.time + (currentTime - this._systemTime);

        this.finalizeStream(endTime);
        this.ready = false;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var frameSize = this.params.get('frameSize');
      var frameType = this.params.get('frameType');
      var sampleRate = this.params.get('sampleRate');
      var frameRate = this.params.get('frameRate');
      var description = this.params.get('description');
      // init operator's stream params
      this.streamParams.frameSize = frameType === 'scalar' ? 1 : frameSize;
      this.streamParams.frameType = frameType;
      this.streamParams.description = description;

      if (frameType === 'signal') {
        if (sampleRate === null) throw new Error('Undefined "sampleRate" for "signal" stream');

        this.streamParams.sourceSampleRate = sampleRate;
        this.streamParams.frameRate = sampleRate / frameSize;
        this.streamParams.sourceSampleCount = frameSize;
      } else if (frameType === 'vector' || frameType === 'scalar') {
        if (frameRate === null) throw new Error('Undefined "frameRate" for "vector" stream');

        this.streamParams.frameRate = frameRate;
        this.streamParams.sourceSampleRate = frameRate;
        this.streamParams.sourceSampleCount = 1;
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      var currentTime = this._getTime();
      var inData = frame.data.length ? frame.data : [frame.data];
      var outData = this.frame.data;
      // if no time provided, use system time
      var time = (0, _isFinite2.default)(frame.time) ? frame.time : currentTime;

      if (this._startTime === null) this._startTime = time;

      if (this._absoluteTime === false) time = time - this._startTime;

      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        outData[i] = inData[i];
      }this.frame.time = time;
      this.frame.metadata = frame.metadata;
      // store current time to compute `endTime` on stop
      this._systemTime = currentTime;
    }

    /**
     * Alternative interface to propagate a frame in the graph. Pack `time`,
     * `data` and `metadata` in a frame object.
     *
     * @param {Number} time - Frame time.
     * @param {Float32Array|Array} data - Frame data.
     * @param {Object} metadata - Optionnal frame metadata.
     *
     * @example
     * eventIn.process(1, [0, 1, 2]);
     * // is equivalent to
     * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
     */

  }, {
    key: 'process',
    value: function process(time, data) {
      var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.processFrame({ time: time, data: data, metadata: metadata });
    }

    /**
     * Propagate a frame object in the graph.
     *
     * @param {Object} frame - Input frame.
     * @param {Number} frame.time - Frame time.
     * @param {Float32Array|Array} frame.data - Frame data.
     * @param {Object} [frame.metadata=undefined] - Optionnal frame metadata.
     *
     * @example
     * eventIn.processFrame({ time: 1, data: [0, 1, 2] });
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      if (!this.ready) return;

      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }]);
  return EventIn;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50SW4uanMiXSwibmFtZXMiOlsiaXNOb2RlIiwiRnVuY3Rpb24iLCJnZXRUaW1lRnVuY3Rpb24iLCJhdWRpb0NvbnRleHQiLCJ0IiwicHJvY2VzcyIsImhydGltZSIsIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImN1cnJlbnRUaW1lIiwiZGVmaW5pdGlvbnMiLCJhYnNvbHV0ZVRpbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJmcmFtZVR5cGUiLCJsaXN0IiwiZnJhbWVTaXplIiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJtZXRhcyIsImtpbmQiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJFdmVudEluIiwib3B0aW9ucyIsInBhcmFtcyIsImdldCIsIl9nZXRUaW1lIiwicmVhZHkiLCJfc3RhcnRUaW1lIiwiX3N5c3RlbVRpbWUiLCJfYWJzb2x1dGVUaW1lIiwic3RhcnRUaW1lIiwiX2luaXRQcm9taXNlIiwiaW5pdCIsInRoZW4iLCJzdGFydCIsImVuZFRpbWUiLCJmcmFtZSIsInRpbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInN0cmVhbVBhcmFtcyIsIkVycm9yIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiaW5EYXRhIiwiZGF0YSIsImxlbmd0aCIsIm91dERhdGEiLCJpIiwibCIsIm1ldGFkYXRhIiwicHJvY2Vzc0ZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsU0FBUyxJQUFJQyxRQUFKLENBQWEsMkRBQWIsQ0FBZjs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsU0FBU0MsZUFBVCxHQUE4QztB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UCxDQUFiO0FBREYsT0FHQSxLQUFLWixLQUFMLENBQVdDLElBQVgsR0FBa0JBLElBQWxCO0FBQ0EsV0FBS0QsS0FBTCxDQUFXYyxRQUFYLEdBQXNCZCxNQUFNYyxRQUE1QjtBQUNBO0FBQ0EsV0FBS3RCLFdBQUwsR0FBbUJ6QixXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OzRCQWFRa0MsSSxFQUFNUSxJLEVBQXVCO0FBQUEsVUFBakJLLFFBQWlCLHVFQUFOLElBQU07O0FBQ25DLFdBQUtDLFlBQUwsQ0FBa0IsRUFBRWQsVUFBRixFQUFRUSxVQUFSLEVBQWNLLGtCQUFkLEVBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O2lDQVdhZCxLLEVBQU87QUFDbEIsVUFBSSxDQUFDLEtBQUtWLEtBQVYsRUFBaUI7O0FBRWpCLFdBQUswQixZQUFMO0FBQ0EsV0FBS0MsZUFBTCxDQUFxQmpCLEtBQXJCO0FBQ0EsV0FBS2tCLGNBQUw7QUFDRDs7O0VBNUltQiw2Qzs7a0JBK0lQakMsTyIsImZpbGUiOiJFdmVudEluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzU3NTc5MC9lbnZpcm9ubWVudC1kZXRlY3Rpb24tbm9kZS1qcy1vci1icm93c2VyXG5jb25zdCBpc05vZGUgPSBuZXcgRnVuY3Rpb24oJ3RyeSB7IHJldHVybiB0aGlzID09PSBnbG9iYWw7IH0gY2F0Y2goZSkgeyByZXR1cm4gZmFsc2UgfScpO1xuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aW1lIGluIHNlY29uZHMgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50XG4gKiBlbnZpcm9ubmVtZW50IChub2RlIG9yIGJyb3dzZXIpLlxuICogSWYgcnVubmluZyBpbiBub2RlIHRoZSB0aW1lIHJlbHkgb24gYHByb2Nlc3MuaHJ0aW1lYCwgd2hpbGUgaWYgaW4gdGhlIGJyb3dzZXJcbiAqIGl0IGlzIHByb3ZpZGVkIGJ5IHRoZSBgY3VycmVudFRpbWVgIG9mIGFuIGBBdWRpb0NvbnRleHRgLCB0aGlzIGNvbnRleHQgY2FuXG4gKiBvcHRpb25uYWx5IGJlIHByb3ZpZGVkIHRvIGtlZXAgdGltZSBjb25zaXN0ZW5jeSBiZXR3ZWVuIHNldmVyYWwgYEV2ZW50SW5gXG4gKiBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW2F1ZGlvQ29udGV4dD1udWxsXSAtIE9wdGlvbm5hbCBhdWRpbyBjb250ZXh0LlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRUaW1lRnVuY3Rpb24oYXVkaW9Db250ZXh0ID0gbnVsbCkge1xuICBpZiAoaXNOb2RlKCkpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gdFswXSArIHRbMV0gKiAxZS05O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXVkaW9Db250ZXh0ID09PSBudWxsIHx8wqAoIWF1ZGlvQ29udGV4dCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkpIHtcbiAgICAgIGNvbnN0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHzCoHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICAgICBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxufVxuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBhYnNvbHV0ZVRpbWU6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGF1ZGlvQ29udGV4dDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gIH0sXG4gIGZyYW1lVHlwZToge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBsaXN0OiBbJ3NpZ25hbCcsICd2ZWN0b3InLCAnc2NhbGFyJ10sXG4gICAgZGVmYXVsdDogJ3NpZ25hbCcsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGZyYW1lU2l6ZToge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1pbjogMSxcbiAgICBtYXg6ICtJbmZpbml0eSwgLy8gbm90IHJlY29tbWVuZGVkLi4uXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgc2FtcGxlUmF0ZToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksIC8vIHNhbWUgaGVyZVxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGZyYW1lUmF0ZToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksIC8vIHNhbWUgaGVyZVxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGRlc2NyaXB0aW9uOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfVxufTtcblxuLyoqXG4gKiBUaGUgYEV2ZW50SW5gIG9wZXJhdG9yIGFsbG93cyB0byBtYW51YWxseSBjcmVhdGUgYSBzdHJlYW0gb2YgZGF0YSBvciB0byBmZWVkXG4gKiBhIHN0cmVhbSBmcm9tIGFub3RoZXIgc291cmNlIChlLmcuIHNlbnNvcnMpIGludG8gYSBwcm9jZXNzaW5nIGdyYXBoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgcGFyYW1ldGVycycgZGVmYXVsdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZnJhbWVUeXBlPSdzaWduYWwnXSAtIFR5cGUgb2YgdGhlIGlucHV0IC0gYWxsb3dlZFxuICogdmFsdWVzOiBgc2lnbmFsYCwgIGB2ZWN0b3JgIG9yIGBzY2FsYXJgLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lU2l6ZT0xXSAtIFNpemUgb2YgdGhlIG91dHB1dCBmcmFtZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zYW1wbGVSYXRlPW51bGxdIC0gU2FtcGxlIHJhdGUgb2YgdGhlIHNvdXJjZSBzdHJlYW0sXG4gKiAgaWYgb2YgdHlwZSBgc2lnbmFsYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVJhdGU9bnVsbF0gLSBSYXRlIG9mIHRoZSBzb3VyY2Ugc3RyZWFtLCBpZiBvZlxuICogIHR5cGUgYHZlY3RvcmAuXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gW29wdGlvbnMuZGVzY3JpcHRpb25dIC0gT3B0aW9ubmFsIGRlc2NyaXB0aW9uXG4gKiAgZGVzY3JpYmluZyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgb3V0cHV0IGZyYW1lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFic29sdXRlVGltZT1mYWxzZV0gLSBEZWZpbmUgaWYgdGltZSBzaG91bGQgYmUgdXNlZFxuICogIGFzIGZvcndhcmRlZCBhcyBnaXZlbiBpbiB0aGUgcHJvY2VzcyBtZXRob2QsIG9yIHJlbGF0aXZlbHkgdG8gdGhlIHRpbWUgb2ZcbiAqICB0aGUgZmlyc3QgYHByb2Nlc3NgIGNhbGwgYWZ0ZXIgc3RhcnQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uc291cmNlXG4gKlxuICogQHRvZG8gLSBBZGQgYSBgbG9naWNhbFRpbWVgIHBhcmFtZXRlciB0byB0YWcgZnJhbWUgYWNjb3JkaW5nIHRvIGZyYW1lIHJhdGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbiAqXG4gKiBjb25zdCBldmVudEluID0gbmV3IGxmby5zb3VyY2UuRXZlbnRJbih7XG4gKiAgIGZyYW1lVHlwZTogJ3ZlY3RvcicsXG4gKiAgIGZyYW1lU2l6ZTogMyxcbiAqICAgZnJhbWVSYXRlOiAxIC8gNTAsXG4gKiAgIGRlc2NyaXB0aW9uOiBbJ2FscGhhJywgJ2JldGEnLCAnZ2FtbWEnXSxcbiAqIH0pO1xuICpcbiAqIC8vIGNvbm5lY3Qgc291cmNlIHRvIG9wZXJhdG9ycyBhbmQgc2luayhzKVxuICpcbiAqIC8vIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBncmFwaFxuICogZXZlbnRJbi5zdGFydCgpO1xuICpcbiAqIC8vIGZlZWQgYGRldmljZW9yaWVudGF0aW9uYCBkYXRhIGludG8gdGhlIGdyYXBoXG4gKiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlb3JpZW50YXRpb24nLCAoZSkgPT4ge1xuICogICBjb25zdCBmcmFtZSA9IHtcbiAqICAgICB0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAqICAgICBkYXRhOiBbZS5hbHBoYSwgZS5iZXRhLCBlLmdhbW1hXSxcbiAqICAgfTtcbiAqXG4gKiAgIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lKTtcbiAqIH0sIGZhbHNlKTtcbiAqL1xuY2xhc3MgRXZlbnRJbiBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICB0aGlzLl9nZXRUaW1lID0gZ2V0VGltZUZ1bmN0aW9uKGF1ZGlvQ29udGV4dCk7XG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IG51bGw7XG4gICAgdGhpcy5fYWJzb2x1dGVUaW1lID0gdGhpcy5wYXJhbXMuZ2V0KCdhYnNvbHV0ZVRpbWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGBzdHJlYW1QYXJhbXNgIGluIHRoZSBncmFwaCBhbmQgYWxsb3cgdG8gcHVzaCBmcmFtZXMgaW50b1xuICAgKiB0aGUgZ3JhcGguIEFueSBjYWxsIHRvIGBwcm9jZXNzYCBvciBgcHJvY2Vzc0ZyYW1lYCBiZWZvcmUgYHN0YXJ0YCB3aWxsIGJlXG4gICAqIGlnbm9yZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLnNvdXJjZS5FdmVudEluI3N0b3B9XG4gICAqL1xuICBzdGFydChzdGFydFRpbWUgPSBudWxsKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0UHJvbWlzZSkge1xuICAgICAgdGhpcy5faW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcbiAgICAgIHRoaXMuX2luaXRQcm9taXNlLnRoZW4oKCkgPT4gdGhpcy5zdGFydChzdGFydFRpbWUpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zdGFydFRpbWUgPSBzdGFydFRpbWU7XG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IG51bGw7IC8vIHZhbHVlIHNldCBpbiB0aGUgZmlyc3QgYHByb2Nlc3NgIGNhbGxcblxuICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBBbnkgY2FsbCB0byBgcHJvY2Vzc2Agb3JcbiAgICogYHByb2Nlc3NGcmFtZWAgYWZ0ZXIgYHN0b3BgIHdpbGwgYmUgaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLnJlYWR5ICYmIHRoaXMuX3N0YXJ0VGltZSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLl9nZXRUaW1lKCk7XG4gICAgICBjb25zdCBlbmRUaW1lID0gdGhpcy5mcmFtZS50aW1lICsgKGN1cnJlbnRUaW1lIC0gdGhpcy5fc3lzdGVtVGltZSk7XG5cbiAgICAgIHRoaXMuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lVHlwZScpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NhbXBsZVJhdGUnKTtcbiAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lUmF0ZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkZXNjcmlwdGlvbicpO1xuICAgIC8vIGluaXQgb3BlcmF0b3IncyBzdHJlYW0gcGFyYW1zXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVUeXBlID09PSAnc2NhbGFyJyA/IDEgOiBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gZnJhbWVUeXBlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgaWYgKHNhbXBsZVJhdGUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIFwic2FtcGxlUmF0ZVwiIGZvciBcInNpZ25hbFwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc2FtcGxlUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIH0gZWxzZSBpZiAoZnJhbWVUeXBlID09PSAndmVjdG9yJyB8fCBmcmFtZVR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICBpZiAoZnJhbWVSYXRlID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBcImZyYW1lUmF0ZVwiIGZvciBcInZlY3RvclwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gZnJhbWVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSAxO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLl9nZXRUaW1lKCk7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YS5sZW5ndGggPyBmcmFtZS5kYXRhIDogW2ZyYW1lLmRhdGFdO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIHN5c3RlbSB0aW1lXG4gICAgbGV0IHRpbWUgPSBOdW1iZXIuaXNGaW5pdGUoZnJhbWUudGltZSkgPyBmcmFtZS50aW1lIDogY3VycmVudFRpbWU7XG5cbiAgICBpZiAodGhpcy5fc3RhcnRUaW1lID09PSBudWxsKVxuICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGltZTtcblxuICAgIGlmICh0aGlzLl9hYnNvbHV0ZVRpbWUgPT09IGZhbHNlKVxuICAgICAgdGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBpbkRhdGFbaV07XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcbiAgICAvLyBzdG9yZSBjdXJyZW50IHRpbWUgdG8gY29tcHV0ZSBgZW5kVGltZWAgb24gc3RvcFxuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbHRlcm5hdGl2ZSBpbnRlcmZhY2UgdG8gcHJvcGFnYXRlIGEgZnJhbWUgaW4gdGhlIGdyYXBoLiBQYWNrIGB0aW1lYCxcbiAgICogYGRhdGFgIGFuZCBgbWV0YWRhdGFgIGluIGEgZnJhbWUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIEZyYW1lIHRpbWUuXG4gICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fEFycmF5fSBkYXRhIC0gRnJhbWUgZGF0YS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gT3B0aW9ubmFsIGZyYW1lIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBldmVudEluLnByb2Nlc3MoMSwgWzAsIDEsIDJdKTtcbiAgICogLy8gaXMgZXF1aXZhbGVudCB0b1xuICAgKiBldmVudEluLnByb2Nlc3NGcmFtZSh7IHRpbWU6IDEsIGRhdGE6IFswLCAxLCAyXSB9KTtcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZGF0YSwgbWV0YWRhdGEgPSBudWxsKSB7XG4gICAgdGhpcy5wcm9jZXNzRnJhbWUoeyB0aW1lLCBkYXRhLCBtZXRhZGF0YSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYSBmcmFtZSBvYmplY3QgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWUgLSBJbnB1dCBmcmFtZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lLnRpbWUgLSBGcmFtZSB0aW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZnJhbWUuZGF0YSAtIEZyYW1lIGRhdGEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZnJhbWUubWV0YWRhdGE9dW5kZWZpbmVkXSAtIE9wdGlvbm5hbCBmcmFtZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoeyB0aW1lOiAxLCBkYXRhOiBbMCwgMSwgMl0gfSk7XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBpZiAoIXRoaXMucmVhZHkpIHJldHVybjtcblxuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudEluO1xuIl19