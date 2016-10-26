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

var _BaseLfo2 = require('../../common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  if (typeof window === 'undefined') {
    return function () {
      var t = process.hrtime();
      return t[0] + t[1] * 1e-9;
    };
  } else {
    if (audioContext === null || !audioContext instanceof AudioContext) audioContext = new AudioContext();

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

var EventIn = function (_BaseLfo) {
  (0, _inherits3.default)(EventIn, _BaseLfo);

  function EventIn() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, EventIn);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EventIn.__proto__ || (0, _getPrototypeOf2.default)(EventIn)).call(this, definitions, options));

    var audioContext = _this.params.get('audioContext');
    _this._getTime = getTimeFunction(audioContext);
    _this._isStarted = false;
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
      var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.initStream();

      this._startTime = startTime;
      this._isStarted = true;
      // values set in the first `process` call
      this._systemTime = null;
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
      if (this._isStarted && this._startTime !== null) {
        var currentTime = this._getTime();
        var endTime = this.frame.time + (currentTime - this._systemTime);

        this.finalizeStream(endTime);
        this._isStarted = false;
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
      if (!this._isStarted) return;

      this.prepareFrame();
      this.processFunction(frame);
      this.propagateFrame();
    }
  }]);
  return EventIn;
}(_BaseLfo3.default);

