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
      height: 100,
      trigger: false,
      radius: 0,
      line: true
    };

    _get(_core.Object.getPrototypeOf(Bpf.prototype), "constructor", this).call(this, previous, options, defaults);

    if (!this.params.canvas) {
      throw new Error("bpf: params.canvas is mandatory and must be canvas DOM element");
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

    // for loop mode
    this.currentXPosition = 0;
    this.lastShiftError = 0;

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
    getYPosition: {

      // scale
      // http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value

      //          (b-a)(x - min)
      // f(x) = --------------  + a
      //           max - min

      value: function getYPosition(value) {
        // a = height
        // b = 0
        var min = this.params.min;
        var max = this.params.max;
        var height = this.params.height;

        return (0 - height) * (value - min) / (max - min) + height;
      }
    },
    setDuration: {

      // params modifier

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

      // main

      value: function process(time, frame) {
        // @TODO: compare dt - if dt < fps return;
        if (this.params.trigger) {
          this.triggerModeDraw(frame, time);
        } else {
          this.scrollModeDraw(frame, time);
        }

        // save previous frame values
        this.previousFrame = new Float32Array(frame);
        this.previousTime = time;

        // forward data ?
      }
    },
    triggerModeDraw: {

      // ----------------------------------------
      // drawing strategies
      // ----------------------------------------

      // draw from left to right, go back to left when > width

      value: function triggerModeDraw(frame, time) {
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
          this.drawCurve(frame, iShift);
          ctx.restore();
        }
      }
    },
    scrollModeDraw: {

      // @default mode
      // draw from the right side of the canvas and scroll

      value: function scrollModeDraw(frame, time) {
        var width = this.params.width;
        var height = this.params.height;
        var duration = this.params.duration;
        var colors = this.params.colors;
        var ctx = this.ctx;
        var iShift = 0;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        // translate canvas according to dt
        if (this.previousTime) {
          var dt = time - this.previousTime;
          // handle average pixel errors between frames
          var fShift = dt / duration * width - this.lastShiftError; // px

          iShift = Math.round(fShift);
          this.lastShiftError = iShift - fShift;
          // scroll canvas to the left
          ctx.drawImage(this.cachedCanvas, iShift, 0, width - iShift, height, 0, 0, width - iShift, height);
        }

        ctx.restore();

        ctx.save();
        ctx.translate(width, 0);
        this.drawCurve(frame, iShift);
        ctx.restore();
        // save current state into buffer canvas
        this.cachedCtx.clearRect(0, 0, width, height);
        this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);
      }
    },
    drawCurve: {

      // @private

      value: function drawCurve(frame, decay) {
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

          if (this.previousFrame && this.params.line) {
            var lastPosY = this.getYPosition(this.previousFrame[i]);
            // draw line
            ctx.beginPath();
            ctx.moveTo(-decay, lastPosY);
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
})(Lfo);

module.exports = Bpf;
//# sourceMappingURL=data:application/json;base64,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QzFDLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsZUFBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLGVBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0IsZUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEIsZUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2IsZUFBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1dBQ2pCOztBQUVELGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNmO09BQ0Y7Ozs7U0EzTkcsR0FBRztHQUFTLEdBQUc7O0FBOE5yQixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvc2luay9icGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0ODQ1MDYvcmFuZG9tLWNvbG9yLWdlbmVyYXRvci1pbi1qYXZhc2NyaXB0XG5mdW5jdGlvbiBnZXRSYW5kb21Db2xvcigpIHtcbiAgdmFyIGxldHRlcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRicuc3BsaXQoJycpO1xuICB2YXIgY29sb3IgPSAnIyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrICkge1xuICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuY2xhc3MgQnBmIGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBkdXJhdGlvbjogMSxcbiAgICAgIG1pbjogLTEsXG4gICAgICBtYXg6IDEsXG4gICAgICBzY2FsZTogMSxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHRyaWdnZXI6IGZhbHNlLFxuICAgICAgcmFkaXVzOiAwLFxuICAgICAgbGluZTogdHJ1ZVxuICAgIH07XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jYW52YXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYnBmOiBwYXJhbXMuY2FudmFzIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBiZSBjYW52YXMgRE9NIGVsZW1lbnQnKTtcbiAgICB9XG5cbiAgICAvLyBwcmVwYXJlIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy5wYXJhbXMuY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY2FjaGVkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYWNoZWRDdHggPSB0aGlzLmNhY2hlZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jdHguY2FudmFzLndpZHRoICA9IHRoaXMuY2FjaGVkQ3R4LmNhbnZhcy53aWR0aCAgPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSBudWxsO1xuXG4gICAgLy8gZm9yIGxvb3AgbW9kZVxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG5cbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGVcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNvbG9ycykge1xuICAgICAgdGhpcy5wYXJhbXMuY29sb3JzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLnBhcmFtcy5jb2xvcnMucHVzaChnZXRSYW5kb21Db2xvcigpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBzY2FsZVxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyOTQ5NTUvaG93LXRvLXNjYWxlLWRvd24tYS1yYW5nZS1vZi1udW1iZXJzLXdpdGgtYS1rbm93bi1taW4tYW5kLW1heC12YWx1ZVxuXG4gIC8vICAgICAgICAgIChiLWEpKHggLSBtaW4pXG4gIC8vIGYoeCkgPSAtLS0tLS0tLS0tLS0tLSAgKyBhXG4gIC8vICAgICAgICAgICBtYXggLSBtaW5cbiAgZ2V0WVBvc2l0aW9uKHZhbHVlKSB7XG4gICAgLy8gYSA9IGhlaWdodFxuICAgIC8vIGIgPSAwXG4gICAgdmFyIG1pbiA9IHRoaXMucGFyYW1zLm1pbjtcbiAgICB2YXIgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICByZXR1cm4gKCgoMCAtIGhlaWdodCkgKiAodmFsdWUgLSBtaW4pKSAvIChtYXggLSBtaW4pKSArIGhlaWdodDtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllclxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xuICAgIHRoaXMucGFyYW1zLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIH1cblxuICBzZXRNaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICB9XG5cbiAgc2V0TWF4KG1heCkge1xuICAgIHRoaXMucGFyYW1zLm1heCA9IG1heDtcbiAgfVxuXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIHNldFRyaWdnZXIoYm9vbCkge1xuICAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHJlc2V0IGN1cnJlbnRYUG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICB9XG5cbiAgLy8gbWFpblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgLy8gQFRPRE86IGNvbXBhcmUgZHQgLSBpZiBkdCA8IGZwcyByZXR1cm47XG4gICAgaWYgKHRoaXMucGFyYW1zLnRyaWdnZXIpIHtcbiAgICAgIHRoaXMudHJpZ2dlck1vZGVEcmF3KGZyYW1lLCB0aW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zY3JvbGxNb2RlRHJhdyhmcmFtZSwgdGltZSk7XG4gICAgfVxuXG4gICAgLy8gc2F2ZSBwcmV2aW91cyBmcmFtZSB2YWx1ZXNcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcbiAgICB0aGlzLnByZXZpb3VzVGltZSAgPSB0aW1lO1xuXG4gICAgLy8gZm9yd2FyZCBkYXRhID9cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZHJhd2luZyBzdHJhdGVnaWVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBkcmF3IGZyb20gbGVmdCB0byByaWdodCwgZ28gYmFjayB0byBsZWZ0IHdoZW4gPiB3aWR0aFxuICB0cmlnZ2VyTW9kZURyYXcoZnJhbWUsIHRpbWUpIHtcbiAgICB2YXIgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgdmFyIGlTaGlmdCA9IDA7XG5cbiAgICAvLyBjaGVjayBib3VuZGFyaWVzXG4gICAgaWYgKHRoaXMucHJldmlvdXNUaW1lKSB7XG4gICAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgICB2YXIgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yOyAvLyBweFxuXG4gICAgICBpU2hpZnQgPSBNYXRoLnJvdW5kKGZTaGlmdCk7XG4gICAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiArPSBpU2hpZnQ7XG5cbiAgICAvLyBkcmF3IHRoZSByaWdodCBwYXJ0XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMuY3VycmVudFhQb3NpdGlvbiwgMCk7XG4gICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIGdvIGJhY2sgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhcyBhbmQgcmVkcmF3IHRoZSBzYW1lIHRoaW5nXG4gICAgaWYgKHRoaXMuY3VycmVudFhQb3NpdGlvbiA+IHdpZHRoKSB7XG4gICAgICAvLyBnbyBiYWNrIHRvIHN0YXJ0XG4gICAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gLT0gd2lkdGg7XG5cbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHgudHJhbnNsYXRlKHRoaXMuY3VycmVudFhQb3NpdGlvbiwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBAZGVmYXVsdCBtb2RlXG4gIC8vIGRyYXcgZnJvbSB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY2FudmFzIGFuZCBzY3JvbGxcbiAgc2Nyb2xsTW9kZURyYXcoZnJhbWUsIHRpbWUpIHtcbiAgICB2YXIgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgaVNoaWZ0ID0gMDtcblxuICAgIC8vIGNsZWFyIGNhbnZhc1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIC8vIHRyYW5zbGF0ZSBjYW52YXMgYWNjb3JkaW5nIHRvIGR0XG4gICAgaWYgKHRoaXMucHJldmlvdXNUaW1lKSB7XG4gICAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgICAvLyBoYW5kbGUgYXZlcmFnZSBwaXhlbCBlcnJvcnMgYmV0d2VlbiBmcmFtZXNcbiAgICAgIHZhciBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG5cbiAgICAgIGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG4gICAgICAvLyBzY3JvbGwgY2FudmFzIHRvIHRoZSBsZWZ0XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FjaGVkQ2FudmFzLFxuICAgICAgICBpU2hpZnQsIDAsIHdpZHRoIC0gaVNoaWZ0LCBoZWlnaHQsXG4gICAgICAgIDAsIDAsIHdpZHRoIC0gaVNoaWZ0LCBoZWlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICAvLyBzYXZlIGN1cnJlbnQgc3RhdGUgaW50byBidWZmZXIgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICAvLyBAcHJpdmF0ZVxuICBkcmF3Q3VydmUoZnJhbWUsIGRlY2F5KSB7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMucGFyYW1zLmNvbG9ycztcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgdmFyIHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcbiAgICAvLyBAVE9ETyB0aGlzIGNhbiBhbmQgc2hvdWxkIGJlIGFic3RyYWN0ZWRcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGNvbG9yIHNob3VsZCBiZWNob3NlbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNbaV07XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbaV07XG5cbiAgICAgIHZhciBwb3NZID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbaV0pO1xuXG4gICAgICAvLyBhcyBhbiBvcHRpb25zID8gcmFkaXVzID9cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucHJldmlvdXNGcmFtZSAmJiB0aGlzLnBhcmFtcy5saW5lKSB7XG4gICAgICAgIHZhciBsYXN0UG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKHRoaXMucHJldmlvdXNGcmFtZVtpXSk7XG4gICAgICAgIC8vIGRyYXcgbGluZVxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oLWRlY2F5LCBsYXN0UG9zWSk7XG4gICAgICAgIGN0eC5saW5lVG8oMCwgcG9zWSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJwZjtcbiJdfQ==