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

    _get(Object.getPrototypeOf(BaseDraw.prototype), 'constructor', this).call(this, defaults, options);

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
    value: function initialize(inStreamParams) {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'initialize', this).call(this, inStreamParams);

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
    value: function finalize(endTime) {
      _get(Object.getPrototypeOf(BaseDraw.prototype), 'finalize', this).call(this, endTime);
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
//# sourceMappingURL=data:application/json;base64,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QUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQzdCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFDakQsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUMzQixDQUFDOztBQUVGLFNBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNmOzs7Ozs7Ozs7Ozs7V0FVUSxtQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxhQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDdEM7OztTQTFMVyxhQUFDLFFBQVEsRUFBRTtBQUNyQixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDakM7OztTQUVNLGFBQUMsR0FBRyxFQUFFO0FBQ1gsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7O1NBRU0sYUFBQyxHQUFHLEVBQUU7QUFDWCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDdEIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7U0F6RGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9zaW5rcy9iYXNlLWRyYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICcuLi9jb3JlL2Jhc2UtbGZvJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRHJhdyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIGV4dGVuZERlZmF1bHRzID0ge30pIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZHVyYXRpb246IDEsXG4gICAgICBtaW46IC0xLFxuICAgICAgbWF4OiAxLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTUwLCAvLyBkZWZhdWx0IGNhbnZhcyBzaXplIGluIERPTSB0b29cbiAgICAgIGlzU3luY2hyb25pemVkOiBmYWxzZSwgLy8gaXMgc2V0IHRvIHRydWUgaWYgdXNlZCBpbiBhIHN5bmNocm9uaXplZFNpbmtcbiAgICAgIGNhbnZhczogbnVsbCwgLy8gYW4gZXhpc3RpbmcgY2FudmFzIGVsZW1lbnQgYmUgdXNlZCBmb3IgZHJhd2luZ1xuICAgICAgY29udGFpbmVyOiBudWxsLCAvLyBhIHNlbGVjdG9yIGluc2lkZSB3aGljaCBjcmVhdGUgYW4gZWxlbWVudFxuICAgIH0sIGV4dGVuZERlZmF1bHRzKTtcblxuICAgIHN1cGVyKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5wYXJhbXMuY2FudmFzICYmICF0aGlzLnBhcmFtcy5jb250YWluZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhcmFtZXRlciBgY2FudmFzYCBvciBgY29udGFpbmVyYCBhcmUgbWFuZGF0b3J5Jyk7XG5cbiAgICAvLyBwcmVwYXJlIGNhbnZhc1xuICAgIGlmICh0aGlzLnBhcmFtcy5jYW52YXMpIHtcbiAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5wYXJhbXMuY2FudmFzO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMuY29udGFpbmVyKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucGFyYW1zLmNvbnRhaW5lcik7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICB9XG5cbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmNhY2hlZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY2FjaGVkQ3R4ID0gdGhpcy5jYWNoZWRDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMucHJldmlvdXNUaW1lID0gMDtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gMDtcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgPSAwO1xuXG4gICAgdGhpcy5yZXNpemUodGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG5cbiAgICAvL1xuICAgIHRoaXMuX3N0YWNrO1xuICAgIHRoaXMuX3JhZklkO1xuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLy8gcGFyYW1zIG1vZGlmaWVyc1xuICBzZXQgZHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICB0aGlzLnBhcmFtcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2V0IG1pbihtaW4pIHtcbiAgICB0aGlzLnBhcmFtcy5taW4gPSBtaW47XG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICBzZXQgbWF4KG1heCkge1xuICAgIHRoaXMucGFyYW1zLm1heCA9IG1heDtcbiAgICB0aGlzLl9zZXRZU2NhbGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIG1hcCB2YWx1ZXMgdG8gcGl4ZWwgaW4gdGhlIHkgYXhpc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldFlTY2FsZSgpIHtcbiAgICBjb25zdCBtaW4gPSB0aGlzLnBhcmFtcy5taW47XG4gICAgY29uc3QgbWF4ID0gdGhpcy5wYXJhbXMubWF4O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcblxuICAgIGNvbnN0IGEgPSAoMCAtIGhlaWdodCkgLyAobWF4IC0gbWluKTtcbiAgICBjb25zdCBiID0gaGVpZ2h0IC0gKGEgKiBtaW4pO1xuXG4gICAgdGhpcy5nZXRZUG9zaXRpb24gPSAoeCkgPT4gYSAqIHggKyBiO1xuICB9XG5cbiAgc2V0dXBTdHJlYW0oKSB7XG4gICAgc3VwZXIuc2V0dXBTdHJlYW0oKTtcbiAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBwcmV2aW91cyBmcmFtZVxuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoaW5TdHJlYW1QYXJhbXMpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX3N0YWNrID0gW107XG4gICAgdGhpcy5fcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3KTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgfVxuXG4gIGZpbmFsaXplKGVuZFRpbWUpIHtcbiAgICBzdXBlci5maW5hbGl6ZShlbmRUaW1lKTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWZJZCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBjdXJyZW50IGZyYW1lIHRvIHRoZSBmcmFtZXMgdG8gZHJhdy4gU2hvdWxkIG5vdCBiZSBvdmVycmlkZW4uXG4gICAqIEBpbmhlcml0ZG9jXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgcHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcbiAgICBjb25zdCBidWZmZXIgPSBmcmFtZS5idWZmZXIuc2xpY2UoMCk7IC8vIGNvcHkgdmFsdWVzIGluc3RlYWQgb2YgcmVmZXJlbmNlXG4gICAgY29uc3QgY29weSA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcbiAgICAvLyBjb25zb2xlLmxvZyhjb3B5KTtcbiAgICAvLyBmcmFtZSA9IGZyYW1lLnNsaWNlKDApO1xuICAgIHRoaXMuX3N0YWNrLnB1c2goeyB0aW1lLCBmcmFtZTogY29weSwgbWV0YURhdGEgfSk7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSB0aGlzLl9zdGFjay5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZXZlbnQgPSB0aGlzLl9zdGFja1tpXTtcbiAgICAgIHRoaXMuZXhlY3V0ZURyYXcoZXZlbnQudGltZSwgZXZlbnQuZnJhbWUpO1xuICAgIH1cblxuICAgIC8vIHJlaW5pdCBzdGFjayBmb3IgbmV4dCBjYWxsXG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcpO1xuICB9XG5cbiAgZXhlY3V0ZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICB0aGlzLnNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKTtcbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgY2FjaGVkQ3R4ID0gdGhpcy5jYWNoZWRDdHg7XG5cbiAgICAvLyBAdG9kbyAtIGZpeCB0aGlzLCBwcm9ibGVtIHdpdGggdGhlIGNhY2hlZCBjYW52YXMuLi5cbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9jYW52YXMvaGlkcGkvXG4gICAgLy8gY29uc3QgYXV0byA9IHRydWU7XG4gICAgLy8gY29uc3QgZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgLy8gY29uc3QgYmFja2luZ1N0b3JlUmF0aW8gPSBjdHgud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGN0eC5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIC8vIGlmIChhdXRvICYmIGRldmljZVBpeGVsUmF0aW8gIT09IGJhY2tpbmdTdG9yZVJhdGlvKSB7XG4gICAgLy8gICBjb25zdCByYXRpbyA9IGRldmljZVBpeGVsUmF0aW8gLyBiYWNraW5nU3RvcmVSYXRpbztcblxuICAgIC8vICAgdGhpcy5wYXJhbXMud2lkdGggPSB3aWR0aCAqIHJhdGlvO1xuICAgIC8vICAgdGhpcy5wYXJhbXMuaGVpZ2h0ID0gaGVpZ2h0ICogcmF0aW87XG5cbiAgICAvLyAgIGN0eC5jYW52YXMud2lkdGggPSBjYWNoZWRDdHguY2FudmFzLndpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgLy8gICBjdHguY2FudmFzLmhlaWdodCA9IGNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgLy8gICBjdHguY2FudmFzLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIC8vICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuXG4gICAgLy8gICBjdHguc2NhbGUocmF0aW8sIHJhdGlvKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJhbXMud2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMucGFyYW1zLmhlaWdodCA9IGhlaWdodDtcblxuICAgICAgY3R4LmNhbnZhcy53aWR0aCA9IGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gY2FjaGVkQ3R4LmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgLy8gfVxuXG4gICAgLy8gY2xlYXIgY2FjaGUgY2FudmFzXG4gICAgY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICAvLyB1cGRhdGUgc2NhbGVcbiAgICB0aGlzLl9zZXRZU2NhbGUoKTtcbiAgfVxuXG4gIC8vIGRlZmF1bHQgZHJhdyBtb2RlXG4gIHNjcm9sbE1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnBhcmFtcy5kdXJhdGlvbjtcblxuICAgIGNvbnN0IGR0ID0gdGltZSAtIHRoaXMucHJldmlvdXNUaW1lO1xuICAgIGNvbnN0IGZTaGlmdCA9IChkdCAvIGR1cmF0aW9uKSAqIHdpZHRoIC0gdGhpcy5sYXN0U2hpZnRFcnJvcjtcbiAgICBjb25zdCBpU2hpZnQgPSBNYXRoLnJvdW5kKGZTaGlmdCk7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IGlTaGlmdCAtIGZTaGlmdDtcblxuICAgIGNvbnN0IHBhcnRpYWxTaGlmdCA9IGlTaGlmdCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdDtcbiAgICB0aGlzLnNoaWZ0Q2FudmFzKHBhcnRpYWxTaGlmdCk7XG5cbiAgICAvLyBzaGlmdCBhbGwgc2libGluZ3MgaWYgc3luY2hyb25pemVkXG4gICAgaWYgKHRoaXMucGFyYW1zLmlzU3luY2hyb25pemVkICYmIHRoaXMuc3luY2hyb25pemVyKVxuICAgICAgdGhpcy5zeW5jaHJvbml6ZXIuc2hpZnRTaWJsaW5ncyhwYXJ0aWFsU2hpZnQsIHRoaXMpO1xuXG4gICAgLy8gdHJhbnNsYXRlIHRvIHRoZSBjdXJyZW50IGZyYW1lIGFuZCBkcmF3IGEgbmV3IHBvbHlnb25cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUod2lkdGgsIDApO1xuICAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCB0aGlzLnByZXZpb3VzRnJhbWUsIGlTaGlmdCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgICAvLyB1cGRhdGUgYGN1cnJlbnRQYXJ0aWFsU2hpZnRgXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0IC09IGlTaGlmdDtcbiAgICAvLyBzYXZlIGN1cnJlbnQgc3RhdGUgaW50byBidWZmZXIgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICB0aGlzLnByZXZpb3VzRnJhbWUuc2V0KGZyYW1lLCAwKTtcbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IHRpbWU7XG4gIH1cblxuICBzaGlmdENhbnZhcyhzaGlmdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ICs9IHNoaWZ0O1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgY3JvcHBlZFdpZHRoID0gd2lkdGggLSB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQ7XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FjaGVkQ2FudmFzLFxuICAgICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0LCAwLCBjcm9wcGVkV2lkdGgsIGhlaWdodCxcbiAgICAgIDAsIDAsIGNyb3BwZWRXaWR0aCwgaGVpZ2h0XG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBpbXBsZW1lbnQgaW4gb3JkZXIgdG8gZGVmaW5lIGhvdyB0byBkcmF3IHRoZSBzaGFwZVxuICAgKiBiZXR3ZWVuIHRoZSBwcmV2aW91cyBhbmQgdGhlIGN1cnJlbnQgZnJhbWUsIGFzc3VtaW5nIHRoZSBjYW52YXMgY29udGV4dFxuICAgKiBpcyBjZW50ZXJlZCBvbiB0aGUgY3VycmVudCBmcmFtZS5cbiAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IGZyYW1lIC0gVGhlIGN1cnJlbnQgZnJhbWUgdG8gZHJhdy5cbiAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IHByZXZGcmFtZSAtIFRoZSBsYXN0IGZyYW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaVNoaWZ0IC0gdGhlIG51bWJlciBvZiBwaXhlbHMgYmV0d2VlbiB0aGUgbGFzdCBhbmQgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAqL1xuICBkcmF3Q3VydmUoZnJhbWUsIHByZXZGcmFtZSwgaVNoaWZ0KSB7XG4gICAgY29uc29sZS5lcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG4iXX0=