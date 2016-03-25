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

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _drawUtils = require('../utils/draw-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Waveform = function (_BaseDraw) {
  (0, _inherits3.default)(Waveform, _BaseDraw);

  function Waveform(options) {
    (0, _classCallCheck3.default)(this, Waveform);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Waveform).call(this, {
      color: (0, _drawUtils.getRandomColor)()
    }, options));
  }

  (0, _createClass3.default)(Waveform, [{
    key: 'drawCurve',
    value: function drawCurve(frame, previousFrame, iShift) {
      var ctx = this.ctx;
      var min = this.getYPosition(frame[0]);
      var max = this.getYPosition(frame[1]);

      ctx.save();

      ctx.fillStyle = this.params.color;
      ctx.beginPath();

      ctx.moveTo(0, this.getYPosition(0));
      ctx.lineTo(0, max);

      if (previousFrame) {
        var prevMin = this.getYPosition(previousFrame[0]);
        var prevMax = this.getYPosition(previousFrame[1]);
        ctx.lineTo(-iShift, prevMax);
        ctx.lineTo(-iShift, prevMin);
      }

      ctx.lineTo(0, min);

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }]);
  return Waveform;
}(_baseDraw2.default);

exports.default = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztJQUdxQjs7O0FBQ25CLFdBRG1CLFFBQ25CLENBQVksT0FBWixFQUFxQjt3Q0FERixVQUNFO3dGQURGLHFCQUVYO0FBQ0osYUFBTyxnQ0FBUDtPQUNDLFVBSGdCO0dBQXJCOzs2QkFEbUI7OzhCQU9ULE9BQU8sZUFBZSxRQUFRO0FBQ3RDLFVBQU0sTUFBTSxLQUFLLEdBQUwsQ0FEMEI7QUFFdEMsVUFBTSxNQUFNLEtBQUssWUFBTCxDQUFrQixNQUFNLENBQU4sQ0FBbEIsQ0FBTixDQUZnQztBQUd0QyxVQUFNLE1BQU0sS0FBSyxZQUFMLENBQWtCLE1BQU0sQ0FBTixDQUFsQixDQUFOLENBSGdDOztBQUt0QyxVQUFJLElBQUosR0FMc0M7O0FBT3RDLFVBQUksU0FBSixHQUFnQixLQUFLLE1BQUwsQ0FBWSxLQUFaLENBUHNCO0FBUXRDLFVBQUksU0FBSixHQVJzQzs7QUFVdEMsVUFBSSxNQUFKLENBQVcsQ0FBWCxFQUFjLEtBQUssWUFBTCxDQUFrQixDQUFsQixDQUFkLEVBVnNDO0FBV3RDLFVBQUksTUFBSixDQUFXLENBQVgsRUFBYyxHQUFkLEVBWHNDOztBQWF0QyxVQUFJLGFBQUosRUFBbUI7QUFDakIsWUFBTSxVQUFVLEtBQUssWUFBTCxDQUFrQixjQUFjLENBQWQsQ0FBbEIsQ0FBVixDQURXO0FBRWpCLFlBQU0sVUFBVSxLQUFLLFlBQUwsQ0FBa0IsY0FBYyxDQUFkLENBQWxCLENBQVYsQ0FGVztBQUdqQixZQUFJLE1BQUosQ0FBVyxDQUFDLE1BQUQsRUFBUyxPQUFwQixFQUhpQjtBQUlqQixZQUFJLE1BQUosQ0FBVyxDQUFDLE1BQUQsRUFBUyxPQUFwQixFQUppQjtPQUFuQjs7QUFPQSxVQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsR0FBZCxFQXBCc0M7O0FBc0J0QyxVQUFJLFNBQUosR0F0QnNDO0FBdUJ0QyxVQUFJLElBQUosR0F2QnNDO0FBd0J0QyxVQUFJLE9BQUosR0F4QnNDOzs7U0FQckIiLCJmaWxlIjoid2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMV0pO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubW92ZVRvKDAsIHRoaXMuZ2V0WVBvc2l0aW9uKDApKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMF0pO1xuICAgICAgY29uc3QgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMV0pO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIl19