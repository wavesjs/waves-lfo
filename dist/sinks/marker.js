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

var Marker = (function (_BaseDraw) {
  _inherits(Marker, _BaseDraw);

  function Marker(options) {
    _classCallCheck(this, Marker);

    var defaults = {
      frameSize: 1,
      color: '#ffffff',
      threshold: 0
    };

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, options, defaults);

    console.log(this.params.color, options);
  }

  _createClass(Marker, [{
    key: 'process',
    value: function process(time, frame, metaData) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Marker.prototype), 'process', this).call(this, time, frame, metaData);
    }
  }, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rcy9tYXJrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFBcUIsYUFBYTs7OztJQUdiLE1BQU07WUFBTixNQUFNOztBQUNkLFdBRFEsTUFBTSxDQUNiLE9BQU8sRUFBRTswQkFERixNQUFNOztBQUV2QixRQUFNLFFBQVEsR0FBRztBQUNmLGVBQVMsRUFBRSxDQUFDO0FBQ1osV0FBSyxFQUFFLFNBQVM7QUFDaEIsZUFBUyxFQUFFLENBQUM7S0FDYixDQUFDOztBQUVGLCtCQVJpQixNQUFNLDZDQVFqQixPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUV6QixXQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3pDOztlQVhrQixNQUFNOztXQWFsQixpQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxpQ0FmaUIsTUFBTSx5Q0FlVCxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtLQUN0Qzs7O1dBRVEsbUJBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7QUFDbEMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDaEMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNyQixVQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztBQUUxQixVQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ2pDLFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDcEMsV0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RCxXQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDYixXQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEIsV0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2Y7S0FDRjs7O1NBbkNrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJlczYvc2lua3MvbWFya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXIgZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZyYW1lU2l6ZTogMSxcbiAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMucGFyYW1zLmNvbG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgaGVpZ2h0ID0gY3R4LmhlaWdodDtcblxuICAgIGNvbnN0IHZhbHVlID0gZnJhbWVbMF07XG5cbiAgICBpZiAodmFsdWUgPiB0aGlzLnBhcmFtcy50aHJlc2hvbGQpIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oLWlTaGlmdCwgdGhpcy5nZXRZUG9zaXRpb24odGhpcy5wYXJhbXMubWluKSk7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHRoaXMuZ2V0WVBvc2l0aW9uKHRoaXMucGFyYW1zLm1heCkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==