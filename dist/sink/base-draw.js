"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../core/lfo-base");

var Lfo = _require.Lfo;

var BaseDraw = (function (_Lfo) {
  function BaseDraw(previous, options) {
    var extendDefaults = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BaseDraw);

    var defaults = _core.Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100
    }, extendDefaults);

    _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "constructor", this).call(this, previous, options, defaults);

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

    this.lastShiftError = 0;
  }

  _inherits(BaseDraw, _Lfo);

  _createClass(BaseDraw, {
    getYPosition: {

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

      // params modifiers
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
    process: {

      // main process method

      value: function process(time, frame) {
        this.previousFrame = new Float32Array(frame);
        this.previousTime = time;
      }
    },
    scrollModeDraw: {

      // default draw mode

      value: function scrollModeDraw(time, frame) {
        var width = this.params.width;
        var height = this.params.height;
        var duration = this.params.duration;
        var ctx = this.ctx;
        var iShift = 0;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        // copy cached canvas according to dt
        if (this.previousTime) {
          var dt = time - this.previousTime;
          var fShift = dt / duration * width - this.lastShiftError;

          iShift = Math.round(fShift);
          this.lastShiftError = iShift - fShift;

          ctx.drawImage(this.cachedCanvas, iShift, 0, width - iShift, height, 0, 0, width - iShift, height);
        }

        ctx.restore();
        // draw new polygon
        ctx.save();
        ctx.translate(width, iShift);
        this.drawCurve(frame, this.previousFrame, iShift);
        ctx.restore();
        // save current state into buffer canvas
        this.cachedCtx.clearRect(0, 0, width, height);
        this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);
      }
    },
    drawCurve: {

      // must implement the logic to draw between the previous frame and the current frame
      // assuming the context is centered on the current frame

      value: function drawCurve(frame, prevFrame, iShift) {
        console.log("must be implemented");
      }
    }
  });

  return BaseDraw;
})(Lfo);

module.exports = BaseDraw;
//# sourceMappingURL=data:application/json;base64,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RyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVkLFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLFdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsV0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVkLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDNUQ7O0FBSUQsYUFBUzs7Ozs7YUFBQSxtQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxlQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7T0FDcEM7Ozs7U0E1R0csUUFBUTtHQUFTLEdBQUc7O0FBK0cxQixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc2luay9iYXNlLWRyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IExmbyB9ID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5jbGFzcyBCYXNlRHJhdyBleHRlbmRzIExmbyB7XG4gIGNvbnN0cnVjdG9yKHByZXZpb3VzLCBvcHRpb25zLCBleHRlbmREZWZhdWx0cyA9IHt9KSB7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgICAgbWluOiAtMSxcbiAgICAgIG1heDogMSxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICBoZWlnaHQ6IDEwMFxuICAgIH0sIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIHN1cGVyKHByZXZpb3VzLCBvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNhbnZhcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdicGY6IHBhcmFtcy5jYW52YXMgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGNhbnZhcyBET00gZWxlbWVudCcpO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmN0eC5jYW52YXMud2lkdGggID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLndpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IG51bGw7XG5cbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gMDtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTI5NDk1NS9ob3ctdG8tc2NhbGUtZG93bi1hLXJhbmdlLW9mLW51bWJlcnMtd2l0aC1hLWtub3duLW1pbi1hbmQtbWF4LXZhbHVlXG4gIC8vICAgICAgICAgIChiLWEpKHggLSBtaW4pXG4gIC8vIGYoeCkgPSAtLS0tLS0tLS0tLS0tLSAgKyBhXG4gIC8vICAgICAgICAgICBtYXggLSBtaW5cbiAgZ2V0WVBvc2l0aW9uKHZhbHVlKSB7XG4gICAgLy8gYSA9IGhlaWdodFxuICAgIC8vIGIgPSAwXG4gICAgdmFyIG1pbiA9IHRoaXMucGFyYW1zLm1pbjtcbiAgICB2YXIgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICByZXR1cm4gKCgoMCAtIGhlaWdodCkgKiAodmFsdWUgLSBtaW4pKSAvIChtYXggLSBtaW4pKSArIGhlaWdodDtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllcnNcbiAgICAvLyBwYXJhbXMgbW9kaWZpZXJcbiAgc2V0RHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICB0aGlzLnBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2V0TWluKG1pbikge1xuICAgIHRoaXMucGFyYW1zLm1pbiA9IG1pbjtcbiAgfVxuXG4gIHNldE1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gIH1cblxuICAvLyBtYWluIHByb2Nlc3MgbWV0aG9kXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IHRpbWU7XG4gIH1cblxuICAvLyBkZWZhdWx0IGRyYXcgbW9kZVxuICBzY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHZhciB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuICAgIHZhciBpU2hpZnQgPSAwO1xuXG4gICAgLy8gY2xlYXIgY2FudmFzXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgLy8gY29weSBjYWNoZWQgY2FudmFzIGFjY29yZGluZyB0byBkdFxuICAgIGlmICh0aGlzLnByZXZpb3VzVGltZSkge1xuICAgICAgdmFyIGR0ID0gdGltZSAtIHRoaXMucHJldmlvdXNUaW1lO1xuICAgICAgdmFyIGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjtcblxuICAgICAgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IGlTaGlmdCAtIGZTaGlmdDtcblxuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhY2hlZENhbnZhcyxcbiAgICAgICAgaVNoaWZ0LCAwLCB3aWR0aCAtIGlTaGlmdCwgaGVpZ2h0LFxuICAgICAgICAwLCAwLCB3aWR0aCAtIGlTaGlmdCwgaGVpZ2h0XG4gICAgICApO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgLy8gZHJhdyBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgaVNoaWZ0KTtcbiAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgLy8gc2F2ZSBjdXJyZW50IHN0YXRlIGludG8gYnVmZmVyIGNhbnZhc1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLy8gbXVzdCBpbXBsZW1lbnQgdGhlIGxvZ2ljIHRvIGRyYXcgYmV0d2VlbiB0aGUgcHJldmlvdXMgZnJhbWUgYW5kIHRoZSBjdXJyZW50IGZyYW1lXG4gIC8vIGFzc3VtaW5nIHRoZSBjb250ZXh0IGlzIGNlbnRlcmVkIG9uIHRoZSBjdXJyZW50IGZyYW1lXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zb2xlLmxvZygnbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZURyYXc7XG5cblxuIl19