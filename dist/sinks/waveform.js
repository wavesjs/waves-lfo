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

var Waveform = (function (_BaseDraw) {
  _inherits(Waveform, _BaseDraw);

  function Waveform(options) {
    _classCallCheck(this, Waveform);

    var defaults = {};
    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Waveform, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Waveform.prototype), 'initialize', this).call(this);

      if (!this.params.color) {
        this.params.color = (0, _utilsDrawUtils.getRandomColor)();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      // this._cache.push({ time, frame });
      _get(Object.getPrototypeOf(Waveform.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
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
})(_baseDraw2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy93YXZlZm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFxQixhQUFhOzs7OzhCQUNILHFCQUFxQjs7SUFHL0IsUUFBUTtZQUFSLFFBQVE7O0FBQ2hCLFdBRFEsUUFBUSxDQUNmLE9BQU8sRUFBRTswQkFERixRQUFROztBQUV6QixRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsK0JBSGlCLFFBQVEsNkNBR25CLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBSmtCLFFBQVE7O1dBTWpCLHNCQUFHO0FBQ1gsaUNBUGlCLFFBQVEsNENBT047O0FBRW5CLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLG9CQVp6QyxjQUFjLEdBWTJDLENBQUM7T0FBRTtLQUNsRTs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRWpDLGlDQWZpQixRQUFRLHlDQWVYLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0tBQ3RDOzs7V0FFUSxtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEMsU0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVYLFNBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDbEMsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVoQixTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFVBQUksYUFBYSxFQUFFO0FBQ2pCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDOUI7O0FBRUQsU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFNBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxTQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDZjs7O1NBM0NrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvc2lua3Mvd2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9yKSB7IHRoaXMucGFyYW1zLmNvbG9yID0gZ2V0UmFuZG9tQ29sb3IoKTsgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICAvLyB0aGlzLl9jYWNoZS5wdXNoKHsgdGltZSwgZnJhbWUgfSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSk7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMV0pO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubW92ZVRvKDAsIHRoaXMuZ2V0WVBvc2l0aW9uKDApKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMF0pO1xuICAgICAgY29uc3QgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMV0pO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIl19