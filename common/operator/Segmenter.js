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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _MovingAverage = require('./MovingAverage');

var _MovingAverage2 = _interopRequireDefault(_MovingAverage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var min = Math.min;
var max = Math.max;

var definitions = {
  logInput: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' }
  },
  minInput: {
    type: 'float',
    default: 0.000000000001,
    metas: { kind: 'dyanmic' }
  },
  filterOrder: {
    type: 'integer',
    default: 5,
    metas: { kind: 'dyanmic' }
  },
  threshold: {
    type: 'float',
    default: 3,
    metas: { kind: 'dyanmic' }
  },
  offThreshold: {
    type: 'float',
    default: -Infinity,
    metas: { kind: 'dyanmic' }
  },
  minInter: {
    type: 'float',
    default: 0.050,
    metas: { kind: 'dyanmic' }
  },
  maxDuration: {
    type: 'float',
    default: Infinity,
    metas: { kind: 'dyanmic' }
  }
};

/**
 * Create segments based on attacks.
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.logInput=false] - Apply log on the input.
 * @param {Number} [options.minInput=0.000000000001] - Minimum value to use as
 *  input.
 * @param {Number} [options.filterOrder=5] - Order of the internally used moving
 *  average.
 * @param {Number} [options.threshold=3] - Threshold that triggers a segment
 *  start.
 * @param {Number} [options.offThreshold=-Infinity] - Threshold that triggers
 *  a segment end.
 * @param {Number} [options.minInter=0.050] - Minimum delay between two semgents.
 * @param {Number} [options.maxDuration=Infinity] - Maximum duration of a segment.
 *
 * @example
 * // assuming a stream from the microphone
 * const source = audioContext.createMediaStreamSource(stream);
 *
 * const audioInNode = new lfo.source.AudioInNode({
 *   sourceNode: source,
 *   audioContext: audioContext,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: frameSize,
 *   hopSize: hopSize,
 *   centeredTimeTags: true
 * });
 *
 * const power = new lfo.operator.RMS({
 *   power: true,
 * });
 *
 * const segmenter = new lfo.operator.Segmenter({
 *   logInput: true,
 *   filterOrder: 5,
 *   threshold: 3,
 *   offThreshold: -Infinity,
 *   minInter: 0.050,
 *   maxDuration: 0.050,
 * });
 *
 * const logger = new lfo.sink.Logger({ time: true });
 *
 * audioInNode.connect(slicer);
 * slicer.connect(power);
 * power.connect(segmenter);
 * segmenter.connect(logger);
 *
 * audioInNode.start();
 */

var Segmenter = function (_BaseLfo) {
  (0, _inherits3.default)(Segmenter, _BaseLfo);

  function Segmenter(options) {
    (0, _classCallCheck3.default)(this, Segmenter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Segmenter.__proto__ || (0, _getPrototypeOf2.default)(Segmenter)).call(this, definitions, options));

    _this.insideSegment = false;
    _this.onsetTime = -Infinity;

    // stats
    _this.min = Infinity;
    _this.max = -Infinity;
    _this.sum = 0;
    _this.sumOfSquares = 0;
    _this.count = 0;

    var minInput = _this.params.get('minInput');
    var fill = minInput;

    if (_this.params.get('logInput') && minInput > 0) fill = Math.log(minInput);

    _this.movingAverage = new _MovingAverage2.default({
      order: _this.params.get('filterOrder'),
      fill: fill
    });

    _this.lastMvavrg = fill;
    return _this;
  }

  (0, _createClass3.default)(Segmenter, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      if (name === 'filterOrder') this.movingAverage.params.set('order', value);
    }
  }, {
    key: 'processStreamParams',
    value: function processStreamParams(prevStreamParams) {
      this.prepareStreamParams(prevStreamParams);

      this.streamParams.frameType = 'vector';
      this.streamParams.frameSize = 5;
      this.streamParams.frameRate = 0;
      this.streamParams.description = ['duration', 'min', 'max', 'mean', 'stddev'];

      this.movingAverage.initStream(prevStreamParams);

      this.propagateStreamParams();
    }
  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'resetStream', this).call(this);
      this.movingAverage.resetStream();
      this.resetSegment();
    }
  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      if (this.insideSegment) this.outputSegment(endTime);

      (0, _get3.default)(Segmenter.prototype.__proto__ || (0, _getPrototypeOf2.default)(Segmenter.prototype), 'finalizeStream', this).call(this, endTime);
    }
  }, {
    key: 'resetSegment',
    value: function resetSegment() {
      this.insideSegment = false;
      this.onsetTime = -Infinity;
      // stats
      this.min = Infinity;
      this.max = -Infinity;
      this.sum = 0;
      this.sumOfSquares = 0;
      this.count = 0;
    }
  }, {
    key: 'outputSegment',
    value: function outputSegment(endTime) {
      var outData = this.frame.data;
      outData[0] = endTime - this.onsetTime;
      outData[1] = this.min;
      outData[2] = this.max;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      outData[3] = mean;
      outData[4] = 0;

      if (meanOfSquare > squareOfmean) outData[4] = Math.sqrt(meanOfSquare - squareOfmean);

      this.frame.time = this.onsetTime;

      this.propagateFrame();
    }
  }, {
    key: 'processSignal',
    value: function processSignal(frame) {
      var logInput = this.params.get('logInput');
      var minInput = this.params.get('minInput');
      var threshold = this.params.get('threshold');
      var minInter = this.params.get('minInter');
      var maxDuration = this.params.get('maxDuration');
      var offThreshold = this.params.get('offThreshold');
      var rawValue = frame.data[0];
      var time = frame.time;
      var value = Math.max(rawValue, minInput);

      if (logInput) value = Math.log(value);

      var diff = value - this.lastMvavrg;
      this.lastMvavrg = this.movingAverage.inputScalar(value);

      // update frame metadata
      this.frame.metadata = frame.metadata;

      if (diff > threshold && time - this.onsetTime > minInter) {
        if (this.insideSegment) this.outputSegment(time);

        // start segment
        this.insideSegment = true;
        this.onsetTime = time;
        this.max = -Infinity;
      }

      if (this.insideSegment) {
        this.min = min(this.min, rawValue);
        this.max = max(this.max, rawValue);
        this.sum += rawValue;
        this.sumOfSquares += rawValue * rawValue;
        this.count++;

        if (time - this.onsetTime >= maxDuration || value <= offThreshold) {
          this.outputSegment(time);
          this.insideSegment = false;
        }
      }
    }
  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();
      this.processFunction(frame);
      // do not propagate here as the frameRate is now zero
    }
  }]);
  return Segmenter;
}(_BaseLfo3.default);

