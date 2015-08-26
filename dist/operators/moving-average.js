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
      order: 10
    };

    _get(Object.getPrototypeOf(MovingAverage.prototype), 'constructor', this).call(this, options, defaults);

    this.sum = 0;
    this.counter = 0;
    this.stack = new Float32Array(this.params.order);
  }

  // streamParams should not change from parent

  _createClass(MovingAverage, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(MovingAverage.prototype), 'reset', this).call(this);

      for (var i = 0, l = this.stack.length; i < l; i++) {
        this.stack[i] = 0;
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

        this.sum -= this.stack[0];
        this.sum += current;
        outFrame[i] = this.sum / divisor;
        // outFrame[i] = this.sum / order;

        // maintain stack
        this.stack.set(this.stack.subarray(1), 0);
        this.stack[pushIndex] = current;
      }

      this.output(time, outFrame, metaData);
    }
  }]);

  return MovingAverage;
})(_coreBaseLfo2['default']);

exports['default'] = MovingAverage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7OztJQU1qQixhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLE9BQU8sRUFBRTswQkFERixhQUFhOztBQUU5QixRQUFNLFFBQVEsR0FBRztBQUNmLFdBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQzs7QUFFRiwrQkFOaUIsYUFBYSw2Q0FNeEIsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDYixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbEQ7Ozs7ZUFYa0IsYUFBYTs7V0FlM0IsaUJBQUc7QUFDTixpQ0FoQmlCLGFBQWEsdUNBZ0JoQjs7QUFFZCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqRCxZQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNuQjs7QUFFRCxVQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFVBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO0FBQzlDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN4QyxVQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFHekIsWUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRTtBQUN4QixjQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUNsQixpQkFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDeEIsTUFBTTtBQUNMLGlCQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ2pCOztBQUVELFlBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQztBQUNwQixnQkFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDOzs7O0FBSWpDLFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO09BQ2pDOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7O1NBdkRrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21vdmluZy1hdmVyYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuLy8gTk9URVM6XG4vLyAtIGFkZCAnc3ltZXRyaWNhbCcgb3B0aW9uIChob3cgdG8gZGVhbCB3aXRoIHZhbHVlcyBiZXR3ZWVuIGZyYW1lcyA/KSA/XG4vLyAtIGNhbiB3ZSBpbXByb3ZlIGFsZ29yaXRobSBpbXBsZW1lbnRhdGlvbiA/XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdBdmVyYWdlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9yZGVyOiAxMFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlcik7XG4gIH1cblxuICAvLyBzdHJlYW1QYXJhbXMgc2hvdWxkIG5vdCBjaGFuZ2UgZnJvbSBwYXJlbnRcblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnN0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5zdGFja1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBjb25zdCBwdXNoSW5kZXggPSB0aGlzLnBhcmFtcy5vcmRlciAtIDE7XG4gICAgbGV0IGRpdmlzb3I7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gZnJhbWVbaV07XG5cbiAgICAgIC8vIGlzIHRoaXMgbmVjZXNzYXJ5LCBvciBpcyBpdCBvdmVyaGVhZCA/XG4gICAgICBpZiAodGhpcy5jb3VudGVyIDwgb3JkZXIpIHtcbiAgICAgICAgdGhpcy5jb3VudGVyICs9IDE7XG4gICAgICAgIGRpdmlzb3IgPSB0aGlzLmNvdW50ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXZpc29yID0gb3JkZXI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3VtIC09IHRoaXMuc3RhY2tbMF07XG4gICAgICB0aGlzLnN1bSArPSBjdXJyZW50O1xuICAgICAgb3V0RnJhbWVbaV0gPSB0aGlzLnN1bSAvIGRpdmlzb3I7XG4gICAgICAvLyBvdXRGcmFtZVtpXSA9IHRoaXMuc3VtIC8gb3JkZXI7XG5cbiAgICAgIC8vIG1haW50YWluIHN0YWNrXG4gICAgICB0aGlzLnN0YWNrLnNldCh0aGlzLnN0YWNrLnN1YmFycmF5KDEpLCAwKTtcbiAgICAgIHRoaXMuc3RhY2tbcHVzaEluZGV4XSA9IGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXQodGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19