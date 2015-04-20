"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

// @TODO create a single instance of ArrayBuffer of the last frame

var BaseDraw = (function (_Lfo) {
  function BaseDraw() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    var extendDefaults = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseDraw);

    var defaults = _core.Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100,
      isSynchronized: false // is set to true if used in a synchronizedSink
    }, extendDefaults);

    _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "constructor", this).call(this, options, defaults);

    if (!this.params.canvas) {
      throw new Error("params.canvas is mandatory and must be canvas DOM element");
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.cachedCanvas = document.createElement("canvas");
    this.cachedCtx = this.cachedCanvas.getContext("2d");

    this.ctx.canvas.width = this.cachedCtx.canvas.width = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;
  }

  _inherits(BaseDraw, _Lfo);

  _createClass(BaseDraw, {
    reset: {
      value: function reset() {
        _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "reset", this).call(this);

        this.ctx.clearRect(0, 0, this.params.width, this.params.height);
        this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
      }
    },
    setupStream: {
      value: function setupStream() {
        _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "setupStream", this).call(this);
        this.previousFrame = new Float32Array(this.streamParams.frameSize);
      }
    },
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
        this.previousFrame.set(frame, 0);
        this.previousTime = time;
        _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "process", this).call(this, time, frame);
      }
    },
    scrollModeDraw: {

      // default draw mode

      value: function scrollModeDraw(time, frame) {
        var width = this.params.width;
        var height = this.params.height;
        var duration = this.params.duration;
        var ctx = this.ctx;

        var dt = time - this.previousTime;
        var fShift = dt / duration * width - this.lastShiftError;
        var iShift = Math.round(fShift);
        this.lastShiftError = iShift - fShift;

        var partialShift = iShift - this.currentPartialShift;
        this.shiftCanvas(partialShift);

        // shift all siblings if synchronized
        if (this.params.isSynchronized && this.synchronizer) {
          this.synchronizer.shiftSiblings(partialShift, this);
        }

        // translate to the current frame and draw a new polygon
        ctx.save();
        ctx.translate(width, 0);
        this.drawCurve(frame, this.previousFrame, iShift);
        ctx.restore();
        // update `currentPartialShift`
        this.currentPartialShift -= iShift;
        // save current state into buffer canvas
        this.cachedCtx.clearRect(0, 0, width, height);
        this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);
      }
    },
    shiftCanvas: {
      value: function shiftCanvas(shift) {
        var width = this.params.width;
        var height = this.params.height;
        var ctx = this.ctx;

        this.currentPartialShift += shift;

        this.ctx.clearRect(0, 0, this.params.width, this.params.height);
        ctx.save();

        ctx.drawImage(this.cachedCanvas, this.currentPartialShift, 0, width - this.currentPartialShift, height, 0, 0, width - this.currentPartialShift, height);

        ctx.restore();
      }
    },
    drawCurve: {

      // Must implement the logic to draw the shape between
      // the previous and the current frame.
      // Assuming the context is centered on the current frame

      value: function drawCurve(frame, prevFrame, iShift) {
        console.error("must be implemented");
      }
    }
  });

  return BaseDraw;
})(Lfo);

