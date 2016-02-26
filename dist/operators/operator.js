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

/**
 * apply a given function on each frame
 *
 * @SIGNATURE scalar callback
 * function(value, index, frame) {
 *   return doSomething(value)
 * }
 *
 * @SIGNATURE vector callback
 * function(time, inFrame, outFrame) {
 *   outFrame.set(inFrame, 0);
 *   return time + 1;
 * }
 *
 */

var Operator = (function (_BaseLfo) {
  _inherits(Operator, _BaseLfo);

  function Operator(options) {
    _classCallCheck(this, Operator);

    _get(Object.getPrototypeOf(Operator.prototype), 'constructor', this).call(this, options);

    this.params.type = this.params.type || 'scalar';

    if (this.params.onProcess) {
      this.callback = this.params.onProcess.bind(this);
    }
  }

  _createClass(Operator, [{
    key: 'configureStream',
    value: function configureStream() {
      if (this.params.type === 'vector' && this.params.frameSize) {
        this.streamParams.frameSize = this.params.frameSize;
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      // apply the callback to the frame
      if (this.params.type === 'vector') {
        var outTime = this.callback(time, frame, this.outFrame);

        if (outTime !== undefined) {
          time = outTime;
        }
      } else {
        for (var i = 0, l = frame.length; i < l; i++) {
          this.outFrame[i] = this.callback(frame[i], i);
        }
      }

      this.time = time;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return Operator;
})(_coreBaseLfo2['default']);

exports['default'] = Operator;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvb3BlcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0Isa0JBQWtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWlCakIsUUFBUTtZQUFSLFFBQVE7O0FBQ2hCLFdBRFEsUUFBUSxDQUNmLE9BQU8sRUFBRTswQkFERixRQUFROztBQUV6QiwrQkFGaUIsUUFBUSw2Q0FFbkIsT0FBTyxFQUFFOztBQUVmLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQzs7QUFFaEQsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUN6QixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsRDtHQUNGOztlQVRrQixRQUFROztXQVdaLDJCQUFHO0FBQ2hCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQzFELFlBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO09BQ3JEO0tBQ0Y7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFOztBQUU3QixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNqQyxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV4RCxZQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7QUFDekIsY0FBSSxHQUFHLE9BQU8sQ0FBQztTQUNoQjtPQUNGLE1BQU07QUFDTCxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0M7T0FDRjs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQW5Da0IsUUFBUTs7O3FCQUFSLFFBQVE7QUFvQzVCLENBQUMiLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9vcGVyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vKipcbiAqIGFwcGx5IGEgZ2l2ZW4gZnVuY3Rpb24gb24gZWFjaCBmcmFtZVxuICpcbiAqIEBTSUdOQVRVUkUgc2NhbGFyIGNhbGxiYWNrXG4gKiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGZyYW1lKSB7XG4gKiAgIHJldHVybiBkb1NvbWV0aGluZyh2YWx1ZSlcbiAqIH1cbiAqXG4gKiBAU0lHTkFUVVJFIHZlY3RvciBjYWxsYmFja1xuICogZnVuY3Rpb24odGltZSwgaW5GcmFtZSwgb3V0RnJhbWUpIHtcbiAqICAgb3V0RnJhbWUuc2V0KGluRnJhbWUsIDApO1xuICogICByZXR1cm4gdGltZSArIDE7XG4gKiB9XG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcGVyYXRvciBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICB0aGlzLnBhcmFtcy50eXBlID0gdGhpcy5wYXJhbXMudHlwZSB8fMKgJ3NjYWxhcic7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMub25Qcm9jZXNzKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrID0gdGhpcy5wYXJhbXMub25Qcm9jZXNzLmJpbmQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnBhcmFtcy50eXBlID09PSAndmVjdG9yJyAmJiB0aGlzLnBhcmFtcy5mcmFtZVNpemUpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMucGFyYW1zLmZyYW1lU2l6ZTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIC8vIGFwcGx5IHRoZSBjYWxsYmFjayB0byB0aGUgZnJhbWVcbiAgICBpZiAodGhpcy5wYXJhbXMudHlwZSA9PT0gJ3ZlY3RvcicpIHtcbiAgICAgIHZhciBvdXRUaW1lID0gdGhpcy5jYWxsYmFjayh0aW1lLCBmcmFtZSwgdGhpcy5vdXRGcmFtZSk7XG5cbiAgICAgIGlmIChvdXRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGltZSA9IG91dFRpbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMub3V0RnJhbWVbaV0gPSB0aGlzLmNhbGxiYWNrKGZyYW1lW2ldLCBpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn07XG4iXX0=