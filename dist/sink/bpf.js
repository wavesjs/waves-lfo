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

      // main - override default for trigger mode

      value: function process(time, frame) {
        // @TODO: compare dt - if dt < fps return;
        if (this.params.trigger) {
          this.triggerModeDraw(time, frame);
        } else {
          this.scrollModeDraw(time, frame);
        }

        // save previous frame values
        this.previousFrame = new Float32Array(frame);
        this.previousTime = time;
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
        var iShift = 0;

        // check boundaries
        if (this.previousTime) {
          var dt = time - this.previousTime;
          var fShift = dt / duration * width - this.lastShiftError; // px

          iShift = Math.round(fShift);
          this.lastShiftError = iShift - fShift;
        }

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
//# sourceMappingURL=data:application/json;base64,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LE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEIsZUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2IsZUFBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1dBQ2pCOztBQUVELGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNmO09BQ0Y7Ozs7U0F6SEcsR0FBRztHQUFTLFFBQVE7O0FBNEgxQixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvc2luay9icGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlRHJhdyA9IHJlcXVpcmUoJy4vYmFzZS1kcmF3Jyk7XG52YXIgeyBnZXRSYW5kb21Db2xvciB9ID0gcmVxdWlyZSgnLi9kcmF3LXV0aWxzJyk7XG5cbmNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZXh0ZW5kRGVmYXVsdHMgPSB7XG4gICAgICB0cmlnZ2VyOiBmYWxzZSxcbiAgICAgIHJhZGl1czogMCxcbiAgICAgIGxpbmU6IHRydWVcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIC8vIGZvciBsb29wIG1vZGVcbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIC8vIGNyZWF0ZSBhbiBhcnJheSBvZiBjb2xvcnMgYWNjb3JkaW5nIHRvIHRoZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3JzKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucGFyYW1zLmNvbG9ycy5wdXNoKGdldFJhbmRvbUNvbG9yKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIHNldFRyaWdnZXIoYm9vbCkge1xuICAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHJlc2V0IGN1cnJlbnRYUG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICB9XG5cbiAgLy8gbWFpbiAtIG92ZXJyaWRlIGRlZmF1bHQgZm9yIHRyaWdnZXIgbW9kZVxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgLy8gQFRPRE86IGNvbXBhcmUgZHQgLSBpZiBkdCA8IGZwcyByZXR1cm47XG4gICAgaWYgKHRoaXMucGFyYW1zLnRyaWdnZXIpIHtcbiAgICAgIHRoaXMudHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gc2F2ZSBwcmV2aW91cyBmcmFtZSB2YWx1ZXNcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcbiAgICB0aGlzLnByZXZpb3VzVGltZSAgPSB0aW1lO1xuICB9XG5cblxuICAvLyBhZGQgYW4gYWx0ZXJuYXRpdmUgZHJhd2luZyBtb2RlXG4gIC8vIGRyYXcgZnJvbSBsZWZ0IHRvIHJpZ2h0LCBnbyBiYWNrIHRvIGxlZnQgd2hlbiA+IHdpZHRoXG4gIHRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHZhciB3aWR0aCAgPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHZhciBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgaVNoaWZ0ID0gMDtcblxuICAgIC8vIGNoZWNrIGJvdW5kYXJpZXNcbiAgICBpZiAodGhpcy5wcmV2aW91c1RpbWUpIHtcbiAgICAgIHZhciBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICAgIHZhciBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG5cbiAgICAgIGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uICs9IGlTaGlmdDtcblxuICAgIC8vIGRyYXcgdGhlIHJpZ2h0IHBhcnRcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgLy8gZ28gYmFjayB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIHNhbWUgdGhpbmdcbiAgICBpZiAodGhpcy5jdXJyZW50WFBvc2l0aW9uID4gd2lkdGgpIHtcbiAgICAgIC8vIGdvIGJhY2sgdG8gc3RhcnRcbiAgICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiAtPSB3aWR0aDtcblxuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gaW1wbGVtZW50cyBkcmF3Q3VydmVcbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIHZhciBjb2xvcnMgPSB0aGlzLnBhcmFtcy5jb2xvcnM7XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgIHZhciByYWRpdXMgPSB0aGlzLnBhcmFtcy5yYWRpdXM7XG4gICAgLy8gQFRPRE8gdGhpcyBjYW4gYW5kIHNob3VsZCBiZSBhYnN0cmFjdGVkXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmcmFtZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAvLyBjb2xvciBzaG91bGQgYmVjaG9zZW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICBjdHguZmlsbFN0eWxlID0gY29sb3JzW2ldO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3JzW2ldO1xuXG4gICAgICB2YXIgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldKTtcblxuICAgICAgLy8gYXMgYW4gb3B0aW9ucyA/IHJhZGl1cyA/XG4gICAgICBpZiAocmFkaXVzID4gMCkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoMCwgcG9zWSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2RnJhbWUgJiYgdGhpcy5wYXJhbXMubGluZSkge1xuICAgICAgICB2YXIgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbaV0pO1xuICAgICAgICAvLyBkcmF3IGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnBmO1xuIl19