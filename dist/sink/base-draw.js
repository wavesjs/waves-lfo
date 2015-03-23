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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFYyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQW5DLEdBQUcsWUFBSCxHQUFHOztJQUVILFFBQVE7QUFDRCxXQURQLFFBQVEsQ0FDQSxRQUFRLEVBQUUsT0FBTyxFQUF1QjtRQUFyQixjQUFjLGdDQUFHLEVBQUU7OzBCQUQ5QyxRQUFROztBQUdWLFFBQUksUUFBUSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMzQixjQUFRLEVBQUUsQ0FBQztBQUNYLFNBQUcsRUFBRSxDQUFDLENBQUM7QUFDUCxTQUFHLEVBQUUsQ0FBQztBQUNOLFdBQUssRUFBRSxHQUFHO0FBQ1YsWUFBTSxFQUFFLEdBQUc7QUFDWCxvQkFBYyxFQUFFLEtBQUs7QUFBQSxLQUN0QixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUVuQixxQ0FaRSxRQUFRLDZDQVlKLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFOztBQUVuQyxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDdkIsWUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO0tBQ25GOzs7QUFHRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhDLFFBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwRCxRQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUksSUFBSSxDQUFDLFNBQVMsQ0FB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TyxFQUFFLENBQUM7T0FDZjs7QUFFRCxTQUFLO2FBQUEsaUJBQUc7QUFDTixZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDakU7O0FBS0QsYUFBUzs7Ozs7O2FBQUEsbUJBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7QUFDbEMsZUFBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO09BQ3RDOzs7O1NBaklHLFFBQVE7R0FBUyxHQUFHOztBQW9JMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiZXM2L3NpbmsvYmFzZS1kcmF3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBMZm8gfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGZvLWJhc2UnKTtcblxuY2xhc3MgQmFzZURyYXcgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihwcmV2aW91cywgb3B0aW9ucywgZXh0ZW5kRGVmYXVsdHMgPSB7fSkge1xuXG4gICAgdmFyIGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkdXJhdGlvbjogMSxcbiAgICAgIG1pbjogLTEsXG4gICAgICBtYXg6IDEsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICBpc1N5bmNocm9uaXplZDogZmFsc2UgLy8gaXMgc2V0IHRvIHRydWUgaWYgdXNlZCBpbiBhIHN5bmNocm9uaXplZFNpbmtcbiAgICB9LCBleHRlbmREZWZhdWx0cyk7XG5cbiAgICBzdXBlcihwcmV2aW91cywgb3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jYW52YXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYnBmOiBwYXJhbXMuY2FudmFzIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBiZSBjYW52YXMgRE9NIGVsZW1lbnQnKTtcbiAgICB9XG5cbiAgICAvLyBwcmVwYXJlIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy5wYXJhbXMuY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY2FjaGVkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYWNoZWRDdHggPSB0aGlzLmNhY2hlZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jdHguY2FudmFzLndpZHRoICA9IHRoaXMuY2FjaGVkQ3R4LmNhbnZhcy53aWR0aCAgPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSAwO1xuXG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ID0gMDtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTI5NDk1NS9ob3ctdG8tc2NhbGUtZG93bi1hLXJhbmdlLW9mLW51bWJlcnMtd2l0aC1hLWtub3duLW1pbi1hbmQtbWF4LXZhbHVlXG4gIC8vICAgICAgICAgIChiLWEpKHggLSBtaW4pXG4gIC8vIGYoeCkgPSAtLS0tLS0tLS0tLS0tLSAgKyBhXG4gIC8vICAgICAgICAgICBtYXggLSBtaW5cbiAgZ2V0WVBvc2l0aW9uKHZhbHVlKSB7XG4gICAgLy8gYSA9IGhlaWdodFxuICAgIC8vIGIgPSAwXG4gICAgdmFyIG1pbiA9IHRoaXMucGFyYW1zLm1pbjtcbiAgICB2YXIgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICByZXR1cm4gKCgoMCAtIGhlaWdodCkgKiAodmFsdWUgLSBtaW4pKSAvIChtYXggLSBtaW4pKSArIGhlaWdodDtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllcnNcbiAgICAvLyBwYXJhbXMgbW9kaWZpZXJcbiAgc2V0RHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICB0aGlzLnBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2V0TWluKG1pbikge1xuICAgIHRoaXMucGFyYW1zLm1pbiA9IG1pbjtcbiAgfVxuXG4gIHNldE1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gIH1cblxuICAvLyBtYWluIHByb2Nlc3MgbWV0aG9kXG4gIHByb2Nlc3ModGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lKTtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IHRpbWU7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSk7XG4gIH1cblxuICAvLyBkZWZhdWx0IGRyYXcgbW9kZVxuICBzY3JvbGxNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHZhciB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdmFyIGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgdmFyIGR0ID0gdGltZSAtIHRoaXMucHJldmlvdXNUaW1lO1xuICAgIHZhciBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7XG4gICAgdmFyIGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgdmFyIHBhcnRpYWxTaGlmdCA9IGlTaGlmdCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdDtcbiAgICB0aGlzLnNoaWZ0Q2FudmFzKHBhcnRpYWxTaGlmdCk7XG5cbiAgICAvLyBzaGlmdCBhbGwgc2libGluZ3MgaWYgc3luY2hyb25pemVkXG4gICAgaWYgKHRoaXMucGFyYW1zLmlzU3luY2hyb25pemVkICYmIHRoaXMuc3luY2hyb25pemVyKSB7XG4gICAgICB0aGlzLnN5bmNocm9uaXplci5zaGlmdFNpYmxpbmdzKHBhcnRpYWxTaGlmdCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLy8gdHJhbnNsYXRlIHRvIHRoZSBjdXJyZW50IGZyYW1lIGFuZCBkcmF3IGEgbmV3IHBvbHlnb25cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUod2lkdGgsIDApO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCB0aGlzLnByZXZpb3VzRnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICAvLyB1cGRhdGUgYGN1cnJlbnRQYXJ0aWFsU2hpZnRgXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0IC09IGlTaGlmdDtcbiAgICAvLyBzYXZlIGN1cnJlbnQgc3RhdGUgaW50byBidWZmZXIgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBzaGlmdENhbnZhcyhzaGlmdCkge1xuICAgIHZhciB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdmFyIGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ICs9IHNoaWZ0O1xuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FjaGVkQ2FudmFzLFxuICAgICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0LFxuICAgICAgMCwgMCwgd2lkdGggLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIGhlaWdodFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICB9XG5cbiAgLy8gTXVzdCBpbXBsZW1lbnQgdGhlIGxvZ2ljIHRvIGRyYXcgdGhlIHNoYXBlIGJldHdlZW5cbiAgLy8gdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCBmcmFtZS5cbiAgLy8gQXNzdW1pbmcgdGhlIGNvbnRleHQgaXMgY2VudGVyZWQgb24gdGhlIGN1cnJlbnQgZnJhbWVcbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ211c3QgYmUgaW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VEcmF3O1xuXG5cbiJdfQ==