exports.default = EventIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50SW4uanMiXSwibmFtZXMiOlsiZ2V0VGltZUZ1bmN0aW9uIiwiYXVkaW9Db250ZXh0Iiwid2luZG93IiwidCIsInByb2Nlc3MiLCJocnRpbWUiLCJBdWRpb0NvbnRleHQiLCJjdXJyZW50VGltZSIsImRlZmluaXRpb25zIiwiYWJzb2x1dGVUaW1lIiwidHlwZSIsImRlZmF1bHQiLCJjb25zdGFudCIsIm51bGxhYmxlIiwiZnJhbWVUeXBlIiwibGlzdCIsImZyYW1lU2l6ZSIsIm1pbiIsIm1heCIsIkluZmluaXR5IiwibWV0YXMiLCJraW5kIiwic2FtcGxlUmF0ZSIsImZyYW1lUmF0ZSIsImRlc2NyaXB0aW9uIiwiRXZlbnRJbiIsIm9wdGlvbnMiLCJwYXJhbXMiLCJnZXQiLCJfZ2V0VGltZSIsIl9pc1N0YXJ0ZWQiLCJfc3RhcnRUaW1lIiwiX3N5c3RlbVRpbWUiLCJfYWJzb2x1dGVUaW1lIiwic3RhcnRUaW1lIiwiaW5pdFN0cmVhbSIsImVuZFRpbWUiLCJmcmFtZSIsInRpbWUiLCJmaW5hbGl6ZVN0cmVhbSIsInN0cmVhbVBhcmFtcyIsIkVycm9yIiwic291cmNlU2FtcGxlUmF0ZSIsInNvdXJjZVNhbXBsZUNvdW50IiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiaW5EYXRhIiwiZGF0YSIsImxlbmd0aCIsIm91dERhdGEiLCJpIiwibCIsIm1ldGFkYXRhIiwicHJvY2Vzc0ZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIiwicHJvcGFnYXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsU0FBU0EsZUFBVCxHQUE4QztBQUFBLE1BQXJCQyxZQUFxQix1RUFBTixJQUFNOztBQUM1QyxNQUFJLE9BQU9DLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsV0FBTyxZQUFNO0FBQ1gsVUFBTUMsSUFBSUMsUUFBUUMsTUFBUixFQUFW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Q2xCLFVBQUksQ0FBQyxLQUFLUCxVQUFWLEVBQXNCOztBQUV0QixXQUFLdUIsWUFBTDtBQUNBLFdBQUtDLGVBQUwsQ0FBcUJqQixLQUFyQjtBQUNBLFdBQUtrQixjQUFMO0FBQ0Q7Ozs7O2tCQUdZOUIsTyIsImZpbGUiOiJFdmVudEluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRpbWUgaW4gc2Vjb25kcyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnRcbiAqIGVudmlyb25uZW1lbnQgKG5vZGUgb3IgYnJvd3NlcikuXG4gKiBJZiBydW5uaW5nIGluIG5vZGUgdGhlIHRpbWUgcmVseSBvbiBgcHJvY2Vzcy5ocnRpbWVgLCB3aGlsZSBpZiBpbiB0aGUgYnJvd3NlclxuICogaXQgaXMgcHJvdmlkZWQgYnkgdGhlIGBjdXJyZW50VGltZWAgb2YgYW4gYEF1ZGlvQ29udGV4dGAsIHRoaXMgY29udGV4dCBjYW5cbiAqIG9wdGlvbm5hbHkgYmUgcHJvdmlkZWQgdG8ga2VlcCB0aW1lIGNvbnNpc3RlbmN5IGJldHdlZW4gc2V2ZXJhbCBgRXZlbnRJbmBcbiAqIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7QXVkaW9Db250ZXh0fSBbYXVkaW9Db250ZXh0PW51bGxdIC0gT3B0aW9ubmFsIGF1ZGlvIGNvbnRleHQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGdldFRpbWVGdW5jdGlvbihhdWRpb0NvbnRleHQgPSBudWxsKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcbiAgICAgIHJldHVybiB0WzBdICsgdFsxXSAqIDFlLTk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhdWRpb0NvbnRleHQgPT09IG51bGwgfHzCoCghYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KSlcbiAgICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuICAgIHJldHVybiAoKSA9PiBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gIH1cbn1cblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYWJzb2x1dGVUaW1lOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBhdWRpb0NvbnRleHQ6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICB9LFxuICBmcmFtZVR5cGU6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgbGlzdDogWydzaWduYWwnLCAndmVjdG9yJywgJ3NjYWxhciddLFxuICAgIGRlZmF1bHQ6ICdzaWduYWwnLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBmcmFtZVNpemU6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtaW46IDEsXG4gICAgbWF4OiArSW5maW5pdHksIC8vIG5vdCByZWNvbW1lbmRlZC4uLlxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIHNhbXBsZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBmcmFtZVJhdGU6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbWluOiAwLFxuICAgIG1heDogK0luZmluaXR5LCAvLyBzYW1lIGhlcmVcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBkZXNjcmlwdGlvbjoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH1cbn07XG5cbi8qKlxuICogVGhlIGBFdmVudEluYCBvcGVyYXRvciBhbGxvd3MgdG8gbWFudWFsbHkgY3JlYXRlIGEgc3RyZWFtIG9mIGRhdGEgb3IgdG8gZmVlZFxuICogYSBzdHJlYW0gZnJvbSBhbm90aGVyIHNvdXJjZSAoZS5nLiBzZW5zb3JzKSBpbnRvIGEgcHJvY2Vzc2luZyBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIHBhcmFtZXRlcnMnIGRlZmF1bHQgdmFsdWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZyYW1lVHlwZT0nc2lnbmFsJ10gLSBUeXBlIG9mIHRoZSBpbnB1dCAtIGFsbG93ZWRcbiAqIHZhbHVlczogYHNpZ25hbGAsICBgdmVjdG9yYCBvciBgc2NhbGFyYC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5mcmFtZVNpemU9MV0gLSBTaXplIG9mIHRoZSBvdXRwdXQgZnJhbWUuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc2FtcGxlUmF0ZT1udWxsXSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugc3RyZWFtLFxuICogIGlmIG9mIHR5cGUgYHNpZ25hbGAuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZnJhbWVSYXRlPW51bGxdIC0gUmF0ZSBvZiB0aGUgc291cmNlIHN0cmVhbSwgaWYgb2ZcbiAqICB0eXBlIGB2ZWN0b3JgLlxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IFtvcHRpb25zLmRlc2NyaXB0aW9uXSAtIE9wdGlvbm5hbCBkZXNjcmlwdGlvblxuICogIGRlc2NyaWJpbmcgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIG91dHB1dCBmcmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hYnNvbHV0ZVRpbWU9ZmFsc2VdIC0gRGVmaW5lIGlmIHRpbWUgc2hvdWxkIGJlIHVzZWRcbiAqICBhcyBmb3J3YXJkZWQgYXMgZ2l2ZW4gaW4gdGhlIHByb2Nlc3MgbWV0aG9kLCBvciByZWxhdGl2ZWx5IHRvIHRoZSB0aW1lIG9mXG4gKiAgdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsIGFmdGVyIHN0YXJ0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLnNvdXJjZVxuICpcbiAqIEB0b2RvIC0gQWRkIGEgYGxvZ2ljYWxUaW1lYCBwYXJhbWV0ZXIgdG8gdGFnIGZyYW1lIGFjY29yZGluZyB0byBmcmFtZSByYXRlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG4gKlxuICogY29uc3QgZXZlbnRJbiA9IG5ldyBsZm8uc291cmNlLkV2ZW50SW4oe1xuICogICBmcmFtZVR5cGU6ICd2ZWN0b3InLFxuICogICBmcmFtZVNpemU6IDMsXG4gKiAgIGZyYW1lUmF0ZTogMSAvIDUwLFxuICogICBkZXNjcmlwdGlvbjogWydhbHBoYScsICdiZXRhJywgJ2dhbW1hJ10sXG4gKiB9KTtcbiAqXG4gKiAvLyBjb25uZWN0IHNvdXJjZSB0byBvcGVyYXRvcnMgYW5kIHNpbmsocylcbiAqXG4gKiAvLyBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgZ3JhcGhcbiAqIGV2ZW50SW4uc3RhcnQoKTtcbiAqXG4gKiAvLyBmZWVkIGBkZXZpY2VvcmllbnRhdGlvbmAgZGF0YSBpbnRvIHRoZSBncmFwaFxuICogd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZW9yaWVudGF0aW9uJywgKGUpID0+IHtcbiAqICAgY29uc3QgZnJhbWUgPSB7XG4gKiAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gKiAgICAgZGF0YTogW2UuYWxwaGEsIGUuYmV0YSwgZS5nYW1tYV0sXG4gKiAgIH07XG4gKlxuICogICBldmVudEluLnByb2Nlc3NGcmFtZShmcmFtZSk7XG4gKiB9LCBmYWxzZSk7XG4gKi9cbmNsYXNzIEV2ZW50SW4gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYXVkaW9Db250ZXh0ID0gdGhpcy5wYXJhbXMuZ2V0KCdhdWRpb0NvbnRleHQnKTtcbiAgICB0aGlzLl9nZXRUaW1lID0gZ2V0VGltZUZ1bmN0aW9uKGF1ZGlvQ29udGV4dCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLl9zeXN0ZW1UaW1lID0gbnVsbDtcbiAgICB0aGlzLl9hYnNvbHV0ZVRpbWUgPSB0aGlzLnBhcmFtcy5nZXQoJ2Fic29sdXRlVGltZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHN0cmVhbVBhcmFtc2AgaW4gdGhlIGdyYXBoIGFuZCBhbGxvdyB0byBwdXNoIGZyYW1lcyBpbnRvXG4gICAqIHRoZSBncmFwaC4gQW55IGNhbGwgdG8gYHByb2Nlc3NgIG9yIGBwcm9jZXNzRnJhbWVgIGJlZm9yZSBgc3RhcnRgIHdpbGwgYmVcbiAgICogaWdub3JlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcmVzZXRTdHJlYW19XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uc291cmNlLkV2ZW50SW4jc3RvcH1cbiAgICovXG4gIHN0YXJ0KHN0YXJ0VGltZSA9IG51bGwpIHtcbiAgICB0aGlzLmluaXRTdHJlYW0oKTtcblxuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHN0YXJ0VGltZTtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICAgIC8vIHZhbHVlcyBzZXQgaW4gdGhlIGZpcnN0IGBwcm9jZXNzYCBjYWxsXG4gICAgdGhpcy5fc3lzdGVtVGltZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbSBhbmQgc3RvcCB0aGUgd2hvbGUgZ3JhcGguIEFueSBjYWxsIHRvIGBwcm9jZXNzYCBvclxuICAgKiBgcHJvY2Vzc0ZyYW1lYCBhZnRlciBgc3RvcGAgd2lsbCBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNmaW5hbGl6ZVN0cmVhbX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5zb3VyY2UuRXZlbnRJbiNzdGFydH1cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuX2lzU3RhcnRlZCAmJiB0aGlzLl9zdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5fZ2V0VGltZSgpO1xuICAgICAgY29uc3QgZW5kVGltZSA9IHRoaXMuZnJhbWUudGltZSArIChjdXJyZW50VGltZSAtIHRoaXMuX3N5c3RlbVRpbWUpO1xuXG4gICAgICB0aGlzLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICAgICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMoKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5wYXJhbXMuZ2V0KCdmcmFtZVNpemUnKTtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lVHlwZScpO1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ3NhbXBsZVJhdGUnKTtcbiAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnBhcmFtcy5nZXQoJ2ZyYW1lUmF0ZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkZXNjcmlwdGlvbicpO1xuICAgIC8vIGluaXQgb3BlcmF0b3IncyBzdHJlYW0gcGFyYW1zXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gZnJhbWVUeXBlID09PSAnc2NhbGFyJyA/IDEgOiBmcmFtZVNpemU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gZnJhbWVUeXBlO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG5cbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgaWYgKHNhbXBsZVJhdGUgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5kZWZpbmVkIFwic2FtcGxlUmF0ZVwiIGZvciBcInNpZ25hbFwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gc2FtcGxlUmF0ZTtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lUmF0ZSA9IHNhbXBsZVJhdGUgLyBmcmFtZVNpemU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVDb3VudCA9IGZyYW1lU2l6ZTtcblxuICAgIH0gZWxzZSBpZiAoZnJhbWVUeXBlID09PSAndmVjdG9yJyB8fCBmcmFtZVR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICBpZiAoZnJhbWVSYXRlID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZGVmaW5lZCBcImZyYW1lUmF0ZVwiIGZvciBcInZlY3RvclwiIHN0cmVhbScpO1xuXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlID0gZnJhbWVSYXRlO1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlQ291bnQgPSAxO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKSB7XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLl9nZXRUaW1lKCk7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YS5sZW5ndGggPyBmcmFtZS5kYXRhIDogW2ZyYW1lLmRhdGFdO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgLy8gaWYgbm8gdGltZSBwcm92aWRlZCwgdXNlIHN5c3RlbSB0aW1lXG4gICAgbGV0IHRpbWUgPSBOdW1iZXIuaXNGaW5pdGUoZnJhbWUudGltZSkgPyBmcmFtZS50aW1lIDogY3VycmVudFRpbWU7XG5cbiAgICBpZiAodGhpcy5fc3RhcnRUaW1lID09PSBudWxsKVxuICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGltZTtcblxuICAgIGlmICh0aGlzLl9hYnNvbHV0ZVRpbWUgPT09IGZhbHNlKVxuICAgICAgdGltZSA9IHRpbWUgLSB0aGlzLl9zdGFydFRpbWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgIG91dERhdGFbaV0gPSBpbkRhdGFbaV07XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcbiAgICAvLyBzdG9yZSBjdXJyZW50IHRpbWUgdG8gY29tcHV0ZSBgZW5kVGltZWAgb24gc3RvcFxuICAgIHRoaXMuX3N5c3RlbVRpbWUgPSBjdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbHRlcm5hdGl2ZSBpbnRlcmZhY2UgdG8gcHJvcGFnYXRlIGEgZnJhbWUgaW4gdGhlIGdyYXBoLiBQYWNrIGB0aW1lYCxcbiAgICogYGRhdGFgIGFuZCBgbWV0YWRhdGFgIGluIGEgZnJhbWUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIEZyYW1lIHRpbWUuXG4gICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5fEFycmF5fSBkYXRhIC0gRnJhbWUgZGF0YS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIC0gT3B0aW9ubmFsIGZyYW1lIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBldmVudEluLnByb2Nlc3MoMSwgWzAsIDEsIDJdKTtcbiAgICogLy8gaXMgZXF1aXZhbGVudCB0b1xuICAgKiBldmVudEluLnByb2Nlc3NGcmFtZSh7IHRpbWU6IDEsIGRhdGE6IFswLCAxLCAyXSB9KTtcbiAgICovXG4gIHByb2Nlc3ModGltZSwgZGF0YSwgbWV0YWRhdGEgPSBudWxsKSB7XG4gICAgdGhpcy5wcm9jZXNzRnJhbWUoeyB0aW1lLCBkYXRhLCBtZXRhZGF0YSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYSBmcmFtZSBvYmplY3QgaW4gdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZnJhbWUgLSBJbnB1dCBmcmFtZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZyYW1lLnRpbWUgLSBGcmFtZSB0aW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheXxBcnJheX0gZnJhbWUuZGF0YSAtIEZyYW1lIGRhdGEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbZnJhbWUubWV0YWRhdGE9dW5kZWZpbmVkXSAtIE9wdGlvbm5hbCBmcmFtZSBtZXRhZGF0YS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogZXZlbnRJbi5wcm9jZXNzRnJhbWUoeyB0aW1lOiAxLCBkYXRhOiBbMCwgMSwgMl0gfSk7XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SW47XG4iXX0=