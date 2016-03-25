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

var Trace = function (_BaseDraw) {
  (0, _inherits3.default)(Trace, _BaseDraw);

  function Trace(options) {
    (0, _classCallCheck3.default)(this, Trace);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Trace).call(this, {
      colorScheme: 'none', // color, opacity
      color: (0, _drawUtils.getRandomColor)()
    }, options));
  }

  (0, _createClass3.default)(Trace, [{
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var ctx = this.ctx;
      var color = void 0,
          gradient = void 0;

      var halfRange = frame[1] / 2;
      var mean = this.getYPosition(frame[0]);
      var min = this.getYPosition(frame[0] - halfRange);
      var max = this.getYPosition(frame[0] + halfRange);

      var prevHalfRange = void 0;
      var prevMin = void 0;
      var prevMax = void 0;

      if (prevFrame) {
        prevHalfRange = prevFrame[1] / 2;
        prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
        prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
      }

      switch (this.params.colorScheme) {
        case 'none':
          ctx.fillStyle = this.params.color;
          break;
        case 'hue':
          gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

          if (prevFrame) gradient.addColorStop(0, 'hsl(' + (0, _drawUtils.getHue)(prevFrame[2]) + ', 100%, 50%)');else gradient.addColorStop(0, 'hsl(' + (0, _drawUtils.getHue)(frame[2]) + ', 100%, 50%)');

          gradient.addColorStop(1, 'hsl(' + (0, _drawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          var rgb = (0, _drawUtils.hexToRGB)(this.params.color);
          gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

          if (prevFrame) gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + prevFrame[2] + ')');else gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');

          gradient.addColorStop(1, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
          ctx.fillStyle = gradient;
          break;
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, mean);
      ctx.lineTo(0, max);

      if (prevFrame) {
        ctx.lineTo(-iShift, prevMax);
        ctx.lineTo(-iShift, prevMin);
      }

      ctx.lineTo(0, min);
      ctx.closePath();

      ctx.fill();
      ctx.restore();
    }
  }]);
  return Trace;
}(_baseDraw2.default);

exports.default = Trace;
;

module.exports = Trace;
//# sourceMappingURL=data:application/json;base64,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QyxNQUFNLENBQU4sQ0FBaEMsR0FBMkMsR0FBM0MsQ0FBekIsQ0FURjtBQVVFLGNBQUksU0FBSixHQUFnQixRQUFoQixDQVZGO0FBV0EsZ0JBWEE7QUFmRixPQW5Ca0M7O0FBZ0RsQyxVQUFJLElBQUosR0FoRGtDO0FBaURsQyxVQUFJLFNBQUosR0FqRGtDO0FBa0RsQyxVQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsSUFBZCxFQWxEa0M7QUFtRGxDLFVBQUksTUFBSixDQUFXLENBQVgsRUFBYyxHQUFkLEVBbkRrQzs7QUFxRGxDLFVBQUksU0FBSixFQUFlO0FBQ2IsWUFBSSxNQUFKLENBQVcsQ0FBQyxNQUFELEVBQVMsT0FBcEIsRUFEYTtBQUViLFlBQUksTUFBSixDQUFXLENBQUMsTUFBRCxFQUFTLE9BQXBCLEVBRmE7T0FBZjs7QUFLQSxVQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsR0FBZCxFQTFEa0M7QUEyRGxDLFVBQUksU0FBSixHQTNEa0M7O0FBNkRsQyxVQUFJLElBQUosR0E3RGtDO0FBOERsQyxVQUFJLE9BQUosR0E5RGtDOzs7U0FUakI7Ozs7QUF5RXBCOztBQUVELE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJ0cmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciwgZ2V0SHVlLCBoZXhUb1JHQiB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZSBleHRlbmRzIEJhc2VEcmF3IHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY29sb3JTY2hlbWU6ICdub25lJywgLy8gY29sb3IsIG9wYWNpdHlcbiAgICAgIGNvbG9yOiBnZXRSYW5kb21Db2xvcigpLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGxldCBjb2xvciwgZ3JhZGllbnQ7XG5cbiAgICBjb25zdCBoYWxmUmFuZ2UgPSBmcmFtZVsxXSAvIDI7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdKTtcbiAgICBjb25zdCBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSAtIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0gKyBoYWxmUmFuZ2UpO1xuXG4gICAgbGV0IHByZXZIYWxmUmFuZ2U7XG4gICAgbGV0IHByZXZNaW47XG4gICAgbGV0IHByZXZNYXg7XG5cbiAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICBwcmV2SGFsZlJhbmdlID0gcHJldkZyYW1lWzFdIC8gMjtcbiAgICAgIHByZXZNaW4gPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbMF0gLSBwcmV2SGFsZlJhbmdlKTtcbiAgICAgIHByZXZNYXggPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbMF0gKyBwcmV2SGFsZlJhbmdlKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMucGFyYW1zLmNvbG9yU2NoZW1lKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdodWUnOlxuICAgICAgICBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAnaHNsKCcgKyBnZXRIdWUocHJldkZyYW1lWzJdKSArICcsIDEwMCUsIDUwJSknKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAnaHNsKCcgKyBnZXRIdWUoZnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuXG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAnaHNsKCcgKyBnZXRIdWUoZnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgICBjb25zdCByZ2IgPSBoZXhUb1JHQih0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KC1pU2hpZnQsIDAsIDAsIDApO1xuXG4gICAgICAgIGlmIChwcmV2RnJhbWUpXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgcHJldkZyYW1lWzJdICsgJyknKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgnICsgcmdiLmpvaW4oJywnKSArICcsJyArIGZyYW1lWzJdICsgJyknKTtcblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgbWVhbik7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiJdfQ==