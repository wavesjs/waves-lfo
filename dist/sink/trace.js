"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("./draw-utils");

var getRandomColor = _require.getRandomColor;
var getHue = _require.getHue;
var hexToRGB = _require.hexToRGB;

var Trace = (function (_BaseDraw) {
  function Trace(previous, options) {
    _classCallCheck(this, Trace);

    var extendDefaults = {
      colorScheme: "none" // color, opacity
    };

    _get(_core.Object.getPrototypeOf(Trace.prototype), "constructor", this).call(this, previous, options);
    // create an array of colors according to the
    if (!this.params.color) {
      this.params.color = getRandomColor();
    }
  }

  _inherits(Trace, _BaseDraw);

  _createClass(Trace, {
    process: {
      value: function process(time, frame) {
        this.scrollModeDraw(time, frame);
        _get(_core.Object.getPrototypeOf(Trace.prototype), "process", this).call(this, time, frame);
      }
    },
    drawCurve: {
      value: function drawCurve(frame, prevFrame, iShift) {
        var ctx = this.ctx;
        var color;

        var halfRange = frame[1] / 2;
        var mean = this.getYPosition(frame[0]);
        var min = this.getYPosition(frame[0] - halfRange);
        var max = this.getYPosition(frame[0] + halfRange);

        if (prevFrame) {
          var prevHalfRange = prevFrame[1] / 2;
          var prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
          var prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
        }

        switch (this.params.colorScheme) {
          case "none":
            ctx.fillStyle = this.params.color;
            break;
          case "hue":
            var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

            if (prevFrame) {
              gradient.addColorStop(0, "hsl(" + getHue(prevFrame[2]) + ", 100%, 50%)");
            } else {
              gradient.addColorStop(0, "hsl(" + getHue(frame[2]) + ", 100%, 50%)");
            }

            gradient.addColorStop(1, "hsl(" + getHue(frame[2]) + ", 100%, 50%)");
            ctx.fillStyle = gradient;
            break;
          case "opacity":
            var rgb = hexToRGB(this.params.color);
            var gradient = ctx.createLinearGradient(-iShift, 0, 0, 0);

            if (prevFrame) {
              gradient.addColorStop(0, "rgba(" + rgb.join(",") + "," + prevFrame[2] + ")");
            } else {
              gradient.addColorStop(0, "rgba(" + rgb.join(",") + "," + frame[2] + ")");
            }

            gradient.addColorStop(1, "rgba(" + rgb.join(",") + "," + frame[2] + ")");
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
    }
  });

  return Trace;
})(BaseDraw);

;

module.exports = Trace;
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxDQUFDO0FBQ3BCLFdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixZQUFJLFNBQVMsRUFBRTtBQUNiLGFBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0IsYUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5Qjs7QUFFRCxXQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQixXQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWhCLFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNmOzs7O1NBaEZHLEtBQUs7R0FBUyxRQUFROztBQWlGM0IsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvc2luay90cmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VEcmF3ID0gcmVxdWlyZSgnLi9iYXNlLWRyYXcnKTtcbnZhciB7IGdldFJhbmRvbUNvbG9yLCBnZXRIdWUsIGhleFRvUkdCIH0gPSByZXF1aXJlKCcuL2RyYXctdXRpbHMnKTtcblxuY2xhc3MgVHJhY2UgZXh0ZW5kcyBCYXNlRHJhdyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZXh0ZW5kRGVmYXVsdHMgPSB7XG4gICAgICBjb2xvclNjaGVtZTogJ25vbmUnIC8vIGNvbG9yLCBvcGFjaXR5XG4gICAgfTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9yKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvciA9IGdldFJhbmRvbUNvbG9yKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUpO1xuICB9XG5cbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgY29sb3I7XG5cbiAgICB2YXIgaGFsZlJhbmdlID0gZnJhbWVbMV0gLyAyO1xuICAgIHZhciBtZWFuID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0pO1xuICAgIHZhciBtaW4gPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSAtIGhhbGZSYW5nZSk7XG4gICAgdmFyIG1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdICsgaGFsZlJhbmdlKTtcblxuICAgIGlmIChwcmV2RnJhbWUpIHtcbiAgICAgIHZhciBwcmV2SGFsZlJhbmdlID0gcHJldkZyYW1lWzFdIC8gMjtcbiAgICAgIHZhciBwcmV2TWluID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lWzBdIC0gcHJldkhhbGZSYW5nZSk7XG4gICAgICB2YXIgcHJldk1heCA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSArIHByZXZIYWxmUmFuZ2UpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5wYXJhbXMuY29sb3JTY2hlbWUpIHtcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2h1ZSc6XG4gICAgICAgIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdoc2woJyArIGdldEh1ZShwcmV2RnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAnaHNsKCcgKyBnZXRIdWUoZnJhbWVbMl0pICsgJywgMTAwJSwgNTAlKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICdoc2woJyArIGdldEh1ZShmcmFtZVsyXSkgKyAnLCAxMDAlLCA1MCUpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3BhY2l0eSc6XG4gICAgICAgIHZhciByZ2IgPSBoZXhUb1JHQih0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICAgIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgtaVNoaWZ0LCAwLCAwLCAwKTtcblxuICAgICAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKCcgKyByZ2Iuam9pbignLCcpICsgJywnICsgcHJldkZyYW1lWzJdICsgJyknKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoJyArIHJnYi5qb2luKCcsJykgKyAnLCcgKyBmcmFtZVsyXSArICcpJyk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oMCwgbWVhbik7XG4gICAgY3R4LmxpbmVUbygwLCBtYXgpO1xuXG4gICAgaWYgKHByZXZGcmFtZSkge1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWF4KTtcbiAgICAgIGN0eC5saW5lVG8oLWlTaGlmdCwgcHJldk1pbik7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVUbygwLCBtaW4pO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiJdfQ==