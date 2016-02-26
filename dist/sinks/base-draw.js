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

    //
    this._stack;
    this._rafId;
    this.draw = this.draw.bind(this);
  }

  // params modifiers

  _createClass(BaseDraw, [{
    key: '_setYScale',

    /**
     * Create the transfert function used to map values to pixel in the y axis
     * @private
     */
    value: function _setYScale() {
      var min = this.params.min;
      var max = this.params.max;
      var height = this.params.height;

      var a = (0 - height) / (max - min);
      var b = height - a * min;

      this.getYPosition = function (x) {
        return a * x + b;
      };
    }
  }, {
    key: 'setupStream',
    value: function setupStream() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'setupStream', this).call(this);
      // keep track of the previous frame
      this.previousFrame = new Float32Array(this.streamParams.frameSize);
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'initialize', this).call(this);
      this._stack = [];
      this._rafId = requestAnimationFrame(this.draw);
    }
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'reset', this).call(this);
      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'finalize', this).call(this);
      cancelAnimationFrame(this._rafId);
    }

    /**
     * Add the current frame to the frames to draw. Should not be overriden.
     * @inheritdoc
     * @final
     */
  }, {
    key: 'process',
    value: function process(time, frame, metaData) {
      var buffer = frame.buffer.slice(0); // copy values instead of reference
      var copy = new Float32Array(buffer);
      // console.log(copy);
      // frame = frame.slice(0);
      this._stack.push({ time: time, frame: copy, metaData: metaData });
    }
  }, {
    key: 'draw',
    value: function draw() {
      for (var i = 0, _length = this._stack.length; i < _length; i++) {
        var _event = this._stack[i];
        this.executeDraw(_event.time, _event.frame);
      }

      // reinit stack for next call
      this._stack.length = 0;
      this._rafId = requestAnimationFrame(this.draw);
    }
  }, {
    key: 'executeDraw',
    value: function executeDraw(time, frame) {
      this.scrollModeDraw(time, frame);
    }
  }, {
    key: 'resize',
    value: function resize(width, height) {
      var ctx = this.ctx;
      var cachedCtx = this.cachedCtx;

      // @todo - fix this, problem with the cached canvas...
      // http://www.html5rocks.com/en/tutorials/canvas/hidpi/
      // const auto = true;
      // const devicePixelRatio = window.devicePixelRatio || 1;
      // const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
      //                     ctx.mozBackingStorePixelRatio ||
      //                     ctx.msBackingStorePixelRatio ||
      //                     ctx.oBackingStorePixelRatio ||
      //                     ctx.backingStorePixelRatio || 1;

      // if (auto && devicePixelRatio !== backingStoreRatio) {
      //   const ratio = devicePixelRatio / backingStoreRatio;

      //   this.params.width = width * ratio;
      //   this.params.height = height * ratio;

      //   ctx.canvas.width = cachedCtx.canvas.width = this.params.width;
      //   ctx.canvas.height = cachedCtx.canvas.height = this.params.height;

      //   ctx.canvas.style.width = `${width}px`;
      //   ctx.canvas.style.height = `${height}px`;

      //   ctx.scale(ratio, ratio);
      // } else {
      this.params.width = width;
      this.params.height = height;

      ctx.canvas.width = cachedCtx.canvas.width = width;
      ctx.canvas.height = cachedCtx.canvas.height = height;
      // }

      // clear cache canvas
      cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
      // update scale
      this._setYScale();
    }

    // default draw mode
  }, {
    key: 'scrollModeDraw',
    value: function scrollModeDraw(time, frame) {
      var ctx = this.ctx;
      var width = this.params.width;
      var height = this.params.height;
      var duration = this.params.duration;

      var dt = time - this.previousTime;
      var fShift = dt / duration * width - this.lastShiftError;
      var iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;

      var partialShift = iShift - this.currentPartialShift;
      this.shiftCanvas(partialShift);

      // shift all siblings if synchronized
      if (this.params.isSynchronized && this.synchronizer) this.synchronizer.shiftSiblings(partialShift, this);

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
      var ctx = this.ctx;
      var width = this.params.width;
      var height = this.params.height;

      this.currentPartialShift += shift;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      var croppedWidth = width - this.currentPartialShift;

      ctx.drawImage(this.cachedCanvas, this.currentPartialShift, 0, croppedWidth, height, 0, 0, croppedWidth, height);

      ctx.restore();
    }

    /**
     * Interface method to implement in order to define how to draw the shape
     * between the previous and the current frame, assuming the canvas context
     * is centered on the current frame.
     * @param {Float32Array} frame - The current frame to draw.
     * @param {Float32Array} prevFrame - The last frame.
     * @param {Number} iShift - the number of pixels between the last and the current frame.
     */
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
      this._setYScale();
    }
  }, {
    key: 'max',
    set: function set(max) {
      this.params.max = max;
      this._setYScale();
    }
  }]);

  return BaseDraw;
})(_coreBaseLfo2['default']);

