'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?

var MovingAverage = (function (_BaseLfo) {
  _inherits(MovingAverage, _BaseLfo);

  function MovingAverage(options) {
    _classCallCheck(this, MovingAverage);

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, {
      order: 10,
      zeroFill: true
    }, options);

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
    this.ringCount = 0;
  }

  _createClass(MovingAverage, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'initialize', this).call(this, inStreamParams);

      this.ringBuffer = new Float32Array(this.params.order * this.frameSize);

      if (this.frameSize > 1) this.sum = new Float32Array(this.frameSize);else this.sum = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      this.ringBuffer.fill(0);

      if (this.frameSize > 1) this.sum.fill(0);else this.sum = 0;

      this.ringIndex = 0;
      this.ringCount = 0;
    }
  }, {
    key: 'inputScalar',
    value: function inputScalar(value) {
      var ringIndex = this.ringIndex;
      var nextRingIndex = (ringIndex + 1) % order;
      var ringOffset = ringIndex;
      var nextRingOffset = nextRingIndex;
      var ringBuffer = this.ringBuffer;
      var order = this.params.order;
      var sum = this.sum;

      if (!this.params.zeroFill && this.ringCount < order) {
        this.ringCount++;
        order = this.ringCount;
      }

      sum -= ringBuffer[nextRingOffset + i];
      sum += value;

      this.sum = sum;
      this.ringBuffer[ringOffset + i] = value;
      this.ringIndex = nextRingIndex;

      return sum / order;
    }
  }, {
    key: 'inputArray',
    value: function inputArray(frame) {
      var outFrame = this.outFrame;
      var frameSize = this.streamParams.frameSize;
      var ringIndex = this.ringIndex;
      var nextRingIndex = (ringIndex + 1) % order;
      var ringOffset = ringIndex * frameSize;
      var nextRingOffset = nextRingIndex * frameSize;
      var ring = this.ringBuffer;
      var sum = this.sum;
      var order = this.params.order;

      if (!this.params.zeroFill && this.ringCount < order) {
        this.ringCount++;
        order = this.ringCount;
      }

      var scale = 1 / order;

      for (var _i = 0; _i < frameSize; _i++) {
        var value = frame[_i];
        var _sum = _sum[_i];

        _sum -= ringBuffer[nextRingOffset + _i];
        _sum += value;

        outFrame[_i] = _sum * scale;

        this.sum[_i] = _sum;
        this.ringBuffer[ringOffset + _i] = value;
      }

      this.ringIndex = nextRingIndex;

      return outFrame;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      if (this.frameSize > 1) this.inputArray(frame);else this.outFrame[0] = this.inputScalar(frame[0]);

      this.output(time, this.outFrame, metaData);
    }
  }]);

  return MovingAverage;
})(_coreBaseLfo2['default']);

exports['default'] = MovingAverage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQUtqQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEI7QUFDSixXQUFLLEVBQUUsRUFBRTtBQUNULGNBQVEsRUFBRSxJQUFJO0tBQ2YsRUFBRSxPQUFPLEVBQUU7O0FBRVosUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7R0FDcEI7O2VBWGtCLGFBQWE7O1dBYXRCLG9CQUFDLGNBQWMsRUFBRTtBQUN6QixpQ0FkaUIsYUFBYSw0Q0FjYixjQUFjLEVBQUU7O0FBRWpDLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV2RSxVQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUU1QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRUksaUJBQUc7QUFDTixpQ0F6QmlCLGFBQWEsdUNBeUJoQjs7QUFFZCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkIsVUFBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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QUFHLENBQUM7QUFDbEIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsRUFBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQ3pDOztBQUVELFVBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDOztBQUUvQixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUV2QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWhELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDNUM7OztTQXpHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9tb3ZpbmctYXZlcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vLyBOT1RFUzpcbi8vIC0gYWRkICdzeW1ldHJpY2FsJyBvcHRpb24gKGhvdyB0byBkZWFsIHdpdGggdmFsdWVzIGJldHdlZW4gZnJhbWVzID8pID9cbi8vIC0gY2FuIHdlIGltcHJvdmUgYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uID9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIG9yZGVyOiAxMCxcbiAgICAgIHplcm9GaWxsOiB0cnVlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdW0gPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICAgIHRoaXMucmluZ0NvdW50ID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5wYXJhbXMub3JkZXIgKiB0aGlzLmZyYW1lU2l6ZSk7XG5cbiAgICBpZih0aGlzLmZyYW1lU2l6ZSA+IDEpXG4gICAgICB0aGlzLnN1bSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5mcmFtZVNpemUpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc3VtID0gMDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIuZmlsbCgwKVxuXG4gICAgaWYodGhpcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0uZmlsbCgwKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnN1bSA9IDA7XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gICAgdGhpcy5yaW5nQ291bnQgPSAwO1xuICB9XG5cbiAgaW5wdXRTY2FsYXIodmFsdWUpIHtcbiAgICBjb25zdCByaW5nSW5kZXggPSB0aGlzLnJpbmdJbmRleDtcbiAgICBjb25zdCBuZXh0UmluZ0luZGV4ID0gKHJpbmdJbmRleCArIDEpICUgb3JkZXI7XG4gICAgY29uc3QgcmluZ09mZnNldCA9IHJpbmdJbmRleDtcbiAgICBjb25zdCBuZXh0UmluZ09mZnNldCA9IG5leHRSaW5nSW5kZXg7XG4gICAgY29uc3QgcmluZ0J1ZmZlciA9IHRoaXMucmluZ0J1ZmZlcjtcbiAgICBsZXQgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBsZXQgc3VtID0gdGhpcy5zdW07XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnplcm9GaWxsICYmIHRoaXMucmluZ0NvdW50IDwgb3JkZXIpIHtcbiAgICAgIHRoaXMucmluZ0NvdW50Kys7XG4gICAgICBvcmRlciA9IHRoaXMucmluZ0NvdW50O1xuICAgIH1cblxuICAgIHN1bSAtPSByaW5nQnVmZmVyW25leHRSaW5nT2Zmc2V0ICsgaV07XG4gICAgc3VtICs9IHZhbHVlO1xuXG4gICAgdGhpcy5zdW0gPSBzdW07XG4gICAgdGhpcy5yaW5nQnVmZmVyW3JpbmdPZmZzZXQgKyBpXSA9IHZhbHVlO1xuICAgIHRoaXMucmluZ0luZGV4ID0gbmV4dFJpbmdJbmRleDtcblxuICAgIHJldHVybiBzdW0gLyBvcmRlcjtcbiAgfVxuXG4gIGlucHV0QXJyYXkoZnJhbWUpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IG5leHRSaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcbiAgICBjb25zdCByaW5nT2Zmc2V0ID0gcmluZ0luZGV4ICogZnJhbWVTaXplO1xuICAgIGNvbnN0IG5leHRSaW5nT2Zmc2V0ID0gbmV4dFJpbmdJbmRleCAqIGZyYW1lU2l6ZTtcbiAgICBjb25zdCByaW5nID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGNvbnN0IHN1bSA9IHRoaXMuc3VtO1xuICAgIGxldCBvcmRlciA9IHRoaXMucGFyYW1zLm9yZGVyO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy56ZXJvRmlsbCAmJiB0aGlzLnJpbmdDb3VudCA8IG9yZGVyKSB7XG4gICAgICB0aGlzLnJpbmdDb3VudCsrO1xuICAgICAgb3JkZXIgPSB0aGlzLnJpbmdDb3VudDtcbiAgICB9XG5cbiAgICBjb25zdCBzY2FsZSA9IDEgLyBvcmRlcjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZnJhbWVbaV07XG4gICAgICBsZXQgc3VtID0gc3VtW2ldO1xuXG4gICAgICBzdW0gLT0gcmluZ0J1ZmZlcltuZXh0UmluZ09mZnNldCArIGldO1xuICAgICAgc3VtICs9IHZhbHVlO1xuXG4gICAgICBvdXRGcmFtZVtpXSA9IHN1bSAqIHNjYWxlO1xuXG4gICAgICB0aGlzLnN1bVtpXSA9IHN1bTtcbiAgICAgIHRoaXMucmluZ0J1ZmZlcltyaW5nT2Zmc2V0ICsgaV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IG5leHRSaW5nSW5kZXg7XG5cbiAgICByZXR1cm4gb3V0RnJhbWU7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGlmKHRoaXMuZnJhbWVTaXplID4gMSlcbiAgICAgIHRoaXMuaW5wdXRBcnJheShmcmFtZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5vdXRGcmFtZVswXSA9IHRoaXMuaW5wdXRTY2FsYXIoZnJhbWVbMF0pO1xuXG4gICAgdGhpcy5vdXRwdXQodGltZSwgdGhpcy5vdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG59XG4iXX0=