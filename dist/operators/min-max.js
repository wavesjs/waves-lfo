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

    _get(Object.getPrototypeOf(MinMax.prototype), 'constructor', this).call(this, options);
  }

  _createClass(MinMax, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(MinMax.prototype), 'initialize', this).call(this, inStreamParams, {
        frameSize: 2
      });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9vcGVyYXRvcnMvbWluLW1heC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixrQkFBa0I7Ozs7Ozs7O0lBS2pCLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakIsT0FBTyxFQUFFO0dBQ2hCOztlQUhrQixNQUFNOztXQUtmLG9CQUFDLGNBQWMsRUFBRTtBQUN6QixpQ0FOaUIsTUFBTSw0Q0FNTixjQUFjLEVBQUU7QUFDL0IsaUJBQVMsRUFBRSxDQUFDO09BQ2IsRUFBRTtLQUNKOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwQixVQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFFcEIsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM1QyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsWUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQUUsYUFBRyxHQUFHLEtBQUssQ0FBQztTQUFFO0FBQ2pDLFlBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUFFLGFBQUcsR0FBRyxLQUFLLENBQUM7U0FBRTtPQUNsQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixVQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN2QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQTNCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L29wZXJhdG9ycy9taW4tbWF4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWluIGFuZCBtYXggdmFsdWVzIGZyb20gZWFjaCBmcmFtZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaW5NYXggZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcykge1xuICAgIHN1cGVyLmluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMsIHtcbiAgICAgIGZyYW1lU2l6ZTogMixcbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgbGV0IG1pbiA9ICtJbmZpbml0eTtcbiAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gZnJhbWVbaV07XG4gICAgICBpZiAodmFsdWUgPCBtaW4pIHsgbWluID0gdmFsdWU7IH1cbiAgICAgIGlmICh2YWx1ZSA+IG1heCkgeyBtYXggPSB2YWx1ZTsgfVxuICAgIH1cblxuICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgdGhpcy5vdXRGcmFtZVswXSA9IG1pbjtcbiAgICB0aGlzLm91dEZyYW1lWzFdID0gbWF4O1xuICAgIHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblxuICAgIHRoaXMub3V0cHV0KCk7XG4gIH1cbn1cbiJdfQ==