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

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, {
      frameSize: 1,
      color: (0, _utilsDrawUtils.getRandomColor)(),
      threshold: 0
    }, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9tYXJrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFBcUIsYUFBYTs7Ozs4QkFDSCxxQkFBcUI7O0lBRy9CLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QiwrQkFGaUIsTUFBTSw2Q0FFakI7QUFDSixlQUFTLEVBQUUsQ0FBQztBQUNaLFdBQUssRUFBRSxxQ0FBZ0I7QUFDdkIsZUFBUyxFQUFFLENBQUM7S0FDYixFQUFFLE9BQU8sRUFBRTtHQUNiOztlQVBrQixNQUFNOztXQVNoQixtQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNoQyxVQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLFVBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0FBRTFCLFVBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDakMsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsV0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNwQyxXQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RCxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNiLFdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDZjtLQUNGOzs7U0ExQmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6ImVzNi9zaW5rcy9tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZURyYXcgZnJvbSAnLi9iYXNlLWRyYXcnO1xuaW1wb3J0IHsgZ2V0UmFuZG9tQ29sb3IgfSBmcm9tICcuLi91dGlscy9kcmF3LXV0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXIgZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBjb2xvcjogZ2V0UmFuZG9tQ29sb3IoKSxcbiAgICAgIHRocmVzaG9sZDogMCxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGhlaWdodCA9IGN0eC5oZWlnaHQ7XG5cbiAgICBjb25zdCB2YWx1ZSA9IGZyYW1lWzBdO1xuXG4gICAgaWYgKHZhbHVlID4gdGhpcy5wYXJhbXMudGhyZXNob2xkKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIHRoaXMuZ2V0WVBvc2l0aW9uKHRoaXMucGFyYW1zLm1pbikpO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCB0aGlzLmdldFlQb3NpdGlvbih0aGlzLnBhcmFtcy5tYXgpKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=