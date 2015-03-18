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
      height: 100,
      isSynchronized: false // is set to true if used in a synchronizedSink
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

        ctx.clearRect(0, 0, width, height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFYyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQW5DLEdBQUcsWUFBSCxHQUFHOztJQUVILFFBQVE7QUFDRCxXQURQLFFBQVEsQ0FDQSxRQUFRLEVBQUUsT0FBTyxFQUF1QjtRQUFyQixjQUFjLGdDQUFHLEVBQUU7OzBCQUQ5QyxRQUFROztBQUdWLFFBQUksUUFBUSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMzQixjQUFRLEVBQUUsQ0FBQztBQUNYLFNBQUcsRUFBRSxDQUFDLENBQUM7QUFDUCxTQUFHLEVBQUUsQ0FBQztBQUNOLFdBQUssRUFBRSxHQUFHO0FBQ1YsWUFBTSxFQUFFLEdBQUc7QUFDWCxvQkFBYyxFQUFFLEtBQUs7QUFBQSxLQUN0QixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUVuQixxQ0FaRSxRQUFRLDZDQVlKLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDdkIsWUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0tBQ25GOzs7QUFHRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhDLFFBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwRCxRQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUksSUFBSSxDQUFDLFNBQVMsQ0FB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QUUsQ0FBQztPQUNmOztBQUtELGFBQVM7Ozs7OzthQUFBLG1CQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLGVBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN0Qzs7OztTQTVIRyxRQUFRO0dBQVMsR0FBRzs7QUErSDFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgTGZvIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xmby1iYXNlJyk7XG5cbmNsYXNzIEJhc2VEcmF3IGV4dGVuZHMgTGZvIHtcbiAgY29uc3RydWN0b3IocHJldmlvdXMsIG9wdGlvbnMsIGV4dGVuZERlZmF1bHRzID0ge30pIHtcblxuICAgIHZhciBkZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZHVyYXRpb246IDEsXG4gICAgICBtaW46IC0xLFxuICAgICAgbWF4OiAxLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgaXNTeW5jaHJvbml6ZWQ6IGZhbHNlIC8vIGlzIHNldCB0byB0cnVlIGlmIHVzZWQgaW4gYSBzeW5jaHJvbml6ZWRTaW5rXG4gICAgfSwgZXh0ZW5kRGVmYXVsdHMpO1xuXG4gICAgc3VwZXIocHJldmlvdXMsIG9wdGlvbnMsIGRlZmF1bHRzKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JwZjogcGFyYW1zLmNhbnZhcyBpcyBtYW5kYXRvcnkgYW5kIG11c3QgYmUgY2FudmFzIERPTSBlbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgLy8gcHJlcGFyZSBjYW52YXNcbiAgICB0aGlzLmNhbnZhcyA9IHRoaXMucGFyYW1zLmNhbnZhcztcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmNhY2hlZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY2FjaGVkQ3R4ID0gdGhpcy5jYWNoZWRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMud2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgdGhpcy5jdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FjaGVkQ3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gMDtcblxuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCA9IDA7XG4gIH1cblxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyOTQ5NTUvaG93LXRvLXNjYWxlLWRvd24tYS1yYW5nZS1vZi1udW1iZXJzLXdpdGgtYS1rbm93bi1taW4tYW5kLW1heC12YWx1ZVxuICAvLyAgICAgICAgICAoYi1hKSh4IC0gbWluKVxuICAvLyBmKHgpID0gLS0tLS0tLS0tLS0tLS0gICsgYVxuICAvLyAgICAgICAgICAgbWF4IC0gbWluXG4gIGdldFlQb3NpdGlvbih2YWx1ZSkge1xuICAgIC8vIGEgPSBoZWlnaHRcbiAgICAvLyBiID0gMFxuICAgIHZhciBtaW4gPSB0aGlzLnBhcmFtcy5taW47XG4gICAgdmFyIG1heCA9IHRoaXMucGFyYW1zLm1heDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgcmV0dXJuICgoKDAgLSBoZWlnaHQpICogKHZhbHVlIC0gbWluKSkgLyAobWF4IC0gbWluKSkgKyBoZWlnaHQ7XG4gIH1cblxuICAvLyBwYXJhbXMgbW9kaWZpZXJzXG4gICAgLy8gcGFyYW1zIG1vZGlmaWVyXG4gIHNldER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHNldE1pbihtaW4pIHtcbiAgICB0aGlzLnBhcmFtcy5taW4gPSBtaW47XG4gIH1cblxuICBzZXRNYXgobWF4KSB7XG4gICAgdGhpcy5wYXJhbXMubWF4ID0gbWF4O1xuICB9XG5cbiAgLy8gbWFpbiBwcm9jZXNzIG1ldGhvZFxuICBwcm9jZXNzKHRpbWUsIGZyYW1lKSB7XG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbmV3IEZsb2F0MzJBcnJheShmcmFtZSk7XG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSB0aW1lO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBkcmF3IG1vZGVcbiAgc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICB2YXIgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHZhciBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuICAgIHZhciBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgICB2YXIgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yO1xuICAgIHZhciBpU2hpZnQgPSBNYXRoLnJvdW5kKGZTaGlmdCk7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IGlTaGlmdCAtIGZTaGlmdDtcblxuICAgIHZhciBwYXJ0aWFsU2hpZnQgPSBpU2hpZnQgLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQ7XG4gICAgdGhpcy5zaGlmdENhbnZhcyhwYXJ0aWFsU2hpZnQpO1xuXG4gICAgLy8gc2hpZnQgYWxsIHNpYmxpbmdzIGlmIHN5bmNocm9uaXplZFxuICAgIGlmICh0aGlzLnBhcmFtcy5pc1N5bmNocm9uaXplZCAmJiB0aGlzLnN5bmNocm9uaXplcikge1xuICAgICAgdGhpcy5zeW5jaHJvbml6ZXIuc2hpZnRTaWJsaW5ncyhwYXJ0aWFsU2hpZnQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8vIHRyYW5zbGF0ZSB0byB0aGUgY3VycmVudCBmcmFtZSBhbmQgZHJhdyBhIG5ldyBwb2x5Z29uXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCAwKTtcbiAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgLy8gdXBkYXRlIGBjdXJyZW50UGFydGlhbFNoaWZ0YFxuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCAtPSBpU2hpZnQ7XG4gICAgLy8gc2F2ZSBjdXJyZW50IHN0YXRlIGludG8gYnVmZmVyIGNhbnZhc1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgc2hpZnRDYW52YXMoc2hpZnQpIHtcbiAgICB2YXIgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB2YXIgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHZhciBjdHggPSB0aGlzLmN0eDtcblxuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCArPSBzaGlmdDtcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYWNoZWRDYW52YXMsXG4gICAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIDAsIHdpZHRoIC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCBoZWlnaHQsXG4gICAgICAwLCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0XG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICAvLyBNdXN0IGltcGxlbWVudCB0aGUgbG9naWMgdG8gZHJhdyB0aGUgc2hhcGUgYmV0d2VlblxuICAvLyB0aGUgcHJldmlvdXMgYW5kIHRoZSBjdXJyZW50IGZyYW1lLlxuICAvLyBBc3N1bWluZyB0aGUgY29udGV4dCBpcyBjZW50ZXJlZCBvbiB0aGUgY3VycmVudCBmcmFtZVxuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc29sZS5lcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZURyYXc7XG5cblxuIl19