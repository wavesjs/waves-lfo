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

    var defaults = {
      order: 10,
      zeroFill: true
    };

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, options, defaults);

    this.sumBuffer = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
    this.ringCount = 0;
  }

  _createClass(MovingAverage, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'initialize', this).call(this);

      this.ringBuffer = new Float32Array(this.params.order * this.frameSize);
      this.sumBuffer = new Float32Array(this.frameSize);
    }

    // streamParams should stay the same ?

  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.ringBuffer.length; i < l; i++) {
        this.ringBuffer[i] = 0;
      }

      this.sum = 0;
      this.ringIndex = 0;
      this.ringCount = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = this.streamParams.frameSize;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var zeroFill = this.params.zeroFill;
      var ringIndex = this.ringIndex;
      var nextRingIndex = (ringIndex + 1) % order;
      var ringOffset = ringIndex * frameSize;
      var nextRingOffset = nextRingIndex * frameSize;
      var ringBuffer = this.ringBuffer;
      var sumBuffer = this.sumBuffer;
      var scale = undefined;

      if (!zeroFill && this.ringCount < order) {
        this.ringCount++;
        scale = 1 / this.ringCount;
      } else {
        scale = 1 / order;
      }

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];
        var sum = sumBuffer[i];

        sum -= ringBuffer[nextRingOffset + i];
        sum += current;

        outFrame[i] = sum * scale;

        this.sumBuffer[i] = sum;
        this.ringBuffer[ringOffset + i] = current;
      }

      this.ringIndex = nextRingIndex;

      this.output(time, outFrame, metaData);
    }
  }]);

  return MovingAverage;
})(_coreBaseLfo2['default']);

exports['default'] = MovingAverage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQUtqQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxFQUFFO0FBQ1QsY0FBUSxFQUFFLElBQUk7S0FDZixDQUFDOztBQUVGLCtCQVBpQixhQUFhLDZDQU94QixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuQixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztHQUNwQjs7ZUFia0IsYUFBYTs7V0FldEIsc0JBQUc7QUFDWCxpQ0FoQmlCLGFBQWEsNENBZ0JYOztBQUVuQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2RSxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNuRDs7Ozs7O1dBSUksaUJBQUc7QUFDTixpQ0F6QmlCLGFBQWEsdUNBeUJoQjs7QUFFZCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0RCxZQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN4Qjs7QUFFRCxVQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFVBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzlDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN4QyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUN0QyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pDLFVBQU0sYUFBYSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUM5QyxVQUFNLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3pDLFVBQU0sY0FBYyxHQUFHLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDakQsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNuQyxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ2pDLFVBQUksS0FBSyxZQUFBLENBQUM7O0FBRVYsVUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssRUFBRTtBQUN2QyxZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakIsYUFBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO09BQzVCLE1BQU07QUFDTCxhQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xDLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixZQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZCLFdBQUcsSUFBSSxVQUFVLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFdBQUcsSUFBSSxPQUFPLENBQUM7O0FBRWYsZ0JBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDOztBQUUxQixZQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN4QixZQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7T0FDM0M7O0FBRUQsVUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7O1NBekVrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21vdmluZy1hdmVyYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8vIE5PVEVTOlxuLy8gLSBhZGQgJ3N5bWV0cmljYWwnIG9wdGlvbiAoaG93IHRvIGRlYWwgd2l0aCB2YWx1ZXMgYmV0d2VlbiBmcmFtZXMgPykgP1xuLy8gLSBjYW4gd2UgaW1wcm92ZSBhbGdvcml0aG0gaW1wbGVtZW50YXRpb24gP1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW92aW5nQXZlcmFnZSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogMTAsXG4gICAgICB6ZXJvRmlsbDogdHJ1ZSxcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zdW1CdWZmZXIgPSBudWxsO1xuICAgIHRoaXMucmluZ0J1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5yaW5nSW5kZXggPSAwO1xuICAgIHRoaXMucmluZ0NvdW50ID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5yaW5nQnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlciAqIHRoaXMuZnJhbWVTaXplKTtcbiAgICB0aGlzLnN1bUJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gc3RyZWFtUGFyYW1zIHNob3VsZCBzdGF5IHRoZSBzYW1lID9cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJpbmdCdWZmZXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnJpbmdCdWZmZXJbaV0gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLnJpbmdJbmRleCA9IDA7XG4gICAgdGhpcy5yaW5nQ291bnQgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG4gICAgY29uc3QgcHVzaEluZGV4ID0gdGhpcy5wYXJhbXMub3JkZXIgLSAxO1xuICAgIGNvbnN0IHplcm9GaWxsID0gdGhpcy5wYXJhbXMuemVyb0ZpbGw7XG4gICAgY29uc3QgcmluZ0luZGV4ID0gdGhpcy5yaW5nSW5kZXg7XG4gICAgY29uc3QgbmV4dFJpbmdJbmRleCA9IChyaW5nSW5kZXggKyAxKSAlIG9yZGVyO1xuICAgIGNvbnN0IHJpbmdPZmZzZXQgPSByaW5nSW5kZXggKiBmcmFtZVNpemU7XG4gICAgY29uc3QgbmV4dFJpbmdPZmZzZXQgPSBuZXh0UmluZ0luZGV4ICogZnJhbWVTaXplO1xuICAgIGNvbnN0IHJpbmdCdWZmZXIgPSB0aGlzLnJpbmdCdWZmZXI7XG4gICAgY29uc3Qgc3VtQnVmZmVyID0gdGhpcy5zdW1CdWZmZXI7XG4gICAgbGV0IHNjYWxlO1xuXG4gICAgaWYgKCF6ZXJvRmlsbCAmJiB0aGlzLnJpbmdDb3VudCA8IG9yZGVyKSB7XG4gICAgICB0aGlzLnJpbmdDb3VudCsrO1xuICAgICAgc2NhbGUgPSAxIC8gdGhpcy5yaW5nQ291bnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjYWxlID0gMSAvIG9yZGVyO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBmcmFtZVtpXTtcbiAgICAgIGxldCBzdW0gPSBzdW1CdWZmZXJbaV07XG5cbiAgICAgIHN1bSAtPSByaW5nQnVmZmVyW25leHRSaW5nT2Zmc2V0ICsgaV07XG4gICAgICBzdW0gKz0gY3VycmVudDtcblxuICAgICAgb3V0RnJhbWVbaV0gPSBzdW0gKiBzY2FsZTtcblxuICAgICAgdGhpcy5zdW1CdWZmZXJbaV0gPSBzdW07XG4gICAgICB0aGlzLnJpbmdCdWZmZXJbcmluZ09mZnNldCArIGldID0gY3VycmVudDtcbiAgICB9XG5cbiAgICB0aGlzLnJpbmdJbmRleCA9IG5leHRSaW5nSW5kZXg7XG5cbiAgICB0aGlzLm91dHB1dCh0aW1lLCBvdXRGcmFtZSwgbWV0YURhdGEpO1xuICB9XG59XG4iXX0=