module.exports = BaseDraw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7OztJQUloQyxRQUFRO0FBQ0QsV0FEUCxRQUFRLEdBQ21DO1FBQW5DLE9BQU8sZ0NBQUcsRUFBRTtRQUFFLGNBQWMsZ0NBQUcsRUFBRTs7MEJBRHpDLFFBQVE7O0FBR1YsUUFBSSxRQUFRLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzNCLGNBQVEsRUFBRSxDQUFDO0FBQ1gsU0FBRyxFQUFFLENBQUMsQ0FBQztBQUNQLFNBQUcsRUFBRSxDQUFDO0FBQ04sV0FBSyxFQUFFLEdBQUc7QUFDVixZQUFNLEVBQUUsR0FBRztBQUNYLG9CQUFjLEVBQUUsS0FBSztBQUFBLEtBQ3RCLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRW5CLHFDQVpFLFFBQVEsNkNBWUosT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztLQUM5RTs7O0FBR0QsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNqQyxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QyxRQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxRSxRQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUUzRSxRQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0QixRQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN4QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0dBQzlCOztZQS9CRyxRQUFROztlQUFSLFFBQVE7QUFpQ1osU0FBSzthQUFBLGlCQUFHO0FBQ04seUNBbENFLFFBQVEsdUNBa0NJOztBQUVkLFlBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxZQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDdkU7O0FBRUQsZUFBVzthQUFBLHVCQUFHO0FBQ1oseUNBekNFLFFBQVEsNkNBeUNVO0FBQ3BCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztPQUNwRTs7QUFNRCxnQkFBWTs7Ozs7OzthQUFBLHNCQUFDLEtBQUssRUFBRTs7O0FBR2xCLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQzFCLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQzFCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUVoQyxlQUFPLEFBQUMsQUFBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUEsSUFBSyxLQUFLLEdBQUcsR0FBRyxDQUFBLEFBQUMsSUFBSyxHQUFHLEdBQUcsR0FBRyxDQUFBLEFBQUMsR0FBSSxNQUFNLENBQUM7T0FDaEU7O0FBSUQsZUFBVzs7Ozs7YUFBQSxxQkFBQyxRQUFRLEVBQUU7QUFDcEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO09BQ2pDOztBQUVELFVBQU07YUFBQSxnQkFBQyxHQUFHLEVBQUU7QUFDVixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7T0FDdkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLEdBQUcsRUFBRTtBQUNWLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztPQUN2Qjs7QUFHRCxXQUFPOzs7O2FBQUEsaUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNuQixZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIseUNBN0VFLFFBQVEseUNBNkVJLElBQUksRUFBRSxLQUFLLEVBQUU7T0FDNUI7O0FBR0Qsa0JBQWM7Ozs7YUFBQSx3QkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQzFCLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hDLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3BDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7O0FBRW5CLFlBQUksRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2xDLFlBQUksTUFBTSxHQUFHLEFBQUMsRUFBRSxHQUFHLFFBQVEsR0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUMzRCxZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxZQUFZLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztBQUNyRCxZQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7QUFHL0IsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ25ELGNBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDs7O0FBR0QsV0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsV0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxXQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWQsWUFBSSxDQUFDLG1CQUFtQixJQUFJLE1BQU0sQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM1RDs7QUFFRCxlQUFXO2FBQUEscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlCLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7O0FBRW5CLFlBQUksQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUM7O0FBRWxDLFlBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxXQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsV0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUM3QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxFQUNyRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUMvQyxDQUFDOztBQUVGLFdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNmOztBQUtELGFBQVM7Ozs7OzthQUFBLG1CQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLGVBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN0Qzs7OztTQXZJRyxRQUFRO0dBQVMsR0FBRzs7QUEwSTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuXG4vLyBAVE9ETyBjcmVhdGUgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgQXJyYXlCdWZmZXIgb2YgdGhlIGxhc3QgZnJhbWVcbmNsYXNzIEJhc2VEcmF3IGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCBleHRlbmREZWZhdWx0cyA9IHt9KSB7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgICAgbWluOiAtMSxcbiAgICAgIG1heDogMSxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIGlzU3luY2hyb25pemVkOiBmYWxzZSAvLyBpcyBzZXQgdG8gdHJ1ZSBpZiB1c2VkIGluIGEgc3luY2hyb25pemVkU2lua1xuICAgIH0sIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIHN1cGVyKG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhcmFtcy5jYW52YXMgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGNhbnZhcyBET00gZWxlbWVudCcpO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmN0eC5jYW52YXMud2lkdGggID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLndpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCA9IDA7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICB9XG5cbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81Mjk0OTU1L2hvdy10by1zY2FsZS1kb3duLWEtcmFuZ2Utb2YtbnVtYmVycy13aXRoLWEta25vd24tbWluLWFuZC1tYXgtdmFsdWVcbiAgLy8gICAgICAgICAgKGItYSkoeCAtIG1pbilcbiAgLy8gZih4KSA9IC0tLS0tLS0tLS0tLS0tICArIGFcbiAgLy8gICAgICAgICAgIG1heCAtIG1pblxuICBnZXRZUG9zaXRpb24odmFsdWUpIHtcbiAgICAvLyBhID0gaGVpZ2h0XG4gICAgLy8gYiA9IDBcbiAgICB2YXIgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIHZhciBtYXggPSB0aGlzLnBhcmFtcy5tYXg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHJldHVybiAoKCgwIC0gaGVpZ2h0KSAqICh2YWx1ZSAtIG1pbikpIC8gKG1heCAtIG1pbikpICsgaGVpZ2h0O1xuICB9XG5cbiAgLy8gcGFyYW1zIG1vZGlmaWVyc1xuICAgIC8vIHBhcmFtcyBtb2RpZmllclxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xuICAgIHRoaXMucGFyYW1zLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIH1cblxuICBzZXRNaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICB9XG5cbiAgc2V0TWF4KG1heCkge1xuICAgIHRoaXMucGFyYW1zLm1heCA9IG1heDtcbiAgfVxuXG4gIC8vIG1haW4gcHJvY2VzcyBtZXRob2RcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgZHJhdyBtb2RlXG4gIHNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgdmFyIGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjtcbiAgICB2YXIgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB2YXIgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpIHtcbiAgICAgIHRoaXMuc3luY2hyb25pemVyLnNoaWZ0U2libGluZ3MocGFydGlhbFNoaWZ0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYWNoZWRDYW52YXMsXG4gICAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIDAsIHdpZHRoIC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCBoZWlnaHQsXG4gICAgICAwLCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0XG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICAvLyBNdXN0IGltcGxlbWVudCB0aGUgbG9naWMgdG8gZHJhdyB0aGUgc2hhcGUgYmV0d2VlblxuICAvLyB0aGUgcHJldmlvdXMgYW5kIHRoZSBjdXJyZW50IGZyYW1lLlxuICAvLyBBc3N1bWluZyB0aGUgY29udGV4dCBpcyBjZW50ZXJlZCBvbiB0aGUgY3VycmVudCBmcmFtZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc29sZS5lcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZURyYXc7XG5cblxuIl19