"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var Bpf = (function (_Lfo) {
  function Bpf(previous, options) {
    _classCallCheck(this, Bpf);

    var defaults = {
      duration: 1,
      min: -1,
      max: 1,
      scale: 1,
      width: 300,
      height: 100
    };

    _get(_core.Object.getPrototypeOf(Bpf.prototype), "constructor", this).call(this, previous, options, defaults);

    if (!this.params.canvas) {
      throw new Error("bpf: a canvas must be given to this module");
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.cachedCanvas = document.createElement("canvas");
    this.cachedCtx = this.cachedCanvas.getContext("2d");

    this.ctx.canvas.width = this.cachedCtx.canvas.width = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousFrame = null;
    this.previousTime = null;

    // create an array of colors according to the
    if (!this.params.colors) {
      this.params.colors = [];
      for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
        this.params.colors.push(getRandomColor());
      }
    }
  }

  _inherits(Bpf, _Lfo);

  _createClass(Bpf, {
    getPosition: {

      // scale
      // http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value

      //          (b-a)(x - min)
      // f(x) = --------------  + a
      //           max - min

      value: function getPosition(value) {
        // var a = this.params.height / (this.params.min - this.params.max);
        // return a * value + (this.params.height / 2);

        // a = height
        // b = 0
        var min = this.params.min;
        var max = this.params.max;
        var height = this.params.height;

        return (0 - height) * (value - min) / (max - min) + height;
      }
    },
    setDuration: {
      value: function setDuration(duration) {
        this.params.duration = duration;
      }
    },
    setMin: {
      value: function setMin(min) {
        this.params.min = min;
      }
    },
    setMax: {
      value: function setMax(max) {
        this.params.max = max;
      }
    },
    process: {
      value: function process(time, frame) {
        var width = this.params.width;
        var height = this.params.height;
        var duration = this.params.duration;
        var colors = this.params.colors;
        var ctx = this.ctx;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        // translate canvas according to dt
        // @TODO should handle scale factor
        if (this.previousTime) {
          var dt = time - this.previousTime;
          var decay = dt / duration * width;

          ctx.translate(-decay, 0);
          ctx.drawImage(this.cachedCanvas, 0, 0, width, height);
        }

        ctx.restore();

        // foreach frame index
        for (var i = 0, l = frame.length; i < l; i++) {
          ctx.save();
          // color should bechosen according to index
          ctx.fillStyle = colors[i];
          ctx.strokeStyle = colors[i];

          ctx.translate(width, 0);
          // draw new point
          var posY = this.getPosition(frame[i]);

          ctx.arc(0, posY, 1, 0, Math.PI * 2, false);
          ctx.fill();

          if (this.previousFrame) {
            var lastPosY = this.getPosition(this.previousFrame[i]);
            // draw line
            ctx.beginPath();
            ctx.moveTo(-decay, lastPosY);
            ctx.lineTo(0, posY);
            ctx.stroke();
            ctx.closePath();
          }

          ctx.restore();
        }

        // save current state into buffer canvas
        this.cachedCtx.clearRect(0, 0, width, height);
        this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);

        // save values
        this.previousFrame = new Float32Array(frame);
        this.previousTime = time;
      }
    }
  });

  return Bpf;
})(Lfo);

