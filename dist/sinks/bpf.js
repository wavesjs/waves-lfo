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
    key: 'process',
    value: function process(time, frame) {
      // @TODO: compare dt - if dt < fps return; (?)
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
})(_baseDraw2['default']);

exports['default'] = Bpf;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LCJmaWxlIjoiZXM2L3NpbmtzL2JwZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEJhc2VEcmF3IGZyb20gJy4vYmFzZS1kcmF3JztcbmltcG9ydCB7IGdldFJhbmRvbUNvbG9yIH0gZnJvbSAnLi4vdXRpbHMvZHJhdy11dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJwZiBleHRlbmRzIEJhc2VEcmF3IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdHJpZ2dlcjogZmFsc2UsXG4gICAgICByYWRpdXM6IDAsXG4gICAgICBsaW5lOiB0cnVlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgICAvLyBmb3IgbG9vcCBtb2RlXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gY3JlYXRlIGFuIGFycmF5IG9mIGNvbG9ycyBhY2NvcmRpbmcgdG8gdGhlIGBvdXRGcmFtZWAgc2l6ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3JzKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucGFyYW1zLmNvbG9ycy5wdXNoKGdldFJhbmRvbUNvbG9yKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIHNldFRyaWdnZXIoYm9vbCkge1xuICAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHJlc2V0IGN1cnJlbnRYUG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIC8vIEBUT0RPOiBjb21wYXJlIGR0IC0gaWYgZHQgPCBmcHMgcmV0dXJuOyAoPylcbiAgICBpZiAodGhpcy5wYXJhbXMudHJpZ2dlcikge1xuICAgICAgdGhpcy50cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgICB9XG5cbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGFkZCBhbiBhbHRlcm5hdGl2ZSBkcmF3aW5nIG1vZGVcbiAgLy8gZHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjb25zdCBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICBjb25zdCBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gICAgY29uc3QgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW1lbnRzIGRyYXdDdXJ2ZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5wYXJhbXMuY29sb3JzO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcbiAgICAvLyBAVE9ETyB0aGlzIGNhbiBhbmQgc2hvdWxkIGJlIGFic3RyYWN0ZWRcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGNvbG9yIHNob3VsZCBiZWNob3NlbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNbaV07XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbaV07XG5cbiAgICAgIGNvbnN0IHBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihmcmFtZVtpXSk7XG4gICAgICAvLyBhcyBhbiBvcHRpb25zID8gcmFkaXVzID9cbiAgICAgIGlmIChyYWRpdXMgPiAwKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYygwLCBwb3NZLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZGcmFtZSAmJiB0aGlzLnBhcmFtcy5saW5lKSB7XG4gICAgICAgIGNvbnN0IGxhc3RQb3NZID0gdGhpcy5nZXRZUG9zaXRpb24ocHJldkZyYW1lW2ldKTtcbiAgICAgICAgLy8gZHJhdyBsaW5lXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygtaVNoaWZ0LCBsYXN0UG9zWSk7XG4gICAgICAgIGN0eC5saW5lVG8oMCwgcG9zWSk7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuXG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxufVxuIl19