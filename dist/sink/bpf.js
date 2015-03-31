"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseDraw = require("./base-draw");

var _require = require("../utils/draw-utils");

var getRandomColor = _require.getRandomColor;

var Bpf = (function (_BaseDraw) {
  function Bpf(options) {
    _classCallCheck(this, Bpf);

    var defaults = {
      trigger: false,
      radius: 0,
      line: true
    };

    _get(_core.Object.getPrototypeOf(Bpf.prototype), "constructor", this).call(this, options, defaults);
    // for loop mode
    this.currentXPosition = 0;
  }

  _inherits(Bpf, _BaseDraw);

  _createClass(Bpf, {
    initialize: {
      value: function initialize() {
        _get(_core.Object.getPrototypeOf(Bpf.prototype), "initialize", this).call(this);

        // create an array of colors according to the `outFrame` size
        if (!this.params.colors) {
          this.params.colors = [];
          for (var i = 0, l = this.streamParams.frameSize; i < l; i++) {
            this.params.colors.push(getRandomColor());
          }
        }
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
//# sourceMappingURL=data:application/json;base64,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LEVBQUUsQ0FBQztXQUNqQjs7QUFFRCxhQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDZjtPQUNGOzs7O1NBbkhHLEdBQUc7R0FBUyxRQUFROztBQXNIMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZXM2L3NpbmsvYnBmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQmFzZURyYXcgPSByZXF1aXJlKCcuL2Jhc2UtZHJhdycpO1xudmFyIHsgZ2V0UmFuZG9tQ29sb3IgfSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RyYXctdXRpbHMnKTtcblxuY2xhc3MgQnBmIGV4dGVuZHMgQmFzZURyYXcge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHJpZ2dlcjogZmFsc2UsXG4gICAgICByYWRpdXM6IDAsXG4gICAgICBsaW5lOiB0cnVlXG4gICAgfTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcbiAgICAvLyBmb3IgbG9vcCBtb2RlXG4gICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uID0gMDtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gY3JlYXRlIGFuIGFycmF5IG9mIGNvbG9ycyBhY2NvcmRpbmcgdG8gdGhlIGBvdXRGcmFtZWAgc2l6ZVxuICAgIGlmICghdGhpcy5wYXJhbXMuY29sb3JzKSB7XG4gICAgICB0aGlzLnBhcmFtcy5jb2xvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRoaXMucGFyYW1zLmNvbG9ycy5wdXNoKGdldFJhbmRvbUNvbG9yKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIHNldFRyaWdnZXIoYm9vbCkge1xuICAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHJlc2V0IGN1cnJlbnRYUG9zaXRpb25cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICB9XG5cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIC8vIEBUT0RPOiBjb21wYXJlIGR0IC0gaWYgZHQgPCBmcHMgcmV0dXJuO1xuICAgIGlmICh0aGlzLnBhcmFtcy50cmlnZ2VyKSB7XG4gICAgICB0aGlzLnRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICAgIH1cblxuICAgIHN1cGVyLnByb2Nlc3ModGltZSwgZnJhbWUpO1xuICB9XG5cbiAgLy8gYWRkIGFuIGFsdGVybmF0aXZlIGRyYXdpbmcgbW9kZVxuICAvLyBkcmF3IGZyb20gbGVmdCB0byByaWdodCwgZ28gYmFjayB0byBsZWZ0IHdoZW4gPiB3aWR0aFxuICB0cmlnZ2VyTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICB2YXIgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgdmFyIGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjsgLy8gcHhcbiAgICB2YXIgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyBpbXBsZW1lbnRzIGRyYXdDdXJ2ZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgdmFyIGNvbG9ycyA9IHRoaXMucGFyYW1zLmNvbG9ycztcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG4gICAgdmFyIHJhZGl1cyA9IHRoaXMucGFyYW1zLnJhZGl1cztcbiAgICAvLyBAVE9ETyB0aGlzIGNhbiBhbmQgc2hvdWxkIGJlIGFic3RyYWN0ZWRcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZyYW1lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIC8vIGNvbG9yIHNob3VsZCBiZWNob3NlbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNbaV07XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcnNbaV07XG5cbiAgICAgIHZhciBwb3NZID0gdGhpcy5nZXRZUG9zaXRpb24oZnJhbWVbaV0pO1xuICAgICAgLy8gYXMgYW4gb3B0aW9ucyA/IHJhZGl1cyA/XG4gICAgICBpZiAocmFkaXVzID4gMCkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMoMCwgcG9zWSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2RnJhbWUgJiYgdGhpcy5wYXJhbXMubGluZSkge1xuICAgICAgICB2YXIgbGFzdFBvc1kgPSB0aGlzLmdldFlQb3NpdGlvbihwcmV2RnJhbWVbaV0pO1xuICAgICAgICAvLyBkcmF3IGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKC1pU2hpZnQsIGxhc3RQb3NZKTtcbiAgICAgICAgY3R4LmxpbmVUbygwLCBwb3NZKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnBmO1xuIl19