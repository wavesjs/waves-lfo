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

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

var _movingAverage = require('./moving-average');

var _movingAverage2 = _interopRequireDefault(_movingAverage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Segmenter = function (_BaseLfo) {
  (0, _inherits3.default)(Segmenter, _BaseLfo);

  function Segmenter(options) {
    (0, _classCallCheck3.default)(this, Segmenter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Segmenter).call(this, {
      logInput: false,
      minInput: 0.000000000001,
      filterOrder: 5,
      threshold: 3,
      offThreshold: -Infinity,
      minInter: 0.050,
      maxDuration: Infinity
    }, options));

    _this.insideSegment = false;
    _this.onsetTime = -Infinity;

    // stats
    _this.min = Infinity;
    _this.max = -Infinity;
    _this.sum = 0;
    _this.sumOfSquares = 0;
    _this.count = 0;

    var minInput = _this.params.minInput;
    var fill = minInput;

    if (_this.params.logInput && minInput > 0) fill = Math.log(minInput);

    _this.movingAverage = new _movingAverage2.default({
      order: _this.params.filterOrder,
      fill: fill
    });

    _this.lastMvavrg = fill;
    return _this;
  }

  (0, _createClass3.default)(Segmenter, [{
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
      this.outFrame[0] = endTime - this.onsetTime;
      this.outFrame[1] = this.min;
      this.outFrame[2] = this.max;

      var norm = 1 / this.count;
      var mean = this.sum * norm;
      var meanOfSquare = this.sumOfSquares * norm;
      var squareOfmean = mean * mean;

      this.outFrame[3] = mean;
      this.outFrame[4] = 0;

      if (meanOfSquare > squareOfmean) this.outFrame[4] = Math.sqrt(meanOfSquare - squareOfmean);

      this.output(this.onsetTime);
    }
  }, {
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Segmenter.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 5,
        description: ['duration', 'min', 'max', 'mean', 'std dev']
      });

      this.movingAverage.initialize(inStreamParams);
    }
  }, {
    key: 'reset',
    value: function reset() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Segmenter.prototype), 'reset', this).call(this);
      this.movingAverage.reset();
      this.resetSegment();
    }
  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      if (this.insideSegment) this.outputSegment(endTime);

      (0, _get3.default)((0, _getPrototypeOf2.default)(Segmenter.prototype), 'finalize', this).call(this, endTime);
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var rawValue = frame[0];
      var minInput = this.params.minInput;
      var value = Math.max(rawValue, minInput);

      if (this.params.logInput) value = Math.log(value);

      var diff = value - this.lastMvavrg;
      this.lastMvavrg = this.movingAverage.inputScalar(value);

      this.metaData = metaData;

      if (diff > this.params.threshold && time - this.onsetTime > this.params.minInter) {
        if (this.insideSegment) this.outputSegment(time);

        // start segment
        this.insideSegment = true;
        this.onsetTime = time;
        this.max = -Infinity;
      }

      if (this.insideSegment) {
        this.min = Math.min(this.min, rawValue);
        this.max = Math.max(this.max, rawValue);
        this.sum += rawValue;
        this.sumOfSquares += rawValue * rawValue;
        this.count++;

        if (time - this.onsetTime >= this.params.maxDuration || value <= this.params.offThreshold) {
          this.outputSegment(time);
          this.insideSegment = false;
        }
      }
    }
  }, {
    key: 'threshold',
    set: function set(value) {
      this.params.threshold = value;
    }
  }, {
    key: 'offThreshold',
    set: function set(value) {
      this.params.offThreshold = value;
    }
  }]);
  return Segmenter;
}(_baseLfo2.default);

