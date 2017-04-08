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

      if (!this.initialized) {
        this.initialized = this.init();
        this.initialized.then(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50SW4uanMiXSwibmFtZXMiOlsiaXNOb2RlIiwiRnVuY3Rpb24iLCJnZXRUaW1lRnVuY3Rpb24iLCJhdWRpb0NvbnRleHQiLCJ0IiwicHJvY2VzcyIsImhydGltZSIsIkF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImN1cnJlbnRUaW1lIiwiZGVmaW5pdGlvbnMiLCJhYnNvbHV0ZVRpbWUiLCJ0eXBlIiwiZGVmYXVsdCIsImNvbnN0YW50IiwibnVsbGFibGUiLCJmcmFtZVR5cGUiLCJsaXN0IiwiZnJhbWVTaXplIiwibWluIiwibWF4IiwiSW5maW5pdHkiLCJtZXRhcyIsImtpbmQiLCJzYW1wbGVSYXRlIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJFdmVudEluIiwib3B0aW9ucyIsInBhcmFtcyIsImdldCIsIl9nZXRUaW1lIiwicmVhZHkiLCJfc3RhcnRUaW1lIiwiX3N5c3RlbVRpbWUiLCJfYWJzb2x1dGVUaW1lIiwic3RhcnRUaW1lIiwiaW5pdGlhbGl6ZWQiLCJpbml0IiwidGhlbiIsInN0YXJ0IiwiZW5kVGltZSIsImZyYW1lIiwidGltZSIsImZpbmFsaXplU3RyZWFtIiwic3RyZWFtUGFyYW1zIiwiRXJyb3IiLCJzb3VyY2VTYW1wbGVSYXRlIiwic291cmNlU2FtcGxlQ291bnQiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJpbkRhdGEiLCJkYXRhIiwibGVuZ3RoIiwib3V0RGF0YSIsImkiLCJsIiwibWV0YWRhdGEiLCJwcm9jZXNzRnJhbWUiLCJwcmVwYXJlRnJhbWUiLCJwcm9jZXNzRnVuY3Rpb24iLCJwcm9wYWdhdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQSxJQUFNQSxTQUFTLElBQUlDLFFBQUosQ0FBYSwyREFBYixDQUFmOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTQyxlQUFULEdBQThDO0FB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LENBQWI7QUFERixPQUdBLEtBQUtaLEtBQUwsQ0FBV0MsSUFBWCxHQUFrQkEsSUFBbEI7QUFDQSxXQUFLRCxLQUFMLENBQVdjLFFBQVgsR0FBc0JkLE1BQU1jLFFBQTVCO0FBQ0E7QUFDQSxXQUFLdEIsV0FBTCxHQUFtQnpCLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBYVFrQyxJLEVBQU1RLEksRUFBdUI7QUFBQSxVQUFqQkssUUFBaUIsdUVBQU4sSUFBTTs7QUFDbkMsV0FBS0MsWUFBTCxDQUFrQixFQUFFZCxVQUFGLEVBQVFRLFVBQVIsRUFBY0ssa0JBQWQsRUFBbEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7aUNBV2FkLEssRUFBTztBQUNsQixVQUFJLENBQUMsS0FBS1YsS0FBVixFQUFpQjs7QUFFakIsV0FBSzBCLFlBQUw7QUFDQSxXQUFLQyxlQUFMLENBQXFCakIsS0FBckI7QUFDQSxXQUFLa0IsY0FBTDtBQUNEOzs7RUE1SW1CLDZDOztrQkErSVBqQyxPIiwiZmlsZSI6IkV2ZW50SW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi8uLi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IFNvdXJjZU1peGluIGZyb20gJy4uLy4uL2NvcmUvU291cmNlTWl4aW4nO1xuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NTc1NzkwL2Vudmlyb25tZW50LWRldGVjdGlvbi1ub2RlLWpzLW9yLWJyb3dzZXJcbmNvbnN0IGlzTm9kZSA9IG5ldyBGdW5jdGlvbigndHJ5IHsgcmV0dXJuIHRoaXMgPT09IGdsb2JhbDsgfSBjYXRjaChlKSB7IHJldHVybiBmYWxzZSB9Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRpbWUgaW4gc2Vjb25kcyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnRcbiAqIGVudmlyb25uZW1lbnQgKG5vZGUgb3IgYnJvd3NlcikuXG4gKiBJZiBydW5uaW5nIGluIG5vZGUgdGhlIHRpbWUgcmVseSBvbiBgcHJvY2Vzcy5ocnRpbWVgLCB3aGlsZSBpZiBpbiB0aGUgYnJvd3NlclxuICogaXQgaXMgcHJvdmlkZWQgYnkgdGhlIGBjdXJyZW50VGltZWAgb2YgYW4gYEF1ZGlvQ29udGV4dGAsIHRoaXMgY29udGV4dCBjYW5cbiAqIG9wdGlvbm5hbHkgYmUgcHJvdmlkZWQgdG8ga2VlcCB0aW1lIGNvbnNpc3RlbmN5IGJldHdlZW4gc2V2ZXJhbCBgRXZlbnRJbmBcbiAqIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBbYXVkaW9Db250ZXh0PW51bGxdIC0gT3B0aW9ubmFsIGF1ZGlvIGNvbnRleHQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFRpbWVGdW5jdGlvbihhdWRpb0NvbnRleHQgPSBudWxsKSB7XG4gIGlmIChpc05vZGUoKSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcbiAgICAgIHJldHVybiB0WzBdICsgdFsxXSAqIDFlLTk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhdWRpb0NvbnRleHQgPT09IG51bGwgfHzCoCghYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSkge1xuICAgICAgY29uc3QgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fMKgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG59XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGFic29sdXRlVGltZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgYXVkaW9Db250ZXh0OiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVUeXBlOiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGxpc3Q6IFsnc2lnbmFsJywgJ3ZlY3RvcicsICdzY2FsYXInXSxcbiAgICBkZWZhdWx0OiAnc2lnbmFsJyxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgZnJhbWVTaXplOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWluOiAxLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBub3QgcmVjb21tZW5kZWQuLi5cbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBzYW1wbGVSYXRlOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSwgLy8gc2FtZSBoZXJlXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgZnJhbWVSYXRlOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSwgLy8gc2FtZSBoZXJlXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSxcbiAgZGVzY3JpcHRpb246IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBgRXZlbnRJbmAgb3BlcmF0b3IgYWxsb3dzIHRvIG1hbnVhbGx5IGNyZWF0ZSBhIHN0cmVhbSBvZiBkYXRhIG9yIHRvIGZlZWRcbiAqIGEgc3RyZWFtIGZyb20gYW5vdGhlciBzb3VyY2UgKGUuZy4gc2Vuc29ycykgaW50byBhIHByb2Nlc3NpbmcgZ3JhcGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBwYXJhbWV0ZXJzJyBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mcmFtZVR5cGU9J3NpZ25hbCddIC0gVHlwZSBvZiB0aGUgaW5wdXQgLSBhbGxvd2VkXG4gKiB2YWx1ZXM6IGBzaWduYWxgLCAgYHZlY3RvcmAgb3IgYHNjYWxhcmAuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVTaXplPTFdIC0gU2l6ZSBvZiB0aGUgb3V0cHV0IGZyYW1lLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNhbXBsZVJhdGU9bnVsbF0gLSBTYW1wbGUgcmF0ZSBvZiB0aGUgc291cmNlIHN0cmVhbSxcbiAqICBpZiBvZiB0eXBlIGBzaWduYWxgLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZyYW1lUmF0ZT1udWxsXSAtIFJhdGUgb2YgdGhlIHNvdXJjZSBzdHJlYW0sIGlmIG9mXG4gKiAgdHlwZSBgdmVjdG9yYC5cbiAqIEBwYXJhbSB7QXJyYXl8U3RyaW5nfSBbb3B0aW9ucy5kZXNjcmlwdGlvbl0gLSBPcHRpb25uYWwgZGVzY3JpcHRpb25cbiAqICBkZXNjcmliaW5nIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBvdXRwdXQgZnJhbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYWJzb2x1dGVUaW1lPWZhbHNlXSAtIERlZmluZSBpZiB0aW1lIHNob3VsZCBiZSB1c2VkXG4gKiAgYXMgZm9yd2FyZGVkIGFzIGdpdmVuIGluIHRoZSBwcm9jZXNzIG1ldGhvZCwgb3IgcmVsYXRpdmVseSB0byB0aGUgdGltZSBvZlxuICogIHRoZSBmaXJzdCBgcHJvY2Vzc2AgY2FsbCBhZnRlciBzdGFydC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5zb3VyY2VcbiAqXG4gKiBAdG9kbyAtIEFkZCBhIGBsb2dpY2FsVGltZWAgcGFyYW1ldGVyIHRvIHRhZyBmcmFtZSBhY2NvcmRpbmcgdG8gZnJhbWUgcmF0ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIGNvbnN0IGV2ZW50SW4gPSBuZXcgbGZvLnNvdXJjZS5FdmVudEluKHtcbiAqICAgZnJhbWVUeXBlOiAndmVjdG9yJyxcbiAqICAgZnJhbWVTaXplOiAzLFxuICogICBmcmFtZVJhdGU6IDEgLyA1MCxcbiAqICAgZGVzY3JpcHRpb246IFsnYWxwaGEnLCAnYmV0YScsICdnYW1tYSddLFxuICogfSk7XG4gKlxuICogLy8gY29ubmVjdCBzb3VyY2UgdG8gb3BlcmF0b3JzIGFuZCBzaW5rKHMpXG4gKlxuICogLy8gaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGdyYXBoXG4gKiBldmVudEluLnN0YXJ0KCk7XG4gKlxuICogLy8gZmVlZCBgZGV2aWNlb3JpZW50YXRpb25gIGRhdGEgaW50byB0aGUgZ3JhcGhcbiAqIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VvcmllbnRhdGlvbicsIChlKSA9PiB7XG4gKiAgIGNvbnN0IGZyYW1lID0ge1xuICogICAgIHRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICogICAgIGRhdGE6IFtlLmFscGhhLCBlLmJldGEsIGUuZ2FtbWFdLFxuICogICB9O1xuICpcbiAqICAgZXZlbnRJbi5wcm9jZXNzRnJhbWUoZnJhbWUpO1xuICogfSwgZmFsc2UpO1xuICovXG5jbGFzcyBFdmVudEluIGV4dGVuZHMgU291cmNlTWl4aW4oQmFzZUxmbykge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBhdWRpb0NvbnRleHQgPSB0aGlzLnBhcmFtcy5nZXQoJ2F1ZGlvQ29udGV4dCcpO1xuICAgIHRoaXMuX2dldFRpbWUgPSBnZXRUaW1lRnVuY3Rpb24oYXVkaW9Db250ZXh0KTtcbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDtcbiAgICB0aGlzLl9hYnNvbHV0ZVRpbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2Fic29sdXRlVGltZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBhbGxvdyB0byBwdXNoIGZyYW1lcyBpbnRvXG4gICAqIHRoZSBncmFwaC4gQW55IGNhbGwgdG8gYHByb2Nlc3NgIG9yIGBwcm9jZXNzRnJhbWVgIGJlZm9yZSBgc3RhcnRgIHdpbGwgYmVcbiAgICogaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RvcH1cbiAgICovXG4gIHN0YXJ0KHN0YXJ0VGltZSA9IG51bGwpIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0aGlzLmluaXQoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQudGhlbigoKSA9PiB0aGlzLnN0YXJ0KHN0YXJ0VGltZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDsgLy8gdmFsdWUgc2V0IGluIHRoZSBmaXJzdCBgcHJvY2Vzc2AgY2FsbFxuXG4gICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIEFueSBjYWxsIHRvIGBwcm9jZXNzYCBvclxuICAgKiBgcHJvY2Vzc0ZyYW1lYCBhZnRlciBgc3RvcGAgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5zb3VyY2UuRXZlbnRJbiNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMucmVhZHkgJiYgdGhpcy5fc3RhcnRUaW1lICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMuX2dldFRpbWUoKTtcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSB0aGlzLmZyYW1lLnRpbWUgKyAoY3VycmVudFRpbWUgLSB0aGlzLl9zeXN0ZW1UaW1lKTtcblxuICAgICAgdGhpcy5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcbiAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcygpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lU2l6ZScpO1xuICAgIGNvbnN0IGZyYW1lVHlwZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVUeXBlJyk7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLmdldCgnc2FtcGxlUmF0ZScpO1xuICAgIGNvbnN0IGZyYW1lUmF0ZSA9IHRoaXMucGFyYW1zLmdldCgnZnJhbWVSYXRlJyk7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0aGlzLnBhcmFtcy5nZXQoJ2Rlc2NyaXB0aW9uJyk7XG4gICAgLy8gaW5pdCBvcGVyYXRvcidzIHN0cmVhbSBwYXJhbXNcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSBmcmFtZVR5cGUgPT09ICdzY2FsYXInID8gMSA6IGZyYW1lU2l6ZTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGUgPSBmcmFtZVR5cGU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcblxuICAgIGlmIChmcmFtZVR5cGUgPT09ICdzaWduYWwnKSB7XG4gICAgICBpZiAoc2FtcGxlUmF0ZSA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgXCJzYW1wbGVSYXRlXCIgZm9yIFwic2lnbmFsXCIgc3RyZWFtJyk7XG5cbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBzYW1wbGVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gc2FtcGxlUmF0ZSAvIGZyYW1lU2l6ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZUNvdW50ID0gZnJhbWVTaXplO1xuXG4gICAgfSBlbHNlIGlmIChmcmFtZVR5cGUgPT09ICd2ZWN0b3InIHx8IGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicpIHtcbiAgICAgIGlmIChmcmFtZVJhdGUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIFwiZnJhbWVSYXRlXCIgZm9yIFwidmVjdG9yXCIgc3RyZWFtJyk7XG5cbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IGZyYW1lUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLnNvdXJjZVNhbXBsZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMuX2dldFRpbWUoKTtcbiAgICBjb25zdCBpbkRhdGEgPSBmcmFtZS5kYXRhLmxlbmd0aCA/IGZyYW1lLmRhdGEgOiBbZnJhbWUuZGF0YV07XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAvLyBpZiBubyB0aW1lIHByb3ZpZGVkLCB1c2Ugc3lzdGVtIHRpbWVcbiAgICBsZXQgdGltZSA9IE51bWJlci5pc0Zpbml0ZShmcmFtZS50aW1lKSA/IGZyYW1lLnRpbWUgOiBjdXJyZW50VGltZTtcblxuICAgIGlmICh0aGlzLl9zdGFydFRpbWUgPT09IG51bGwpXG4gICAgICB0aGlzLl9zdGFydFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKHRoaXMuX2Fic29sdXRlVGltZSA9PT0gZmFsc2UpXG4gICAgICB0aW1lID0gdGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKVxuICAgICAgb3V0RGF0YVtpXSA9IGluRGF0YVtpXTtcblxuICAgIHRoaXMuZnJhbWUudGltZSA9IHRpbWU7XG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuICAgIC8vIHN0b3JlIGN1cnJlbnQgdGltZSB0byBjb21wdXRlIGBlbmRUaW1lYCBvbiBzdG9wXG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IGN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsdGVybmF0aXZlIGludGVyZmFjZSB0byBwcm9wYWdhdGUgYSBmcmFtZSBpbiB0aGUgZ3JhcGguIFBhY2sgYHRpbWVgLFxuICAgKiBgZGF0YWAgYW5kIGBtZXRhZGF0YWAgaW4gYSBmcmFtZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gRnJhbWUgdGltZS5cbiAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl8QXJyYXl9IGRhdGEgLSBGcmFtZSBkYXRhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YWRhdGEgLSBPcHRpb25uYWwgZnJhbWUgbWV0YWRhdGEuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGV2ZW50SW4ucHJvY2VzcygxLCBbMCwgMSwgMl0pO1xuICAgKiAvLyBpcyBlcXVpdmFsZW50IHRvXG4gICAqIGV2ZW50SW4ucHJvY2Vzc0ZyYW1lKHsgdGltZTogMSwgZGF0YTogWzAsIDEsIDJdIH0pO1xuICAgKi9cbiAgcHJvY2Vzcyh0aW1lLCBkYXRhLCBtZXRhZGF0YSA9IG51bGwpIHtcbiAgICB0aGlzLnByb2Nlc3NGcmFtZSh7IHRpbWUsIGRhdGEsIG1ldGFkYXRhIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSBhIGZyYW1lIG9iamVjdCBpbiB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIElucHV0IGZyYW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZnJhbWUudGltZSAtIEZyYW1lIHRpbWUuXG4gICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fEFycmF5fSBmcmFtZS5kYXRhIC0gRnJhbWUgZGF0YS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtmcmFtZS5tZXRhZGF0YT11bmRlZmluZWRdIC0gT3B0aW9ubmFsIGZyYW1lIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBldmVudEluLnByb2Nlc3NGcmFtZSh7IHRpbWU6IDEsIGRhdGE6IFswLCAxLCAyXSB9KTtcbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIGlmICghdGhpcy5yZWFkeSkgcmV0dXJuO1xuXG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SW47XG4iXX0=