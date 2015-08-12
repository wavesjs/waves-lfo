'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var Lfo = require('../core/lfo-base');

// @TODO create a single instance of ArrayBuffer of the last frame

var BaseDraw = (function (_Lfo) {
  _inherits(BaseDraw, _Lfo);

  function BaseDraw() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var extendDefaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseDraw);

    var defaults = _Object$assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 100,
      isSynchronized: false // is set to true if used in a synchronizedSink
    }, extendDefaults);

    _get(Object.getPrototypeOf(BaseDraw.prototype), 'constructor', this).call(this, options, defaults);

    if (!this.params.canvas) {
      throw new Error('params.canvas is mandatory and must be canvas DOM element');
    }

    // prepare canvas
    this.canvas = this.params.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.ctx.canvas.width = this.cachedCtx.canvas.width = this.params.width;
    this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height;

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;
  }

  _createClass(BaseDraw, [{
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'reset', this).call(this);

      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    }
  }, {
    key: 'setupStream',
    value: function setupStream() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'setupStream', this).call(this);
      this.previousFrame = new Float32Array(this.streamParams.frameSize);
    }

    // http://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
    //        (b-a)(x - min)
    // f(x) = -------------- + a
    //          max - min
  }, {
    key: 'getYPosition',
    value: function getYPosition(value) {
      // a = height
      // b = 0
      var min = this.params.min;
      var max = this.params.max;
      var height = this.params.height;

      return (0 - height) * (value - min) / (max - min) + height;
    }

    // params modifiers
    // params modifier
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      this.params.duration = duration;
    }
  }, {
    key: 'setMin',
    value: function setMin(min) {
      this.params.min = min;
    }
  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.params.max = max;
    }

    // main process method
  }, {
    key: 'process',
    value: function process(time, frame) {
      this.previousFrame.set(frame, 0);
      this.previousTime = time;
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'process', this).call(this, time, frame);
    }

    // default draw mode
  }, {
    key: 'scrollModeDraw',
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
  }, {
    key: 'shiftCanvas',
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

    // Must implement the logic to draw the shape between
    // the previous and the current frame.
    // Assuming the context is centered on the current frame
  }, {
    key: 'drawCurve',
    value: function drawCurve(frame, prevFrame, iShift) {
      console.error('must be implemented');
    }
  }]);

  return BaseDraw;
})(Lfo);

module.exports = BaseDraw;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztBQUViLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7O0lBSWxDLFFBQVE7WUFBUixRQUFROztBQUNELFdBRFAsUUFBUSxHQUNtQztRQUFuQyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxjQUFjLHlEQUFHLEVBQUU7OzBCQUR6QyxRQUFROztBQUdWLFFBQU0sUUFBUSxHQUFHLGVBQWM7QUFDN0IsY0FBUSxFQUFFLENBQUM7QUFDWCxTQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ1AsU0FBRyxFQUFFLENBQUM7QUFDTixXQUFLLEVBQUUsR0FBRztBQUNWLFlBQU0sRUFBRSxHQUFHO0FBQ1gsb0JBQWMsRUFBRSxLQUFLO0tBQ3RCLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRW5CLCtCQVpFLFFBQVEsNkNBWUosT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLFlBQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztLQUM5RTs7O0FBR0QsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNqQyxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QyxRQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxD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QUksS0FBSyxDQUFDOztBQUVsQyxTQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxTQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQzdCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQ3JFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQy9DLENBQUM7O0FBRUYsU0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2Y7Ozs7Ozs7V0FLUSxtQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxhQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDdEM7OztTQXZJRyxRQUFRO0dBQVMsR0FBRzs7QUEwSTFCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rL2Jhc2UtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgTGZvID0gcmVxdWlyZSgnLi4vY29yZS9sZm8tYmFzZScpO1xuXG5cbi8vIEBUT0RPIGNyZWF0ZSBhIHNpbmdsZSBpbnN0YW5jZSBvZiBBcnJheUJ1ZmZlciBvZiB0aGUgbGFzdCBmcmFtZVxuY2xhc3MgQmFzZURyYXcgZXh0ZW5kcyBMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIGV4dGVuZERlZmF1bHRzID0ge30pIHtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkdXJhdGlvbjogMSxcbiAgICAgIG1pbjogLTEsXG4gICAgICBtYXg6IDEsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICBpc1N5bmNocm9uaXplZDogZmFsc2UgLy8gaXMgc2V0IHRvIHRydWUgaWYgdXNlZCBpbiBhIHN5bmNocm9uaXplZFNpbmtcbiAgICB9LCBleHRlbmREZWZhdWx0cyk7XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNhbnZhcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbXMuY2FudmFzIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBiZSBjYW52YXMgRE9NIGVsZW1lbnQnKTtcbiAgICB9XG5cbiAgICAvLyBwcmVwYXJlIGNhbnZhc1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy5wYXJhbXMuY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY2FjaGVkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYWNoZWRDdHggPSB0aGlzLmNhY2hlZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jdHguY2FudmFzLndpZHRoICA9IHRoaXMuY2FjaGVkQ3R4LmNhbnZhcy53aWR0aCAgPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHRoaXMucHJldmlvdXNUaW1lID0gMDtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gMDtcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgPSAwO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcblxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gIH1cblxuICBzZXR1cFN0cmVhbSgpIHtcbiAgICBzdXBlci5zZXR1cFN0cmVhbSgpO1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTI5NDk1NS9ob3ctdG8tc2NhbGUtZG93bi1hLXJhbmdlLW9mLW51bWJlcnMtd2l0aC1hLWtub3duLW1pbi1hbmQtbWF4LXZhbHVlXG4gIC8vICAgICAgICAoYi1hKSh4IC0gbWluKVxuICAvLyBmKHgpID0gLS0tLS0tLS0tLS0tLS0gKyBhXG4gIC8vICAgICAgICAgIG1heCAtIG1pblxuICBnZXRZUG9zaXRpb24odmFsdWUpIHtcbiAgICAvLyBhID0gaGVpZ2h0XG4gICAgLy8gYiA9IDBcbiAgICBjb25zdCBtaW4gPSB0aGlzLnBhcmFtcy5taW47XG4gICAgY29uc3QgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIHJldHVybiAoKCgwIC0gaGVpZ2h0KSAqICh2YWx1ZSAtIG1pbikpIC8gKG1heCAtIG1pbikpICsgaGVpZ2h0O1xuICB9XG5cbiAgLy8gcGFyYW1zIG1vZGlmaWVyc1xuICAgIC8vIHBhcmFtcyBtb2RpZmllclxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xuICAgIHRoaXMucGFyYW1zLmR1cmF0aW9uID0gZHVyYXRpb247XG4gIH1cblxuICBzZXRNaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICB9XG5cbiAgc2V0TWF4KG1heCkge1xuICAgIHRoaXMucGFyYW1zLm1heCA9IG1heDtcbiAgfVxuXG4gIC8vIG1haW4gcHJvY2VzcyBtZXRob2RcbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgICBzdXBlci5wcm9jZXNzKHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgZHJhdyBtb2RlXG4gIHNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcblxuICAgIGNvbnN0IGR0ID0gdGltZSAtIHRoaXMucHJldmlvdXNUaW1lO1xuICAgIGNvbnN0IGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjtcbiAgICBjb25zdCBpU2hpZnQgPSBNYXRoLnJvdW5kKGZTaGlmdCk7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IGlTaGlmdCAtIGZTaGlmdDtcblxuICAgIGNvbnN0IHBhcnRpYWxTaGlmdCA9IGlTaGlmdCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdDtcbiAgICB0aGlzLnNoaWZ0Q2FudmFzKHBhcnRpYWxTaGlmdCk7XG5cbiAgICAvLyBzaGlmdCBhbGwgc2libGluZ3MgaWYgc3luY2hyb25pemVkXG4gICAgaWYgKHRoaXMucGFyYW1zLmlzU3luY2hyb25pemVkICYmIHRoaXMuc3luY2hyb25pemVyKSB7XG4gICAgICB0aGlzLnN5bmNocm9uaXplci5zaGlmdFNpYmxpbmdzKHBhcnRpYWxTaGlmdCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLy8gdHJhbnNsYXRlIHRvIHRoZSBjdXJyZW50IGZyYW1lIGFuZCBkcmF3IGEgbmV3IHBvbHlnb25cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUod2lkdGgsIDApO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCB0aGlzLnByZXZpb3VzRnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICAvLyB1cGRhdGUgYGN1cnJlbnRQYXJ0aWFsU2hpZnRgXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0IC09IGlTaGlmdDtcbiAgICAvLyBzYXZlIGN1cnJlbnQgc3RhdGUgaW50byBidWZmZXIgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBzaGlmdENhbnZhcyhzaGlmdCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ICs9IHNoaWZ0O1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhY2hlZENhbnZhcyxcbiAgICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgMCwgd2lkdGggLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIGhlaWdodCxcbiAgICAgIDAsIDAsIHdpZHRoIC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCBoZWlnaHRcbiAgICApO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIC8vIE11c3QgaW1wbGVtZW50IHRoZSBsb2dpYyB0byBkcmF3IHRoZSBzaGFwZSBiZXR3ZWVuXG4gIC8vIHRoZSBwcmV2aW91cyBhbmQgdGhlIGN1cnJlbnQgZnJhbWUuXG4gIC8vIEFzc3VtaW5nIHRoZSBjb250ZXh0IGlzIGNlbnRlcmVkIG9uIHRoZSBjdXJyZW50IGZyYW1lXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdtdXN0IGJlIGltcGxlbWVudGVkJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlRHJhdztcblxuXG4iXX0=