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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7O0lBR2pCLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsT0FBTyxFQUFFOzBCQURGLGFBQWE7O0FBRTlCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsV0FBSyxFQUFFLEVBQUU7S0FDVixDQUFDOztBQUVGLCtCQU5pQixhQUFhLDZDQU14QixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixRQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNiLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNsRDs7OztlQVhrQixhQUFhOztXQWUzQixpQkFBRztBQUNOLGlDQWhCaUIsYUFBYSx1Q0FnQmhCOztBQUVkLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pELFlBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ25COztBQUVELFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsVUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7S0FDbEI7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7QUFDOUMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFVBQUksT0FBTyxZQUFBLENBQUM7O0FBRVosV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsQyxZQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUd6QixZQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFO0FBQ3hCLGNBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO0FBQ2xCLGlCQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QixNQUFNO0FBQ0wsaUJBQU8sR0FBRyxLQUFLLENBQUM7U0FDakI7O0FBRUQsWUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFlBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDO0FBQ3BCLGdCQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7Ozs7QUFJakMsWUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUM7T0FDakM7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDOzs7U0F2RGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6ImVzNi9vcGVyYXRvcnMvbW92aW5nLWF2ZXJhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZpbmdBdmVyYWdlIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9yZGVyOiAxMFxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnN1bSA9IDA7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLnN0YWNrID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBhcmFtcy5vcmRlcik7XG4gIH1cblxuICAvLyBzdHJlYW1QYXJhbXMgc2hvdWxkIG5vdCBjaGFuZ2UgZnJvbSBwYXJlbnRcblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnN0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5zdGFja1tpXSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5zdW0gPSAwO1xuICAgIHRoaXMuY291bnRlciA9IDA7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IG91dEZyYW1lID0gdGhpcy5vdXRGcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLnBhcmFtcy5vcmRlcjtcbiAgICBjb25zdCBwdXNoSW5kZXggPSB0aGlzLnBhcmFtcy5vcmRlciAtIDE7XG4gICAgbGV0IGRpdmlzb3I7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBjdXJyZW50ID0gZnJhbWVbaV07XG5cbiAgICAgIC8vIGlzIHRoaXMgbmVjZXNzYXJ5LCBvciBpcyBpdCBvdmVyaGVhZCA/XG4gICAgICBpZiAodGhpcy5jb3VudGVyIDwgb3JkZXIpIHtcbiAgICAgICAgdGhpcy5jb3VudGVyICs9IDE7XG4gICAgICAgIGRpdmlzb3IgPSB0aGlzLmNvdW50ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXZpc29yID0gb3JkZXI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3VtIC09IHRoaXMuc3RhY2tbMF07XG4gICAgICB0aGlzLnN1bSArPSBjdXJyZW50O1xuICAgICAgb3V0RnJhbWVbaV0gPSB0aGlzLnN1bSAvIGRpdmlzb3I7XG4gICAgICAvLyBvdXRGcmFtZVtpXSA9IHRoaXMuc3VtIC8gb3JkZXI7XG5cbiAgICAgIC8vIG1haW50YWluIHN0YWNrXG4gICAgICB0aGlzLnN0YWNrLnNldCh0aGlzLnN0YWNrLnN1YmFycmF5KDEpLCAwKTtcbiAgICAgIHRoaXMuc3RhY2tbcHVzaEluZGV4XSA9IGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5vdXRwdXQodGltZSwgb3V0RnJhbWUsIG1ldGFEYXRhKTtcbiAgfVxufVxuIl19