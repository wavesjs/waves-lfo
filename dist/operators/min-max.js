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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the min and max values from each frame
 */

var MinMax = function (_BaseLfo) {
  (0, _inherits3.default)(MinMax, _BaseLfo);

  function MinMax(options) {
    (0, _classCallCheck3.default)(this, MinMax);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MinMax).call(this, options));
  }

  (0, _createClass3.default)(MinMax, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(MinMax.prototype), 'initialize', this).call(this, inStreamParams, {
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
}(_baseLfo2.default);

exports.default = MinMax;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1pbi1tYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7SUFLcUI7OztBQUNuQixXQURtQixNQUNuQixDQUFZLE9BQVosRUFBcUI7d0NBREYsUUFDRTt3RkFERixtQkFFWCxVQURhO0dBQXJCOzs2QkFEbUI7OytCQUtSLGdCQUFnQjtBQUN6Qix1REFOaUIsa0RBTUEsZ0JBQWdCO0FBQy9CLG1CQUFXLENBQVg7UUFERixDQUR5Qjs7Ozs0QkFNbkIsTUFBTSxPQUFPLFVBQVU7QUFDN0IsVUFBSSxNQUFNLENBQUMsUUFBRCxDQURtQjtBQUU3QixVQUFJLE1BQU0sQ0FBQyxRQUFELENBRm1COztBQUk3QixXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxNQUFNLE1BQU4sRUFBYyxJQUFJLENBQUosRUFBTyxHQUF6QyxFQUE4QztBQUM1QyxZQUFNLFFBQVEsTUFBTSxDQUFOLENBQVIsQ0FEc0M7QUFFNUMsWUFBSSxRQUFRLEdBQVIsRUFBYTtBQUFFLGdCQUFNLEtBQU4sQ0FBRjtTQUFqQjtBQUNBLFlBQUksUUFBUSxHQUFSLEVBQWE7QUFBRSxnQkFBTSxLQUFOLENBQUY7U0FBakI7T0FIRjs7QUFNQSxXQUFLLElBQUwsR0FBWSxJQUFaLENBVjZCO0FBVzdCLFdBQUssUUFBTCxDQUFjLENBQWQsSUFBbUIsR0FBbkIsQ0FYNkI7QUFZN0IsV0FBSyxRQUFMLENBQWMsQ0FBZCxJQUFtQixHQUFuQixDQVo2QjtBQWE3QixXQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FiNkI7O0FBZTdCLFdBQUssTUFBTCxHQWY2Qjs7O1NBWFoiLCJmaWxlIjoibWluLW1heC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbiBhbmQgbWF4IHZhbHVlcyBmcm9tIGVhY2ggZnJhbWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluTWF4IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zLCB7XG4gICAgICBmcmFtZVNpemU6IDIsXG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGxldCBtaW4gPSArSW5maW5pdHk7XG4gICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZyYW1lW2ldO1xuICAgICAgaWYgKHZhbHVlIDwgbWluKSB7IG1pbiA9IHZhbHVlOyB9XG4gICAgICBpZiAodmFsdWUgPiBtYXgpIHsgbWF4ID0gdmFsdWU7IH1cbiAgICB9XG5cbiAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgIHRoaXMub3V0RnJhbWVbMF0gPSBtaW47XG4gICAgdGhpcy5vdXRGcmFtZVsxXSA9IG1heDtcbiAgICB0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cbiAgICB0aGlzLm91dHB1dCgpO1xuICB9XG59XG4iXX0=