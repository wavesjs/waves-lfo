'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLfo = require('../core/base-lfo');

var _baseLfo2 = _interopRequireDefault(_baseLfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseDraw = function (_BaseLfo) {
  (0, _inherits3.default)(BaseDraw, _BaseLfo);

  function BaseDraw() {
    var extendDefaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, BaseDraw);

    var defaults = (0, _assign2.default)({
      duration: 1,
      min: -1,
      max: 1,
      width: 300,
      height: 150, // default canvas size in DOM too
      isSynchronized: false, // is set to true if used in a synchronizedSink
      canvas: null, // an existing canvas element be used for drawing
      container: null }, // a selector inside which create an element
    extendDefaults);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BaseDraw).call(this, defaults, options));

    if (!_this.params.canvas && !_this.params.container) throw new Error('parameter `canvas` or `container` are mandatory');

    // prepare canvas
    if (_this.params.canvas) {
      _this.canvas = _this.params.canvas;
    } else if (_this.params.container) {
      var container = document.querySelector(_this.params.container);
      _this.canvas = document.createElement('canvas');
      container.appendChild(_this.canvas);
    }

    _this.ctx = _this.canvas.getContext('2d');

    _this.cachedCanvas = document.createElement('canvas');
    _this.cachedCtx = _this.cachedCanvas.getContext('2d');

    _this.previousTime = 0;
    _this.lastShiftError = 0;
    _this.currentPartialShift = 0;

    _this.resize(_this.params.width, _this.params.height);

    //
    _this._stack;
    _this._rafId;
    _this.draw = _this.draw.bind(_this);
    return _this;
  }

  // params modifiers


  (0, _createClass3.default)(BaseDraw, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(BaseDraw.prototype), 'setupStream', this).call(this);
      // keep track of the previous frame
      this.previousFrame = new Float32Array(this.streamParams.frameSize);
    }
  }, {
    key: 'initialize',
    value: function initialize(inStreamParams) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(BaseDraw.prototype), 'initialize', this).call(this, inStreamParams);

      this._stack = [];
      this._rafId = requestAnimationFrame(this.draw);
    }
  }, {
    key: 'reset',
    value: function reset() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(BaseDraw.prototype), 'reset', this).call(this);
      this.ctx.clearRect(0, 0, this.params.width, this.params.height);
      this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    }
  }, {
    key: 'finalize',
    value: function finalize(endTime) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(BaseDraw.prototype), 'finalize', this).call(this, endTime);
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

      this._stack.push({ time: time, frame: copy, metaData: metaData });
    }
  }, {
    key: 'draw',
    value: function draw() {
      for (var i = 0, length = this._stack.length; i < length; i++) {
        var event = this._stack[i];
        this.executeDraw(event.time, event.frame);
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
}(_baseLfo2.default);

exports.default = BaseDraw;
//# sourceMappingURL=data:application/json;base64,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QVBpQjtBQVFqQixVQUFJLElBQUosR0FSaUI7O0FBVWpCLFVBQU0sZUFBZSxRQUFRLEtBQUssbUJBQUwsQ0FWWjs7QUFZakIsVUFBSSxTQUFKLENBQWMsS0FBSyxZQUFMLEVBQ1osS0FBSyxtQkFBTCxFQUEwQixDQUQ1QixFQUMrQixZQUQvQixFQUM2QyxNQUQ3QyxFQUVFLENBRkYsRUFFSyxDQUZMLEVBRVEsWUFGUixFQUVzQixNQUZ0QixFQVppQjs7QUFpQmpCLFVBQUksT0FBSixHQWpCaUI7Ozs7Ozs7Ozs7Ozs7OzhCQTRCVCxPQUFPLFdBQVcsUUFBUTtBQUNsQyxjQUFRLEtBQVIsQ0FBYyxxQkFBZCxFQURrQzs7OztzQkF2THZCLFVBQVU7QUFDckIsV0FBSyxNQUFMLENBQVksUUFBWixHQUF1QixRQUF2QixDQURxQjs7OztzQkFJZixLQUFLO0FBQ1gsV0FBSyxNQUFMLENBQVksR0FBWixHQUFrQixHQUFsQixDQURXO0FBRVgsV0FBSyxVQUFMLEdBRlc7Ozs7c0JBS0wsS0FBSztBQUNYLFdBQUssTUFBTCxDQUFZLEdBQVosR0FBa0IsR0FBbEIsQ0FEVztBQUVYLFdBQUssVUFBTCxHQUZXOzs7U0F0RE0iLCJmaWxlIjoiYmFzZS1kcmF3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vY29yZS9iYXNlLWxmbyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZURyYXcgZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZXh0ZW5kRGVmYXVsdHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGR1cmF0aW9uOiAxLFxuICAgICAgbWluOiAtMSxcbiAgICAgIG1heDogMSxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICBoZWlnaHQ6IDE1MCwgLy8gZGVmYXVsdCBjYW52YXMgc2l6ZSBpbiBET00gdG9vXG4gICAgICBpc1N5bmNocm9uaXplZDogZmFsc2UsIC8vIGlzIHNldCB0byB0cnVlIGlmIHVzZWQgaW4gYSBzeW5jaHJvbml6ZWRTaW5rXG4gICAgICBjYW52YXM6IG51bGwsIC8vIGFuIGV4aXN0aW5nIGNhbnZhcyBlbGVtZW50IGJlIHVzZWQgZm9yIGRyYXdpbmdcbiAgICAgIGNvbnRhaW5lcjogbnVsbCwgLy8gYSBzZWxlY3RvciBpbnNpZGUgd2hpY2ggY3JlYXRlIGFuIGVsZW1lbnRcbiAgICB9LCBleHRlbmREZWZhdWx0cyk7XG5cbiAgICBzdXBlcihkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW1zLmNhbnZhcyAmJiAhdGhpcy5wYXJhbXMuY29udGFpbmVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbWV0ZXIgYGNhbnZhc2Agb3IgYGNvbnRhaW5lcmAgYXJlIG1hbmRhdG9yeScpO1xuXG4gICAgLy8gcHJlcGFyZSBjYW52YXNcbiAgICBpZiAodGhpcy5wYXJhbXMuY2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IHRoaXMucGFyYW1zLmNhbnZhcztcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLmNvbnRhaW5lcikge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnBhcmFtcy5jb250YWluZXIpO1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLnByZXZpb3VzVGltZSA9IDA7XG4gICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gICAgdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0ID0gMDtcblxuICAgIHRoaXMucmVzaXplKHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuXG4gICAgLy9cbiAgICB0aGlzLl9zdGFjaztcbiAgICB0aGlzLl9yYWZJZDtcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIHBhcmFtcyBtb2RpZmllcnNcbiAgc2V0IGR1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtaW4obWluKSB7XG4gICAgdGhpcy5wYXJhbXMubWluID0gbWluO1xuICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuICB9XG5cbiAgc2V0IG1heChtYXgpIHtcbiAgICB0aGlzLnBhcmFtcy5tYXggPSBtYXg7XG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBtYXAgdmFsdWVzIHRvIHBpeGVsIGluIHRoZSB5IGF4aXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRZU2NhbGUoKSB7XG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMubWluO1xuICAgIGNvbnN0IG1heCA9IHRoaXMucGFyYW1zLm1heDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICBjb25zdCBhID0gKDAgLSBoZWlnaHQpIC8gKG1heCAtIG1pbik7XG4gICAgY29uc3QgYiA9IGhlaWdodCAtIChhICogbWluKTtcblxuICAgIHRoaXMuZ2V0WVBvc2l0aW9uID0gKHgpID0+IGEgKiB4ICsgYjtcbiAgfVxuXG4gIHNldHVwU3RyZWFtKCkge1xuICAgIHN1cGVyLnNldHVwU3RyZWFtKCk7XG4gICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgcHJldmlvdXMgZnJhbWVcbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gIH1cblxuICBpbml0aWFsaXplKGluU3RyZWFtUGFyYW1zKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShpblN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdyk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gIH1cblxuICBmaW5hbGl6ZShlbmRUaW1lICApIHtcbiAgICBzdXBlci5maW5hbGl6ZShlbmRUaW1lICApO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIGN1cnJlbnQgZnJhbWUgdG8gdGhlIGZyYW1lcyB0byBkcmF3LiBTaG91bGQgbm90IGJlIG92ZXJyaWRlbi5cbiAgICogQGluaGVyaXRkb2NcbiAgICogQGZpbmFsXG4gICAqL1xuICBwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGZyYW1lLmJ1ZmZlci5zbGljZSgwKTsgLy8gY29weSB2YWx1ZXMgaW5zdGVhZCBvZiByZWZlcmVuY2VcbiAgICBjb25zdCBjb3B5ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuXG4gICAgdGhpcy5fc3RhY2sucHVzaCh7IHRpbWUsIGZyYW1lOiBjb3B5LCBtZXRhRGF0YSB9KTtcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHRoaXMuX3N0YWNrLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX3N0YWNrW2ldO1xuICAgICAgdGhpcy5leGVjdXRlRHJhdyhldmVudC50aW1lLCBldmVudC5mcmFtZSk7XG4gICAgfVxuXG4gICAgLy8gcmVpbml0IHN0YWNrIGZvciBuZXh0IGNhbGxcbiAgICB0aGlzLl9zdGFjay5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdyk7XG4gIH1cblxuICBleGVjdXRlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpO1xuICB9XG5cbiAgcmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZWRDdHggPSB0aGlzLmNhY2hlZEN0eDtcblxuICAgIC8vIEB0b2RvIC0gZml4IHRoaXMsIHByb2JsZW0gd2l0aCB0aGUgY2FjaGVkIGNhbnZhcy4uLlxuICAgIC8vIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2NhbnZhcy9oaWRwaS9cbiAgICAvLyBjb25zdCBhdXRvID0gdHJ1ZTtcbiAgICAvLyBjb25zdCBkZXZpY2VQaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAvLyBjb25zdCBiYWNraW5nU3RvcmVSYXRpbyA9IGN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjdHgubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjdHguYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCAxO1xuXG4gICAgLy8gaWYgKGF1dG8gJiYgZGV2aWNlUGl4ZWxSYXRpbyAhPT0gYmFja2luZ1N0b3JlUmF0aW8pIHtcbiAgICAvLyAgIGNvbnN0IHJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbyAvIGJhY2tpbmdTdG9yZVJhdGlvO1xuXG4gICAgLy8gICB0aGlzLnBhcmFtcy53aWR0aCA9IHdpZHRoICogcmF0aW87XG4gICAgLy8gICB0aGlzLnBhcmFtcy5oZWlnaHQgPSBoZWlnaHQgKiByYXRpbztcblxuICAgIC8vICAgY3R4LmNhbnZhcy53aWR0aCA9IGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICAvLyAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gY2FjaGVkQ3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICAvLyAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgLy8gICBjdHguY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG5cbiAgICAvLyAgIGN0eC5zY2FsZShyYXRpbywgcmF0aW8pO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmFtcy53aWR0aCA9IHdpZHRoO1xuICAgICAgdGhpcy5wYXJhbXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICBjdHguY2FudmFzLndpZHRoID0gY2FjaGVkQ3R4LmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgY3R4LmNhbnZhcy5oZWlnaHQgPSBjYWNoZWRDdHguY2FudmFzLmhlaWdodCA9IGhlaWdodDtcbiAgICAvLyB9XG5cbiAgICAvLyBjbGVhciBjYWNoZSBjYW52YXNcbiAgICBjYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAgIC8vIHVwZGF0ZSBzY2FsZVxuICAgIHRoaXMuX3NldFlTY2FsZSgpO1xuICB9XG5cbiAgLy8gZGVmYXVsdCBkcmF3IG1vZGVcbiAgc2Nyb2xsTW9kZURyYXcodGltZSwgZnJhbWUpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuXG4gICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yO1xuICAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gICAgY29uc3QgcGFydGlhbFNoaWZ0ID0gaVNoaWZ0IC0gdGhpcy5jdXJyZW50UGFydGlhbFNoaWZ0O1xuICAgIHRoaXMuc2hpZnRDYW52YXMocGFydGlhbFNoaWZ0KTtcblxuICAgIC8vIHNoaWZ0IGFsbCBzaWJsaW5ncyBpZiBzeW5jaHJvbml6ZWRcbiAgICBpZiAodGhpcy5wYXJhbXMuaXNTeW5jaHJvbml6ZWQgJiYgdGhpcy5zeW5jaHJvbml6ZXIpXG4gICAgICB0aGlzLnN5bmNocm9uaXplci5zaGlmdFNpYmxpbmdzKHBhcnRpYWxTaGlmdCwgdGhpcyk7XG5cbiAgICAvLyB0cmFuc2xhdGUgdG8gdGhlIGN1cnJlbnQgZnJhbWUgYW5kIGRyYXcgYSBuZXcgcG9seWdvblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIC8vIHVwZGF0ZSBgY3VycmVudFBhcnRpYWxTaGlmdGBcbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgLT0gaVNoaWZ0O1xuICAgIC8vIHNhdmUgY3VycmVudCBzdGF0ZSBpbnRvIGJ1ZmZlciBjYW52YXNcbiAgICB0aGlzLmNhY2hlZEN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIHRoaXMucHJldmlvdXNGcmFtZS5zZXQoZnJhbWUsIDApO1xuICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNoaWZ0Q2FudmFzKHNoaWZ0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG5cbiAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQgKz0gc2hpZnQ7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBjcm9wcGVkV2lkdGggPSB3aWR0aCAtIHRoaXMuY3VycmVudFBhcnRpYWxTaGlmdDtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYWNoZWRDYW52YXMsXG4gICAgICB0aGlzLmN1cnJlbnRQYXJ0aWFsU2hpZnQsIDAsIGNyb3BwZWRXaWR0aCwgaGVpZ2h0LFxuICAgICAgMCwgMCwgY3JvcHBlZFdpZHRoLCBoZWlnaHRcbiAgICApO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCBpbiBvcmRlciB0byBkZWZpbmUgaG93IHRvIGRyYXcgdGhlIHNoYXBlXG4gICAqIGJldHdlZW4gdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCBmcmFtZSwgYXNzdW1pbmcgdGhlIGNhbnZhcyBjb250ZXh0XG4gICAqIGlzIGNlbnRlcmVkIG9uIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gZnJhbWUgLSBUaGUgY3VycmVudCBmcmFtZSB0byBkcmF3LlxuICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gcHJldkZyYW1lIC0gVGhlIGxhc3QgZnJhbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpU2hpZnQgLSB0aGUgbnVtYmVyIG9mIHBpeGVscyBiZXR3ZWVuIHRoZSBsYXN0IGFuZCB0aGUgY3VycmVudCBmcmFtZS5cbiAgICovXG4gIGRyYXdDdXJ2ZShmcmFtZSwgcHJldkZyYW1lLCBpU2hpZnQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdtdXN0IGJlIGltcGxlbWVudGVkJyk7XG4gIH1cbn1cbiJdfQ==