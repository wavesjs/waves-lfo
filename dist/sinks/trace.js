'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Trace = (function (_BaseDraw) {
  _inherits(Trace, _BaseDraw);

  function Trace(options) {
    _classCallCheck(this, Trace);

    var defaults = {
      colorScheme: 'none', // color, opacity
      color: (0, _utilsDrawUtils.getRandomColor)()
    };

    _get(Object.getPrototypeOf(Trace.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Trace, [{
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var ctx = this.ctx;
      var color = undefined,
          gradient = undefined;

      var halfRange = frame[1] / 2;
      var mean = this.getYPosition(frame[0]);
      var min = this.getYPosition(frame[0] - halfRange);
      var max = this.getYPosition(frame[0] + halfRange);

      var prevHalfRange = undefined;
      var prevMin = undefined;
      var prevMax = undefined;

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

          if (prevFrame) gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(prevFrame[2]) + ', 100%, 50%)');else gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');

          gradient.addColorStop(1, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          var rgb = (0, _utilsDrawUtils.hexToRGB)(this.params.color);
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
})(_baseDraw2['default']);

exports['default'] = Trace;
;

module.exports = Trace;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUUsQ0FBQztLQUNmOzs7U0ExRWtCLEtBQUs7OztxQkFBTCxLQUFLO0FBMkV6QixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rcy90cmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciwgZ2V0SHVlLCBoZXhUb1JHQiB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZSBleHRlbmRzIEJhc2VEcmF3IHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvclNjaGVtZTogJ25vbmUnLCAvLyBjb2xvciwgb3BhY2l0eVxuICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBsZXQgY29sb3IsIGdyYWRpZW50O1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gZnJhbWVbMV0gLyAyO1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSk7XG4gICAgY29uc3QgbWluID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdICsgaGFsZlJhbmdlKTtcblxuICAgIGxldCBwcmV2SGFsZlJhbmdlO1xuICAgIGxldCBwcmV2TWluO1xuICAgIGxldCBwcmV2TWF4O1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgcHJldkhhbGZSYW5nZSA9IHByZXZGcmFtZVsxXSAvIDI7XG4gICAgICBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lWzBdIC0gcHJldkhhbGZSYW5nZSk7XG4gICAgICBwcmV2TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lWzBdICsgcHJldkhhbGZSYW5nZSk7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLnBhcmFtcy5jb2xvclNjaGVtZSkge1xuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaHVlJzpcbiAgICAgICAgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoLWlTaGlmdCwgMCwgMCwgMCk7XG5cbiAgICAgICAgaWYgKHByZXZGcmFtZSlcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ2hzbCgnICsgZ2V0SHVlKHByZXZGcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ2hzbCgnICsgZ2V0SHVlKGZyYW1lWzJdKSArICcsIDEwMCUsIDUwJSknKTtcblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ2hzbCgnICsgZ2V0SHVlKGZyYW1lWzJdKSArICcsIDEwMCUsIDUwJSknKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgY29uc3QgcmdiID0gaGV4VG9SR0IodGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgICBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKVxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgnICsgcmdiLmpvaW4oJywnKSArICcsJyArIHByZXZGcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgZnJhbWVbMl0gKyAnKScpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDAsIG1lYW4pO1xuICAgIGN0eC5saW5lVG8oMCwgbWF4KTtcblxuICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1heCk7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHByZXZNaW4pO1xuICAgIH1cblxuICAgIGN0eC5saW5lVG8oMCwgbWluKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2U7XG4iXX0=