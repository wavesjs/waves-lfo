"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var Lfo = require("../core/lfo-base");

// @TODO create a single instance of ArrayBuffer of the last frame

var BaseDraw = (function (_Lfo) {
  function BaseDraw(previous, options) {
    var extendDefaults = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BaseDraw);

    var defaults = _core.Object.assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100,
      isSynchronized: false // is set to true if used in a synchronizedSink
    }, extendDefaults);

    _get(_core.Object.getPrototypeOf(BaseDraw.prototype), "constructor", this).call(this, previous, options, defaults);

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

    this.previousFrame = null;
    this.previousTime = 0;

    this.lastShiftError = 0;
    this.currentPartialShift = 0;
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

        this.clear();
        ctx.save();

        ctx.drawImage(this.cachedCanvas, this.currentPartialShift, 0, width - this.currentPartialShift, height, 0, 0, width - this.currentPartialShift, height);

        ctx.restore();
      }
    },
    clear: {
      value: function clear() {
        this.ctx.clearRect(0, 0, this.params.width, this.params.height);
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
//# sourceMappingURL=data:application/json;base64,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QU8sRUFBRSxDQUFDO09BQ2Y7O0FBRUQsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2pFOztBQUtELGFBQVM7Ozs7OzthQUFBLG1CQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLGVBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN0Qzs7OztTQWpJRyxRQUFRO0dBQVMsR0FBRzs7QUFvSTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIExmbyA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuXG4vLyBAVE9ETyBjcmVhdGUgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgQXJyYXlCdWZmZXIgb2YgdGhlIGxhc3QgZnJhbWVcbmNsYXNzIEJhc2VEcmF3IGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMsIGV4dGVuZERlZmF1bHRzID0ge30pIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZHVyYXRpb246IDEsXG4gICAgICBtaW46IC0xLFxuICAgICAgbWF4OiAxLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgaXNTeW5jaHJvbml6ZWQ6IGZhbHNlIC8vIGlzIHNldCB0byB0cnVlIGlmIHVzZWQgaW4gYSBzeW5jaHJvbml6ZWRTaW5rXG4gICAgfSwgZXh0ZW5kRGVmYXVsdHMpO1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhcmFtcy5jYW52YXMgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGNhbnZhcyBET00gZWxlbWVudCcpO1xuICAgIH1cblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmN0eC5jYW52YXMud2lkdGggID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLndpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IDA7XG5cbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gMDtcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgPSAwO1xuICB9XG5cbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81Mjk0OTU1L2hvdy10by1zY2FsZS1kb3duLWEtcmFuZ2Utb2YtbnVtYmVycy13aXRoLWEta25vd24tbWluLWFuZC1tYXgtdmFsdWVcbiAgLy8gICAgICAgICAgKGItYSkoeCAtIG1pbilcbiAgLy8gZih4KSA9IC0tLS0tLS0tLS0tLS0tICArIGFcbiAgLy8gICAgICAgICAgIG1heCAtIG1pblxuICBnZXRZUG9zaXRpb24odmFsdWUpIHtcbiAgICAvLyBhID0gaGVpZ2h0XG4gICAgLy8gYiA9IDBcbiAgICB2YXIgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIHZhciBtYXggPSB0aGlzLnBhcmFtcy5tYXg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHJldHVybiAoKCgwIC0gaGVpZ2h0KSAqICh2YWx1ZSAtIG1pbikpIC8gKG1heCAtIG1pbikpICsgaGVpZ2h0O1xuICB9XG5cbiAgLy8gcGFyYW1zIG1vZGlmaWVyc1xuICAgIC8vIHBhcmFtcyBtb2RpZmllclxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xuICAgIHRoaXMucGFyYW1zLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIH1cblxuICBzZXRNaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICB9XG5cbiAgc2V0TWF4KG1heCkge1xuICAgIHRoaXMucGFyYW1zLm1heCA9IG1heDtcbiAgfVxuXG4gIC8vIG1haW4gcHJvY2VzcyBtZXRob2RcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWUpO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgZHJhdyBtb2RlXG4gIHNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB2YXIgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgdmFyIGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjtcbiAgICB2YXIgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgICB2YXIgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpIHtcbiAgICAgIHRoaXMuc3luY2hyb25pemVyLnNoaWZ0U2libGluZ3MocGFydGlhbFNoaWZ0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgdmFyIHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB2YXIgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYWNoZWRDYW52YXMsXG4gICAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIDAsIHdpZHRoIC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCBoZWlnaHQsXG4gICAgICAwLCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0XG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gIH1cblxuICAvLyBNdXN0IGltcGxlbWVudCB0aGUgbG9naWMgdG8gZHJhdyB0aGUgc2hhcGUgYmV0d2VlblxuICAvLyB0aGUgcHJldmlvdXMgYW5kIHRoZSBjdXJyZW50IGZyYW1lLlxuICAvLyBBc3N1bWluZyB0aGUgY29udGV4dCBpcyBjZW50ZXJlZCBvbiB0aGUgY3VycmVudCBmcmFtZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc29sZS5lcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZURyYXc7XG5cblxuIl19