exports.default = Segmenter;
//# sourceMappingURL=data:application/json;base64,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QUFLLEdBQUwsRUFBVSxRQUFuQixDQUFYLENBRHNCO0FBRXRCLGFBQUssR0FBTCxHQUFXLEtBQUssR0FBTCxDQUFTLEtBQUssR0FBTCxFQUFVLFFBQW5CLENBQVgsQ0FGc0I7QUFHdEIsYUFBSyxHQUFMLElBQVksUUFBWixDQUhzQjtBQUl0QixhQUFLLFlBQUwsSUFBcUIsV0FBVyxRQUFYLENBSkM7QUFLdEIsYUFBSyxLQUFMLEdBTHNCOztBQU90QixZQUFJLE9BQU8sS0FBSyxTQUFMLElBQWtCLEtBQUssTUFBTCxDQUFZLFdBQVosSUFBMkIsU0FBUyxLQUFLLE1BQUwsQ0FBWSxZQUFaLEVBQTBCO0FBQ3pGLGVBQUssYUFBTCxDQUFtQixJQUFuQixFQUR5RjtBQUV6RixlQUFLLGFBQUwsR0FBcUIsS0FBckIsQ0FGeUY7U0FBM0Y7T0FQRjs7OztzQkExRlksT0FBTztBQUNuQixXQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLEtBQXhCLENBRG1COzs7O3NCQUlKLE9BQU87QUFDdEIsV0FBSyxNQUFMLENBQVksWUFBWixHQUEyQixLQUEzQixDQURzQjs7O1NBeENMIiwiZmlsZSI6InNlZ21lbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuaW1wb3J0IE1vdmluZ0F2ZXJhZ2UgZnJvbSAnLi9tb3ZpbmctYXZlcmFnZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBsb2dJbnB1dDogZmFsc2UsXG4gICAgICBtaW5JbnB1dDogMC4wMDAwMDAwMDAwMDEsXG4gICAgICBmaWx0ZXJPcmRlcjogNSxcbiAgICAgIHRocmVzaG9sZDogMyxcbiAgICAgIG9mZlRocmVzaG9sZDogLUluZmluaXR5LFxuICAgICAgbWluSW50ZXI6IDAuMDUwLFxuICAgICAgbWF4RHVyYXRpb246IEluZmluaXR5LFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5pbnNpZGVTZWdtZW50ID0gZmFsc2U7XG4gICAgdGhpcy5vbnNldFRpbWUgPSAtSW5maW5pdHk7XG5cbiAgICAvLyBzdGF0c1xuICAgIHRoaXMubWluID0gSW5maW5pdHk7XG4gICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuc3VtT2ZTcXVhcmVzID0gMDtcbiAgICB0aGlzLmNvdW50ID0gMDtcblxuICAgIGNvbnN0IG1pbklucHV0ID0gdGhpcy5wYXJhbXMubWluSW5wdXQ7XG4gICAgbGV0IGZpbGwgPSBtaW5JbnB1dDtcblxuICAgIGlmKHRoaXMucGFyYW1zLmxvZ0lucHV0ICYmIG1pbklucHV0ID4gMClcbiAgICAgIGZpbGwgPSBNYXRoLmxvZyhtaW5JbnB1dCk7XG5cbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UgPSBuZXcgTW92aW5nQXZlcmFnZSh7XG4gICAgICBvcmRlcjogdGhpcy5wYXJhbXMuZmlsdGVyT3JkZXIsXG4gICAgICBmaWxsOiBmaWxsLFxuICAgIH0pO1xuXG4gICAgdGhpcy5sYXN0TXZhdnJnID0gZmlsbDtcbiAgfVxuXG4gIHNldCB0aHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy50aHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBvZmZUaHJlc2hvbGQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vZmZUaHJlc2hvbGQgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlc2V0U2VnbWVudCgpIHtcbiAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9uc2V0VGltZSA9IC1JbmZpbml0eTtcblxuICAgIC8vIHN0YXRzXG4gICAgdGhpcy5taW4gPSBJbmZpbml0eTtcbiAgICB0aGlzLm1heCA9IC1JbmZpbml0eTtcbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5zdW1PZlNxdWFyZXMgPSAwO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICB9XG5cbiAgb3V0cHV0U2VnbWVudChlbmRUaW1lKSB7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IGVuZFRpbWUgLSB0aGlzLm9uc2V0VGltZTtcbiAgICB0aGlzLm91dEZyYW1lWzFdID0gdGhpcy5taW47XG4gICAgdGhpcy5vdXRGcmFtZVsyXSA9IHRoaXMubWF4O1xuXG4gICAgY29uc3Qgbm9ybSA9IDEgLyB0aGlzLmNvdW50O1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLnN1bSAqIG5vcm07XG4gICAgY29uc3QgbWVhbk9mU3F1YXJlID0gdGhpcy5zdW1PZlNxdWFyZXMgKiBub3JtO1xuICAgIGNvbnN0IHNxdWFyZU9mbWVhbiA9IG1lYW4gKiBtZWFuO1xuXG4gICAgdGhpcy5vdXRGcmFtZVszXSA9IG1lYW47XG4gICAgdGhpcy5vdXRGcmFtZVs0XSA9IDA7XG5cbiAgICBpZiAobWVhbk9mU3F1YXJlID4gc3F1YXJlT2ZtZWFuKVxuICAgICAgdGhpcy5vdXRGcmFtZVs0XSA9IE1hdGguc3FydChtZWFuT2ZTcXVhcmUgLSBzcXVhcmVPZm1lYW4pO1xuXG4gICAgdGhpcy5vdXRwdXQodGhpcy5vbnNldFRpbWUpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMsIHtcbiAgICAgIGZyYW1lU2l6ZTogNSxcbiAgICAgIGRlc2NyaXB0aW9uOiBbXG4gICAgICAgICdkdXJhdGlvbicsXG4gICAgICAgICdtaW4nLFxuICAgICAgICAnbWF4JyxcbiAgICAgICAgJ21lYW4nLFxuICAgICAgICAnc3RkIGRldicsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb3ZpbmdBdmVyYWdlLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLm1vdmluZ0F2ZXJhZ2UucmVzZXQoKTtcbiAgICB0aGlzLnJlc2V0U2VnbWVudCgpO1xuICB9XG5cbiAgZmluYWxpemUoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmluc2lkZVNlZ21lbnQpXG4gICAgICB0aGlzLm91dHB1dFNlZ21lbnQoZW5kVGltZSk7XG5cbiAgICBzdXBlci5maW5hbGl6ZShlbmRUaW1lKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3QgcmF3VmFsdWUgPSBmcmFtZVswXTtcbiAgICBjb25zdCBtaW5JbnB1dCA9IHRoaXMucGFyYW1zLm1pbklucHV0O1xuICAgIGxldCB2YWx1ZSA9IE1hdGgubWF4KHJhd1ZhbHVlLCBtaW5JbnB1dCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMubG9nSW5wdXQpXG4gICAgICB2YWx1ZSA9IE1hdGgubG9nKHZhbHVlKTtcblxuICAgIGNvbnN0IGRpZmYgPSB2YWx1ZSAtIHRoaXMubGFzdE12YXZyZztcbiAgICB0aGlzLmxhc3RNdmF2cmcgPSB0aGlzLm1vdmluZ0F2ZXJhZ2UuaW5wdXRTY2FsYXIodmFsdWUpO1xuXG4gICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXG4gICAgaWYgKGRpZmYgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQgJiYgdGltZSAtIHRoaXMub25zZXRUaW1lID4gdGhpcy5wYXJhbXMubWluSW50ZXIpIHtcbiAgICAgIGlmKHRoaXMuaW5zaWRlU2VnbWVudClcbiAgICAgICAgdGhpcy5vdXRwdXRTZWdtZW50KHRpbWUpO1xuXG4gICAgICAvLyBzdGFydCBzZWdtZW50XG4gICAgICB0aGlzLmluc2lkZVNlZ21lbnQgPSB0cnVlO1xuICAgICAgdGhpcy5vbnNldFRpbWUgPSB0aW1lO1xuICAgICAgdGhpcy5tYXggPSAtSW5maW5pdHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zaWRlU2VnbWVudCkge1xuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgcmF3VmFsdWUpO1xuICAgICAgdGhpcy5zdW0gKz0gcmF3VmFsdWU7XG4gICAgICB0aGlzLnN1bU9mU3F1YXJlcyArPSByYXdWYWx1ZSAqIHJhd1ZhbHVlO1xuICAgICAgdGhpcy5jb3VudCsrO1xuXG4gICAgICBpZiAodGltZSAtIHRoaXMub25zZXRUaW1lID49IHRoaXMucGFyYW1zLm1heER1cmF0aW9uIHx8IHZhbHVlIDw9IHRoaXMucGFyYW1zLm9mZlRocmVzaG9sZCkge1xuICAgICAgICB0aGlzLm91dHB1dFNlZ21lbnQodGltZSk7XG4gICAgICAgIHRoaXMuaW5zaWRlU2VnbWVudCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19