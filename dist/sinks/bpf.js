'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseDraw = require('./base-draw');

var _baseDraw2 = _interopRequireDefault(_baseDraw);

var _drawUtils = require('../utils/draw-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bpf = function (_BaseDraw) {
  (0, _inherits3.default)(Bpf, _BaseDraw);

  function Bpf(options) {
    (0, _classCallCheck3.default)(this, Bpf);


    // for loop mode

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Bpf).call(this, {
      trigger: false,
      radius: 0,
      line: true
    }, options));

    _this.currentXPosition = 0;
    return _this;
  }

  (0, _createClass3.default)(Bpf, [{
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Bpf.prototype), 'initialize', this).call(this, inStreamParams);

      // create an array of colors according to the `outFrame` size
      if (!this.params.colors) {
        this.params.colors = [];

        for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
          this.params.colors.push((0, _drawUtils.getRandomColor)());
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

      (0, _get3.default)((0, _getPrototypeOf2.default)(Bpf.prototype), 'process', this).call(this, time, frame);
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
}(_baseDraw2.default);

exports.default = Bpf;
//# sourceMappingURL=data:application/json;base64,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QztBQUlqQyxjQUFJLE1BQUosQ0FBVyxDQUFDLE1BQUQsRUFBUyxRQUFwQixFQUppQztBQUtqQyxjQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsSUFBZCxFQUxpQztBQU1qQyxjQUFJLE1BQUosR0FOaUM7QUFPakMsY0FBSSxTQUFKLEdBUGlDO1NBQW5DOztBQVVBLFlBQUksT0FBSixHQXpCNEM7T0FBOUM7OztTQXRGaUIiLCJmaWxlIjoiYnBmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHRyaWdnZXI6IGZhbHNlLFxuICAgICAgcmFkaXVzOiAwLFxuICAgICAgbGluZTogdHJ1ZVxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gZm9yIGxvb3AgbW9kZVxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICAvLyBjcmVhdGUgYW4gYXJyYXkgb2YgY29sb3JzIGFjY29yZGluZyB0byB0aGUgYG91dEZyYW1lYCBzaXplXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jb2xvcnMpIHtcbiAgICAgIHRoaXMucGFyYW1zLmNvbG9ycyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTsgaSA8IGw7IGkrKylcbiAgICAgICAgdGhpcy5wYXJhbXMuY29sb3JzLnB1c2goZ2V0UmFuZG9tQ29sb3IoKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWxsb3cgdG8gd2l0Y2ggZWFzaWx5IGJldHdlZW4gdGhlIDIgbW9kZXNcbiAgc2V0VHJpZ2dlcihib29sKSB7XG4gICAgdGhpcy5wYXJhbXMudHJpZ2dlciA9IGJvb2w7XG4gICAgLy8gY2xlYXIgY2FudmFzIGFuZCBjYWNoZVxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgLy8gcmVzZXQgY3VycmVudFhQb3NpdGlvblxuICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gIH1cblxuICBleGVjdXRlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIGlmICh0aGlzLnBhcmFtcy50cmlnZ2VyKVxuICAgICAgdGhpcy50cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuXG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWx0ZXJuYXRpdmUgZHJhd2luZyBtb2RlLlxuICAgKiBEcmF3IGZyb20gbGVmdCB0byByaWdodCwgZ28gYmFjayB0byBsZWZ0IHdoZW4gPiB3aWR0aFxuICAgKi9cbiAgdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjb25zdCBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICBjb25zdCBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gICAgY29uc3QgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZnJhbWUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgLy8gY29sb3Igc2hvdWxkIGJlY2hvc2VuIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yc1tpXTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yc1tpXTtcblxuICAgICAgY29uc3QgcG9zWSA9IHRoaXMuZ2V0WVBvc2l0aW9uKGZyYW1lW2ldKTtcbiAgICAgIC8vIGFzIGFuIG9wdGlvbnMgPyByYWRpdXMgP1xuICAgICAgaWYgKHJhZGl1cyA+IDApIHtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguYXJjKDAsIHBvc1ksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldkZyYW1lICYmIHRoaXMucGFyYW1zLmxpbmUpIHtcbiAgICAgICAgY29uc3QgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbaV0pO1xuICAgICAgICAvLyBkcmF3IGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=