exports['default'] = BaseDraw;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LG1CQUFtQixFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUNqRCxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxNQUFNLENBQzNCLENBQUM7O0FBRUYsU0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2Y7Ozs7Ozs7Ozs7OztXQVVRLG1CQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLGFBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUN0Qzs7O1NBekxXLGFBQUMsUUFBUSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztLQUNqQzs7O1NBRU0sYUFBQyxHQUFHLEVBQUU7QUFDWCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDdEIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7U0FFTSxhQUFDLEdBQUcsRUFBRTtBQUNYLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN0QixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7OztTQTFEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZXM2L3NpbmtzL2Jhc2UtZHJhdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJy4uL2NvcmUvYmFzZS1sZm8nO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VEcmF3IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSwgZXh0ZW5kRGVmYXVsdHMgPSB7fSkge1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgICAgbWluOiAtMSxcbiAgICAgIG1heDogMSxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICBoZWlnaHQ6IDE1MCwgLy8gZGVmYXVsdCBjYW52YXMgc2l6ZSBpbiBET00gdG9vXG4gICAgICBpc1N5bmNocm9uaXplZDogZmFsc2UsIC8vIGlzIHNldCB0byB0cnVlIGlmIHVzZWQgaW4gYSBzeW5jaHJvbml6ZWRTaW5rXG4gICAgICBjYW52YXM6IG51bGwsIC8vIGFuIGV4aXN0aW5nIGNhbnZhcyBlbGVtZW50IGJlIHVzZWQgZm9yIGRyYXdpbmdcbiAgICAgIGNvbnRhaW5lcjogbnVsbCwgLy8gYSBzZWxlY3RvciBpbnNpZGUgd2hpY2ggY3JlYXRlIGFuIGVsZW1lbnRcbiAgICB9LCBleHRlbmREZWZhdWx0cyk7XG5cbiAgICBzdXBlcihvcHRpb25zLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNhbnZhcyAmJiAhdGhpcy5wYXJhbXMuY29udGFpbmVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbWV0ZXIgYGNhbnZhc2Agb3IgYGNvbnRhaW5lcmAgYXJlIG1hbmRhdG9yeScpO1xuXG4gICAgLy8gcHJlcGFyZSBjYW52YXNcbiAgICBpZiAodGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucGFyYW1zLmNhbnZhcztcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLmNvbnRhaW5lcikge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnBhcmFtcy5jb250YWluZXIpO1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ID0gMDtcblxuICAgIHRoaXMucmVzaXplKHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuXG4gICAgLy9cbiAgICB0aGlzLl9zdGFjaztcbiAgICB0aGlzLl9yYWZJZDtcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllcnNcbiAgc2V0IGR1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuICB9XG5cbiAgc2V0IG1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBtYXAgdmFsdWVzIHRvIHBpeGVsIGluIHRoZSB5IGF4aXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRZU2NhbGUoKSB7XG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIGNvbnN0IG1heCA9IHRoaXMucGFyYW1zLm1heDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICBjb25zdCBhID0gKDAgLSBoZWlnaHQpIC8gKG1heCAtIG1pbik7XG4gICAgY29uc3QgYiA9IGhlaWdodCAtIChhICogbWluKTtcblxuICAgIHRoaXMuZ2V0WVBvc2l0aW9uID0gKHgpID0+IGEgKiB4ICsgYjtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgcHJldmlvdXMgZnJhbWVcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdyk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICBzdXBlci5maW5hbGl6ZSgpO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGN1cnJlbnQgZnJhbWUgdG8gdGhlIGZyYW1lcyB0byBkcmF3LiBTaG91bGQgbm90IGJlIG92ZXJyaWRlbi5cbiAgICogQGluaGVyaXRkb2NcbiAgICogQGZpbmFsXG4gICAqL1xuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGZyYW1lLmJ1ZmZlci5zbGljZSgwKTsgLy8gY29weSB2YWx1ZXMgaW5zdGVhZCBvZiByZWZlcmVuY2VcbiAgICBjb25zdCBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNvcHkpO1xuICAgIC8vIGZyYW1lID0gZnJhbWUuc2xpY2UoMCk7XG4gICAgdGhpcy5fc3RhY2sucHVzaCh7IHRpbWUsIGZyYW1lOiBjb3B5LCBtZXRhRGF0YSB9KTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHRoaXMuX3N0YWNrLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX3N0YWNrW2ldO1xuICAgICAgdGhpcy5leGVjdXRlRHJhdyhldmVudC50aW1lLCBldmVudC5mcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gcmVpbml0IHN0YWNrIGZvciBuZXh0IGNhbGxcbiAgICB0aGlzLl9zdGFjay5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdyk7XG4gIH1cblxuICBleGVjdXRlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICB9XG5cbiAgcmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZWRDdHggPSB0aGlzLmNhY2hlZEN0eDtcblxuICAgIC8vIEB0b2RvIC0gZml4IHRoaXMsIHByb2JsZW0gd2l0aCB0aGUgY2FjaGVkIGNhbnZhcy4uLlxuICAgIC8vIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2NhbnZhcy9oaWRwaS9cbiAgICAvLyBjb25zdCBhdXRvID0gdHJ1ZTtcbiAgICAvLyBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAvLyBjb25zdCBiYWNraW5nU3RvcmVSYXRpbyA9IGN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjdHgubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjdHguYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCAxO1xuXG4gICAgLy8gaWYgKGF1dG8gJiYgZGV2aWNlUGl4ZWxSYXRpbyAhPT0gYmFja2luZ1N0b3JlUmF0aW8pIHtcbiAgICAvLyAgIGNvbnN0IHJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbyAvIGJhY2tpbmdTdG9yZVJhdGlvO1xuXG4gICAgLy8gICB0aGlzLnBhcmFtcy53aWR0aCA9IHdpZHRoICogcmF0aW87XG4gICAgLy8gICB0aGlzLnBhcmFtcy5oZWlnaHQgPSBoZWlnaHQgKiByYXRpbztcblxuICAgIC8vICAgY3R4LmNhbnZhcy53aWR0aCA9IGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICAvLyAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gY2FjaGVkQ3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICAvLyAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgLy8gICBjdHguY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG5cbiAgICAvLyAgIGN0eC5zY2FsZShyYXRpbywgcmF0aW8pO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmFtcy53aWR0aCA9IHdpZHRoO1xuICAgICAgdGhpcy5wYXJhbXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICBjdHguY2FudmFzLndpZHRoID0gY2FjaGVkQ3R4LmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSBjYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAvLyB9XG5cbiAgICAvLyBjbGVhciBjYWNoZSBjYW52YXNcbiAgICBjYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHVwZGF0ZSBzY2FsZVxuICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBkcmF3IG1vZGVcbiAgc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuXG4gICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yO1xuICAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgY29uc3QgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpXG4gICAgICB0aGlzLnN5bmNocm9uaXplci5zaGlmdFNpYmxpbmdzKHBhcnRpYWxTaGlmdCwgdGhpcyk7XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBjcm9wcGVkV2lkdGggPSB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdDtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYWNoZWRDYW52YXMsXG4gICAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIDAsIGNyb3BwZWRXaWR0aCwgaGVpZ2h0LFxuICAgICAgMCwgMCwgY3JvcHBlZFdpZHRoLCBoZWlnaHRcbiAgICApO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCBpbiBvcmRlciB0byBkZWZpbmUgaG93IHRvIGRyYXcgdGhlIHNoYXBlXG4gICAqIGJldHdlZW4gdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCBmcmFtZSwgYXNzdW1pbmcgdGhlIGNhbnZhcyBjb250ZXh0XG4gICAqIGlzIGNlbnRlcmVkIG9uIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gZnJhbWUgLSBUaGUgY3VycmVudCBmcmFtZSB0byBkcmF3LlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gcHJldkZyYW1lIC0gVGhlIGxhc3QgZnJhbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpU2hpZnQgLSB0aGUgbnVtYmVyIG9mIHBpeGVscyBiZXR3ZWVuIHRoZSBsYXN0IGFuZCB0aGUgY3VycmVudCBmcmFtZS5cbiAgICovXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdtdXN0IGJlIGltcGxlbWVudGVkJyk7XG4gIH1cbn1cblxuXG5cbiJdfQ==