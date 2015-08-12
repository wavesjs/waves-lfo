'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var BaseDraw = require('./base-draw');

var _require = require('../utils/draw-utils');

var getRandomColor = _require.getRandomColor;

var Bpf = (function (_BaseDraw) {
  _inherits(Bpf, _BaseDraw);

  function Bpf(options) {
    _classCallCheck(this, Bpf);

    var defaults = {
      trigger: false,
      radius: 0,
      line: true
    };

    _get(Object.getPrototypeOf(Bpf.prototype), 'constructor', this).call(this, options, defaults);
    // for loop mode
    this.currentXPosition = 0;
  }

  _createClass(Bpf, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(Bpf.prototype), 'initialize', this).call(this);

      // create an array of colors according to the `outFrame` size
      if (!this.params.colors) {
        this.params.colors = [];
        for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
          this.params.colors.push(getRandomColor());
        }
      }
    }

    // allow to witch easily between the 2 modes
  }, {
    key: 'setTrigger',
    value: function setTrigger(bool) {
      this.params.trigger = bool;
      // clear canvas and cache
      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
      // reset currentXPosition
      this.currentXPosition = 0;
      this.lastShiftError = 0;
    }
  }, {
    key: 'process',
    value: function process(time, frame) {
      // @TODO: compare dt - if dt < fps return;
      if (this.params.trigger) {
        this.triggerModeDraw(time, frame);
      } else {
        this.scrollModeDraw(time, frame);
      }

      _get(Object.getPrototypeOf(Bpf.prototype), 'process', this).call(this, time, frame);
    }

    // add an alternative drawing mode
    // draw from left to right, go back to left when > width
  }, {
    key: 'triggerModeDraw',
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

    // implements drawCurve
  }, {
    key: 'drawCurve',
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
  }]);

  return Bpf;
})(BaseDraw);

module.exports = Bpf;
//# sourceMappingURL=data:application/json;base64,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QUFFLENBQUM7T0FDZjtLQUNGOzs7U0FuSEcsR0FBRztHQUFTLFFBQVE7O0FBc0gxQixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvc2luay9icGYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBCYXNlRHJhdyA9IHJlcXVpcmUoJy4vYmFzZS1kcmF3Jyk7XG52YXIgeyBnZXRSYW5kb21Db2xvciB9ID0gcmVxdWlyZSgnLi4vdXRpbHMvZHJhdy11dGlscycpO1xuXG5jbGFzcyBCcGYgZXh0ZW5kcyBCYXNlRHJhdyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICB0cmlnZ2VyOiBmYWxzZSxcbiAgICAgIHJhZGl1czogMCxcbiAgICAgIGxpbmU6IHRydWVcbiAgICB9O1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuICAgIC8vIGZvciBsb29wIG1vZGVcbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGUgYG91dEZyYW1lYCBzaXplXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jb2xvcnMpIHtcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9ycyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5wYXJhbXMuY29sb3JzLnB1c2goZ2V0UmFuZG9tQ29sb3IoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gYWxsb3cgdG8gd2l0Y2ggZWFzaWx5IGJldHdlZW4gdGhlIDIgbW9kZXNcbiAgc2V0VHJpZ2dlcihib29sKSB7XG4gICAgdGhpcy5wYXJhbXMudHJpZ2dlciA9IGJvb2w7XG4gICAgLy8gY2xlYXIgY2FudmFzIGFuZCBjYWNoZVxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgLy8gcmVzZXQgY3VycmVudFhQb3NpdGlvblxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gIH1cblxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgLy8gQFRPRE86IGNvbXBhcmUgZHQgLSBpZiBkdCA8IGZwcyByZXR1cm47XG4gICAgaWYgKHRoaXMucGFyYW1zLnRyaWdnZXIpIHtcbiAgICAgIHRoaXMudHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgfVxuXG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICAvLyBhZGQgYW4gYWx0ZXJuYXRpdmUgZHJhd2luZyBtb2RlXG4gIC8vIGRyYXcgZnJvbSBsZWZ0IHRvIHJpZ2h0LCBnbyBiYWNrIHRvIGxlZnQgd2hlbiA+IHdpZHRoXG4gIHRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHZhciB3aWR0aCAgPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHZhciBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuICAgIHZhciBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICB2YXIgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yOyAvLyBweFxuICAgIHZhciBpU2hpZnQgPSBNYXRoLnJvdW5kKGZTaGlmdCk7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IGlTaGlmdCAtIGZTaGlmdDtcblxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiArPSBpU2hpZnQ7XG5cbiAgICAvLyBkcmF3IHRoZSByaWdodCBwYXJ0XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMuY3VycmVudFhQb3NpdGlvbiwgMCk7XG4gICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIGdvIGJhY2sgdG8gdGhlIGxlZnQgb2YgdGhlIGNhbnZhcyBhbmQgcmVkcmF3IHRoZSBzYW1lIHRoaW5nXG4gICAgaWYgKHRoaXMuY3VycmVudFhQb3NpdGlvbiA+IHdpZHRoKSB7XG4gICAgICAvLyBnbyBiYWNrIHRvIHN0YXJ0XG4gICAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gLT0gd2lkdGg7XG5cbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHgudHJhbnNsYXRlKHRoaXMuY3VycmVudFhQb3NpdGlvbiwgMCk7XG4gICAgICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCB0aGlzLnByZXZpb3VzRnJhbWUsIGlTaGlmdCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGltcGxlbWVudHMgZHJhd0N1cnZlXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICB2YXIgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcbiAgICB2YXIgcmFkaXVzID0gdGhpcy5wYXJhbXMucmFkaXVzO1xuICAgIC8vIEBUT0RPIHRoaXMgY2FuIGFuZCBzaG91bGQgYmUgYWJzdHJhY3RlZFxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgLy8gY29sb3Igc2hvdWxkIGJlY2hvc2VuIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yc1tpXTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1tpXTtcblxuICAgICAgdmFyIHBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVtpXSk7XG4gICAgICAvLyBhcyBhbiBvcHRpb25zID8gcmFkaXVzID9cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZGcmFtZSAmJiB0aGlzLnBhcmFtcy5saW5lKSB7XG4gICAgICAgIHZhciBsYXN0UG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKHByZXZGcmFtZVtpXSk7XG4gICAgICAgIC8vIGRyYXcgbGluZVxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oLWlTaGlmdCwgbGFzdFBvc1kpO1xuICAgICAgICBjdHgubGluZVRvKDAsIHBvc1kpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcGY7XG4iXX0=