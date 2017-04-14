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

var _BaseLfo2 = require('../../core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonDefinitions = {
  min: {
    type: 'float',
    default: -1,
    metas: { kind: 'dynamic' }
  },
  max: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' }
  },
  width: {
    type: 'integer',
    default: 300,
    metas: { kind: 'dynamic' }
  },
  height: {
    type: 'integer',
    default: 150,
    metas: { kind: 'dynamic' }
  },
  container: {
    type: 'any',
    default: null,
    constant: true
  },
  canvas: {
    type: 'any',
    default: null,
    constant: true
  }
};

var hasDurationDefinitions = {
  duration: {
    type: 'float',
    min: 0,
    max: +Infinity,
    default: 1,
    metas: { kind: 'dynamic' }
  },
  referenceTime: {
    type: 'float',
    default: 0,
    constant: true
  }
};

/**
 * Base class to extend in order to create graphic sinks.
 *
 * <span class="warning">_This class should be considered abstract and only
 * be used to be extended._</span>
 *
 * @todo - fix float rounding errors (produce decays in sync draws)
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.min=-1] - Minimum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.max=1] - Maximum value represented in the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
 *  the canvas. This parameter only exists for operators that display several
 *  consecutive frames on the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class. This parameter only exists
 *  for operators that display several consecutive frames on the canvas.
 */

