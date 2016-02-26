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
      colorScheme: 'none' // color, opacity
    };

    _get(Object.getPrototypeOf(Trace.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Trace, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Trace.prototype), 'initialize', this).call(this);

      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Trace.prototype), 'process', this).call(this, time, frame);
    }
  }, {
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

          if (prevFrame) {
            gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(prevFrame[2]) + ', 100%, 50%)');
          } else {
            gradient.addColorStop(0, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          }

          gradient.addColorStop(1, 'hsl(' + (0, _utilsDrawUtils.getHue)(frame[2]) + ', 100%, 50%)');
          ctx.fillStyle = gradient;
          break;
        case 'opacity':
          var rgb = (0, _utilsDrawUtils.hexToRGB)(this.params.color);
          gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

          if (prevFrame) {
            gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + prevFrame[2] + ')');
          } else {
            gradient.addColorStop(0, 'rgba(' + rgb.join(',') + ',' + frame[2] + ')');
          }

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
//# sourceMappingURL=data:application/json;base64,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QUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsVUFBSSxTQUFTLEVBQUU7QUFDYixXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDOUI7O0FBRUQsU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkIsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVoQixTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZjs7O1NBdEZrQixLQUFLOzs7cUJBQUwsS0FBSztBQXVGekIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvc2lua3MvdHJhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IsIGdldEh1ZSwgaGV4VG9SR0IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2UgZXh0ZW5kcyBCYXNlRHJhdyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29sb3JTY2hlbWU6ICdub25lJyAvLyBjb2xvciwgb3BhY2l0eVxuICAgIH07XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgbGV0IGNvbG9yLCBncmFkaWVudDtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IGZyYW1lWzFdIC8gMjtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0pO1xuICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSArIGhhbGZSYW5nZSk7XG5cbiAgICBsZXQgcHJldkhhbGZSYW5nZTtcbiAgICBsZXQgcHJldk1pbjtcbiAgICBsZXQgcHJldk1heDtcblxuICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgIHByZXZIYWxmUmFuZ2UgPSBwcmV2RnJhbWVbMV0gLyAyO1xuICAgICAgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSAtIHByZXZIYWxmUmFuZ2UpO1xuICAgICAgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMuY29sb3JTY2hlbWUpIHtcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2h1ZSc6XG4gICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KC1pU2hpZnQsIDAsIDAsIDApO1xuXG4gICAgICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ2hzbCgnICsgZ2V0SHVlKHByZXZGcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdoc2woJyArIGdldEh1ZShmcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ2hzbCgnICsgZ2V0SHVlKGZyYW1lWzJdKSArICcsIDEwMCUsIDUwJSknKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgICAgY29uc3QgcmdiID0gaGV4VG9SR0IodGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgICBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgcHJldkZyYW1lWzJdICsgJyknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgbWVhbik7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiJdfQ==