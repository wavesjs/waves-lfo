"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("./draw-utils");

var getRandomColor = _require.getRandomColor;

var Bpf = (function (_BaseDraw) {
  function Bpf(previous, options) {
    _classCallCheck(this, Bpf);

    var extendDefaults = {
      trigger: false,
      radius: 0,
      line: true
    };

    _get(_core.Object.getPrototypeOf(Bpf.prototype), "constructor", this).call(this, previous, options, extendDefaults);
    // for loop mode
    this.currentXPosition = 0;
    // create an array of colors according to the
    if (!this.params.colors) {
      this.params.colors = [];
      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        this.params.colors.push(getRandomColor());
      }
    }
  }

  _inherits(Bpf, _BaseDraw);

  _createClass(Bpf, {
    setTrigger: {

      // allow to witch easily between the 2 modes

      value: function setTrigger(bool) {
        this.params.trigger = bool;
        // clear canvas and cache
        this.ctx.clearRect(0, 0, this.params.width, this.params.height);
        this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
        // reset currentXPosition
        this.currentXPosition = 0;
        this.lastShiftError = 0;
      }
    },
    process: {
      value: function process(time, frame) {
        // @TODO: compare dt - if dt < fps return;
        if (this.params.trigger) {
          this.triggerModeDraw(time, frame);
        } else {
          this.scrollModeDraw(time, frame);
        }

        _get(_core.Object.getPrototypeOf(Bpf.prototype), "process", this).call(this, time, frame);
      }
    },
    triggerModeDraw: {

      // add an alternative drawing mode
      // draw from left to right, go back to left when > width

      value: function triggerModeDraw(time, frame) {
        var width = this.params.width;
        var height = this.params.height;
        var duration = this.params.duration;
        var ctx = this.ctx;

        var dt = time - this.previousTime;
        var fShift = dt / duration * width - this.lastShiftError; // px
        var iShift = Math.round(fShift);
        this.lastShiftError = iShift - fShift;

        this.currentXPosition += iShift;

        // draw the right part
        ctx.save();
        ctx.translate(this.currentXPosition, 0);
        ctx.clearRect(-iShift, 0, iShift, height);
        this.drawCurve(frame, iShift);
        ctx.restore();

        // go back to the left of the canvas and redraw the same thing
        if (this.currentXPosition > width) {
          // go back to start
          this.currentXPosition -= width;

          ctx.save();
          ctx.translate(this.currentXPosition, 0);
          ctx.clearRect(-iShift, 0, iShift, height);
          this.drawCurve(frame, this.previousFrame, iShift);
          ctx.restore();
        }
      }
    },
    drawCurve: {

      // implements drawCurve

      value: function drawCurve(frame, prevFrame, iShift) {
        var colors = this.params.colors;
        var ctx = this.ctx;
        var radius = this.params.radius;
        // @TODO this can and should be abstracted
        for (var i = 0, l = frame.length; i < l; i++) {
          ctx.save();
          // color should bechosen according to index
          ctx.fillStyle = colors[i];
          ctx.strokeStyle = colors[i];

          var posY = this.getYPosition(frame[i]);
          // as an options ? radius ?
          if (radius > 0) {
            ctx.beginPath();
            ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
          }

          if (prevFrame && this.params.line) {
            var lastPosY = this.getYPosition(prevFrame[i]);
            // draw line
            ctx.beginPath();
            ctx.moveTo(-iShift, lastPosY);
            ctx.lineTo(0, posY);
            ctx.stroke();
            ctx.closePath();
          }

          ctx.restore();
        }
      }
    }
  });

  return Bpf;
})(BaseDraw);

module.exports = Bpf;
//# sourceMappingURL=data:application/json;base64,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QyxPQUFPLEVBQUUsQ0FBQztTQUNmO09BQ0Y7Ozs7U0E5R0csR0FBRztHQUFTLFFBQVE7O0FBaUgxQixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvc2luay9icGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlRHJhdyA9IHJlcXVpcmUoJy4vYmFzZS1kcmF3Jyk7XG52YXIgeyBnZXRSYW5kb21Db2xvciB9ID0gcmVxdWlyZSgnLi9kcmF3LXV0aWxzJyk7XG5cbmNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZXh0ZW5kRGVmYXVsdHMgPSB7XG4gICAgICB0cmlnZ2VyOiBmYWxzZSxcbiAgICAgIHJhZGl1czogMCxcbiAgICAgIGxpbmU6IHRydWVcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGV4dGVuZERlZmF1bHRzKTtcbiAgICAvLyBmb3IgbG9vcCBtb2RlXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uID0gMDtcbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9ycykge1xuICAgICAgdGhpcy5wYXJhbXMuY29sb3JzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLnBhcmFtcy5jb2xvcnMucHVzaChnZXRSYW5kb21Db2xvcigpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBhbGxvdyB0byB3aXRjaCBlYXNpbHkgYmV0d2VlbiB0aGUgMiBtb2Rlc1xuICBzZXRUcmlnZ2VyKGJvb2wpIHtcbiAgICB0aGlzLnBhcmFtcy50cmlnZ2VyID0gYm9vbDtcbiAgICAvLyBjbGVhciBjYW52YXMgYW5kIGNhY2hlXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICAvLyByZXNldCBjdXJyZW50WFBvc2l0aW9uXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uID0gMDtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gMDtcbiAgfVxuXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICAvLyBAVE9ETzogY29tcGFyZSBkdCAtIGlmIGR0IDwgZnBzIHJldHVybjtcbiAgICBpZiAodGhpcy5wYXJhbXMudHJpZ2dlcikge1xuICAgICAgdGhpcy50cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICB9XG5cbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGFkZCBhbiBhbHRlcm5hdGl2ZSBkcmF3aW5nIG1vZGVcbiAgLy8gZHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgdmFyIHdpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgdmFyIGR0ID0gdGltZSAtIHRoaXMucHJldmlvdXNUaW1lO1xuICAgIHZhciBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gICAgdmFyIGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uICs9IGlTaGlmdDtcblxuICAgIC8vIGRyYXcgdGhlIHJpZ2h0IHBhcnRcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgLy8gZ28gYmFjayB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIHNhbWUgdGhpbmdcbiAgICBpZiAodGhpcy5jdXJyZW50WFBvc2l0aW9uID4gd2lkdGgpIHtcbiAgICAgIC8vIGdvIGJhY2sgdG8gc3RhcnRcbiAgICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiAtPSB3aWR0aDtcblxuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaW1wbGVtZW50cyBkcmF3Q3VydmVcbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLnBhcmFtcy5jb2xvcnM7XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgIHZhciByYWRpdXMgPSB0aGlzLnBhcmFtcy5yYWRpdXM7XG4gICAgLy8gQFRPRE8gdGhpcyBjYW4gYW5kIHNob3VsZCBiZSBhYnN0cmFjdGVkXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAvLyBjb2xvciBzaG91bGQgYmVjaG9zZW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3JzW2ldO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzW2ldO1xuXG4gICAgICB2YXIgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldKTtcbiAgICAgIC8vIGFzIGFuIG9wdGlvbnMgPyByYWRpdXMgP1xuICAgICAgaWYgKHJhZGl1cyA+IDApIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguYXJjKDAsIHBvc1ksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldkZyYW1lICYmIHRoaXMucGFyYW1zLmxpbmUpIHtcbiAgICAgICAgdmFyIGxhc3RQb3NZID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lW2ldKTtcbiAgICAgICAgLy8gZHJhdyBsaW5lXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtaVNoaWZ0LCBsYXN0UG9zWSk7XG4gICAgICAgIGN0eC5saW5lVG8oMCwgcG9zWSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJwZjtcbiJdfQ==