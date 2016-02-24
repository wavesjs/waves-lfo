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

    this.sum = 0;
    this.counter = 0;
    this.queue = new Float32Array(this.params.order);
  }

  // streamParams should stay the same ?

  _createClass(MovingAverage, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.queue[i] = 0;
      }this.sum = 0;
      this.counter = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = this.streamParams.frameSize;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var zeroFill = this.params.zeroFill;
      var divisor = undefined;

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];

        this.sum -= this.queue[0];
        this.sum += current;

        if (!zeroFill) {
          if (this.counter < order) {
            this.counter += 1;
            divisor = this.counter;
          } else {
            divisor = order;
          }

          outFrame[i] = this.sum / divisor;
        } else {
          outFrame[i] = this.sum / order;
        }

        // maintain stack
        this.queue.set(this.queue.subarray(1), 0);
        this.queue[pushIndex] = current;
      }

      this.output(time, outFrame, metaData);
    }
  }]);

  return MovingAverage;
})(_coreBaseLfo2['default']);

exports['default'] = MovingAverage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQU1qQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxFQUFFO0FBQ1QsY0FBUSxFQUFFLElBQUk7S0FDZixDQUFDOztBQUVGLCtCQVBpQixhQUFhLDZDQU94QixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNsRDs7OztlQVprQixhQUFhOztXQWdCM0IsaUJBQUc7QUFDTixpQ0FqQmlCLGFBQWEsdUNBaUJoQjs7QUFFZCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7T0FBQSxBQUVwQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFVBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzlDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN4QyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUN0QyxVQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixZQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUM7O0FBRXBCLFlBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixjQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFO0FBQ3hCLGdCQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUNsQixtQkFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7V0FDeEIsTUFBTTtBQUNMLG1CQUFPLEdBQUcsS0FBSyxDQUFDO1dBQ2pCOztBQUVELGtCQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7U0FDbEMsTUFBTTtBQUNMLGtCQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7U0FDaEM7OztBQUdELFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO09BQ2pDOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7O1NBM0RrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21vdmluZy1hdmVyYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuLy8gTk9URVM6XG4vLyAtIGFkZCAnc3ltZXRyaWNhbCcgb3B0aW9uIChob3cgdG8gZGVhbCB3aXRoIHZhbHVlcyBiZXR3ZWVuIGZyYW1lcyA/KSA/XG4vLyAtIGNhbiB3ZSBpbXByb3ZlIGFsZ29yaXRobSBpbXBsZW1lbnRhdGlvbiA/XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdBdmVyYWdlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9yZGVyOiAxMCxcbiAgICAgIHplcm9GaWxsOiB0cnVlLFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLnF1ZXVlID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlcik7XG4gIH1cblxuICAvLyBzdHJlYW1QYXJhbXMgc2hvdWxkIHN0YXkgdGhlIHNhbWUgP1xuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucXVldWUubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5xdWV1ZVtpXSA9IDA7XG5cbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgY29uc3Qgb3V0RnJhbWUgPSB0aGlzLm91dEZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBvcmRlciA9IHRoaXMucGFyYW1zLm9yZGVyO1xuICAgIGNvbnN0IHB1c2hJbmRleCA9IHRoaXMucGFyYW1zLm9yZGVyIC0gMTtcbiAgICBjb25zdCB6ZXJvRmlsbCA9IHRoaXMucGFyYW1zLnplcm9GaWxsO1xuICAgIGxldCBkaXZpc29yO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgY3VycmVudCA9IGZyYW1lW2ldO1xuXG4gICAgICB0aGlzLnN1bSAtPSB0aGlzLnF1ZXVlWzBdO1xuICAgICAgdGhpcy5zdW0gKz0gY3VycmVudDtcblxuICAgICAgaWYgKCF6ZXJvRmlsbCkge1xuICAgICAgICBpZiAodGhpcy5jb3VudGVyIDwgb3JkZXIpIHtcbiAgICAgICAgICB0aGlzLmNvdW50ZXIgKz0gMTtcbiAgICAgICAgICBkaXZpc29yID0gdGhpcy5jb3VudGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpdmlzb3IgPSBvcmRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dEZyYW1lW2ldID0gdGhpcy5zdW0gLyBkaXZpc29yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0RnJhbWVbaV0gPSB0aGlzLnN1bSAvIG9yZGVyO1xuICAgICAgfVxuXG4gICAgICAvLyBtYWludGFpbiBzdGFja1xuICAgICAgdGhpcy5xdWV1ZS5zZXQodGhpcy5xdWV1ZS5zdWJhcnJheSgxKSwgMCk7XG4gICAgICB0aGlzLnF1ZXVlW3B1c2hJbmRleF0gPSBjdXJyZW50O1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0KHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==