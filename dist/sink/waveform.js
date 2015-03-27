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
  function Waveform(previous, options) {
    _classCallCheck(this, Waveform);

    var extendDefaults = {};

    _get(_core.Object.getPrototypeOf(Waveform.prototype), "constructor", this).call(this, previous, options, extendDefaults);

    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  _inherits(Waveform, _BaseDraw);

  _createClass(Waveform, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL3dhdmVmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7ZUFDYixPQUFPLENBQUMscUJBQXFCLENBQUM7O0lBQWpELGNBQWMsWUFBZCxjQUFjOztJQUVkLFFBQVE7QUFDRCxXQURQLFFBQVEsQ0FDQSxRQUFRLEVBQUUsT0FBTyxFQUFFOzBCQUQzQixRQUFROztBQUVWLFFBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQzs7QUFFeEIscUNBSkUsUUFBUSw2Q0FJSixRQUFRLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRTs7QUFFekMsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLGNBQWMsRUFBRSxDQUFDO0tBQ3RDO0dBQ0Y7O1lBVEcsUUFBUTs7ZUFBUixRQUFRO0FBV1osV0FBTzthQUFBLGlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDakMseUNBYkUsUUFBUSx5Q0FhSSxJQUFJLEVBQUUsS0FBSyxFQUFFO09BQzVCOztBQUVELGFBQVM7YUFBQSxtQkFBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxZQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ25CLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsWUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEMsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVYLFdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDbEMsV0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVoQixXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFlBQUksYUFBYSxFQUFFO0FBQ2pCLGNBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsY0FBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxhQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLGFBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDOUI7O0FBRUQsV0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWCxXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDZjs7OztTQXpDRyxRQUFRO0dBQVMsUUFBUTs7QUE0Qy9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFzZURyYXcgPSByZXF1aXJlKCcuL2Jhc2UtZHJhdycpO1xudmFyIHsgZ2V0UmFuZG9tQ29sb3IgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RyYXctdXRpbHMnKTtcblxuY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgdmFyIGV4dGVuZERlZmF1bHRzID0ge307XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZXh0ZW5kRGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jb2xvcikge1xuICAgICAgdGhpcy5wYXJhbXMuY29sb3IgPSBnZXRSYW5kb21Db2xvcigpO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldmlvdXNGcmFtZSwgaVNoaWZ0KSB7XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgIHZhciBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSk7XG4gICAgdmFyIG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzFdKTtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgY3R4Lm1vdmVUbygwLCB0aGlzLmdldFlQb3NpdGlvbigwKSk7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZpb3VzRnJhbWUpIHtcbiAgICAgIHZhciBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldmlvdXNGcmFtZVswXSk7XG4gICAgICB2YXIgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZpb3VzRnJhbWVbMV0pO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdmVmb3JtOyJdfQ==