var BaseDisplay = function (_BaseLfo) {
  (0, _inherits3.default)(BaseDisplay, _BaseLfo);

  function BaseDisplay(defs) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var hasDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    (0, _classCallCheck3.default)(this, BaseDisplay);

    var commonDefs = void 0;

    if (hasDuration) commonDefs = (0, _assign2.default)({}, commonDefinitions, hasDurationDefinitions);else commonDefs = commonDefinitions;

    var definitions = (0, _assign2.default)({}, commonDefs, defs);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BaseDisplay.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay)).call(this, definitions, options));

    if (_this.params.get('canvas') === null && _this.params.get('container') === null) throw new Error('Invalid parameter: `canvas` or `container` not defined');

    var canvasParam = _this.params.get('canvas');
    var containerParam = _this.params.get('container');

    // prepare canvas
    if (canvasParam) {
      if (typeof canvasParam === 'string') _this.canvas = document.querySelector(canvasParam);else _this.canvas = canvasParam;
    } else if (containerParam) {
      var container = void 0;

      if (typeof containerParam === 'string') container = document.querySelector(containerParam);else container = containerParam;

      _this.canvas = document.createElement('canvas');
      container.appendChild(_this.canvas);
    }

    _this.ctx = _this.canvas.getContext('2d');
    _this.cachedCanvas = document.createElement('canvas');
    _this.cachedCtx = _this.cachedCanvas.getContext('2d');

    _this.previousFrame = null;
    _this.currentTime = hasDuration ? _this.params.get('referenceTime') : null;

    /**
     * Instance of the `DisplaySync` used to synchronize the different displays
     * @private
     */
    _this.displaySync = false;

    _this._stack = [];
    _this._rafId = null;

    _this.renderStack = _this.renderStack.bind(_this);
    _this.shiftError = 0;

    // initialize canvas size and y scale transfert function
    _this._resize();
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(BaseDisplay, [{
    key: '_resize',
    value: function _resize() {
      var width = this.params.get('width');
      var height = this.params.get('height');

      var ctx = this.ctx;
      var cachedCtx = this.cachedCtx;

      var dPR = window.devicePixelRatio || 1;
      var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

      this.pixelRatio = dPR / bPR;

      var lastWidth = this.canvasWidth;
      var lastHeight = this.canvasHeight;
      this.canvasWidth = width * this.pixelRatio;
      this.canvasHeight = height * this.pixelRatio;

      cachedCtx.canvas.width = this.canvasWidth;
      cachedCtx.canvas.height = this.canvasHeight;

      // copy current image from ctx (resize)
      if (lastWidth && lastHeight) {
        cachedCtx.drawImage(ctx.canvas, 0, 0, lastWidth, lastHeight, 0, 0, this.canvasWidth, this.canvasHeight);
      }

      ctx.canvas.width = this.canvasWidth;
      ctx.canvas.height = this.canvasHeight;
      ctx.canvas.style.width = width + 'px';
      ctx.canvas.style.height = height + 'px';

      // update scale
      this._setYScale();
    }

    /**
     * Create the transfert function used to map values to pixel in the y axis
     * @private
     */

  }, {
    key: '_setYScale',
    value: function _setYScale() {
      var min = this.params.get('min');
      var max = this.params.get('max');
      var height = this.canvasHeight;

      var a = (0 - height) / (max - min);
      var b = height - a * min;

      this.getYPosition = function (x) {
        return a * x + b;
      };
    }

    /**
     * Returns the width in pixel a `vector` frame needs to be drawn.
     * @private
     */

  }, {
    key: 'getMinimumFrameWidth',
    value: function getMinimumFrameWidth() {
      return 1; // need one pixel to draw the line
    }

    /**
     * Callback function executed when a parameter is updated.
     *
     * @param {String} name - Parameter name.
     * @param {Mixed} value - Parameter value.
     * @param {Object} metas - Metadatas of the parameter.
     * @private
     */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      switch (name) {
        case 'min':
        case 'max':
          // @todo - make sure that min and max are different
          this._setYScale();
          break;
        case 'width':
        case 'height':
          this._resize();
      }
    }

    /** @private */

  }, {
    key: 'propagateStreamParams',
    value: function propagateStreamParams() {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'propagateStreamParams', this).call(this);
    }

    /** @private */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'resetStream', this).call(this);

      var width = this.canvasWidth;
      var height = this.canvasHeight;

      this.ctx.clearRect(0, 0, width, height);
      this.cachedCtx.clearRect(0, 0, width, height);
    }

    /** @private */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      this.currentTime = null;
      (0, _get3.default)(BaseDisplay.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseDisplay.prototype), 'finalizeStream', this).call(this, endTime);

      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    /**
     * Add the current frame to the frames to draw. Should not be overriden.
     * @private
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      var frameSize = this.streamParams.frameSize;
      var copy = new Float32Array(frameSize);
      var data = frame.data;

      // copy values of the input frame as they might be updated
      // in reference before being consumed in the draw function
      for (var i = 0; i < frameSize; i++) {
        copy[i] = data[i];
      }this._stack.push({
        time: frame.time,
        data: copy,
        metadata: frame.metadata
      });

      if (this._rafId === null) this._rafId = requestAnimationFrame(this.renderStack);
    }

    /**
     * Render the accumulated frames. Method called in `requestAnimationFrame`.
     * @private
     */

  }, {
    key: 'renderStack',
    value: function renderStack() {
      if (this.params.has('duration')) {
        // render all frame since last `renderStack` call
        for (var i = 0, l = this._stack.length; i < l; i++) {
          this.scrollModeDraw(this._stack[i]);
        }
      } else {
        // only render last received frame if any
        if (this._stack.length > 0) {
          var frame = this._stack[this._stack.length - 1];
          this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.processFunction(frame);
        }
      }

      // reinit stack for next call
      this._stack.length = 0;
      this._rafId = requestAnimationFrame(this.renderStack);
    }

    /**
     * Draw data from right to left with scrolling
     * @private
     * @todo - check possibility of maintaining all values from one place to
     *         minimize float error tracking.
     */

  }, {
    key: 'scrollModeDraw',
    value: function scrollModeDraw(frame) {
      var frameType = this.streamParams.frameType;
      var frameRate = this.streamParams.frameRate;
      var frameSize = this.streamParams.frameSize;
      var sourceSampleRate = this.streamParams.sourceSampleRate;

      var canvasDuration = this.params.get('duration');
      var ctx = this.ctx;
      var canvasWidth = this.canvasWidth;
      var canvasHeight = this.canvasHeight;

      var previousFrame = this.previousFrame;

      // current time at the left of the canvas
      var currentTime = this.currentTime !== null ? this.currentTime : frame.time;
      var frameStartTime = frame.time;
      var lastFrameTime = previousFrame ? previousFrame.time : 0;
      var lastFrameDuration = this.lastFrameDuration ? this.lastFrameDuration : 0;

      var frameDuration = void 0;

      if (frameType === 'scalar' || frameType === 'vector') {
        var pixelDuration = canvasDuration / canvasWidth;
        frameDuration = this.getMinimumFrameWidth() * pixelDuration;
      } else if (this.streamParams.frameType === 'signal') {
        frameDuration = frameSize / sourceSampleRate;
      }

      var frameEndTime = frameStartTime + frameDuration;
      // define if we need to shift the canvas
      var shiftTime = frameEndTime - currentTime;

      // if the canvas is not synced, should never go to `else`
      if (shiftTime > 0) {
        // shift the canvas of shiftTime in pixels
        var fShift = shiftTime / canvasDuration * canvasWidth - this.shiftError;
        var iShift = Math.floor(fShift + 0.5);
        this.shiftError = fShift - iShift;

        var _currentTime = frameStartTime + frameDuration;
        this.shiftCanvas(iShift, _currentTime);

        // if siblings, share the information
        if (this.displaySync) this.displaySync.shiftSiblings(iShift, _currentTime, this);
      }

      // width of the frame in pixels
      var fFrameWidth = frameDuration / canvasDuration * canvasWidth;
      var frameWidth = Math.floor(fFrameWidth + 0.5);

      // define position of the head in the canvas
      var canvasStartTime = this.currentTime - canvasDuration;
      var startTimeRatio = (frameStartTime - canvasStartTime) / canvasDuration;
      var startTimePosition = startTimeRatio * canvasWidth;

      // number of pixels since last frame
      var pixelsSinceLastFrame = this.lastFrameWidth;

      if ((frameType === 'scalar' || frameType === 'vector') && previousFrame) {
        var frameInterval = frame.time - previousFrame.time;
        pixelsSinceLastFrame = frameInterval / canvasDuration * canvasWidth;
      }

      // draw current frame
      ctx.save();
      ctx.translate(startTimePosition, 0);
      this.processFunction(frame, frameWidth, pixelsSinceLastFrame);
      ctx.restore();

      // save current canvas state into cached canvas
      this.cachedCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.cachedCtx.drawImage(this.canvas, 0, 0, canvasWidth, canvasHeight);

      // update lastFrameDuration, lastFrameWidth
      this.lastFrameDuration = frameDuration;
      this.lastFrameWidth = frameWidth;
      this.previousFrame = frame;
    }

    /**
     * Shift canvas, also called from `DisplaySync`
     * @private
     */

  }, {
    key: 'shiftCanvas',
    value: function shiftCanvas(iShift, time) {
      var ctx = this.ctx;
      var cache = this.cachedCanvas;
      var cachedCtx = this.cachedCtx;
      var width = this.canvasWidth;
      var height = this.canvasHeight;
      var croppedWidth = width - iShift;
      this.currentTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(cache, iShift, 0, croppedWidth, height, 0, 0, croppedWidth, height);
      // save current canvas state into cached canvas
      cachedCtx.clearRect(0, 0, width, height);
      cachedCtx.drawImage(this.canvas, 0, 0, width, height);
    }

    // @todo - Fix trigger mode
    // allow to witch easily between the 2 modes
    // setTrigger(bool) {
    //   this.params.trigger = bool;
    //   // clear canvas and cache
    //   this.ctx.clearRect(0, 0, this.params.width, this.params.height);
    //   this.cachedCtx.clearRect(0, 0, this.params.width, this.params.height);
    //   // reset _currentXPosition
    //   this._currentXPosition = 0;
    //   this.lastShiftError = 0;
    // }

    // /**
    //  * Alternative drawing mode.
    //  * Draw from left to right, go back to left when > width
    //  */
    // triggerModeDraw(time, frame) {
    //   const width  = this.params.width;
    //   const height = this.params.height;
    //   const duration = this.params.duration;
    //   const ctx = this.ctx;

    //   const dt = time - this.previousTime;
    //   const fShift = (dt / duration) * width - this.lastShiftError; // px
    //   const iShift = Math.round(fShift);
    //   this.lastShiftError = iShift - fShift;

    //   this.currentXPosition += iShift;

    //   // draw the right part
    //   ctx.save();
    //   ctx.translate(this.currentXPosition, 0);
    //   ctx.clearRect(-iShift, 0, iShift, height);
    //   this.drawCurve(frame, iShift);
    //   ctx.restore();

    //   // go back to the left of the canvas and redraw the same thing
    //   if (this.currentXPosition > width) {
    //     // go back to start
    //     this.currentXPosition -= width;

    //     ctx.save();
    //     ctx.translate(this.currentXPosition, 0);
    //     ctx.clearRect(-iShift, 0, iShift, height);
    //     this.drawCurve(frame, this.previousFrame, iShift);
    //     ctx.restore();
    //   }
    // }

  }]);
  return BaseDisplay;
}(_BaseLfo3.default);

exports.default = BaseDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VEaXNwbGF5LmpzIl0sIm5hbWVzIjpbImNvbW1vbkRlZmluaXRpb25zIiwibWluIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJtYXgiLCJ3aWR0aCIsImhlaWdodCIsImNvbnRhaW5lciIsImNvbnN0YW50IiwiY2FudmFzIiwiaGFzRHVyYXRpb25EZWZpbml0aW9ucyIsImR1cmF0aW9uIiwiSW5maW5pdHkiLCJyZWZlcmVuY2VUaW1lIiwiQmFzZURpc3BsYXkiLCJkZWZzIiwib3B0aW9ucyIsImhhc0R1cmF0aW9uIiwiY29tbW9uRGVmcyIsImRlZmluaXRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJjYW52YXNQYXJhbSIsImNvbnRhaW5lclBhcmFtIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiY3R4IiwiZ2V0Q29udGV4dCIsImNhY2hlZENhbnZhcyIsImNhY2hlZEN0eCIsInByZXZpb3VzRnJhbWUiLCJjdXJyZW50VGltZSIsImRpc3BsYXlTeW5jIiwiX3N0YWNrIiwiX3JhZklkIiwicmVuZGVyU3RhY2siLCJiaW5kIiwic2hpZnRFcnJvciIsIl9yZXNpemUiLCJkUFIiLCJ3aW5kb3ciLCJkZXZpY2VQaXhlbFJhdGlvIiwiYlBSIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJwaXhlbFJhdGlvIiwibGFzdFdpZHRoIiwiY2FudmFzV2lkdGgiLCJsYXN0SGVpZ2h0IiwiY2FudmFzSGVpZ2h0IiwiZHJhd0ltYWdlIiwic3R5bGUiLCJfc2V0WVNjYWxlIiwiYSIsImIiLCJnZXRZUG9zaXRpb24iLCJ4IiwibmFtZSIsInZhbHVlIiwiY2xlYXJSZWN0IiwiZW5kVGltZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJzdHJlYW1QYXJhbXMiLCJjb3B5IiwiRmxvYXQzMkFycmF5IiwiZGF0YSIsImkiLCJwdXNoIiwidGltZSIsIm1ldGFkYXRhIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiaGFzIiwibCIsImxlbmd0aCIsInNjcm9sbE1vZGVEcmF3IiwicHJvY2Vzc0Z1bmN0aW9uIiwiZnJhbWVUeXBlIiwiZnJhbWVSYXRlIiwic291cmNlU2FtcGxlUmF0ZSIsImNhbnZhc0R1cmF0aW9uIiwiZnJhbWVTdGFydFRpbWUiLCJsYXN0RnJhbWVUaW1lIiwibGFzdEZyYW1lRHVyYXRpb24iLCJmcmFtZUR1cmF0aW9uIiwicGl4ZWxEdXJhdGlvbiIsImdldE1pbmltdW1GcmFtZVdpZHRoIiwiZnJhbWVFbmRUaW1lIiwic2hpZnRUaW1lIiwiZlNoaWZ0IiwiaVNoaWZ0IiwiTWF0aCIsImZsb29yIiwic2hpZnRDYW52YXMiLCJzaGlmdFNpYmxpbmdzIiwiZkZyYW1lV2lkdGgiLCJmcmFtZVdpZHRoIiwiY2FudmFzU3RhcnRUaW1lIiwic3RhcnRUaW1lUmF0aW8iLCJzdGFydFRpbWVQb3NpdGlvbiIsInBpeGVsc1NpbmNlTGFzdEZyYW1lIiwibGFzdEZyYW1lV2lkdGgiLCJmcmFtZUludGVydmFsIiwic2F2ZSIsInRyYW5zbGF0ZSIsInJlc3RvcmUiLCJjYWNoZSIsImNyb3BwZWRXaWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxvQkFBb0I7QUFDeEJDLE9BQUs7QUFDSEMsVUFBTSxPQURIO0FBRUhDLGFBQVMsQ0FBQyxDQUZQO0FBR0hDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEosR0FEbUI7QUFNeEJDLE9BQUs7QUFDSEosVUFBTSxPQURIO0FBRUhDLGFBQVMsQ0FGTjtBQUdIQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhKLEdBTm1CO0FBV3hCRSxTQUFP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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O2tCQUlhUSxXIiwiZmlsZSI6IkJhc2VEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29yZS9CYXNlTGZvJztcblxuY29uc3QgY29tbW9uRGVmaW5pdGlvbnMgPSB7XG4gIG1pbjoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogLTEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIG1heDoge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgd2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMzAwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBoZWlnaHQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMTUwLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBjb250YWluZXI6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYW52YXM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuY29uc3QgaGFzRHVyYXRpb25EZWZpbml0aW9ucyA9IHtcbiAgZHVyYXRpb246IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIG1pbjogMCxcbiAgICBtYXg6ICtJbmZpbml0eSxcbiAgICBkZWZhdWx0OiAxLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICByZWZlcmVuY2VUaW1lOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxufTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGV4dGVuZCBpbiBvcmRlciB0byBjcmVhdGUgZ3JhcGhpYyBzaW5rcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhYnN0cmFjdCBhbmQgb25seVxuICogYmUgdXNlZCB0byBiZSBleHRlbmRlZC5fPC9zcGFuPlxuICpcbiAqIEB0b2RvIC0gZml4IGZsb2F0IHJvdW5kaW5nIGVycm9ycyAocHJvZHVjZSBkZWNheXMgaW4gc3luYyBkcmF3cylcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNsaWVudC5zaW5rXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWluPS0xXSAtIE1pbmltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4PTFdIC0gTWF4aW11bSB2YWx1ZSByZXByZXNlbnRlZCBpbiB0aGUgY2FudmFzLlxuICogIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0zMDBdIC0gV2lkdGggb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTE1MF0gLSBIZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNvbnRhaW5lcj1udWxsXSAtIENvbnRhaW5lciBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gaW5zZXJ0IHRoZSBjYW52YXMuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge0VsZW1lbnR8Q1NTU2VsZWN0b3J9IFtvcHRpb25zLmNhbnZhcz1udWxsXSAtIENhbnZhcyBlbGVtZW50XG4gKiAgaW4gd2hpY2ggdG8gZHJhdy4gX2NvbnN0YW50IHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xXSAtIER1cmF0aW9uIChpbiBzZWNvbmRzKSByZXByZXNlbnRlZCBpblxuICogIHRoZSBjYW52YXMuIFRoaXMgcGFyYW1ldGVyIG9ubHkgZXhpc3RzIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWxcbiAqICBjb25zZWN1dGl2ZSBmcmFtZXMgb24gdGhlIGNhbnZhcy4gX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnJlZmVyZW5jZVRpbWU9bnVsbF0gLSBPcHRpb25uYWwgcmVmZXJlbmNlIHRpbWUgdGhlXG4gKiAgZGlzcGxheSBzaG91bGQgY29uc2lkZXJlciBhcyB0aGUgb3JpZ2luLiBJcyBvbmx5IHVzZWZ1bGwgd2hlbiBzeW5jaHJvbml6aW5nXG4gKiAgc2V2ZXJhbCBkaXNwbGF5IHVzaW5nIHRoZSBgRGlzcGxheVN5bmNgIGNsYXNzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0c1xuICogIGZvciBvcGVyYXRvcnMgdGhhdCBkaXNwbGF5IHNldmVyYWwgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuXG4gKi9cbmNsYXNzIEJhc2VEaXNwbGF5IGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKGRlZnMsIG9wdGlvbnMgPSB7fSwgaGFzRHVyYXRpb24gPSB0cnVlKSB7XG4gICAgbGV0IGNvbW1vbkRlZnM7XG5cbiAgICBpZiAoaGFzRHVyYXRpb24pXG4gICAgICBjb21tb25EZWZzID0gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uRGVmaW5pdGlvbnMsIGhhc0R1cmF0aW9uRGVmaW5pdGlvbnMpO1xuICAgIGVsc2VcbiAgICAgIGNvbW1vbkRlZnMgPSBjb21tb25EZWZpbml0aW9uc1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tb25EZWZzLCBkZWZzKTtcblxuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ2NhbnZhcycpID09PSBudWxsICYmIHRoaXMucGFyYW1zLmdldCgnY29udGFpbmVyJykgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyOiBgY2FudmFzYCBvciBgY29udGFpbmVyYCBub3QgZGVmaW5lZCcpO1xuXG4gICAgY29uc3QgY2FudmFzUGFyYW0gPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbnZhcycpO1xuICAgIGNvbnN0IGNvbnRhaW5lclBhcmFtID0gdGhpcy5wYXJhbXMuZ2V0KCdjb250YWluZXInKTtcblxuICAgIC8vIHByZXBhcmUgY2FudmFzXG4gICAgaWYgKGNhbnZhc1BhcmFtKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbnZhc1BhcmFtID09PSAnc3RyaW5nJylcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNhbnZhc1BhcmFtKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXNQYXJhbTtcbiAgICB9IGVsc2UgaWYgKGNvbnRhaW5lclBhcmFtKSB7XG4gICAgICBsZXQgY29udGFpbmVyO1xuXG4gICAgICBpZiAodHlwZW9mIGNvbnRhaW5lclBhcmFtID09PSAnc3RyaW5nJylcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXJQYXJhbSk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lclBhcmFtO1xuXG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcbiAgICB9XG5cbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jYWNoZWRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLnByZXZpb3VzRnJhbWUgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBoYXNEdXJhdGlvbiA/IHRoaXMucGFyYW1zLmdldCgncmVmZXJlbmNlVGltZScpIDogbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbmNlIG9mIHRoZSBgRGlzcGxheVN5bmNgIHVzZWQgdG8gc3luY2hyb25pemUgdGhlIGRpZmZlcmVudCBkaXNwbGF5c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kaXNwbGF5U3luYyA9IGZhbHNlO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yYWZJZCA9IG51bGw7XG5cbiAgICB0aGlzLnJlbmRlclN0YWNrID0gdGhpcy5yZW5kZXJTdGFjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hpZnRFcnJvciA9IDA7XG5cbiAgICAvLyBpbml0aWFsaXplIGNhbnZhcyBzaXplIGFuZCB5IHNjYWxlIHRyYW5zZmVydCBmdW5jdGlvblxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5nZXQoJ3dpZHRoJyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdoZWlnaHQnKTtcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuXG4gICAgY29uc3QgZFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCBiUFIgPSBjdHgud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIHRoaXMucGl4ZWxSYXRpbyA9IGRQUiAvIGJQUjtcblxuICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgbGFzdEhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSB3aWR0aCAqIHRoaXMucGl4ZWxSYXRpbztcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGhlaWdodCAqIHRoaXMucGl4ZWxSYXRpbztcblxuICAgIGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICAvLyBjb3B5IGN1cnJlbnQgaW1hZ2UgZnJvbSBjdHggKHJlc2l6ZSlcbiAgICBpZiAobGFzdFdpZHRoICYmIGxhc3RIZWlnaHQpIHtcbiAgICAgIGNhY2hlZEN0eC5kcmF3SW1hZ2UoY3R4LmNhbnZhcyxcbiAgICAgICAgMCwgMCwgbGFzdFdpZHRoLCBsYXN0SGVpZ2h0LFxuICAgICAgICAwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuXG4gICAgLy8gdXBkYXRlIHNjYWxlXG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBtYXAgdmFsdWVzIHRvIHBpeGVsIGluIHRoZSB5IGF4aXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRZU2NhbGUoKSB7XG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW4nKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLnBhcmFtcy5nZXQoJ21heCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgY29uc3QgYSA9ICgwIC0gaGVpZ2h0KSAvIChtYXggLSBtaW4pO1xuICAgIGNvbnN0IGIgPSBoZWlnaHQgLSAoYSAqIG1pbik7XG5cbiAgICB0aGlzLmdldFlQb3NpdGlvbiA9ICh4KSA9PiBhICogeCArIGI7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggaW4gcGl4ZWwgYSBgdmVjdG9yYCBmcmFtZSBuZWVkcyB0byBiZSBkcmF3bi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldE1pbmltdW1GcmFtZVdpZHRoKCkge1xuICAgIHJldHVybiAxOyAvLyBuZWVkIG9uZSBwaXhlbCB0byBkcmF3IHRoZSBsaW5lXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiBhIHBhcmFtZXRlciBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFBhcmFtZXRlciBuYW1lLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGFzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnbWluJzpcbiAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgIC8vIEB0b2RvIC0gbWFrZSBzdXJlIHRoYXQgbWluIGFuZCBtYXggYXJlIGRpZmZlcmVudFxuICAgICAgICB0aGlzLl9zZXRZU2NhbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3aWR0aCc6XG4gICAgICBjYXNlICdoZWlnaHQnOlxuICAgICAgICB0aGlzLl9yZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkge1xuICAgIHN1cGVyLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHJlc2V0U3RyZWFtKCkge1xuICAgIHN1cGVyLnJlc2V0U3RyZWFtKCk7XG5cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbnVsbDtcbiAgICBzdXBlci5maW5hbGl6ZVN0cmVhbShlbmRUaW1lKTtcblxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX3JhZklkKTtcbiAgICB0aGlzLl9yYWZJZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBjdXJyZW50IGZyYW1lIHRvIHRoZSBmcmFtZXMgdG8gZHJhdy4gU2hvdWxkIG5vdCBiZSBvdmVycmlkZW4uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgY29weSA9IG5ldyBGbG9hdDMyQXJyYXkoZnJhbWVTaXplKTtcbiAgICBjb25zdCBkYXRhID0gZnJhbWUuZGF0YTtcblxuICAgIC8vIGNvcHkgdmFsdWVzIG9mIHRoZSBpbnB1dCBmcmFtZSBhcyB0aGV5IG1pZ2h0IGJlIHVwZGF0ZWRcbiAgICAvLyBpbiByZWZlcmVuY2UgYmVmb3JlIGJlaW5nIGNvbnN1bWVkIGluIHRoZSBkcmF3IGZ1bmN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKylcbiAgICAgIGNvcHlbaV0gPSBkYXRhW2ldO1xuXG4gICAgdGhpcy5fc3RhY2sucHVzaCh7XG4gICAgICB0aW1lOiBmcmFtZS50aW1lLFxuICAgICAgZGF0YTogY29weSxcbiAgICAgIG1ldGFkYXRhOiBmcmFtZS5tZXRhZGF0YSxcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9yYWZJZCA9PT0gbnVsbClcbiAgICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyU3RhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYWNjdW11bGF0ZWQgZnJhbWVzLiBNZXRob2QgY2FsbGVkIGluIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVuZGVyU3RhY2soKSB7XG4gICAgaWYgKHRoaXMucGFyYW1zLmhhcygnZHVyYXRpb24nKSkge1xuICAgICAgLy8gcmVuZGVyIGFsbCBmcmFtZSBzaW5jZSBsYXN0IGByZW5kZXJTdGFja2AgY2FsbFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLl9zdGFjay5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICAgIHRoaXMuc2Nyb2xsTW9kZURyYXcodGhpcy5fc3RhY2tbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvbmx5IHJlbmRlciBsYXN0IHJlY2VpdmVkIGZyYW1lIGlmIGFueVxuICAgICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZnJhbWUgPSB0aGlzLl9zdGFja1t0aGlzLl9zdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlaW5pdCBzdGFjayBmb3IgbmV4dCBjYWxsXG4gICAgdGhpcy5fc3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlclN0YWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IGRhdGEgZnJvbSByaWdodCB0byBsZWZ0IHdpdGggc2Nyb2xsaW5nXG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gY2hlY2sgcG9zc2liaWxpdHkgb2YgbWFpbnRhaW5pbmcgYWxsIHZhbHVlcyBmcm9tIG9uZSBwbGFjZSB0b1xuICAgKiAgICAgICAgIG1pbmltaXplIGZsb2F0IGVycm9yIHRyYWNraW5nLlxuICAgKi9cbiAgc2Nyb2xsTW9kZURyYXcoZnJhbWUpIHtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG4gICAgY29uc3QgZnJhbWVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVSYXRlO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBzb3VyY2VTYW1wbGVSYXRlID0gdGhpcy5zdHJlYW1QYXJhbXMuc291cmNlU2FtcGxlUmF0ZTtcblxuICAgIGNvbnN0IGNhbnZhc0R1cmF0aW9uID0gdGhpcy5wYXJhbXMuZ2V0KCdkdXJhdGlvbicpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBjYW52YXNIZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGNvbnN0IHByZXZpb3VzRnJhbWUgPSB0aGlzLnByZXZpb3VzRnJhbWU7XG5cbiAgICAvLyBjdXJyZW50IHRpbWUgYXQgdGhlIGxlZnQgb2YgdGhlIGNhbnZhc1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gKHRoaXMuY3VycmVudFRpbWUgIT09IG51bGwpID8gdGhpcy5jdXJyZW50VGltZSA6IGZyYW1lLnRpbWU7XG4gICAgY29uc3QgZnJhbWVTdGFydFRpbWUgPSBmcmFtZS50aW1lO1xuICAgIGNvbnN0IGxhc3RGcmFtZVRpbWUgPSBwcmV2aW91c0ZyYW1lID8gcHJldmlvdXNGcmFtZS50aW1lIDogMDtcbiAgICBjb25zdCBsYXN0RnJhbWVEdXJhdGlvbiA9IHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPyB0aGlzLmxhc3RGcmFtZUR1cmF0aW9uIDogMDtcblxuICAgIGxldCBmcmFtZUR1cmF0aW9uO1xuXG4gICAgaWYgKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykge1xuICAgICAgY29uc3QgcGl4ZWxEdXJhdGlvbiA9IGNhbnZhc0R1cmF0aW9uIC8gY2FudmFzV2lkdGg7XG4gICAgICBmcmFtZUR1cmF0aW9uID0gdGhpcy5nZXRNaW5pbXVtRnJhbWVXaWR0aCgpICogcGl4ZWxEdXJhdGlvbjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSA9PT0gJ3NpZ25hbCcpIHtcbiAgICAgIGZyYW1lRHVyYXRpb24gPSBmcmFtZVNpemUgLyBzb3VyY2VTYW1wbGVSYXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYW1lRW5kVGltZSA9IGZyYW1lU3RhcnRUaW1lICsgZnJhbWVEdXJhdGlvbjtcbiAgICAvLyBkZWZpbmUgaWYgd2UgbmVlZCB0byBzaGlmdCB0aGUgY2FudmFzXG4gICAgY29uc3Qgc2hpZnRUaW1lID0gZnJhbWVFbmRUaW1lIC0gY3VycmVudFRpbWU7XG5cbiAgICAvLyBpZiB0aGUgY2FudmFzIGlzIG5vdCBzeW5jZWQsIHNob3VsZCBuZXZlciBnbyB0byBgZWxzZWBcbiAgICBpZiAoc2hpZnRUaW1lID4gMCkge1xuICAgICAgLy8gc2hpZnQgdGhlIGNhbnZhcyBvZiBzaGlmdFRpbWUgaW4gcGl4ZWxzXG4gICAgICBjb25zdCBmU2hpZnQgPSAoc2hpZnRUaW1lIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGggLSB0aGlzLnNoaWZ0RXJyb3I7XG4gICAgICBjb25zdCBpU2hpZnQgPSBNYXRoLmZsb29yKGZTaGlmdCArIDAuNSk7XG4gICAgICB0aGlzLnNoaWZ0RXJyb3IgPSBmU2hpZnQgLSBpU2hpZnQ7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gZnJhbWVTdGFydFRpbWUgKyBmcmFtZUR1cmF0aW9uO1xuICAgICAgdGhpcy5zaGlmdENhbnZhcyhpU2hpZnQsIGN1cnJlbnRUaW1lKTtcblxuICAgICAgLy8gaWYgc2libGluZ3MsIHNoYXJlIHRoZSBpbmZvcm1hdGlvblxuICAgICAgaWYgKHRoaXMuZGlzcGxheVN5bmMpXG4gICAgICAgIHRoaXMuZGlzcGxheVN5bmMuc2hpZnRTaWJsaW5ncyhpU2hpZnQsIGN1cnJlbnRUaW1lLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyB3aWR0aCBvZiB0aGUgZnJhbWUgaW4gcGl4ZWxzXG4gICAgY29uc3QgZkZyYW1lV2lkdGggPSAoZnJhbWVEdXJhdGlvbiAvIGNhbnZhc0R1cmF0aW9uKSAqIGNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGZyYW1lV2lkdGggPSBNYXRoLmZsb29yKGZGcmFtZVdpZHRoICsgMC41KTtcblxuICAgIC8vIGRlZmluZSBwb3NpdGlvbiBvZiB0aGUgaGVhZCBpbiB0aGUgY2FudmFzXG4gICAgY29uc3QgY2FudmFzU3RhcnRUaW1lID0gdGhpcy5jdXJyZW50VGltZSAtIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVJhdGlvID0gKGZyYW1lU3RhcnRUaW1lIC0gY2FudmFzU3RhcnRUaW1lKSAvIGNhbnZhc0R1cmF0aW9uO1xuICAgIGNvbnN0IHN0YXJ0VGltZVBvc2l0aW9uID0gc3RhcnRUaW1lUmF0aW8gKiBjYW52YXNXaWR0aDtcblxuICAgIC8vIG51bWJlciBvZiBwaXhlbHMgc2luY2UgbGFzdCBmcmFtZVxuICAgIGxldCBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IHRoaXMubGFzdEZyYW1lV2lkdGg7XG5cbiAgICBpZiAoKGZyYW1lVHlwZSA9PT0gJ3NjYWxhcicgfHwgZnJhbWVUeXBlID09PSAndmVjdG9yJykgJiYgcHJldmlvdXNGcmFtZSkge1xuICAgICAgY29uc3QgZnJhbWVJbnRlcnZhbCA9IGZyYW1lLnRpbWUgLSBwcmV2aW91c0ZyYW1lLnRpbWU7XG4gICAgICBwaXhlbHNTaW5jZUxhc3RGcmFtZSA9IChmcmFtZUludGVydmFsIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gZHJhdyBjdXJyZW50IGZyYW1lXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHN0YXJ0VGltZVBvc2l0aW9uLCAwKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSwgZnJhbWVXaWR0aCwgcGl4ZWxzU2luY2VMYXN0RnJhbWUpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgY2FudmFzIHN0YXRlIGludG8gY2FjaGVkIGNhbnZhc1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgICB0aGlzLmNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXG4gICAgLy8gdXBkYXRlIGxhc3RGcmFtZUR1cmF0aW9uLCBsYXN0RnJhbWVXaWR0aFxuICAgIHRoaXMubGFzdEZyYW1lRHVyYXRpb24gPSBmcmFtZUR1cmF0aW9uO1xuICAgIHRoaXMubGFzdEZyYW1lV2lkdGggPSBmcmFtZVdpZHRoO1xuICAgIHRoaXMucHJldmlvdXNGcmFtZSA9IGZyYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoaWZ0IGNhbnZhcywgYWxzbyBjYWxsZWQgZnJvbSBgRGlzcGxheVN5bmNgXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzaGlmdENhbnZhcyhpU2hpZnQsIHRpbWUpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuY2FjaGVkQ2FudmFzO1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjb25zdCBjcm9wcGVkV2lkdGggPSB3aWR0aCAtIGlTaGlmdDtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGltZTtcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmRyYXdJbWFnZShjYWNoZSwgaVNoaWZ0LCAwLCBjcm9wcGVkV2lkdGgsIGhlaWdodCwgMCwgMCwgY3JvcHBlZFdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIHNhdmUgY3VycmVudCBjYW52YXMgc3RhdGUgaW50byBjYWNoZWQgY2FudmFzXG4gICAgY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjYWNoZWRDdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIC8vIEB0b2RvIC0gRml4IHRyaWdnZXIgbW9kZVxuICAvLyBhbGxvdyB0byB3aXRjaCBlYXNpbHkgYmV0d2VlbiB0aGUgMiBtb2Rlc1xuICAvLyBzZXRUcmlnZ2VyKGJvb2wpIHtcbiAgLy8gICB0aGlzLnBhcmFtcy50cmlnZ2VyID0gYm9vbDtcbiAgLy8gICAvLyBjbGVhciBjYW52YXMgYW5kIGNhY2hlXG4gIC8vICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAvLyAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnBhcmFtcy53aWR0aCwgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgLy8gICAvLyByZXNldCBfY3VycmVudFhQb3NpdGlvblxuICAvLyAgIHRoaXMuX2N1cnJlbnRYUG9zaXRpb24gPSAwO1xuICAvLyAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSAwO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqIEFsdGVybmF0aXZlIGRyYXdpbmcgbW9kZS5cbiAgLy8gICogRHJhdyBmcm9tIGxlZnQgdG8gcmlnaHQsIGdvIGJhY2sgdG8gbGVmdCB3aGVuID4gd2lkdGhcbiAgLy8gICovXG4gIC8vIHRyaWdnZXJNb2RlRHJhdyh0aW1lLCBmcmFtZSkge1xuICAvLyAgIGNvbnN0IHdpZHRoICA9IHRoaXMucGFyYW1zLndpZHRoO1xuICAvLyAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgLy8gICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAvLyAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuXG4gIC8vICAgY29uc3QgZHQgPSB0aW1lIC0gdGhpcy5wcmV2aW91c1RpbWU7XG4gIC8vICAgY29uc3QgZlNoaWZ0ID0gKGR0IC8gZHVyYXRpb24pICogd2lkdGggLSB0aGlzLmxhc3RTaGlmdEVycm9yOyAvLyBweFxuICAvLyAgIGNvbnN0IGlTaGlmdCA9IE1hdGgucm91bmQoZlNoaWZ0KTtcbiAgLy8gICB0aGlzLmxhc3RTaGlmdEVycm9yID0gaVNoaWZ0IC0gZlNoaWZ0O1xuXG4gIC8vICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uICs9IGlTaGlmdDtcblxuICAvLyAgIC8vIGRyYXcgdGhlIHJpZ2h0IHBhcnRcbiAgLy8gICBjdHguc2F2ZSgpO1xuICAvLyAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICBjdHguY2xlYXJSZWN0KC1pU2hpZnQsIDAsIGlTaGlmdCwgaGVpZ2h0KTtcbiAgLy8gICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICBjdHgucmVzdG9yZSgpO1xuXG4gIC8vICAgLy8gZ28gYmFjayB0byB0aGUgbGVmdCBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXcgdGhlIHNhbWUgdGhpbmdcbiAgLy8gICBpZiAodGhpcy5jdXJyZW50WFBvc2l0aW9uID4gd2lkdGgpIHtcbiAgLy8gICAgIC8vIGdvIGJhY2sgdG8gc3RhcnRcbiAgLy8gICAgIHRoaXMuY3VycmVudFhQb3NpdGlvbiAtPSB3aWR0aDtcblxuICAvLyAgICAgY3R4LnNhdmUoKTtcbiAgLy8gICAgIGN0eC50cmFuc2xhdGUodGhpcy5jdXJyZW50WFBvc2l0aW9uLCAwKTtcbiAgLy8gICAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAvLyAgICAgdGhpcy5kcmF3Q3VydmUoZnJhbWUsIHRoaXMucHJldmlvdXNGcmFtZSwgaVNoaWZ0KTtcbiAgLy8gICAgIGN0eC5yZXN0b3JlKCk7XG4gIC8vICAgfVxuICAvLyB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZURpc3BsYXk7XG4iXX0=