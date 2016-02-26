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

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, options, {
      order: 10,
      zeroFill: true
    });

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
    this.ringCount = 0;
  }

  _createClass(MovingAverage, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'initialize', this).call(this);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQUtqQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEIsT0FBTyxFQUFFO0FBQ2IsV0FBSyxFQUFFLEVBQUU7QUFDVCxjQUFRLEVBQUUsSUFBSTtLQUNmLEVBQUU7O0FBRUgsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7R0FDcEI7O2VBWGtCLGFBQWE7O1dBYXRCLHNCQUFHO0FBQ1gsaUNBZGlCLGFBQWEsNENBY1g7O0FBRW5CLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUV2RSxVQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUU1QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRUksaUJBQUc7QUFDTixpQ0F6QmlCLGFBQWEsdUNBeUJoQjs7QUFFZCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkIsVUFBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FFakIsSUFBSSxD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QUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsRUFBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQ3pDOztBQUVELFVBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDOztBQUUvQixhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUV2QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWhELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDNUM7OztTQXpHa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9tb3ZpbmctYXZlcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vLyBOT1RFUzpcbi8vIC0gYWRkICdzeW1ldHJpY2FsJyBvcHRpb24gKGhvdyB0byBkZWFsIHdpdGggdmFsdWVzIGJldHdlZW4gZnJhbWVzID8pID9cbi8vIC0gY2FuIHdlIGltcHJvdmUgYWxnb3JpdGhtIGltcGxlbWVudGF0aW9uID9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdmluZ0F2ZXJhZ2UgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMsIHtcbiAgICAgIG9yZGVyOiAxMCxcbiAgICAgIHplcm9GaWxsOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zdW0gPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICAgIHRoaXMucmluZ0NvdW50ID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlciAqIHRoaXMuZnJhbWVTaXplKTtcblxuICAgIGlmKHRoaXMuZnJhbWVTaXplID4gMSlcbiAgICAgIHRoaXMuc3VtID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlci5maWxsKDApXG5cbiAgICBpZih0aGlzLmZyYW1lU2l6ZSA+IDEpXG4gICAgICB0aGlzLnN1bS5maWxsKDApO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc3VtID0gMDtcblxuICAgIHRoaXMucmluZ0luZGV4ID0gMDtcbiAgICB0aGlzLnJpbmdDb3VudCA9IDA7XG4gIH1cblxuICBpbnB1dFNjYWxhcih2YWx1ZSkge1xuICAgIGNvbnN0IHJpbmdJbmRleCA9IHRoaXMucmluZ0luZGV4O1xuICAgIGNvbnN0IG5leHRSaW5nSW5kZXggPSAocmluZ0luZGV4ICsgMSkgJSBvcmRlcjtcbiAgICBjb25zdCByaW5nT2Zmc2V0ID0gcmluZ0luZGV4O1xuICAgIGNvbnN0IG5leHRSaW5nT2Zmc2V0ID0gbmV4dFJpbmdJbmRleDtcbiAgICBjb25zdCByaW5nQnVmZmVyID0gdGhpcy5yaW5nQnVmZmVyO1xuICAgIGxldCBvcmRlciA9IHRoaXMucGFyYW1zLm9yZGVyO1xuICAgIGxldCBzdW0gPSB0aGlzLnN1bTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuemVyb0ZpbGwgJiYgdGhpcy5yaW5nQ291bnQgPCBvcmRlcikge1xuICAgICAgdGhpcy5yaW5nQ291bnQrKztcbiAgICAgIG9yZGVyID0gdGhpcy5yaW5nQ291bnQ7XG4gICAgfVxuXG4gICAgc3VtIC09IHJpbmdCdWZmZXJbbmV4dFJpbmdPZmZzZXQgKyBpXTtcbiAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICB0aGlzLnN1bSA9IHN1bTtcbiAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ09mZnNldCArIGldID0gdmFsdWU7XG4gICAgdGhpcy5yaW5nSW5kZXggPSBuZXh0UmluZ0luZGV4O1xuXG4gICAgcmV0dXJuIHN1bSAvIG9yZGVyO1xuICB9XG5cbiAgaW5wdXRBcnJheShmcmFtZSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgbmV4dFJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuICAgIGNvbnN0IHJpbmdPZmZzZXQgPSByaW5nSW5kZXggKiBmcmFtZVNpemU7XG4gICAgY29uc3QgbmV4dFJpbmdPZmZzZXQgPSBuZXh0UmluZ0luZGV4ICogZnJhbWVTaXplO1xuICAgIGNvbnN0IHJpbmcgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3Qgc3VtID0gdGhpcy5zdW07XG4gICAgbGV0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnplcm9GaWxsICYmIHRoaXMucmluZ0NvdW50IDwgb3JkZXIpIHtcbiAgICAgIHRoaXMucmluZ0NvdW50Kys7XG4gICAgICBvcmRlciA9IHRoaXMucmluZ0NvdW50O1xuICAgIH1cblxuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBmcmFtZVtpXTtcbiAgICAgIGxldCBzdW0gPSBzdW1baV07XG5cbiAgICAgIHN1bSAtPSByaW5nQnVmZmVyW25leHRSaW5nT2Zmc2V0ICsgaV07XG4gICAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICAgIG91dEZyYW1lW2ldID0gc3VtICogc2NhbGU7XG5cbiAgICAgIHRoaXMuc3VtW2ldID0gc3VtO1xuICAgICAgdGhpcy5yaW5nQnVmZmVyW3JpbmdPZmZzZXQgKyBpXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gbmV4dFJpbmdJbmRleDtcblxuICAgIHJldHVybiBvdXRGcmFtZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYodGhpcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5pbnB1dEFycmF5KGZyYW1lKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLm91dEZyYW1lWzBdID0gdGhpcy5pbnB1dFNjYWxhcihmcmFtZVswXSk7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==