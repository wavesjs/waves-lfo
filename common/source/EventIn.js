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
    // @todo - replace with `performance.now`
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
 *     time: window.performace.now() / 1000,
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

      if (this.initialized === false) {
        if (this.initPromise === null) // init has not yet been called
          this.initPromise = this.init();

        this.initPromise.then(function () {
          return _this2.start(startTime);
        });
        return;
      }

      this._startTime = startTime;
      this._systemTime = null; // value set in the first `process` call

      this.started = true;
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
      if (this.started && this._startTime !== null) {
        var currentTime = this._getTime();
        var endTime = this.frame.time + (currentTime - this._systemTime);

        this.finalizeStream(endTime);
        this.started = false;
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
      if (!this.started) return;

      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }]);
  return EventIn;
}((0, _SourceMixin3.default)(_BaseLfo2.default));

exports.default = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50SW4uanMiXSwibmFtZXMiOlsiaXNOb2RlIiwiRnVuY3Rpb24iLCJnZXRUaW1lRnVuY3Rpb24iLCJhdWRpb0NvbnRleHQiLCJ0IiwicHJvY2VzcyIsImhydGltZSIsIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImN1cnJlbnRUaW1lIiwiZGVmaW5pdGlvbnMiLCJhYnNvbHV0ZVRpbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJmcmFtZVR5cGUiLCJsaXN0IiwiZnJhbWVTaXplIiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJtZXRhcyIsImtpbmQiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJFdmVudEluIiwib3B0aW9ucyIsInBhcmFtcyIsImdldCIsIl9nZXRUaW1lIiwiX3N0YXJ0VGltZSIsIl9zeXN0ZW1UaW1lIiwiX2Fic29sdXRlVGltZSIsInN0YXJ0VGltZSIsImluaXRpYWxpemVkIiwiaW5pdFByb21pc2UiLCJpbml0IiwidGhlbiIsInN0YXJ0Iiwic3RhcnRlZCIsImVuZFRpbWUiLCJmcmFtZSIsInRpbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInN0cmVhbVBhcmFtcyIsIkVycm9yIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiaW5EYXRhIiwiZGF0YSIsImxlbmd0aCIsIm91dERhdGEiLCJpIiwibCIsIm1ldGFkYXRhIiwicHJvY2Vzc0ZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsU0FBUyxJQUFJQyxRQUFKLENBQWEsMkRBQWIsQ0FBZjs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsU0FB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QUF3REQsR0FBeEQ7QUFDRUQsZ0JBQVFDLENBQVIsSUFBYUosT0FBT0ksQ0FBUCxDQUFiO0FBREYsT0FHQSxLQUFLWixLQUFMLENBQVdDLElBQVgsR0FBa0JBLElBQWxCO0FBQ0EsV0FBS0QsS0FBTCxDQUFXYyxRQUFYLEdBQXNCZCxNQUFNYyxRQUE1QjtBQUNBO0FBQ0EsV0FBS3hCLFdBQUwsR0FBbUJ4QixXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OzRCQWFRbUMsSSxFQUFNUSxJLEVBQXVCO0FBQUEsVUFBakJLLFFBQWlCLHVFQUFOLElBQU07O0FBQ25DLFdBQUtDLFlBQUwsQ0FBa0IsRUFBRWQsVUFBRixFQUFRUSxVQUFSLEVBQWNLLGtCQUFkLEVBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O2lDQVdhZCxLLEVBQU87QUFDbEIsVUFBSSxDQUFDLEtBQUtGLE9BQVYsRUFBbUI7O0FBRW5CLFdBQUtrQixZQUFMO0FBQ0EsV0FBS0MsZUFBTCxDQUFxQmpCLEtBQXJCO0FBQ0EsV0FBS2tCLGNBQUw7QUFDRDs7O0VBN0ltQiw2Qzs7a0JBZ0pQbEMsTyIsImZpbGUiOiJFdmVudEluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBTb3VyY2VNaXhpbiBmcm9tICcuLi8uLi9jb3JlL1NvdXJjZU1peGluJztcblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzU3NTc5MC9lbnZpcm9ubWVudC1kZXRlY3Rpb24tbm9kZS1qcy1vci1icm93c2VyXG5jb25zdCBpc05vZGUgPSBuZXcgRnVuY3Rpb24oJ3RyeSB7IHJldHVybiB0aGlzID09PSBnbG9iYWw7IH0gY2F0Y2goZSkgeyByZXR1cm4gZmFsc2UgfScpO1xuXG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aW1lIGluIHNlY29uZHMgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50XG4gKiBlbnZpcm9ubmVtZW50IChub2RlIG9yIGJyb3dzZXIpLlxuICogSWYgcnVubmluZyBpbiBub2RlIHRoZSB0aW1lIHJlbHkgb24gYHByb2Nlc3MuaHJ0aW1lYCwgd2hpbGUgaWYgaW4gdGhlIGJyb3dzZXJcbiAqIGl0IGlzIHByb3ZpZGVkIGJ5IHRoZSBgY3VycmVudFRpbWVgIG9mIGFuIGBBdWRpb0NvbnRleHRgLCB0aGlzIGNvbnRleHQgY2FuXG4gKiBvcHRpb25uYWx5IGJlIHByb3ZpZGVkIHRvIGtlZXAgdGltZSBjb25zaXN0ZW5jeSBiZXR3ZWVuIHNldmVyYWwgYEV2ZW50SW5gXG4gKiBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gW2F1ZGlvQ29udGV4dD1udWxsXSAtIE9wdGlvbm5hbCBhdWRpbyBjb250ZXh0LlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXRUaW1lRnVuY3Rpb24oYXVkaW9Db250ZXh0ID0gbnVsbCkge1xuICBpZiAoaXNOb2RlKCkpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgdCA9IHByb2Nlc3MuaHJ0aW1lKCk7XG4gICAgICByZXR1cm4gdFswXSArIHRbMV0gKiAxZS05O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBAdG9kbyAtIHJlcGxhY2Ugd2l0aCBgcGVyZm9ybWFuY2Uubm93YFxuICAgIGlmIChhdWRpb0NvbnRleHQgPT09IG51bGwgfHzCoCghYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSkge1xuICAgICAgY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG59XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGFic29sdXRlVGltZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXVkaW9Db250ZXh0OiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVUeXBlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnc2lnbmFsJywgJ3ZlY3RvcicsICdzY2FsYXInXSxcbiAgICBkZWZhdWx0OiAnc2lnbmFsJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWluOiAxLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBub3QgcmVjb21tZW5kZWQuLi5cbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBzYW1wbGVSYXRlOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSwgLy8gc2FtZSBoZXJlXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgZnJhbWVSYXRlOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSwgLy8gc2FtZSBoZXJlXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgZGVzY3JpcHRpb246IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBgRXZlbnRJbmAgb3BlcmF0b3IgYWxsb3dzIHRvIG1hbnVhbGx5IGNyZWF0ZSBhIHN0cmVhbSBvZiBkYXRhIG9yIHRvIGZlZWRcbiAqIGEgc3RyZWFtIGZyb20gYW5vdGhlciBzb3VyY2UgKGUuZy4gc2Vuc29ycykgaW50byBhIHByb2Nlc3NpbmcgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXJzJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mcmFtZVR5cGU9J3NpZ25hbCddIC0gVHlwZSBvZiB0aGUgaW5wdXQgLSBhbGxvd2VkXG4gKiB2YWx1ZXM6IGBzaWduYWxgLCAgYHZlY3RvcmAgb3IgYHNjYWxhcmAuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTFdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGZyYW1lLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNhbXBsZVJhdGU9bnVsbF0gLSBTYW1wbGUgcmF0ZSBvZiB0aGUgc291cmNlIHN0cmVhbSxcbiAqICBpZiBvZiB0eXBlIGBzaWduYWxgLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lUmF0ZT1udWxsXSAtIFJhdGUgb2YgdGhlIHNvdXJjZSBzdHJlYW0sIGlmIG9mXG4gKiAgdHlwZSBgdmVjdG9yYC5cbiAqIEBwYXJhbSB7QXJyYXl8U3RyaW5nfSBbb3B0aW9ucy5kZXNjcmlwdGlvbl0gLSBPcHRpb25uYWwgZGVzY3JpcHRpb25cbiAqICBkZXNjcmliaW5nIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBvdXRwdXQgZnJhbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYWJzb2x1dGVUaW1lPWZhbHNlXSAtIERlZmluZSBpZiB0aW1lIHNob3VsZCBiZSB1c2VkXG4gKiAgYXMgZm9yd2FyZGVkIGFzIGdpdmVuIGluIHRoZSBwcm9jZXNzIG1ldGhvZCwgb3IgcmVsYXRpdmVseSB0byB0aGUgdGltZSBvZlxuICogIHRoZSBmaXJzdCBgcHJvY2Vzc2AgY2FsbCBhZnRlciBzdGFydC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zb3VyY2VcbiAqXG4gKiBAdG9kbyAtIEFkZCBhIGBsb2dpY2FsVGltZWAgcGFyYW1ldGVyIHRvIHRhZyBmcmFtZSBhY2NvcmRpbmcgdG8gZnJhbWUgcmF0ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqICAgZnJhbWVTaXplOiAzLFxuICogICBmcmFtZVJhdGU6IDEgLyA1MCxcbiAqICAgZGVzY3JpcHRpb246IFsnYWxwaGEnLCAnYmV0YScsICdnYW1tYSddLFxuICogfSk7XG4gKlxuICogLy8gY29ubmVjdCBzb3VyY2UgdG8gb3BlcmF0b3JzIGFuZCBzaW5rKHMpXG4gKlxuICogLy8gaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGdyYXBoXG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogLy8gZmVlZCBgZGV2aWNlb3JpZW50YXRpb25gIGRhdGEgaW50byB0aGUgZ3JhcGhcbiAqIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIChlKSA9PiB7XG4gKiAgIGNvbnN0IGZyYW1lID0ge1xuICogICAgIHRpbWU6IHdpbmRvdy5wZXJmb3JtYWNlLm5vdygpIC8gMTAwMCxcbiAqICAgICBkYXRhOiBbZS5hbHBoYSwgZS5iZXRhLCBlLmdhbW1hXSxcbiAqICAgfTtcbiAqXG4gKiAgIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKGZyYW1lKTtcbiAqIH0sIGZhbHNlKTtcbiAqL1xuY2xhc3MgRXZlbnRJbiBleHRlbmRzIFNvdXJjZU1peGluKEJhc2VMZm8pIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICB0aGlzLl9nZXRUaW1lID0gZ2V0VGltZUZ1bmN0aW9uKGF1ZGlvQ29udGV4dCk7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDtcbiAgICB0aGlzLl9hYnNvbHV0ZVRpbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2Fic29sdXRlVGltZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBhbGxvdyB0byBwdXNoIGZyYW1lcyBpbnRvXG4gICAqIHRoZSBncmFwaC4gQW55IGNhbGwgdG8gYHByb2Nlc3NgIG9yIGBwcm9jZXNzRnJhbWVgIGJlZm9yZSBgc3RhcnRgIHdpbGwgYmVcbiAgICogaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RvcH1cbiAgICovXG4gIHN0YXJ0KHN0YXJ0VGltZSA9IG51bGwpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0aGlzLmluaXRQcm9taXNlID09PSBudWxsKSAvLyBpbml0IGhhcyBub3QgeWV0IGJlZW4gY2FsbGVkXG4gICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLmluaXQoKTtcblxuICAgICAgdGhpcy5pbml0UHJvbWlzZS50aGVuKCgpID0+IHRoaXMuc3RhcnQoc3RhcnRUaW1lKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBudWxsOyAvLyB2YWx1ZSBzZXQgaW4gdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsXG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmFsaXplIHRoZSBzdHJlYW0gYW5kIHN0b3AgdGhlIHdob2xlIGdyYXBoLiBBbnkgY2FsbCB0byBgcHJvY2Vzc2Agb3JcbiAgICogYHByb2Nlc3NGcmFtZWAgYWZ0ZXIgYHN0b3BgIHdpbGwgYmUgaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZmluYWxpemVTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RhcnR9XG4gICAqL1xuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQgJiYgdGhpcy5fc3RhcnRUaW1lICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMuX2dldFRpbWUoKTtcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSB0aGlzLmZyYW1lLnRpbWUgKyAoY3VycmVudFRpbWUgLSB0aGlzLl9zeXN0ZW1UaW1lKTtcblxuICAgICAgdGhpcy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKCkge1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVTaXplJyk7XG4gICAgY29uc3QgZnJhbWVUeXBlID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVR5cGUnKTtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuZ2V0KCdzYW1wbGVSYXRlJyk7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVJhdGUnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMucGFyYW1zLmdldCgnZGVzY3JpcHRpb24nKTtcbiAgICAvLyBpbml0IG9wZXJhdG9yJ3Mgc3RyZWFtIHBhcmFtc1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgPyAxIDogZnJhbWVTaXplO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9IGZyYW1lVHlwZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKGZyYW1lVHlwZSA9PT0gJ3NpZ25hbCcpIHtcbiAgICAgIGlmIChzYW1wbGVSYXRlID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBcInNhbXBsZVJhdGVcIiBmb3IgXCJzaWduYWxcIiBzdHJlYW0nKTtcblxuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBzYW1wbGVSYXRlIC8gZnJhbWVTaXplO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSBmcmFtZVNpemU7XG5cbiAgICB9IGVsc2UgaWYgKGZyYW1lVHlwZSA9PT0gJ3ZlY3RvcicgfHwgZnJhbWVUeXBlID09PSAnc2NhbGFyJykge1xuICAgICAgaWYgKGZyYW1lUmF0ZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgXCJmcmFtZVJhdGVcIiBmb3IgXCJ2ZWN0b3JcIiBzdHJlYW0nKTtcblxuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSA9IGZyYW1lUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gMTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGdW5jdGlvbihmcmFtZSkge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5fZ2V0VGltZSgpO1xuICAgIGNvbnN0IGluRGF0YSA9IGZyYW1lLmRhdGEubGVuZ3RoID8gZnJhbWUuZGF0YSA6IFtmcmFtZS5kYXRhXTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIC8vIGlmIG5vIHRpbWUgcHJvdmlkZWQsIHVzZSBzeXN0ZW0gdGltZVxuICAgIGxldCB0aW1lID0gTnVtYmVyLmlzRmluaXRlKGZyYW1lLnRpbWUpID8gZnJhbWUudGltZSA6IGN1cnJlbnRUaW1lO1xuXG4gICAgaWYgKHRoaXMuX3N0YXJ0VGltZSA9PT0gbnVsbClcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRpbWU7XG5cbiAgICBpZiAodGhpcy5fYWJzb2x1dGVUaW1lID09PSBmYWxzZSlcbiAgICAgIHRpbWUgPSB0aW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7IGkgPCBsOyBpKyspXG4gICAgICBvdXREYXRhW2ldID0gaW5EYXRhW2ldO1xuXG4gICAgdGhpcy5mcmFtZS50aW1lID0gdGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG4gICAgLy8gc3RvcmUgY3VycmVudCB0aW1lIHRvIGNvbXB1dGUgYGVuZFRpbWVgIG9uIHN0b3BcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQWx0ZXJuYXRpdmUgaW50ZXJmYWNlIHRvIHByb3BhZ2F0ZSBhIGZyYW1lIGluIHRoZSBncmFwaC4gUGFjayBgdGltZWAsXG4gICAqIGBkYXRhYCBhbmQgYG1ldGFkYXRhYCBpbiBhIGZyYW1lIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBGcmFtZSB0aW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZGF0YSAtIEZyYW1lIGRhdGEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSAtIE9wdGlvbm5hbCBmcmFtZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZXZlbnRJbi5wcm9jZXNzKDEsIFswLCAxLCAyXSk7XG4gICAqIC8vIGlzIGVxdWl2YWxlbnQgdG9cbiAgICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoeyB0aW1lOiAxLCBkYXRhOiBbMCwgMSwgMl0gfSk7XG4gICAqL1xuICBwcm9jZXNzKHRpbWUsIGRhdGEsIG1ldGFkYXRhID0gbnVsbCkge1xuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKHsgdGltZSwgZGF0YSwgbWV0YWRhdGEgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIGEgZnJhbWUgb2JqZWN0IGluIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyYW1lIC0gSW5wdXQgZnJhbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmcmFtZS50aW1lIC0gRnJhbWUgdGltZS5cbiAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl8QXJyYXl9IGZyYW1lLmRhdGEgLSBGcmFtZSBkYXRhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2ZyYW1lLm1ldGFkYXRhPXVuZGVmaW5lZF0gLSBPcHRpb25uYWwgZnJhbWUgbWV0YWRhdGEuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKHsgdGltZTogMSwgZGF0YTogWzAsIDEsIDJdIH0pO1xuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHJldHVybjtcblxuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudEluO1xuIl19