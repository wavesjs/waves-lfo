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

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var MovingAverage = (function (_BaseLfo) {
  _inherits(MovingAverage, _BaseLfo);

  function MovingAverage(options) {
    _classCallCheck(this, MovingAverage);

    var defaults = {
      order: 100
    };

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, options, defaults);

    this.sum = 0;
    this.counter = 0;
    this.queue = new Float32Array(this.params.order);
  }

  // streamParams should not change from parent

  _createClass(MovingAverage, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.queue.length; i < l; i++) {
        this.queue[i] = 0;
      }

      this.sum = 0;
      this.counter = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var outFrame = this.outFrame;
      var frameSize = this.streamParams.frameSize;
      var order = this.params.order;
      var pushIndex = this.params.order - 1;
      var divisor = undefined;

      for (var i = 0; i < frameSize; i++) {
        var current = frame[i];

        // is this necessary, or is it overhead ?
        if (this.counter < order) {
          this.counter += 1;
          divisor = this.counter;
        } else {
          divisor = order;
        }

        this.sum -= this.queue[0];
        this.sum += current;
        outFrame[i] = this.sum / divisor;
        // outFrame[i] = this.sum / order;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQU1qQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxHQUFHO0tBQ1gsQ0FBQzs7QUFFRiwrQkFOaUIsYUFBYSw2Q0FNeEIsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbEQ7Ozs7ZUFYa0IsYUFBYTs7V0FlM0IsaUJBQUc7QUFDTixpQ0FoQmlCLGFBQWEsdUNBZ0JoQjs7QUFFZCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqRCxZQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNuQjs7QUFFRCxVQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFVBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzlDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN4QyxVQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHekIsWUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRTtBQUN4QixjQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUNsQixpQkFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDeEIsTUFBTTtBQUNMLGlCQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ2pCOztBQUVELFlBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQztBQUNwQixnQkFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDOzs7O0FBSWpDLFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO09BQ2pDOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7O1NBdkRrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21vdmluZy1hdmVyYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuLy8gTk9URVM6XG4vLyAtIGFkZCAnc3ltZXRyaWNhbCcgb3B0aW9uIChob3cgdG8gZGVhbCB3aXRoIHZhbHVlcyBiZXR3ZWVuIGZyYW1lcyA/KSA/XG4vLyAtIGNhbiB3ZSBpbXByb3ZlIGFsZ29yaXRobSBpbXBsZW1lbnRhdGlvbiA/XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdBdmVyYWdlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9yZGVyOiAxMDBcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5wYXJhbXMub3JkZXIpO1xuICB9XG5cbiAgLy8gc3RyZWFtUGFyYW1zIHNob3VsZCBub3QgY2hhbmdlIGZyb20gcGFyZW50XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5xdWV1ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMucXVldWVbaV0gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuc3VtID0gMDtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCBvdXRGcmFtZSA9IHRoaXMub3V0RnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IG9yZGVyID0gdGhpcy5wYXJhbXMub3JkZXI7XG4gICAgY29uc3QgcHVzaEluZGV4ID0gdGhpcy5wYXJhbXMub3JkZXIgLSAxO1xuICAgIGxldCBkaXZpc29yO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgY29uc3QgY3VycmVudCA9IGZyYW1lW2ldO1xuXG4gICAgICAvLyBpcyB0aGlzIG5lY2Vzc2FyeSwgb3IgaXMgaXQgb3ZlcmhlYWQgP1xuICAgICAgaWYgKHRoaXMuY291bnRlciA8IG9yZGVyKSB7XG4gICAgICAgIHRoaXMuY291bnRlciArPSAxO1xuICAgICAgICBkaXZpc29yID0gdGhpcy5jb3VudGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGl2aXNvciA9IG9yZGVyO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN1bSAtPSB0aGlzLnF1ZXVlWzBdO1xuICAgICAgdGhpcy5zdW0gKz0gY3VycmVudDtcbiAgICAgIG91dEZyYW1lW2ldID0gdGhpcy5zdW0gLyBkaXZpc29yO1xuICAgICAgLy8gb3V0RnJhbWVbaV0gPSB0aGlzLnN1bSAvIG9yZGVyO1xuXG4gICAgICAvLyBtYWludGFpbiBzdGFja1xuICAgICAgdGhpcy5xdWV1ZS5zZXQodGhpcy5xdWV1ZS5zdWJhcnJheSgxKSwgMCk7XG4gICAgICB0aGlzLnF1ZXVlW3B1c2hJbmRleF0gPSBjdXJyZW50O1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0KHRpbWUsIG91dEZyYW1lLCBtZXRhRGF0YSk7XG4gIH1cbn1cbiJdfQ==