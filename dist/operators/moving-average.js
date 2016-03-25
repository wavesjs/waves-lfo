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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?

var MovingAverage = function (_BaseLfo) {
  (0, _inherits3.default)(MovingAverage, _BaseLfo);

  function MovingAverage(options) {
    (0, _classCallCheck3.default)(this, MovingAverage);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MovingAverage).call(this, {
      order: 10,
      fill: 0
    }, options));

    _this.sum = null;
    _this.ringBuffer = null;
    _this.ringIndex = 0;
    return _this;
  }

  (0, _createClass3.default)(MovingAverage, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(MovingAverage.prototype), 'initialize', this).call(this, inStreamParams);

      this.ringBuffer = new Float32Array(this.params.order * this.streamParams.frameSize);

      if (this.streamParams.frameSize > 1) this.sum = new Float32Array(this.streamParams.frameSize);else this.sum = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(MovingAverage.prototype), 'reset', this).call(this);

      this.ringBuffer.fill(this.params.fill);

      var fillSum = this.params.order * this.params.fill;

      if (this.streamParams.frameSize > 1) this.sum.fill(fillSum);else this.sum = fillSum;

      this.ringIndex = 0;
    }
  }, {
    key: 'inputScalar',
    value: function inputScalar(value) {
      var order = this.params.order;
      var ringIndex = this.ringIndex;
      var ringBuffer = this.ringBuffer;
      var sum = this.sum;

      sum -= ringBuffer[ringIndex];
      sum += value;

      this.sum = sum;
      this.ringBuffer[ringIndex] = value;
      this.ringIndex = (ringIndex + 1) % order;

      return sum / order;
    }
  }, {
    key: 'inputArray',
    value: function inputArray(frame) {
      var outFrame = this.outFrame;
      var order = this.params.order;
      var frameSize = this.streamParams.frameSize;
      var ringIndex = this.ringIndex;
      var ringOffset = ringIndex * frameSize;
      var ring = this.ringBuffer;
      var sum = this.sum;
      var scale = 1 / order;

      for (var i = 0; i < frameSize; i++) {
        var ringBufferIndex = ringOffset + i;
        var value = frame[i];
        var _sum = _sum[i];

        _sum -= ringBuffer[ringBufferIndex];
        _sum += value;

        outFrame[i] = _sum * scale;

        this.sum[i] = _sum;
        this.ringBuffer[ringBufferIndex] = value;
      }

      this.ringIndex = (ringIndex + 1) % order;

      return outFrame;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (this.frameSize > 1) this.inputArray(frame);else this.outFrame[0] = this.inputScalar(frame[0]);

      if (this.streamParams.sourceSampleRate) time -= 0.5 * (this.params.order - 1) / this.streamParams.sourceSampleRate;

      this.output(time, this.outFrame, metaData);
    }
  }]);
  return MovingAverage;
}(_baseLfo2.default);

exports.default = MovingAverage;
//# sourceMappingURL=data:application/json;base64,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QkFBTyxLQUFQLENBTmtDOztBQVFsQyxpQkFBUyxDQUFULElBQWMsT0FBTSxLQUFOLENBUm9COztBQVVsQyxhQUFLLEdBQUwsQ0FBUyxDQUFULElBQWMsSUFBZCxDQVZrQztBQVdsQyxhQUFLLFVBQUwsQ0FBZ0IsZUFBaEIsSUFBbUMsS0FBbkMsQ0FYa0M7T0FBcEM7O0FBY0EsV0FBSyxTQUFMLEdBQWlCLENBQUMsWUFBWSxDQUFaLENBQUQsR0FBa0IsS0FBbEIsQ0F4QkQ7O0FBMEJoQixhQUFPLFFBQVAsQ0ExQmdCOzs7OzRCQTZCVixNQUFNLE9BQU8sVUFBVTtBQUM3QixVQUFHLEtBQUssU0FBTCxHQUFpQixDQUFqQixFQUNELEtBQUssVUFBTCxDQUFnQixLQUFoQixFQURGLEtBR0UsS0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixLQUFLLFdBQUwsQ0FBaUIsTUFBTSxDQUFOLENBQWpCLENBQW5CLENBSEY7O0FBS0EsVUFBRyxLQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLEVBQ0QsUUFBUyxPQUFPLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsQ0FBcEIsQ0FBUCxHQUFnQyxLQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLENBRDNDOztBQUdBLFdBQUssTUFBTCxDQUFZLElBQVosRUFBa0IsS0FBSyxRQUFMLEVBQWUsUUFBakMsRUFUNkI7OztTQW5GWiIsImZpbGUiOiJtb3ZpbmctYXZlcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vLyBOT1RFUzpcbi8vIC0gYWRkICdzeW1ldHJpY2FsJyBvcHRpb24gKGhvdyB0byBkZWFsIHdpdGggdmFsdWVzIGJldHdlZW4gZnJhbWVzID8pID9cbi8vIC0gY2FuIHdlIGltcHJvdmUgYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uID9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIG9yZGVyOiAxMCxcbiAgICAgIGZpbGw6IDAsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnN1bSA9IG51bGw7XG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucGFyYW1zLm9yZGVyICogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlci5maWxsKHRoaXMucGFyYW1zLmZpbGwpO1xuXG4gICAgY29uc3QgZmlsbFN1bSA9IHRoaXMucGFyYW1zLm9yZGVyICogdGhpcy5wYXJhbXMuZmlsbDtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0uZmlsbChmaWxsU3VtKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnN1bSA9IGZpbGxTdW07XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gIH1cblxuICBpbnB1dFNjYWxhcih2YWx1ZSkge1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBsZXQgc3VtID0gdGhpcy5zdW07XG5cbiAgICBzdW0gLT0gcmluZ0J1ZmZlcltyaW5nSW5kZXhdO1xuICAgIHN1bSArPSB2YWx1ZTtcblxuICAgIHRoaXMuc3VtID0gc3VtO1xuICAgIHRoaXMucmluZ0J1ZmZlcltyaW5nSW5kZXhdID0gdmFsdWU7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcblxuICAgIHJldHVybiBzdW0gLyBvcmRlcjtcbiAgfVxuXG4gIGlucHV0QXJyYXkoZnJhbWUpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ09mZnNldCA9IHJpbmdJbmRleCAqIGZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtO1xuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgcmluZ0J1ZmZlckluZGV4ID0gcmluZ09mZnNldCArIGk7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZyYW1lW2ldO1xuICAgICAgbGV0IHN1bSA9IHN1bVtpXTtcblxuICAgICAgc3VtIC09IHJpbmdCdWZmZXJbcmluZ0J1ZmZlckluZGV4XTtcbiAgICAgIHN1bSArPSB2YWx1ZTtcblxuICAgICAgb3V0RnJhbWVbaV0gPSBzdW0gKiBzY2FsZTtcblxuICAgICAgdGhpcy5zdW1baV0gPSBzdW07XG4gICAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ0J1ZmZlckluZGV4XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG5cbiAgICByZXR1cm4gb3V0RnJhbWU7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmKHRoaXMuZnJhbWVTaXplID4gMSlcbiAgICAgIHRoaXMuaW5wdXRBcnJheShmcmFtZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5vdXRGcmFtZVswXSA9IHRoaXMuaW5wdXRTY2FsYXIoZnJhbWVbMF0pO1xuXG4gICAgaWYodGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSlcbiAgICAgIHRpbWUgLT0gKDAuNSAqICh0aGlzLnBhcmFtcy5vcmRlciAtIDEpIC8gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZSk7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==