'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var BaseDraw = require('./base-draw');

var _require = require('../utils/draw-utils');

var getRandomColor = _require.getRandomColor;

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
        this.params.color = getRandomColor();
      }
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      this.scrollModeDraw(time, frame);
      _get(Object.getPrototypeOf(Waveform.prototype), 'process', this).call(this, time, frame);
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
})(BaseDraw);

module.exports = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3dhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7ZUFDYixPQUFPLENBQUMscUJBQXFCLENBQUM7O0lBQWpELGNBQWMsWUFBZCxjQUFjOztJQUVkLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxDQUNBLE9BQU8sRUFBRTswQkFEakIsUUFBUTs7QUFFVixRQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRWxCLCtCQUpFLFFBQVEsNkNBSUosT0FBTyxFQUFFLFFBQVEsRUFBRTtHQUMxQjs7ZUFMRyxRQUFROztXQU9GLHNCQUFHO0FBQ1gsaUNBUkUsUUFBUSw0Q0FRUzs7QUFFbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUM7T0FBRTtLQUNsRTs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNuQixVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxpQ0FmRSxRQUFRLHlDQWVJLElBQUksRUFBRSxLQUFLLEVBQUU7S0FDNUI7OztXQUVRLG1CQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQ3RDLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkIsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0QyxTQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsU0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxTQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWhCLFNBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsVUFBSSxhQUFhLEVBQUU7QUFDakIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0IsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM5Qjs7QUFFRCxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmOzs7U0EzQ0csUUFBUTtHQUFTLFFBQVE7O0FBOEMvQixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc2luay93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VEcmF3ID0gcmVxdWlyZSgnLi9iYXNlLWRyYXcnKTtcbnZhciB7IGdldFJhbmRvbUNvbG9yIH0gPSByZXF1aXJlKCcuLi91dGlscy9kcmF3LXV0aWxzJyk7XG5cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge307XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3IpIHsgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpOyB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZpb3VzRnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgbWluID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0pO1xuICAgIHZhciBtYXggPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVsxXSk7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGN0eC5tb3ZlVG8oMCwgdGhpcy5nZXRZUG9zaXRpb24oMCkpO1xuICAgIGN0eC5saW5lVG8oMCwgbWF4KTtcblxuICAgIGlmIChwcmV2aW91c0ZyYW1lKSB7XG4gICAgICB2YXIgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMF0pO1xuICAgICAgdmFyIHByZXZNYXggPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2aW91c0ZyYW1lWzFdKTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1heCk7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHByZXZNaW4pO1xuICAgIH1cblxuICAgIGN0eC5saW5lVG8oMCwgbWluKTtcblxuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXZlZm9ybTsiXX0=