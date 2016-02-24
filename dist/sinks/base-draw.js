'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreBaseLfo = require('../core/base-lfo');

var _coreBaseLfo2 = _interopRequireDefault(_coreBaseLfo);

var BaseDraw = (function (_BaseLfo) {
  _inherits(BaseDraw, _BaseLfo);

  function BaseDraw() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var extendDefaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseDraw);

    var defaults = _Object$assign({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 150, // default canvas size in DOM too
      isSynchronized: false, // is set to true if used in a synchronizedSink
      canvas: null, // an existing canvas element be used for drawing
      container: null }, // a selector inside which create an element
    extendDefaults);

    _get(Object.getPrototypeOf(BaseDraw.prototype), 'constructor', this).call(this, options, defaults);

    if (!this.params.canvas && !this.params.container) throw new Error('parameter `canvas` or `container` are mandatory');

    // prepare canvas
    if (this.params.canvas) {
      this.canvas = this.params.canvas;
    } else if (this.params.container) {
      var container = document.querySelector(this.params.container);
      this.canvas = document.createElement('canvas');
      container.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');

    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.previousTime = 0;
    this.lastShiftError = 0;
    this.currentPartialShift = 0;

    this.resize(this.params.width, this.params.height);
    // this._cache = [];
    // this._rafId;
    // this.draw = this.draw.bind(this);
  }

  // initialize() {
  //   super.initialize();
  //   // this._rafId = requestAnimationFrame(this.draw);
  // }

  // finalize() {
  //   super.finalize();
  //   // cancelAnimationFrame(this._rafId);
  // }

  // draw() {
  //   console.log('draw', this._cache.length);
  //   this._cache.forEach((infos) => {
  //     console.log(infos);
  //     this.scrollModeDraw(infos.time, infos.frame);
  //   });

  //   this._cache.length = 0;
  //   this._rafId = requestAnimationFrame(this.draw);
  // }

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
  }, {
    key: 'resize',
    value: function resize(width, height) {
      this.ctx.canvas.width = this.cachedCtx.canvas.width = this.params.width = width;
      this.ctx.canvas.height = this.cachedCtx.canvas.height = this.params.height = height;
      // clear cache canvas
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
      // update scale
      this.setYScale();
    }
  }, {
    key: 'setYScale',
    value: function setYScale() {
      var min = this.params.min;
      var max = this.params.max;
      var height = this.params.height;

      var a = (0 - height) / (max - min);
      var b = height - a * min;

      this.getYPosition = function (x) {
        return a * x + b;
      };
    }

    // params modifiers
  }, {
    key: 'process',

    // main process method
    value: function process(time, frame, metaData) {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'process', this).call(this, time, frame, metaData);
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

      this.previousFrame.set(frame, 0);
      this.previousTime = time;
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
  }, {
    key: 'duration',
    set: function set(duration) {
      this.params.duration = duration;
    }
  }, {
    key: 'min',
    set: function set(min) {
      this.params.min = min;
      this.setYScale();
    }
  }, {
    key: 'max',
    set: function set(max) {
      this.params.max = max;
      this.setYScale();
    }
  }]);

  return BaseDraw;
})(_coreBaseLfo2['default']);

exports['default'] = BaseDraw;

