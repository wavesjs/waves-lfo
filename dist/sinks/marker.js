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

var Marker = (function (_BaseDraw) {
  _inherits(Marker, _BaseDraw);

  function Marker(options) {
    _classCallCheck(this, Marker);

    var defaults = {
      frameSize: 1,
      color: (0, _utilsDrawUtils.getRandomColor)(),
      threshold: 0
    };

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, options, defaults);
  }

  _createClass(Marker, [{
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var color = this.params.color;
      var ctx = this.ctx;
      var height = ctx.height;

      var value = frame[0];

      if (value > this.params.threshold) {
        ctx.save();
        ctx.strokeStyle = this.params.color;
        ctx.beginPath();
        ctx.moveTo(-iShift, this.getYPosition(this.params.min));
        ctx.lineTo(-iShift, this.getYPosition(this.params.max));
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    }
  }]);

  return Marker;
})(_baseDraw2['default']);

exports['default'] = Marker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9tYXJrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFBcUIsYUFBYTs7Ozs4QkFDSCxxQkFBcUI7O0lBRy9CLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QixRQUFNLFFBQVEsR0FBRztBQUNmLGVBQVMsRUFBRSxDQUFDO0FBQ1osV0FBSyxFQUFFLHFDQUFnQjtBQUN2QixlQUFTLEVBQUUsQ0FBQztLQUNiLENBQUM7O0FBRUYsK0JBUmlCLE1BQU0sNkNBUWpCLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O2VBVGtCLE1BQU07O1dBV2hCLG1CQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckIsVUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7QUFFMUIsVUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNqQyxXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxXQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3BDLFdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsV0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2IsV0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNmO0tBQ0Y7OztTQTVCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiZXM2L3NpbmtzL21hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlRHJhdyBmcm9tICcuL2Jhc2UtZHJhdyc7XG5pbXBvcnQgeyBnZXRSYW5kb21Db2xvciB9IGZyb20gJy4uL3V0aWxzL2RyYXctdXRpbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgY29sb3I6IGdldFJhbmRvbUNvbG9yKCksXG4gICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGhlaWdodCA9IGN0eC5oZWlnaHQ7XG5cbiAgICBjb25zdCB2YWx1ZSA9IGZyYW1lWzBdO1xuXG4gICAgaWYgKHZhbHVlID4gdGhpcy5wYXJhbXMudGhyZXNob2xkKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIHRoaXMuZ2V0WVBvc2l0aW9uKHRoaXMucGFyYW1zLm1pbikpO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5tYXgpKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=