module.exports = Bpf;
//# sourceMappingURL=data:application/json;base64,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U0FBUyxFQUFFLENBQUM7QUFDaEIsZUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3QixlQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQixlQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDYixlQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7V0FDakI7O0FBRUQsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2Y7OztBQUdELFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7OztBQUczRCxZQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFlBQUksQ0FBQyxZQUFZLEdBQUksSUFBSSxDQUFDO09BQzNCOzs7O1NBL0hHLEdBQUc7R0FBUyxHQUFHOztBQWtJckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZXM2L3NpbmsvYnBmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDg0NTA2L3JhbmRvbS1jb2xvci1nZW5lcmF0b3ItaW4tamF2YXNjcmlwdFxuZnVuY3Rpb24gZ2V0UmFuZG9tQ29sb3IoKSB7XG4gIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcbiAgdmFyIGNvbG9yID0gJyMnO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKyApIHtcbiAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcbiAgfVxuICByZXR1cm4gY29sb3I7XG59XG5cbmNsYXNzIEJwZiBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgZHVyYXRpb246IDEsXG4gICAgICBtaW46IC0xLFxuICAgICAgbWF4OiAxLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAxMDBcbiAgICB9O1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JwZjogYSBjYW52YXMgbXVzdCBiZSBnaXZlbiB0byB0aGlzIG1vZHVsZScpO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmN0eC5jYW52YXMud2lkdGggID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLndpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IG51bGw7XG5cbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9ycykge1xuICAgICAgdGhpcy5wYXJhbXMuY29sb3JzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLnBhcmFtcy5jb2xvcnMucHVzaChnZXRSYW5kb21Db2xvcigpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBzY2FsZVxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyOTQ5NTUvaG93LXRvLXNjYWxlLWRvd24tYS1yYW5nZS1vZi1udW1iZXJzLXdpdGgtYS1rbm93bi1taW4tYW5kLW1heC12YWx1ZVxuXG4gIC8vICAgICAgICAgIChiLWEpKHggLSBtaW4pXG4gIC8vIGYoeCkgPSAtLS0tLS0tLS0tLS0tLSAgKyBhXG4gIC8vICAgICAgICAgICBtYXggLSBtaW5cbiAgZ2V0UG9zaXRpb24odmFsdWUpIHtcbiAgICAvLyB2YXIgYSA9IHRoaXMucGFyYW1zLmhlaWdodCAvICh0aGlzLnBhcmFtcy5taW4gLSB0aGlzLnBhcmFtcy5tYXgpO1xuICAgIC8vIHJldHVybiBhICogdmFsdWUgKyAodGhpcy5wYXJhbXMuaGVpZ2h0IC8gMik7XG5cbiAgICAvLyBhID0gaGVpZ2h0XG4gICAgLy8gYiA9IDBcbiAgICB2YXIgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIHZhciBtYXggPSB0aGlzLnBhcmFtcy5tYXg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHJldHVybiAoKCgwIC0gaGVpZ2h0KSAqICh2YWx1ZSAtIG1pbikpIC8gKG1heCAtIG1pbikpICsgaGVpZ2h0O1xuICB9XG5cbiAgc2V0RHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICB0aGlzLnBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2V0TWluKG1pbikge1xuICAgIHRoaXMucGFyYW1zLm1pbiA9IG1pbjtcbiAgfVxuXG4gIHNldE1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdmFyIHdpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMucGFyYW1zLmNvbG9ycztcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICAvLyBjbGVhciBjYW52YXNcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICAvLyB0cmFuc2xhdGUgY2FudmFzIGFjY29yZGluZyB0byBkdFxuICAgIC8vIEBUT0RPIHNob3VsZCBoYW5kbGUgc2NhbGUgZmFjdG9yXG4gICAgaWYgKHRoaXMucHJldmlvdXNUaW1lKSB7XG4gICAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgICB2YXIgZGVjYXkgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aDtcblxuICAgICAgY3R4LnRyYW5zbGF0ZSgtZGVjYXksIDApO1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhY2hlZENhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIGZvcmVhY2ggZnJhbWUgaW5kZXhcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGNvbG9yIHNob3VsZCBiZWNob3NlbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNbaV07XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbaV07XG5cbiAgICAgIGN0eC50cmFuc2xhdGUod2lkdGgsIDApO1xuICAgICAgLy8gZHJhdyBuZXcgcG9pbnRcbiAgICAgIHZhciBwb3NZID0gdGhpcy5nZXRQb3NpdGlvbihmcmFtZVtpXSk7XG5cbiAgICAgIGN0eC5hcmMoMCwgcG9zWSwgMSwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgIGN0eC5maWxsKCk7XG5cbiAgICAgIGlmICh0aGlzLnByZXZpb3VzRnJhbWUpIHtcbiAgICAgICAgdmFyIGxhc3RQb3NZID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLnByZXZpb3VzRnJhbWVbaV0pO1xuICAgICAgICAvLyBkcmF3IGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1kZWNheSwgbGFzdFBvc1kpO1xuICAgICAgICBjdHgubGluZVRvKDAsIHBvc1kpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgc3RhdGUgaW50byBidWZmZXIgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAvLyBzYXZlIHZhbHVlc1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIHRoaXMucHJldmlvdXNUaW1lICA9IHRpbWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcGY7XG4iXX0=