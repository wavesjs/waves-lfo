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

      this.ringBuffer = new Float32Array(this.params.order * this.streamParams.frameSize);

      if (this.streamParams.frameSize > 1) this.sum = new Float32Array(this.streamParams.frameSize);else this.sum = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      this.ringBuffer.fill(0);

      if (this.streamParams.frameSize > 1) this.sum.fill(0);else this.sum = 0;

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

      sum -= ringBuffer[nextRingOffset];
      sum += value;

      this.sum = sum;
      this.ringBuffer[ringOffset] = value;
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

      for (var i = 0; i < frameSize; i++) {
        var value = frame[i];
        var _sum = _sum[i];

        _sum -= ringBuffer[nextRingOffset + i];
        _sum += value;

        outFrame[i] = _sum * scale;

        this.sum[i] = _sum;
        this.ringBuffer[ringOffset + i] = value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQUtqQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QiwrQkFGaUIsYUFBYSw2Q0FFeEIsT0FBTyxFQUFFO0FBQ2IsV0FBSyxFQUFFLEVBQUU7QUFDVCxjQUFRLEVBQUUsSUFBSTtLQUNmLEVBQUU7O0FBRUgsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7R0FDcEI7O2VBWGtCLGFBQWE7O1dBYXRCLHNCQUFHO0FBQ1gsaUNBZGlCLGFBQWEsNENBY1g7O0FBRW5CLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFcEYsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUV6RCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRUksaUJBQUc7QUFDTixpQ0F6QmlCLGFBQWEsdUNBeUJoQjs7QUFFZCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkIsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQ2pDLElBQUksQ0FBQyxHQUFHLENB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QUcsQ0FBQztBQUNsQixZQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7T0FDekM7O0FBRUQsVUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7O0FBRS9CLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBRXZCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM1Qzs7O1NBekdrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21vdmluZy1hdmVyYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8vIE5PVEVTOlxuLy8gLSBhZGQgJ3N5bWV0cmljYWwnIG9wdGlvbiAoaG93IHRvIGRlYWwgd2l0aCB2YWx1ZXMgYmV0d2VlbiBmcmFtZXMgPykgP1xuLy8gLSBjYW4gd2UgaW1wcm92ZSBhbGdvcml0aG0gaW1wbGVtZW50YXRpb24gP1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW92aW5nQXZlcmFnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucywge1xuICAgICAgb3JkZXI6IDEwLFxuICAgICAgemVyb0ZpbGw6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1bSA9IG51bGw7XG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gICAgdGhpcy5yaW5nQ291bnQgPSAwO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnJpbmdCdWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucGFyYW1zLm9yZGVyICogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5zdW0gPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIHRoaXMucmluZ0J1ZmZlci5maWxsKDApXG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID4gMSlcbiAgICAgIHRoaXMuc3VtLmZpbGwoMCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zdW0gPSAwO1xuXG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICAgIHRoaXMucmluZ0NvdW50ID0gMDtcbiAgfVxuXG4gIGlucHV0U2NhbGFyKHZhbHVlKSB7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgbmV4dFJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuICAgIGNvbnN0IHJpbmdPZmZzZXQgPSByaW5nSW5kZXg7XG4gICAgY29uc3QgbmV4dFJpbmdPZmZzZXQgPSBuZXh0UmluZ0luZGV4O1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgbGV0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG4gICAgbGV0IHN1bSA9IHRoaXMuc3VtO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy56ZXJvRmlsbCAmJiB0aGlzLnJpbmdDb3VudCA8IG9yZGVyKSB7XG4gICAgICB0aGlzLnJpbmdDb3VudCsrO1xuICAgICAgb3JkZXIgPSB0aGlzLnJpbmdDb3VudDtcbiAgICB9XG5cbiAgICBzdW0gLT0gcmluZ0J1ZmZlcltuZXh0UmluZ09mZnNldF07XG4gICAgc3VtICs9IHZhbHVlO1xuXG4gICAgdGhpcy5zdW0gPSBzdW07XG4gICAgdGhpcy5yaW5nQnVmZmVyW3JpbmdPZmZzZXRdID0gdmFsdWU7XG4gICAgdGhpcy5yaW5nSW5kZXggPSBuZXh0UmluZ0luZGV4O1xuXG4gICAgcmV0dXJuIHN1bSAvIG9yZGVyO1xuICB9XG5cbiAgaW5wdXRBcnJheShmcmFtZSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgbmV4dFJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuICAgIGNvbnN0IHJpbmdPZmZzZXQgPSByaW5nSW5kZXggKiBmcmFtZVNpemU7XG4gICAgY29uc3QgbmV4dFJpbmdPZmZzZXQgPSBuZXh0UmluZ0luZGV4ICogZnJhbWVTaXplO1xuICAgIGNvbnN0IHJpbmcgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3Qgc3VtID0gdGhpcy5zdW07XG4gICAgbGV0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLnplcm9GaWxsICYmIHRoaXMucmluZ0NvdW50IDwgb3JkZXIpIHtcbiAgICAgIHRoaXMucmluZ0NvdW50Kys7XG4gICAgICBvcmRlciA9IHRoaXMucmluZ0NvdW50O1xuICAgIH1cblxuICAgIGNvbnN0IHNjYWxlID0gMSAvIG9yZGVyO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgdmFsdWUgPSBmcmFtZVtpXTtcbiAgICAgIGxldCBzdW0gPSBzdW1baV07XG5cbiAgICAgIHN1bSAtPSByaW5nQnVmZmVyW25leHRSaW5nT2Zmc2V0ICsgaV07XG4gICAgICBzdW0gKz0gdmFsdWU7XG5cbiAgICAgIG91dEZyYW1lW2ldID0gc3VtICogc2NhbGU7XG5cbiAgICAgIHRoaXMuc3VtW2ldID0gc3VtO1xuICAgICAgdGhpcy5yaW5nQnVmZmVyW3JpbmdPZmZzZXQgKyBpXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMucmluZ0luZGV4ID0gbmV4dFJpbmdJbmRleDtcblxuICAgIHJldHVybiBvdXRGcmFtZTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgaWYodGhpcy5mcmFtZVNpemUgPiAxKVxuICAgICAgdGhpcy5pbnB1dEFycmF5KGZyYW1lKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLm91dEZyYW1lWzBdID0gdGhpcy5pbnB1dFNjYWxhcihmcmFtZVswXSk7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCB0aGlzLm91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==