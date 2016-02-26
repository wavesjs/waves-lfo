'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _utilsDrawUtils = require('../utils/draw-utils');

var Bpf = (function (_BaseDraw) {
  _inherits(Bpf, _BaseDraw);

  function Bpf(options) {
    _classCallCheck(this, Bpf);

    _get(Object.getPrototypeOf(Bpf.prototype), 'constructor', this).call(this, {
      trigger: false,
      radius: 0,
      line: true
    }, options);

    // for loop mode
    this.currentXPosition = 0;
  }

  _createClass(Bpf, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(Bpf.prototype), 'initialize', this).call(this, inStreamParams);

      // create an array of colors according to the `outFrame` size
      if (!this.params.colors) {
        this.params.colors = [];

        for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
          this.params.colors.push((0, _utilsDrawUtils.getRandomColor)());
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
    key: 'executeDraw',
    value: function executeDraw(time, frame) {
      if (this.params.trigger) this.triggerModeDraw(time, frame);else this.scrollModeDraw(time, frame);

      _get(Object.getPrototypeOf(Bpf.prototype), 'process', this).call(this, time, frame);
    }

    /**
     * Alternative drawing mode.
     * Draw from left to right, go back to left when > width
     */
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
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      var colors = this.params.colors;
      var ctx = this.ctx;
      var radius = this.params.radius;

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
})(_baseDraw2['default']);

exports['default'] = Bpf;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHRyaWdnZXI6IGZhbHNlLFxuICAgICAgcmFkaXVzOiAwLFxuICAgICAgbGluZTogdHJ1ZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gZm9yIGxvb3AgbW9kZVxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGUgYG91dEZyYW1lYCBzaXplXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jb2xvcnMpIHtcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9ycyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgICAgdGhpcy5wYXJhbXMuY29sb3JzLnB1c2goZ2V0UmFuZG9tQ29sb3IoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWxsb3cgdG8gd2l0Y2ggZWFzaWx5IGJldHdlZW4gdGhlIDIgbW9kZXNcbiAgc2V0VHJpZ2dlcihib29sKSB7XG4gICAgdGhpcy5wYXJhbXMudHJpZ2dlciA9IGJvb2w7XG4gICAgLy8gY2xlYXIgY2FudmFzIGFuZCBjYWNoZVxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgLy8gcmVzZXQgY3VycmVudFhQb3NpdGlvblxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gIH1cblxuICBleGVjdXRlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIGlmICh0aGlzLnBhcmFtcy50cmlnZ2VyKVxuICAgICAgdGhpcy50cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuXG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWx0ZXJuYXRpdmUgZHJhd2luZyBtb2RlLlxuICAgKiBEcmF3IGZyb20gbGVmdCB0byByaWdodCwgZ28gYmFjayB0byBsZWZ0IHdoZW4gPiB3aWR0aFxuICAgKi9cbiAgdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjb25zdCBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICBjb25zdCBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gICAgY29uc3QgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgLy8gY29sb3Igc2hvdWxkIGJlY2hvc2VuIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yc1tpXTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1tpXTtcblxuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldKTtcbiAgICAgIC8vIGFzIGFuIG9wdGlvbnMgPyByYWRpdXMgP1xuICAgICAgaWYgKHJhZGl1cyA+IDApIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguYXJjKDAsIHBvc1ksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldkZyYW1lICYmIHRoaXMucGFyYW1zLmxpbmUpIHtcbiAgICAgICAgY29uc3QgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbaV0pO1xuICAgICAgICAvLyBkcmF3IGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=