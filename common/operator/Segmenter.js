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

var _BaseLfo2 = require('../../core/BaseLfo');

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
 * import * as lfo from 'waves-lfo/client';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlci5qcyJdLCJuYW1lcyI6WyJtaW4iLCJNYXRoIiwibWF4IiwiZGVmaW5pdGlvbnMiLCJsb2dJbnB1dCIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwibWluSW5wdXQiLCJmaWx0ZXJPcmRlciIsInRocmVzaG9sZCIsIm9mZlRocmVzaG9sZCIsIkluZmluaXR5IiwibWluSW50ZXIiLCJtYXhEdXJhdGlvbiIsIlNlZ21lbnRlciIsIm9wdGlvbnMiLCJpbnNpZGVTZWdtZW50Iiwib25zZXRUaW1lIiwic3VtIiwic3VtT2ZTcXVhcmVzIiwiY291bnQiLCJwYXJhbXMiLCJnZXQiLCJmaWxsIiwibG9nIiwibW92aW5nQXZlcmFnZSIsIm9yZGVyIiwibGFzdE12YXZyZyIsIm5hbWUiLCJ2YWx1ZSIsInNldCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwiZnJhbWVTaXplIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJpbml0U3RyZWFtIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJyZXNldFNlZ21lbnQiLCJlbmRUaW1lIiwib3V0cHV0U2VnbWVudCIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJub3JtIiwibWVhbiIsIm1lYW5PZlNxdWFyZSIsInNxdWFyZU9mbWVhbiIsInNxcnQiLCJ0aW1lIiwicHJvcGFnYXRlRnJhbWUiLCJyYXdWYWx1ZSIsImRpZmYiLCJpbnB1dFNjYWxhciIsIm1ldGFkYXRhIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxLQUFLRCxHQUFqQjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdBQWpCOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFlBQVU7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O0FBQ0Q7O0FBRUQsVUFBSSxLQUFLSyxhQUFULEVBQXdCO0FBQ3RCLGFBQUtsQixHQUFMLEdBQVdBLElBQUksS0FBS0EsR0FBVCxFQUFjd0QsUUFBZCxDQUFYO0FBQ0EsYUFBS3RELEdBQUwsR0FBV0EsSUFBSSxLQUFLQSxHQUFULEVBQWNzRCxRQUFkLENBQVg7QUFDQSxhQUFLcEMsR0FBTCxJQUFZb0MsUUFBWjtBQUNBLGFBQUtuQyxZQUFMLElBQXFCbUMsV0FBV0EsUUFBaEM7QUFDQSxhQUFLbEMsS0FBTDs7QUFFQSxZQUFJZ0MsT0FBTyxLQUFLbkMsU0FBWixJQUF5QkosV0FBekIsSUFBd0NnQixTQUFTbkIsWUFBckQsRUFBbUU7QUFDakUsZUFBS2lDLGFBQUwsQ0FBbUJTLElBQW5CO0FBQ0EsZUFBS3BDLGFBQUwsR0FBcUIsS0FBckI7QUFDRDtBQUNGO0FBQ0Y7OztpQ0FFWTZCLEssRUFBTztBQUNsQixXQUFLYSxZQUFMO0FBQ0EsV0FBS0MsZUFBTCxDQUFxQmQsS0FBckI7QUFDQTtBQUNEOzs7OztrQkFHWS9CLFMiLCJmaWxlIjoiU2VnbWVudGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcbmltcG9ydCBNb3ZpbmdBdmVyYWdlIGZyb20gJy4vTW92aW5nQXZlcmFnZSc7XG5cbmNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBsb2dJbnB1dDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluSW5wdXQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMDAwMDAwMDAwMDAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBmaWx0ZXJPcmRlcjoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiA1LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICB0aHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDMsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG9mZlRocmVzaG9sZDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLUluZmluaXR5LFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtaW5JbnRlcjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMC4wNTAsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1heER1cmF0aW9uOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiBJbmZpbml0eSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbn1cblxuLyoqXG4gKiBDcmVhdGUgc2VnbWVudHMgYmFzZWQgb24gYXR0YWNrcy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5vcGVyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5sb2dJbnB1dD1mYWxzZV0gLSBBcHBseSBsb2cgb24gdGhlIGlucHV0LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbklucHV0PTAuMDAwMDAwMDAwMDAxXSAtIE1pbmltdW0gdmFsdWUgdG8gdXNlIGFzXG4gKiAgaW5wdXQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZmlsdGVyT3JkZXI9NV0gLSBPcmRlciBvZiB0aGUgaW50ZXJuYWxseSB1c2VkIG1vdmluZ1xuICogIGF2ZXJhZ2UuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudGhyZXNob2xkPTNdIC0gVGhyZXNob2xkIHRoYXQgdHJpZ2dlcnMgYSBzZWdtZW50XG4gKiAgc3RhcnQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub2ZmVGhyZXNob2xkPS1JbmZpbml0eV0gLSBUaHJlc2hvbGQgdGhhdCB0cmlnZ2Vyc1xuICogIGEgc2VnbWVudCBlbmQuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluSW50ZXI9MC4wNTBdIC0gTWluaW11bSBkZWxheSBiZXR3ZWVuIHR3byBzZW1nZW50cy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhEdXJhdGlvbj1JbmZpbml0eV0gLSBNYXhpbXVtIGR1cmF0aW9uIG9mIGEgc2VnbWVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuICpcbiAqIC8vIGFzc3VtaW5nIGEgc3RyZWFtIGZyb20gdGhlIG1pY3JvcGhvbmVcbiAqIGNvbnN0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVNZWRpYVN0cmVhbVNvdXJjZShzdHJlYW0pO1xuICpcbiAqIGNvbnN0IGF1ZGlvSW5Ob2RlID0gbmV3IGxmby5zb3VyY2UuQXVkaW9Jbk5vZGUoe1xuICogICBzb3VyY2VOb2RlOiBzb3VyY2UsXG4gKiAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICogfSk7XG4gKlxuICogY29uc3Qgc2xpY2VyID0gbmV3IGxmby5vcGVyYXRvci5TbGljZXIoe1xuICogICBmcmFtZVNpemU6IGZyYW1lU2l6ZSxcbiAqICAgaG9wU2l6ZTogaG9wU2l6ZSxcbiAqICAgY2VudGVyZWRUaW1lVGFnczogdHJ1ZVxuICogfSk7XG4gKlxuICogY29uc3QgcG93ZXIgPSBuZXcgbGZvLm9wZXJhdG9yLlJNUyh7XG4gKiAgIHBvd2VyOiB0cnVlLFxuICogfSk7XG4gKlxuICogY29uc3Qgc2VnbWVudGVyID0gbmV3IGxmby5vcGVyYXRvci5TZWdtZW50ZXIoe1xuICogICBsb2dJbnB1dDogdHJ1ZSxcbiAqICAgZmlsdGVyT3JkZXI6IDUsXG4gKiAgIHRocmVzaG9sZDogMyxcbiAqICAgb2ZmVGhyZXNob2xkOiAtSW5maW5pdHksXG4gKiAgIG1pbkludGVyOiAwLjA1MCxcbiAqICAgbWF4RHVyYXRpb246IDAuMDUwLFxuICogfSk7XG4gKlxuICogY29uc3QgbG9nZ2VyID0gbmV3IGxmby5zaW5rLkxvZ2dlcih7IHRpbWU6IHRydWUgfSk7XG4gKlxuICogYXVkaW9Jbk5vZGUuY29ubmVjdChzbGljZXIpO1xuICogc2xpY2VyLmNvbm5lY3QocG93ZXIpO1xuICogcG93ZXIuY29ubmVjdChzZWdtZW50ZXIpO1xuICogc2VnbWVudGVyLmNvbm5lY3QobG9nZ2VyKTtcbiAqXG4gKiBhdWRpb0luTm9kZS5zdGFydCgpO1xuICovXG5jbGFzcyBTZWdtZW50ZXIgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuXG4gICAgLy8gc3RhdHNcbiAgICB0aGlzLm1pbiA9IEluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnN1bU9mU3F1YXJlcyA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBsZXQgZmlsbCA9IG1pbklucHV0O1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKSAmJiBtaW5JbnB1dCA+IDApXG4gICAgICBmaWxsID0gTWF0aC5sb2cobWluSW5wdXQpO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlID0gbmV3IE1vdmluZ0F2ZXJhZ2Uoe1xuICAgICAgb3JkZXI6IHRoaXMucGFyYW1zLmdldCgnZmlsdGVyT3JkZXInKSxcbiAgICAgIGZpbGw6IGZpbGwsXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhc3RNdmF2cmcgPSBmaWxsO1xuICB9XG5cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2ZpbHRlck9yZGVyJylcbiAgICAgIHRoaXMubW92aW5nQXZlcmFnZS5wYXJhbXMuc2V0KCdvcmRlcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gMDtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZHVyYXRpb24nLCAnbWluJywgJ21heCcsICdtZWFuJywgJ3N0ZGRldiddO1xuXG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbShwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMubW92aW5nQXZlcmFnZS5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMucmVzZXRTZWdtZW50KCk7XG4gIH1cblxuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudChlbmRUaW1lKTtcblxuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgcmVzZXRTZWdtZW50KCkge1xuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBvdXREYXRhWzBdID0gZW5kVGltZSAtIHRoaXMub25zZXRUaW1lO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLm1pbjtcbiAgICBvdXREYXRhWzJdID0gdGhpcy5tYXg7XG5cbiAgICBjb25zdCBub3JtID0gMSAvIHRoaXMuY291bnQ7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuc3VtICogbm9ybTtcbiAgICBjb25zdCBtZWFuT2ZTcXVhcmUgPSB0aGlzLnN1bU9mU3F1YXJlcyAqIG5vcm07XG4gICAgY29uc3Qgc3F1YXJlT2ZtZWFuID0gbWVhbiAqIG1lYW47XG5cbiAgICBvdXREYXRhWzNdID0gbWVhbjtcbiAgICBvdXREYXRhWzRdID0gMDtcblxuICAgIGlmIChtZWFuT2ZTcXVhcmUgPiBzcXVhcmVPZm1lYW4pXG4gICAgICBvdXREYXRhWzRdID0gTWF0aC5zcXJ0KG1lYW5PZlNxdWFyZSAtIHNxdWFyZU9mbWVhbik7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aGlzLm9uc2V0VGltZTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBsb2dJbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IG1pbkludGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5JbnRlcicpO1xuICAgIGNvbnN0IG1heER1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdtYXhEdXJhdGlvbicpO1xuICAgIGNvbnN0IG9mZlRocmVzaG9sZCA9IHRoaXMucGFyYW1zLmdldCgnb2ZmVGhyZXNob2xkJyk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZS5kYXRhWzBdO1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAobG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgLy8gdXBkYXRlIGZyYW1lIG1ldGFkYXRhXG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gbWluSW50ZXIpIHtcbiAgICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcblxuICAgICAgLy8gc3RhcnQgc2VnbWVudFxuICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gdHJ1ZTtcbiAgICAgIHRoaXMub25zZXRUaW1lID0gdGltZTtcbiAgICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpIHtcbiAgICAgIHRoaXMubWluID0gbWluKHRoaXMubWluLCByYXdWYWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IG1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IG1heER1cmF0aW9uIHx8IHZhbHVlIDw9IG9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgaGVyZSBhcyB0aGUgZnJhbWVSYXRlIGlzIG5vdyB6ZXJvXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudGVyO1xuIl19