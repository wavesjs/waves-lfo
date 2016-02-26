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
 * Returns the min and max values from each frame
 */

var MinMax = (function (_BaseLfo) {
  _inherits(MinMax, _BaseLfo);

  function MinMax(options) {
    _classCallCheck(this, MinMax);

    _get(Object.getPrototypeOf(MinMax.prototype), 'constructor', this).call(this, options, {});
  }

  _createClass(MinMax, [{
    key: 'configureStream',
    value: function configureStream() {
      this.streamParams.frameSize = 2;
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var min = +Infinity;
      var max = -Infinity;

      for (var i = 0, l = frame.length; i < l; i++) {
        var value = frame[i];
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
      }

      this.time = time;
      this.outFrame[0] = min;
      this.outFrame[1] = max;
      this.metaData = metaData;

      this.output();
    }
  }]);

  return MinMax;
})(_coreBaseLfo2['default']);

exports['default'] = MinMax;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7Ozs7O0lBS2pCLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxFQUFFLEVBQUUsRUFBRTtHQUNwQjs7ZUFIa0IsTUFBTTs7V0FLViwyQkFBRztBQUNoQixVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7S0FDakM7OztXQUVNLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQzdCLFVBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3BCLFVBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDOztBQUVwQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixZQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFBRSxhQUFHLEdBQUcsS0FBSyxDQUFDO1NBQUU7QUFDakMsWUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQUUsYUFBRyxHQUFHLEtBQUssQ0FBQztTQUFFO09BQ2xDOztBQUVELFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBekJrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJlczYvb3BlcmF0b3JzL21pbi1tYXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtaW4gYW5kIG1heCB2YWx1ZXMgZnJvbSBlYWNoIGZyYW1lXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbk1heCBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucywge30pO1xuICB9XG5cbiAgY29uZmlndXJlU3RyZWFtKCkge1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IDI7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGxldCBtaW4gPSArSW5maW5pdHk7XG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZyYW1lW2ldO1xuICAgICAgaWYgKHZhbHVlIDwgbWluKSB7IG1pbiA9IHZhbHVlOyB9XG4gICAgICBpZiAodmFsdWUgPiBtYXgpIHsgbWF4ID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBtaW47XG4gICAgdGhpcy5vdXRGcmFtZVsxXSA9IG1heDtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG4iXX0=