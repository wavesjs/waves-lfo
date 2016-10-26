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
 * Create segment based on attacks
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlci5qcyJdLCJuYW1lcyI6WyJtaW4iLCJNYXRoIiwibWF4IiwiZGVmaW5pdGlvbnMiLCJsb2dJbnB1dCIsInR5cGUiLCJkZWZhdWx0IiwibWV0YXMiLCJraW5kIiwibWluSW5wdXQiLCJmaWx0ZXJPcmRlciIsInRocmVzaG9sZCIsIm9mZlRocmVzaG9sZCIsIkluZmluaXR5IiwibWluSW50ZXIiLCJtYXhEdXJhdGlvbiIsIlNlZ21lbnRlciIsIm9wdGlvbnMiLCJpbnNpZGVTZWdtZW50Iiwib25zZXRUaW1lIiwic3VtIiwic3VtT2ZTcXVhcmVzIiwiY291bnQiLCJwYXJhbXMiLCJnZXQiLCJmaWxsIiwibG9nIiwibW92aW5nQXZlcmFnZSIsIm9yZGVyIiwibGFzdE12YXZyZyIsIm5hbWUiLCJ2YWx1ZSIsInNldCIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVUeXBlIiwiZnJhbWVTaXplIiwiZnJhbWVSYXRlIiwiZGVzY3JpcHRpb24iLCJpbml0U3RyZWFtIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwicmVzZXRTdHJlYW0iLCJyZXNldFNlZ21lbnQiLCJlbmRUaW1lIiwib3V0cHV0U2VnbWVudCIsIm91dERhdGEiLCJmcmFtZSIsImRhdGEiLCJub3JtIiwibWVhbiIsIm1lYW5PZlNxdWFyZSIsInNxdWFyZU9mbWVhbiIsInNxcnQiLCJ0aW1lIiwicHJvcGFnYXRlRnJhbWUiLCJyYXdWYWx1ZSIsImRpZmYiLCJpbnB1dFNjYWxhciIsIm1ldGFkYXRhIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNQyxLQUFLRCxHQUFqQjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdBQWpCOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLFlBQVU7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R0FBV0EsSUFBSSxLQUFLQSxHQUFULEVBQWN3RCxRQUFkLENBQVg7QUFDQSxhQUFLdEQsR0FBTCxHQUFXQSxJQUFJLEtBQUtBLEdBQVQsRUFBY3NELFFBQWQsQ0FBWDtBQUNBLGFBQUtwQyxHQUFMLElBQVlvQyxRQUFaO0FBQ0EsYUFBS25DLFlBQUwsSUFBcUJtQyxXQUFXQSxRQUFoQztBQUNBLGFBQUtsQyxLQUFMOztBQUVBLFlBQUlnQyxPQUFPLEtBQUtuQyxTQUFaLElBQXlCSixXQUF6QixJQUF3Q2dCLFNBQVNuQixZQUFyRCxFQUFtRTtBQUNqRSxlQUFLaUMsYUFBTCxDQUFtQlMsSUFBbkI7QUFDQSxlQUFLcEMsYUFBTCxHQUFxQixLQUFyQjtBQUNEO0FBQ0Y7QUFDRjs7O2lDQUVZNkIsSyxFQUFPO0FBQ2xCLFdBQUthLFlBQUw7QUFDQSxXQUFLQyxlQUFMLENBQXFCZCxLQUFyQjtBQUNBO0FBQ0Q7Ozs7O2tCQS9Ja0IvQixTIiwiZmlsZSI6IlNlZ21lbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgTW92aW5nQXZlcmFnZSBmcm9tICcuL01vdmluZ0F2ZXJhZ2UnO1xuXG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcbmNvbnN0IG1heCA9IE1hdGgubWF4O1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbG9nSW5wdXQ6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG4gIG1pbklucHV0OiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLjAwMDAwMDAwMDAwMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgZmlsdGVyT3JkZXI6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgdGhyZXNob2xkOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAzLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBvZmZUaHJlc2hvbGQ6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC1JbmZpbml0eSxcbiAgICBtZXRhczogeyBraW5kOiAnZHlhbm1pYycgfSxcbiAgfSxcbiAgbWluSW50ZXI6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDAuMDUwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeWFubWljJyB9LFxuICB9LFxuICBtYXhEdXJhdGlvbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogSW5maW5pdHksXG4gICAgbWV0YXM6IHsga2luZDogJ2R5YW5taWMnIH0sXG4gIH0sXG59XG5cbi8qKlxuICogQ3JlYXRlIHNlZ21lbnQgYmFzZWQgb24gYXR0YWNrc1xuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9uc2V0VGltZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuXG4gICAgY29uc3QgbWluSW5wdXQgPSB0aGlzLnBhcmFtcy5nZXQoJ21pbklucHV0Jyk7XG4gICAgbGV0IGZpbGwgPSBtaW5JbnB1dDtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2xvZ0lucHV0JykgJiYgbWluSW5wdXQgPiAwKVxuICAgICAgZmlsbCA9IE1hdGgubG9nKG1pbklucHV0KTtcblxuICAgIHRoaXMubW92aW5nQXZlcmFnZSA9IG5ldyBNb3ZpbmdBdmVyYWdlKHtcbiAgICAgIG9yZGVyOiB0aGlzLnBhcmFtcy5nZXQoJ2ZpbHRlck9yZGVyJyksXG4gICAgICBmaWxsOiBmaWxsLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sYXN0TXZhdnJnID0gZmlsbDtcbiAgfVxuXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdmaWx0ZXJPcmRlcicpXG4gICAgICAgIHRoaXMubW92aW5nQXZlcmFnZS5wYXJhbXMuc2V0KCdvcmRlcicsIHZhbHVlKTtcbiAgfVxuXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9ICd2ZWN0b3InO1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDU7XG4gICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlID0gMDtcbiAgICB0aGlzLnN0cmVhbVBhcmFtcy5kZXNjcmlwdGlvbiA9IFsnZHVyYXRpb24nLCAnbWluJywgJ21heCcsICdtZWFuJywgJ3N0ZGRldiddO1xuXG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5pdFN0cmVhbShwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMubW92aW5nQXZlcmFnZS5yZXNldFN0cmVhbSgpO1xuICAgIHRoaXMucmVzZXRTZWdtZW50KCk7XG4gIH1cblxuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgIHRoaXMub3V0cHV0U2VnbWVudChlbmRUaW1lKTtcblxuICAgIHN1cGVyLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgcmVzZXRTZWdtZW50KCkge1xuICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgIHRoaXMub25zZXRUaW1lID0gLUluZmluaXR5O1xuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBvdXREYXRhWzBdID0gZW5kVGltZSAtIHRoaXMub25zZXRUaW1lO1xuICAgIG91dERhdGFbMV0gPSB0aGlzLm1pbjtcbiAgICBvdXREYXRhWzJdID0gdGhpcy5tYXg7XG5cbiAgICBjb25zdCBub3JtID0gMSAvIHRoaXMuY291bnQ7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuc3VtICogbm9ybTtcbiAgICBjb25zdCBtZWFuT2ZTcXVhcmUgPSB0aGlzLnN1bU9mU3F1YXJlcyAqIG5vcm07XG4gICAgY29uc3Qgc3F1YXJlT2ZtZWFuID0gbWVhbiAqIG1lYW47XG5cbiAgICBvdXREYXRhWzNdID0gbWVhbjtcbiAgICBvdXREYXRhWzRdID0gMDtcblxuICAgIGlmIChtZWFuT2ZTcXVhcmUgPiBzcXVhcmVPZm1lYW4pXG4gICAgICBvdXREYXRhWzRdID0gTWF0aC5zcXJ0KG1lYW5PZlNxdWFyZSAtIHNxdWFyZU9mbWVhbik7XG5cbiAgICB0aGlzLmZyYW1lLnRpbWUgPSB0aGlzLm9uc2V0VGltZTtcblxuICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgfVxuXG4gIHByb2Nlc3NTaWduYWwoZnJhbWUpIHtcbiAgICBjb25zdCBsb2dJbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbG9nSW5wdXQnKTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLmdldCgnbWluSW5wdXQnKTtcbiAgICBjb25zdCB0aHJlc2hvbGQgPSB0aGlzLnBhcmFtcy5nZXQoJ3RocmVzaG9sZCcpO1xuICAgIGNvbnN0IG1pbkludGVyID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW5JbnRlcicpO1xuICAgIGNvbnN0IG1heER1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdtYXhEdXJhdGlvbicpO1xuICAgIGNvbnN0IG9mZlRocmVzaG9sZCA9IHRoaXMucGFyYW1zLmdldCgnb2ZmVGhyZXNob2xkJyk7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZS5kYXRhWzBdO1xuICAgIGNvbnN0IHRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAobG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgLy8gdXBkYXRlIGZyYW1lIG1ldGFkYXRhXG4gICAgdGhpcy5mcmFtZS5tZXRhZGF0YSA9IGZyYW1lLm1ldGFkYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gbWluSW50ZXIpIHtcbiAgICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICAgIHRoaXMub3V0cHV0U2VnbWVudCh0aW1lKTtcblxuICAgICAgLy8gc3RhcnQgc2VnbWVudFxuICAgICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gdHJ1ZTtcbiAgICAgIHRoaXMub25zZXRUaW1lID0gdGltZTtcbiAgICAgIHRoaXMubWF4ID0gLUluZmluaXR5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpIHtcbiAgICAgIHRoaXMubWluID0gbWluKHRoaXMubWluLCByYXdWYWx1ZSk7XG4gICAgICB0aGlzLm1heCA9IG1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IG1heER1cmF0aW9uIHx8IHZhbHVlIDw9IG9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgaGVyZSBhcyB0aGUgZnJhbWVSYXRlIGlzIG5vdyB6ZXJvXG4gIH1cbn1cbiJdfQ==