"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("../utils/draw-utils");

var getRandomColor = _require.getRandomColor;

var Waveform = (function (_BaseDraw) {
  function Waveform(options) {
    _classCallCheck(this, Waveform);

    var defaults = {};

    _get(_core.Object.getPrototypeOf(Waveform.prototype), "constructor", this).call(this, options, defaults);
  }

  _inherits(Waveform, _BaseDraw);

  _createClass(Waveform, {
    initialize: {
      value: function initialize() {
        _get(_core.Object.getPrototypeOf(Waveform.prototype), "initialize", this).call(this);

        if (!this.params.color) {
          this.params.color = getRandomColor();
        }
      }
    },
    process: {
      value: function process(time, frame) {
        this.scrollModeDraw(time, frame);
        _get(_core.Object.getPrototypeOf(Waveform.prototype), "process", this).call(this, time, frame);
      }
    },
    drawCurve: {
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
    }
  });

  return Waveform;
})(BaseDraw);

module.exports = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3dhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7ZUFDYixPQUFPLENBQUMscUJBQXFCLENBQUM7O0lBQWpELGNBQWMsWUFBZCxjQUFjOztJQUVkLFFBQVE7QUFDRCxXQURQLFFBQVEsQ0FDQSxPQUFPLEVBQUU7MEJBRGpCLFFBQVE7O0FBRVYsUUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVsQixxQ0FKRSxRQUFRLDZDQUlKLE9BQU8sRUFBRSxRQUFRLEVBQUU7R0FDMUI7O1lBTEcsUUFBUTs7ZUFBUixRQUFRO0FBT1osY0FBVTthQUFBLHNCQUFHO0FBQ1gseUNBUkUsUUFBUSw0Q0FRUzs7QUFFbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUM7U0FBRTtPQUNsRTs7QUFFRCxXQUFPO2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNuQixZQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyx5Q0FmRSxRQUFRLHlDQWVJLElBQUksRUFBRSxLQUFLLEVBQUU7T0FDNUI7O0FBRUQsYUFBUzthQUFBLG1CQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQ3RDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkIsWUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0QyxXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsV0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsQyxXQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWhCLFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsWUFBSSxhQUFhLEVBQUU7QUFDakIsY0FBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxjQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELGFBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0IsYUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5Qjs7QUFFRCxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsV0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNmOzs7O1NBM0NHLFFBQVE7R0FBUyxRQUFROztBQThDL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiZXM2L3Npbmsvd2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlRHJhdyA9IHJlcXVpcmUoJy4vYmFzZS1kcmF3Jyk7XG52YXIgeyBnZXRSYW5kb21Db2xvciB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvZHJhdy11dGlscycpO1xuXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHt9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9yKSB7IHRoaXMucGFyYW1zLmNvbG9yID0gZ2V0UmFuZG9tQ29sb3IoKTsgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2aW91c0ZyYW1lLCBpU2hpZnQpIHtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgdmFyIG1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdKTtcbiAgICB2YXIgbWF4ID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMV0pO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubW92ZVRvKDAsIHRoaXMuZ2V0WVBvc2l0aW9uKDApKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldmlvdXNGcmFtZSkge1xuICAgICAgdmFyIHByZXZNaW4gPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2aW91c0ZyYW1lWzBdKTtcbiAgICAgIHZhciBwcmV2TWF4ID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldmlvdXNGcmFtZVsxXSk7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHByZXZNYXgpO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWluKTtcbiAgICB9XG5cbiAgICBjdHgubGluZVRvKDAsIG1pbik7XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2F2ZWZvcm07Il19