exports.default = Segmenter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlci5qcyJdLCJuYW1lcyI6WyJtaW4iLCJNYXRoIiwibWF4IiwiZGVmaW5pdGlvbnMiLCJsb2dJbnB1dCIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwibWluSW5wdXQiLCJmaWx0ZXJPcmRlciIsInRocmVzaG9sZCIsIm9mZlRocmVzaG9sZCIsIkluZmluaXR5IiwibWluSW50ZXIiLCJtYXhEdXJhdGlvbiIsIlNlZ21lbnRlciIsIm9wdGlvbnMiLCJpbnNpZGVTZWdtZW50Iiwib25zZXRUaW1lIiwic3VtIiwic3VtT2ZTcXVhcmVzIiwiY291bnQiLCJwYXJhbXMiLCJnZXQiLCJmaWxsIiwibG9nIiwibW92aW5nQXZlcmFnZSIsIm9yZGVyIiwibGFzdE12YXZyZyIsIm5hbWUiLCJ2YWx1ZSIsInNldCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwiZnJhbWVTaXplIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJpbml0U3RyZWFtIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJyZXNldFNlZ21lbnQiLCJlbmRUaW1lIiwib3V0cHV0U2VnbWVudCIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJub3JtIiwibWVhbiIsIm1lYW5PZlNxdWFyZSIsInNxdWFyZU9mbWVhbiIsInNxcnQiLCJ0aW1lIiwicHJvcGFnYXRlRnJhbWUiLCJyYXdWYWx1ZSIsImRpZmYiLCJpbnB1dFNjYWxhciIsIm1ldGFkYXRhIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxLQUFLRCxHQUFqQjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdBQWpCOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFlBQVU7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QUNEOztBQUVELFVBQUksS0FBS0ssYUFBVCxFQUF3QjtBQUN0QixhQUFLbEIsR0FBTCxHQUFXQSxJQUFJLEtBQUtBLEdBQVQsRUFBY3dELFFBQWQsQ0FBWDtBQUNBLGFBQUt0RCxHQUFMLEdBQVdBLElBQUksS0FBS0EsR0FBVCxFQUFjc0QsUUFBZCxDQUFYO0FBQ0EsYUFBS3BDLEdBQUwsSUFBWW9DLFFBQVo7QUFDQSxhQUFLbkMsWUFBTCxJQUFxQm1DLFdBQVdBLFFBQWhDO0FBQ0EsYUFBS2xDLEtBQUw7O0FBRUEsWUFBSWdDLE9BQU8sS0FBS25DLFNBQVosSUFBeUJKLFdBQXpCLElBQXdDZ0IsU0FBU25CLFlBQXJELEVBQW1FO0FBQ2pFLGVBQUtpQyxhQUFMLENBQW1CUyxJQUFuQjtBQUNBLGVBQUtwQyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0Q7QUFDRjtBQUNGOzs7aUNBRVk2QixLLEVBQU87QUFDbEIsV0FBS2EsWUFBTDtBQUNBLFdBQUtDLGVBQUwsQ0FBcUJkLEtBQXJCO0FBQ0E7QUFDRDs7Ozs7a0JBR1kvQixTIiwiZmlsZSI6IlNlZ21lbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgTW92aW5nQXZlcmFnZSBmcm9tICcuL01vdmluZ0F2ZXJhZ2UnO1xuXG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcbmNvbnN0IG1heCA9IE1hdGgubWF4O1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbG9nSW5wdXQ6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1pbklucHV0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjAwMDAwMDAwMDAwMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgZmlsdGVyT3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAzLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBvZmZUaHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC1JbmZpbml0eSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluSW50ZXI6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMDUwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtYXhEdXJhdGlvbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogSW5maW5pdHksXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG59XG5cbi8qKlxuICogQ3JlYXRlIHNlZ21lbnRzIGJhc2VkIG9uIGF0dGFja3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24ub3BlcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubG9nSW5wdXQ9ZmFsc2VdIC0gQXBwbHkgbG9nIG9uIHRoZSBpbnB1dC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5taW5JbnB1dD0wLjAwMDAwMDAwMDAwMV0gLSBNaW5pbXVtIHZhbHVlIHRvIHVzZSBhc1xuICogIGlucHV0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmZpbHRlck9yZGVyPTVdIC0gT3JkZXIgb2YgdGhlIGludGVybmFsbHkgdXNlZCBtb3ZpbmdcbiAqICBhdmVyYWdlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRocmVzaG9sZD0zXSAtIFRocmVzaG9sZCB0aGF0IHRyaWdnZXJzIGEgc2VnbWVudFxuICogIHN0YXJ0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9mZlRocmVzaG9sZD0tSW5maW5pdHldIC0gVGhyZXNob2xkIHRoYXQgdHJpZ2dlcnNcbiAqICBhIHNlZ21lbnQgZW5kLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbkludGVyPTAuMDUwXSAtIE1pbmltdW0gZGVsYXkgYmV0d2VlbiB0d28gc2VtZ2VudHMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4RHVyYXRpb249SW5maW5pdHldIC0gTWF4aW11bSBkdXJhdGlvbiBvZiBhIHNlZ21lbnQuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGFzc3VtaW5nIGEgc3RyZWFtIGZyb20gdGhlIG1pY3JvcGhvbmVcbiAqIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IGZyYW1lU2l6ZSxcbiAqICAgaG9wU2l6ZTogaG9wU2l6ZSxcbiAqICAgY2VudGVyZWRUaW1lVGFnczogdHJ1ZVxuICogfSk7XG4gKlxuICogY29uc3QgcG93ZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlJNUyh7XG4gKiAgIHBvd2VyOiB0cnVlLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2VnbWVudGVyID0gbmV3IGxmby5vcGVyYXRvci5TZWdtZW50ZXIoe1xuICogICBsb2dJbnB1dDogdHJ1ZSxcbiAqICAgZmlsdGVyT3JkZXI6IDUsXG4gKiAgIHRocmVzaG9sZDogMyxcbiAqICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gKiAgIG1pbkludGVyOiAwLjA1MCxcbiAqICAgbWF4RHVyYXRpb246IDAuMDUwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IHRpbWU6IHRydWUgfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QocG93ZXIpO1xuICogcG93ZXIuY29ubmVjdChzZWdtZW50ZXIpO1xuICogc2VnbWVudGVyLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luTm9kZS5zdGFydCgpO1xuICovXG5jbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuXG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBsZXQgZmlsbCA9IG1pbklucHV0O1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKSAmJiBtaW5JbnB1dCA+IDApXG4gICAgICBmaWxsID0gTWF0aC5sb2cobWluSW5wdXQpO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlID0gbmV3IE1vdmluZ0F2ZXJhZ2Uoe1xuICAgICAgb3JkZXI6IHRoaXMucGFyYW1zLmdldCgnZmlsdGVyT3JkZXInKSxcbiAgICAgIGZpbGw6IGZpbGwsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhc3RNdmF2cmcgPSBmaWxsO1xuICB9XG5cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2ZpbHRlck9yZGVyJylcbiAgICAgICAgdGhpcy5tb3ZpbmdBdmVyYWdlLnBhcmFtcy5zZXQoJ29yZGVyJywgdmFsdWUpO1xuICB9XG5cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID0gJ3ZlY3Rvcic7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gNTtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGUgPSAwO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmRlc2NyaXB0aW9uID0gWydkdXJhdGlvbicsICdtaW4nLCAnbWF4JywgJ21lYW4nLCAnc3RkZGV2J107XG5cblxuICAgIHRoaXMubW92aW5nQXZlcmFnZS5pbml0U3RyZWFtKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLnJlc2V0U3RyZWFtKCk7XG4gICAgdGhpcy5yZXNldFNlZ21lbnQoKTtcbiAgfVxuXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBpZiAodGhpcy5pbnNpZGVTZWdtZW50KVxuICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KGVuZFRpbWUpO1xuXG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICByZXNldFNlZ21lbnQoKSB7XG4gICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgdGhpcy5vbnNldFRpbWUgPSAtSW5maW5pdHk7XG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gIH1cblxuICBvdXRwdXRTZWdtZW50KGVuZFRpbWUpIHtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIG91dERhdGFbMF0gPSBlbmRUaW1lIC0gdGhpcy5vbnNldFRpbWU7XG4gICAgb3V0RGF0YVsxXSA9IHRoaXMubWluO1xuICAgIG91dERhdGFbMl0gPSB0aGlzLm1heDtcblxuICAgIGNvbnN0IG5vcm0gPSAxIC8gdGhpcy5jb3VudDtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5zdW0gKiBub3JtO1xuICAgIGNvbnN0IG1lYW5PZlNxdWFyZSA9IHRoaXMuc3VtT2ZTcXVhcmVzICogbm9ybTtcbiAgICBjb25zdCBzcXVhcmVPZm1lYW4gPSBtZWFuICogbWVhbjtcblxuICAgIG91dERhdGFbM10gPSBtZWFuO1xuICAgIG91dERhdGFbNF0gPSAwO1xuXG4gICAgaWYgKG1lYW5PZlNxdWFyZSA+IHNxdWFyZU9mbWVhbilcbiAgICAgIG91dERhdGFbNF0gPSBNYXRoLnNxcnQobWVhbk9mU3F1YXJlIC0gc3F1YXJlT2ZtZWFuKTtcblxuICAgIHRoaXMuZnJhbWUudGltZSA9IHRoaXMub25zZXRUaW1lO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgcHJvY2Vzc1NpZ25hbChmcmFtZSkge1xuICAgIGNvbnN0IGxvZ0lucHV0ID0gdGhpcy5wYXJhbXMuZ2V0KCdsb2dJbnB1dCcpO1xuICAgIGNvbnN0IG1pbklucHV0ID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5JbnB1dCcpO1xuICAgIGNvbnN0IHRocmVzaG9sZCA9IHRoaXMucGFyYW1zLmdldCgndGhyZXNob2xkJyk7XG4gICAgY29uc3QgbWluSW50ZXIgPSB0aGlzLnBhcmFtcy5nZXQoJ21pbkludGVyJyk7XG4gICAgY29uc3QgbWF4RHVyYXRpb24gPSB0aGlzLnBhcmFtcy5nZXQoJ21heER1cmF0aW9uJyk7XG4gICAgY29uc3Qgb2ZmVGhyZXNob2xkID0gdGhpcy5wYXJhbXMuZ2V0KCdvZmZUaHJlc2hvbGQnKTtcbiAgICBjb25zdCByYXdWYWx1ZSA9IGZyYW1lLmRhdGFbMF07XG4gICAgY29uc3QgdGltZSA9IGZyYW1lLnRpbWU7XG4gICAgbGV0IHZhbHVlID0gTWF0aC5tYXgocmF3VmFsdWUsIG1pbklucHV0KTtcblxuICAgIGlmIChsb2dJbnB1dClcbiAgICAgIHZhbHVlID0gTWF0aC5sb2codmFsdWUpO1xuXG4gICAgY29uc3QgZGlmZiA9IHZhbHVlIC0gdGhpcy5sYXN0TXZhdnJnO1xuICAgIHRoaXMubGFzdE12YXZyZyA9IHRoaXMubW92aW5nQXZlcmFnZS5pbnB1dFNjYWxhcih2YWx1ZSk7XG5cbiAgICAvLyB1cGRhdGUgZnJhbWUgbWV0YWRhdGFcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICBpZiAoZGlmZiA+IHRocmVzaG9sZCAmJiB0aW1lIC0gdGhpcy5vbnNldFRpbWUgPiBtaW5JbnRlcikge1xuICAgICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBtaW4odGhpcy5taW4sIHJhd1ZhbHVlKTtcbiAgICAgIHRoaXMubWF4ID0gbWF4KHRoaXMubWF4LCByYXdWYWx1ZSk7XG4gICAgICB0aGlzLnN1bSArPSByYXdWYWx1ZTtcbiAgICAgIHRoaXMuc3VtT2ZTcXVhcmVzICs9IHJhd1ZhbHVlICogcmF3VmFsdWU7XG4gICAgICB0aGlzLmNvdW50Kys7XG5cbiAgICAgIGlmICh0aW1lIC0gdGhpcy5vbnNldFRpbWUgPj0gbWF4RHVyYXRpb24gfHwgdmFsdWUgPD0gb2ZmVGhyZXNob2xkKSB7XG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcbiAgICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgLy8gZG8gbm90IHByb3BhZ2F0ZSBoZXJlIGFzIHRoZSBmcmFtZVJhdGUgaXMgbm93IHplcm9cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50ZXI7XG4iXX0=