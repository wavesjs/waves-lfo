'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Operator = function (_BaseLfo) {
  (0, _inherits3.default)(Operator, _BaseLfo);

  function Operator(options) {
    (0, _classCallCheck3.default)(this, Operator);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Operator).call(this, options));

    _this.params.type = _this.params.type || 'scalar';

    if (_this.params.onProcess) {
      _this.callback = _this.params.onProcess.bind(_this);
    }
    return _this;
  }

  (0, _createClass3.default)(Operator, [{
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
}(_baseLfo2.default);

exports.default = Operator;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wZXJhdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQnFCOzs7QUFDbkIsV0FEbUIsUUFDbkIsQ0FBWSxPQUFaLEVBQXFCO3dDQURGLFVBQ0U7OzZGQURGLHFCQUVYLFVBRGE7O0FBR25CLFVBQUssTUFBTCxDQUFZLElBQVosR0FBbUIsTUFBSyxNQUFMLENBQVksSUFBWixJQUFvQixRQUFwQixDQUhBOztBQUtuQixRQUFJLE1BQUssTUFBTCxDQUFZLFNBQVosRUFBdUI7QUFDekIsWUFBSyxRQUFMLEdBQWdCLE1BQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsSUFBdEIsT0FBaEIsQ0FEeUI7S0FBM0I7aUJBTG1CO0dBQXJCOzs2QkFEbUI7O3NDQVdEO0FBQ2hCLFVBQUksS0FBSyxNQUFMLENBQVksSUFBWixLQUFxQixRQUFyQixJQUFpQyxLQUFLLE1BQUwsQ0FBWSxTQUFaLEVBQXVCO0FBQzFELGFBQUssWUFBTCxDQUFrQixTQUFsQixHQUE4QixLQUFLLE1BQUwsQ0FBWSxTQUFaLENBRDRCO09BQTVEOzs7OzRCQUtNLE1BQU0sT0FBTyxVQUFVOztBQUU3QixVQUFJLEtBQUssTUFBTCxDQUFZLElBQVosS0FBcUIsUUFBckIsRUFBK0I7QUFDakMsWUFBSSxVQUFVLEtBQUssUUFBTCxDQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsS0FBSyxRQUFMLENBQXJDLENBRDZCOztBQUdqQyxZQUFJLFlBQVksU0FBWixFQUF1QjtBQUN6QixpQkFBTyxPQUFQLENBRHlCO1NBQTNCO09BSEYsTUFNTztBQUNMLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE1BQU0sTUFBTixFQUFjLElBQUksQ0FBSixFQUFPLEdBQXpDLEVBQThDO0FBQzVDLGVBQUssUUFBTCxDQUFjLENBQWQsSUFBbUIsS0FBSyxRQUFMLENBQWMsTUFBTSxDQUFOLENBQWQsRUFBd0IsQ0FBeEIsQ0FBbkIsQ0FENEM7U0FBOUM7T0FQRjs7QUFZQSxXQUFLLElBQUwsR0FBWSxJQUFaLENBZDZCO0FBZTdCLFdBQUssUUFBTCxHQUFnQixRQUFoQixDQWY2Qjs7QUFpQjdCLFdBQUssTUFBTCxHQWpCNkI7OztTQWpCWjs7OztBQW9DcEIiLCJmaWxlIjoib3BlcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuLyoqXG4gKiBhcHBseSBhIGdpdmVuIGZ1bmN0aW9uIG9uIGVhY2ggZnJhbWVcbiAqXG4gKiBAU0lHTkFUVVJFIHNjYWxhciBjYWxsYmFja1xuICogZnVuY3Rpb24odmFsdWUsIGluZGV4LCBmcmFtZSkge1xuICogICByZXR1cm4gZG9Tb21ldGhpbmcodmFsdWUpXG4gKiB9XG4gKlxuICogQFNJR05BVFVSRSB2ZWN0b3IgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHRpbWUsIGluRnJhbWUsIG91dEZyYW1lKSB7XG4gKiAgIG91dEZyYW1lLnNldChpbkZyYW1lLCAwKTtcbiAqICAgcmV0dXJuIHRpbWUgKyAxO1xuICogfVxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3BlcmF0b3IgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5wYXJhbXMudHlwZSA9IHRoaXMucGFyYW1zLnR5cGUgfHzCoCdzY2FsYXInO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLm9uUHJvY2Vzcykge1xuICAgICAgdGhpcy5jYWxsYmFjayA9IHRoaXMucGFyYW1zLm9uUHJvY2Vzcy5iaW5kKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZVN0cmVhbSgpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMudHlwZSA9PT0gJ3ZlY3RvcicgJiYgdGhpcy5wYXJhbXMuZnJhbWVTaXplKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLnBhcmFtcy5mcmFtZVNpemU7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICAvLyBhcHBseSB0aGUgY2FsbGJhY2sgdG8gdGhlIGZyYW1lXG4gICAgaWYgKHRoaXMucGFyYW1zLnR5cGUgPT09ICd2ZWN0b3InKSB7XG4gICAgICB2YXIgb3V0VGltZSA9IHRoaXMuY2FsbGJhY2sodGltZSwgZnJhbWUsIHRoaXMub3V0RnJhbWUpO1xuXG4gICAgICBpZiAob3V0VGltZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRpbWUgPSBvdXRUaW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLm91dEZyYW1lW2ldID0gdGhpcy5jYWxsYmFjayhmcmFtZVtpXSwgaSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50aW1lID0gdGltZTtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59O1xuIl19