module.exports = BaseDraw;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LEVBQUU7QUFDbEMsYUFBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3RDOzs7U0E3RVcsYUFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0tBQ2pDOzs7U0FFTSxhQUFDLEdBQUcsRUFBRTtBQUNYLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN0QixVQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbEI7OztTQUVNLGFBQUMsR0FBRyxFQUFFO0FBQ1gsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNsQjs7O1NBNUdrQixRQUFROzs7cUJBQVIsUUFBUTs7QUFnTDdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaW5rcy9iYXNlLWRyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRHJhdyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIGV4dGVuZERlZmF1bHRzID0ge30pIHtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkdXJhdGlvbjogMSxcbiAgICAgIG1pbjogLTEsXG4gICAgICBtYXg6IDEsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAxNTAsIC8vIGRlZmF1bHQgY2FudmFzIHNpemUgaW4gRE9NIHRvb1xuICAgICAgaXNTeW5jaHJvbml6ZWQ6IGZhbHNlLCAvLyBpcyBzZXQgdG8gdHJ1ZSBpZiB1c2VkIGluIGEgc3luY2hyb25pemVkU2lua1xuICAgICAgY2FudmFzOiBudWxsLCAvLyBhbiBleGlzdGluZyBjYW52YXMgZWxlbWVudCBiZSB1c2VkIGZvciBkcmF3aW5nXG4gICAgICBjb250YWluZXI6IG51bGwsIC8vIGEgc2VsZWN0b3IgaW5zaWRlIHdoaWNoIGNyZWF0ZSBhbiBlbGVtZW50XG4gICAgfSwgZXh0ZW5kRGVmYXVsdHMpO1xuXG4gICAgc3VwZXIob3B0aW9ucywgZGVmYXVsdHMpO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jYW52YXMgJiYgIXRoaXMucGFyYW1zLmNvbnRhaW5lcilcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVyIGBjYW52YXNgIG9yIGBjb250YWluZXJgIGFyZSBtYW5kYXRvcnknKTtcblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgaWYgKHRoaXMucGFyYW1zLmNhbnZhcykge1xuICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLnBhcmFtcy5jYW52YXM7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5jb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5wYXJhbXMuY29udGFpbmVyKTtcbiAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cblxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY2FjaGVkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYWNoZWRDdHggPSB0aGlzLmNhY2hlZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5wcmV2aW91c1RpbWUgPSAwO1xuICAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAgIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCA9IDA7XG5cbiAgICB0aGlzLnJlc2l6ZSh0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICAvLyB0aGlzLl9jYWNoZSA9IFtdO1xuICAgIC8vIHRoaXMuX3JhZklkO1xuICAgIC8vIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSgpIHtcbiAgLy8gICBzdXBlci5pbml0aWFsaXplKCk7XG4gIC8vICAgLy8gdGhpcy5fcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3KTtcbiAgLy8gfVxuXG4gIC8vIGZpbmFsaXplKCkge1xuICAvLyAgIHN1cGVyLmZpbmFsaXplKCk7XG4gIC8vICAgLy8gY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmSWQpO1xuICAvLyB9XG5cbiAgLy8gZHJhdygpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnZHJhdycsIHRoaXMuX2NhY2hlLmxlbmd0aCk7XG4gIC8vICAgdGhpcy5fY2FjaGUuZm9yRWFjaCgoaW5mb3MpID0+IHtcbiAgLy8gICAgIGNvbnNvbGUubG9nKGluZm9zKTtcbiAgLy8gICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcoaW5mb3MudGltZSwgaW5mb3MuZnJhbWUpO1xuICAvLyAgIH0pO1xuXG4gIC8vICAgdGhpcy5fY2FjaGUubGVuZ3RoID0gMDtcbiAgLy8gICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcpO1xuICAvLyB9XG5cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgc3VwZXIuc2V0dXBTdHJlYW0oKTtcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICByZXNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCAgPSB0aGlzLmNhY2hlZEN0eC5jYW52YXMud2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodCA9IGhlaWdodDtcbiAgICAvLyBjbGVhciBjYWNoZSBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gICAgLy8gdXBkYXRlIHNjYWxlXG4gICAgdGhpcy5zZXRZU2NhbGUoKTtcbiAgfVxuXG4gIHNldFlTY2FsZSgpIHtcbiAgICBjb25zdCBtaW4gPSB0aGlzLnBhcmFtcy5taW47XG4gICAgY29uc3QgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIGNvbnN0IGEgPSAoMCAtIGhlaWdodCkgLyAobWF4IC0gbWluKTtcbiAgICBjb25zdCBiID0gaGVpZ2h0IC0gKGEgKiBtaW4pO1xuXG4gICAgdGhpcy5nZXRZUG9zaXRpb24gPSAoeCkgPT4gYSAqIHggKyBiO1xuICB9XG5cbiAgLy8gcGFyYW1zIG1vZGlmaWVyc1xuICBzZXQgZHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICB0aGlzLnBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2V0IG1pbihtaW4pIHtcbiAgICB0aGlzLnBhcmFtcy5taW4gPSBtaW47XG4gICAgdGhpcy5zZXRZU2NhbGUoKTtcbiAgfVxuXG4gIHNldCBtYXgobWF4KSB7XG4gICAgdGhpcy5wYXJhbXMubWF4ID0gbWF4O1xuICAgIHRoaXMuc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvLyBtYWluIHByb2Nlc3MgbWV0aG9kXG4gIHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG4gICAgc3VwZXIucHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBkcmF3IG1vZGVcbiAgc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yO1xuICAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgY29uc3QgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpIHtcbiAgICAgIHRoaXMuc3luY2hyb25pemVyLnNoaWZ0U2libGluZ3MocGFydGlhbFNoaWZ0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FjaGVkQ2FudmFzLFxuICAgICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCAwLCB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdCwgaGVpZ2h0LFxuICAgICAgMCwgMCwgd2lkdGggLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIGhlaWdodFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLy8gTXVzdCBpbXBsZW1lbnQgdGhlIGxvZ2ljIHRvIGRyYXcgdGhlIHNoYXBlIGJldHdlZW5cbiAgLy8gdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCBmcmFtZS5cbiAgLy8gQXNzdW1pbmcgdGhlIGNvbnRleHQgaXMgY2VudGVyZWQgb24gdGhlIGN1cnJlbnQgZnJhbWVcbiAgZHJhd0N1cnZlKGZyYW1lLCBwcmV2RnJhbWUsIGlTaGlmdCkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ211c3QgYmUgaW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VEcmF3O1xuXG5cbiJdfQ==