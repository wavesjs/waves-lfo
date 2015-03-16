"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("./draw-utils");

var getRandomColor = _require.getRandomColor;

var Trace = (function (_BaseDraw) {
  function Trace(previous, options) {
    _classCallCheck(this, Trace);

    _get(_core.Object.getPrototypeOf(Trace.prototype), "constructor", this).call(this, previous, options);
    // create an array of colors according to the
    if (this.streamParams.frameSize === 2 && !this.params.color) {
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
        var color = this.params.color;
        var ctx = this.ctx;

        var halfRange = frame[1] / 2;
        var mean = this.getYPosition(frame[0]);
        var min = this.getYPosition(frame[0] - halfRange);
        var max = this.getYPosition(frame[0] + halfRange);

        if (prevFrame) {
          var prevHalfRange = prevFrame[1] / 2;
          var prevMin = this.getYPosition(prevFrame[0] - prevHalfRange);
          var prevMax = this.getYPosition(prevFrame[0] + prevHalfRange);
        }

        // draw range
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

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
//# sourceMappingURL=data:application/json;base64,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akRHLEtBQUs7R0FBUyxRQUFROztBQWtEM0IsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvc2luay90cmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIEJhc2VEcmF3ID0gcmVxdWlyZSgnLi9iYXNlLWRyYXcnKTtcbnZhciB7IGdldFJhbmRvbUNvbG9yIH0gPSByZXF1aXJlKCcuL2RyYXctdXRpbHMnKTtcblxuY2xhc3MgVHJhY2UgZXh0ZW5kcyBCYXNlRHJhdyB7XG5cbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucyk7XG4gICAgLy8gY3JlYXRlIGFuIGFycmF5IG9mIGNvbG9ycyBhY2NvcmRpbmcgdG8gdGhlXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9PT0gMiAmJiAhdGhpcy5wYXJhbXMuY29sb3IpIHtcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9yID0gZ2V0UmFuZG9tQ29sb3IoKTtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgdmFyIGNvbG9yID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgdmFyIGhhbGZSYW5nZSA9IGZyYW1lWzFdIC8gMjtcbiAgICB2YXIgbWVhbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lWzBdKTtcbiAgICB2YXIgbWluID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbMF0gLSBoYWxmUmFuZ2UpO1xuICAgIHZhciBtYXggPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVswXSArIGhhbGZSYW5nZSk7XG5cbiAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICB2YXIgcHJldkhhbGZSYW5nZSA9IHByZXZGcmFtZVsxXSAvIDI7XG4gICAgICB2YXIgcHJldk1pbiA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVswXSAtIHByZXZIYWxmUmFuZ2UpO1xuICAgICAgdmFyIHByZXZNYXggPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbMF0gKyBwcmV2SGFsZlJhbmdlKTtcbiAgICB9XG5cbiAgICAvLyBkcmF3IHJhbmdlXG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygwLCBtZWFuKTtcbiAgICBjdHgubGluZVRvKDAsIG1heCk7XG5cbiAgICBpZiAocHJldkZyYW1lKSB7XG4gICAgICBjdHgubGluZVRvKC1pU2hpZnQsIHByZXZNYXgpO1xuICAgICAgY3R4LmxpbmVUbygtaVNoaWZ0LCBwcmV2TWluKTtcbiAgICB9XG5cbiAgICBjdHgubGluZVRvKDAsIG1pbik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIl19