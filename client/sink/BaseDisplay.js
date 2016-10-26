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

var _BaseLfo2 = require('../../common/core/BaseLfo');

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

    //
    _this._stack;
    _this._rafId;

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

      this._stack = [];
      this._rafId = requestAnimationFrame(this.renderStack);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VEaXNwbGF5LmpzIl0sIm5hbWVzIjpbImNvbW1vbkRlZmluaXRpb25zIiwibWluIiwidHlwZSIsImRlZmF1bHQiLCJtZXRhcyIsImtpbmQiLCJtYXgiLCJ3aWR0aCIsImhlaWdodCIsImNvbnRhaW5lciIsImNvbnN0YW50IiwiY2FudmFzIiwiaGFzRHVyYXRpb25EZWZpbml0aW9ucyIsImR1cmF0aW9uIiwiSW5maW5pdHkiLCJyZWZlcmVuY2VUaW1lIiwiQmFzZURpc3BsYXkiLCJkZWZzIiwib3B0aW9ucyIsImhhc0R1cmF0aW9uIiwiY29tbW9uRGVmcyIsImRlZmluaXRpb25zIiwicGFyYW1zIiwiZ2V0IiwiRXJyb3IiLCJjYW52YXNQYXJhbSIsImNvbnRhaW5lclBhcmFtIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiY3R4IiwiZ2V0Q29udGV4dCIsImNhY2hlZENhbnZhcyIsImNhY2hlZEN0eCIsInByZXZpb3VzRnJhbWUiLCJjdXJyZW50VGltZSIsImRpc3BsYXlTeW5jIiwiX3N0YWNrIiwiX3JhZklkIiwicmVuZGVyU3RhY2siLCJiaW5kIiwic2hpZnRFcnJvciIsIl9yZXNpemUiLCJkUFIiLCJ3aW5kb3ciLCJkZXZpY2VQaXhlbFJhdGlvIiwiYlBSIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJwaXhlbFJhdGlvIiwibGFzdFdpZHRoIiwiY2FudmFzV2lkdGgiLCJsYXN0SGVpZ2h0IiwiY2FudmFzSGVpZ2h0IiwiZHJhd0ltYWdlIiwic3R5bGUiLCJfc2V0WVNjYWxlIiwiYSIsImIiLCJnZXRZUG9zaXRpb24iLCJ4IiwibmFtZSIsInZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2xlYXJSZWN0IiwiZW5kVGltZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZnJhbWUiLCJmcmFtZVNpemUiLCJzdHJlYW1QYXJhbXMiLCJjb3B5IiwiRmxvYXQzMkFycmF5IiwiZGF0YSIsImkiLCJwdXNoIiwidGltZSIsIm1ldGFkYXRhIiwiaGFzIiwibCIsImxlbmd0aCIsInNjcm9sbE1vZGVEcmF3IiwicHJvY2Vzc0Z1bmN0aW9uIiwiZnJhbWVUeXBlIiwiZnJhbWVSYXRlIiwic291cmNlU2FtcGxlUmF0ZSIsImNhbnZhc0R1cmF0aW9uIiwiZnJhbWVTdGFydFRpbWUiLCJsYXN0RnJhbWVUaW1lIiwibGFzdEZyYW1lRHVyYXRpb24iLCJmcmFtZUR1cmF0aW9uIiwicGl4ZWxEdXJhdGlvbiIsImdldE1pbmltdW1GcmFtZVdpZHRoIiwiZnJhbWVFbmRUaW1lIiwic2hpZnRUaW1lIiwiZlNoaWZ0IiwiaVNoaWZ0IiwiTWF0aCIsImZsb29yIiwic2hpZnRDYW52YXMiLCJzaGlmdFNpYmxpbmdzIiwiZkZyYW1lV2lkdGgiLCJmcmFtZVdpZHRoIiwiY2FudmFzU3RhcnRUaW1lIiwic3RhcnRUaW1lUmF0aW8iLCJzdGFydFRpbWVQb3NpdGlvbiIsInBpeGVsc1NpbmNlTGFzdEZyYW1lIiwibGFzdEZyYW1lV2lkdGgiLCJmcmFtZUludGVydmFsIiwic2F2ZSIsInRyYW5zbGF0ZSIsInJlc3RvcmUiLCJjYWNoZSIsImNyb3BwZWRXaWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxvQkFBb0I7QUFDeEJDLE9BQUs7QUFDSEMsVUFBTSxPQURIO0FBRUhDLGFBQVMsQ0FBQyxDQUZQO0FBR0hDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSEosR0FEbUI7QUFNeEJDLE9BQUs7QUFDSEosVUFBTSxPQURIO0FBRUhDLGFBQVMsQ0FGTjtBQUdIQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUhKLEdBTm1CO0FBV3hCRSxTQUFP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ZmlsZSI6IkJhc2VEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnLi4vLi4vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5cbmNvbnN0IGNvbW1vbkRlZmluaXRpb25zID0ge1xuICBtaW46IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IC0xLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9LFxuICBtYXg6IHtcbiAgICB0eXBlOiAnZmxvYXQnLFxuICAgIGRlZmF1bHQ6IDEsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH0sXG4gIHdpZHRoOiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDMwMCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgaGVpZ2h0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDE1MCxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgY29udGFpbmVyOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FudmFzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbmNvbnN0IGhhc0R1cmF0aW9uRGVmaW5pdGlvbnMgPSB7XG4gIGR1cmF0aW9uOiB7XG4gICAgdHlwZTogJ2Zsb2F0JyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiArSW5maW5pdHksXG4gICAgZGVmYXVsdDogMSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfSxcbiAgcmVmZXJlbmNlVGltZToge1xuICAgIHR5cGU6ICdmbG9hdCcsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbn07XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBleHRlbmQgaW4gb3JkZXIgdG8gY3JlYXRlIGdyYXBoaWMgc2lua3MuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X1RoaXMgY2xhc3Mgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYWJzdHJhY3QgYW5kIG9ubHlcbiAqIGJlIHVzZWQgdG8gYmUgZXh0ZW5kZWQuXzwvc3Bhbj5cbiAqXG4gKiBAdG9kbyAtIGZpeCBmbG9hdCByb3VuZGluZyBlcnJvcnMgKHByb2R1Y2UgZGVjYXlzIGluIHN5bmMgZHJhd3MpXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjbGllbnQuc2lua1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbj0tMV0gLSBNaW5pbXVtIHZhbHVlIHJlcHJlc2VudGVkIGluIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heD0xXSAtIE1heGltdW0gdmFsdWUgcmVwcmVzZW50ZWQgaW4gdGhlIGNhbnZhcy5cbiAqICBfZHluYW1pYyBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9MzAwXSAtIFdpZHRoIG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNTBdIC0gSGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gKiAgX2R5bmFtaWMgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jb250YWluZXI9bnVsbF0gLSBDb250YWluZXIgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGluc2VydCB0aGUgY2FudmFzLiBfY29uc3RhbnQgcGFyYW1ldGVyX1xuICogQHBhcmFtIHtFbGVtZW50fENTU1NlbGVjdG9yfSBbb3B0aW9ucy5jYW52YXM9bnVsbF0gLSBDYW52YXMgZWxlbWVudFxuICogIGluIHdoaWNoIHRvIGRyYXcuIF9jb25zdGFudCBwYXJhbWV0ZXJfXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZHVyYXRpb249MV0gLSBEdXJhdGlvbiAoaW4gc2Vjb25kcykgcmVwcmVzZW50ZWQgaW5cbiAqICB0aGUgY2FudmFzLiBUaGlzIHBhcmFtZXRlciBvbmx5IGV4aXN0cyBmb3Igb3BlcmF0b3JzIHRoYXQgZGlzcGxheSBzZXZlcmFsXG4gKiAgY29uc2VjdXRpdmUgZnJhbWVzIG9uIHRoZSBjYW52YXMuIF9keW5hbWljIHBhcmFtZXRlcl9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5yZWZlcmVuY2VUaW1lPW51bGxdIC0gT3B0aW9ubmFsIHJlZmVyZW5jZSB0aW1lIHRoZVxuICogIGRpc3BsYXkgc2hvdWxkIGNvbnNpZGVyZXIgYXMgdGhlIG9yaWdpbi4gSXMgb25seSB1c2VmdWxsIHdoZW4gc3luY2hyb25pemluZ1xuICogIHNldmVyYWwgZGlzcGxheSB1c2luZyB0aGUgYERpc3BsYXlTeW5jYCBjbGFzcy4gVGhpcyBwYXJhbWV0ZXIgb25seSBleGlzdHNcbiAqICBmb3Igb3BlcmF0b3JzIHRoYXQgZGlzcGxheSBzZXZlcmFsIGNvbnNlY3V0aXZlIGZyYW1lcyBvbiB0aGUgY2FudmFzLlxuICovXG5jbGFzcyBCYXNlRGlzcGxheSBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihkZWZzLCBvcHRpb25zID0ge30sIGhhc0R1cmF0aW9uID0gdHJ1ZSkge1xuICAgIGxldCBjb21tb25EZWZzO1xuXG4gICAgaWYgKGhhc0R1cmF0aW9uKVxuICAgICAgY29tbW9uRGVmcyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbW1vbkRlZmluaXRpb25zLCBoYXNEdXJhdGlvbkRlZmluaXRpb25zKTtcbiAgICBlbHNlXG4gICAgICBjb21tb25EZWZzID0gY29tbW9uRGVmaW5pdGlvbnNcblxuICAgIGNvbnN0IGRlZmluaXRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uRGVmcywgZGVmcyk7XG5cbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdjYW52YXMnKSA9PT0gbnVsbCAmJiB0aGlzLnBhcmFtcy5nZXQoJ2NvbnRhaW5lcicpID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhcmFtZXRlcjogYGNhbnZhc2Agb3IgYGNvbnRhaW5lcmAgbm90IGRlZmluZWQnKTtcblxuICAgIGNvbnN0IGNhbnZhc1BhcmFtID0gdGhpcy5wYXJhbXMuZ2V0KCdjYW52YXMnKTtcbiAgICBjb25zdCBjb250YWluZXJQYXJhbSA9IHRoaXMucGFyYW1zLmdldCgnY29udGFpbmVyJyk7XG5cbiAgICAvLyBwcmVwYXJlIGNhbnZhc1xuICAgIGlmIChjYW52YXNQYXJhbSkge1xuICAgICAgaWYgKHR5cGVvZiBjYW52YXNQYXJhbSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihjYW52YXNQYXJhbSk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzUGFyYW07XG4gICAgfSBlbHNlIGlmIChjb250YWluZXJQYXJhbSkge1xuICAgICAgbGV0IGNvbnRhaW5lcjtcblxuICAgICAgaWYgKHR5cGVvZiBjb250YWluZXJQYXJhbSA9PT0gJ3N0cmluZycpXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyUGFyYW0pO1xuICAgICAgZWxzZVxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXJQYXJhbTtcblxuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY2FjaGVkQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYWNoZWRDdHggPSB0aGlzLmNhY2hlZENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gaGFzRHVyYXRpb24gPyB0aGlzLnBhcmFtcy5nZXQoJ3JlZmVyZW5jZVRpbWUnKSA6IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW5jZSBvZiB0aGUgYERpc3BsYXlTeW5jYCB1c2VkIHRvIHN5bmNocm9uaXplIHRoZSBkaWZmZXJlbnQgZGlzcGxheXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGlzcGxheVN5bmMgPSBmYWxzZTtcblxuICAgIC8vXG4gICAgdGhpcy5fc3RhY2s7XG4gICAgdGhpcy5fcmFmSWQ7XG5cbiAgICB0aGlzLnJlbmRlclN0YWNrID0gdGhpcy5yZW5kZXJTdGFjay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hpZnRFcnJvciA9IDA7XG5cbiAgICAvLyBpbml0aWFsaXplIGNhbnZhcyBzaXplIGFuZCB5IHNjYWxlIHRyYW5zZmVydCBmdW5jdGlvblxuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZXNpemUoKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5nZXQoJ3dpZHRoJyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuZ2V0KCdoZWlnaHQnKTtcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhY2hlZEN0eCA9IHRoaXMuY2FjaGVkQ3R4O1xuXG4gICAgY29uc3QgZFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCBiUFIgPSBjdHgud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgIGN0eC5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIHRoaXMucGl4ZWxSYXRpbyA9IGRQUiAvIGJQUjtcblxuICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY29uc3QgbGFzdEhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSB3aWR0aCAqIHRoaXMucGl4ZWxSYXRpbztcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGhlaWdodCAqIHRoaXMucGl4ZWxSYXRpbztcblxuICAgIGNhY2hlZEN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNhY2hlZEN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICAvLyBjb3B5IGN1cnJlbnQgaW1hZ2UgZnJvbSBjdHggKHJlc2l6ZSlcbiAgICBpZiAobGFzdFdpZHRoICYmIGxhc3RIZWlnaHQpIHtcbiAgICAgIGNhY2hlZEN0eC5kcmF3SW1hZ2UoY3R4LmNhbnZhcyxcbiAgICAgICAgMCwgMCwgbGFzdFdpZHRoLCBsYXN0SGVpZ2h0LFxuICAgICAgICAwLCAwLCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuXG4gICAgLy8gdXBkYXRlIHNjYWxlXG4gICAgdGhpcy5fc2V0WVNjYWxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBtYXAgdmFsdWVzIHRvIHBpeGVsIGluIHRoZSB5IGF4aXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRZU2NhbGUoKSB7XG4gICAgY29uc3QgbWluID0gdGhpcy5wYXJhbXMuZ2V0KCdtaW4nKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLnBhcmFtcy5nZXQoJ21heCcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgY29uc3QgYSA9ICgwIC0gaGVpZ2h0KSAvIChtYXggLSBtaW4pO1xuICAgIGNvbnN0IGIgPSBoZWlnaHQgLSAoYSAqIG1pbik7XG5cbiAgICB0aGlzLmdldFlQb3NpdGlvbiA9ICh4KSA9PiBhICogeCArIGI7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggaW4gcGl4ZWwgYSBgdmVjdG9yYCBmcmFtZSBuZWVkcyB0byBiZSBkcmF3bi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldE1pbmltdW1GcmFtZVdpZHRoKCkge1xuICAgIHJldHVybiAxOyAvLyBuZWVkIG9uZSBwaXhlbCB0byBkcmF3IHRoZSBsaW5lXG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiBhIHBhcmFtZXRlciBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFBhcmFtZXRlciBuYW1lLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFBhcmFtZXRlciB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGFzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAnbWluJzpcbiAgICAgIGNhc2UgJ21heCc6XG4gICAgICAgIC8vIEB0b2RvIC0gbWFrZSBzdXJlIHRoYXQgbWluIGFuZCBtYXggYXJlIGRpZmZlcmVudFxuICAgICAgICB0aGlzLl9zZXRZU2NhbGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3aWR0aCc6XG4gICAgICBjYXNlICdoZWlnaHQnOlxuICAgICAgICB0aGlzLl9yZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkge1xuICAgIHN1cGVyLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlclN0YWNrKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICBzdXBlci5yZXNldFN0cmVhbSgpO1xuXG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgdGhpcy5jdXJyZW50VGltZSA9IG51bGw7XG4gICAgc3VwZXIuZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgY3VycmVudCBmcmFtZSB0byB0aGUgZnJhbWVzIHRvIGRyYXcuIFNob3VsZCBub3QgYmUgb3ZlcnJpZGVuLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGNvcHkgPSBuZXcgRmxvYXQzMkFycmF5KGZyYW1lU2l6ZSk7XG4gICAgY29uc3QgZGF0YSA9IGZyYW1lLmRhdGE7XG5cbiAgICAvLyBjb3B5IHZhbHVlcyBvZiB0aGUgaW5wdXQgZnJhbWUgYXMgdGhleSBtaWdodCBiZSB1cGRhdGVkXG4gICAgLy8gaW4gcmVmZXJlbmNlIGJlZm9yZSBiZWluZyBjb25zdW1lZCBpbiB0aGUgZHJhdyBmdW5jdGlvblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspXG4gICAgICBjb3B5W2ldID0gZGF0YVtpXTtcblxuICAgIHRoaXMuX3N0YWNrLnB1c2goe1xuICAgICAgdGltZTogZnJhbWUudGltZSxcbiAgICAgIGRhdGE6IGNvcHksXG4gICAgICBtZXRhZGF0YTogZnJhbWUubWV0YWRhdGEsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBhY2N1bXVsYXRlZCBmcmFtZXMuIE1ldGhvZCBjYWxsZWQgaW4gYHJlcXVlc3RBbmltYXRpb25GcmFtZWAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW5kZXJTdGFjaygpIHtcbiAgICBpZiAodGhpcy5wYXJhbXMuaGFzKCdkdXJhdGlvbicpKSB7XG4gICAgICAvLyByZW5kZXIgYWxsIGZyYW1lIHNpbmNlIGxhc3QgYHJlbmRlclN0YWNrYCBjYWxsXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMuX3N0YWNrLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgICAgdGhpcy5zY3JvbGxNb2RlRHJhdyh0aGlzLl9zdGFja1tpXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG9ubHkgcmVuZGVyIGxhc3QgcmVjZWl2ZWQgZnJhbWUgaWYgYW55XG4gICAgICBpZiAodGhpcy5fc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmcmFtZSA9IHRoaXMuX3N0YWNrW3RoaXMuX3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVpbml0IHN0YWNrIGZvciBuZXh0IGNhbGxcbiAgICB0aGlzLl9zdGFjay5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyU3RhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgZGF0YSBmcm9tIHJpZ2h0IHRvIGxlZnQgd2l0aCBzY3JvbGxpbmdcbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBjaGVjayBwb3NzaWJpbGl0eSBvZiBtYWludGFpbmluZyBhbGwgdmFsdWVzIGZyb20gb25lIHBsYWNlIHRvXG4gICAqICAgICAgICAgbWluaW1pemUgZmxvYXQgZXJyb3IgdHJhY2tpbmcuXG4gICAqL1xuICBzY3JvbGxNb2RlRHJhdyhmcmFtZSkge1xuICAgIGNvbnN0IGZyYW1lVHlwZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZTtcbiAgICBjb25zdCBmcmFtZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVJhdGU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IHNvdXJjZVNhbXBsZVJhdGUgPSB0aGlzLnN0cmVhbVBhcmFtcy5zb3VyY2VTYW1wbGVSYXRlO1xuXG4gICAgY29uc3QgY2FudmFzRHVyYXRpb24gPSB0aGlzLnBhcmFtcy5nZXQoJ2R1cmF0aW9uJyk7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgY2FudmFzV2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuXG4gICAgY29uc3QgcHJldmlvdXNGcmFtZSA9IHRoaXMucHJldmlvdXNGcmFtZTtcblxuICAgIC8vIGN1cnJlbnQgdGltZSBhdCB0aGUgbGVmdCBvZiB0aGUgY2FudmFzXG4gICAgY29uc3QgY3VycmVudFRpbWUgPSAodGhpcy5jdXJyZW50VGltZSAhPT0gbnVsbCkgPyB0aGlzLmN1cnJlbnRUaW1lIDogZnJhbWUudGltZTtcbiAgICBjb25zdCBmcmFtZVN0YXJ0VGltZSA9IGZyYW1lLnRpbWU7XG4gICAgY29uc3QgbGFzdEZyYW1lVGltZSA9IHByZXZpb3VzRnJhbWUgPyBwcmV2aW91c0ZyYW1lLnRpbWUgOiAwO1xuICAgIGNvbnN0IGxhc3RGcmFtZUR1cmF0aW9uID0gdGhpcy5sYXN0RnJhbWVEdXJhdGlvbiA/IHRoaXMubGFzdEZyYW1lRHVyYXRpb24gOiAwO1xuXG4gICAgbGV0IGZyYW1lRHVyYXRpb247XG5cbiAgICBpZiAoZnJhbWVUeXBlID09PSAnc2NhbGFyJyB8fCBmcmFtZVR5cGUgPT09ICd2ZWN0b3InKSB7XG4gICAgICBjb25zdCBwaXhlbER1cmF0aW9uID0gY2FudmFzRHVyYXRpb24gLyBjYW52YXNXaWR0aDtcbiAgICAgIGZyYW1lRHVyYXRpb24gPSB0aGlzLmdldE1pbmltdW1GcmFtZVdpZHRoKCkgKiBwaXhlbER1cmF0aW9uO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlID09PSAnc2lnbmFsJykge1xuICAgICAgZnJhbWVEdXJhdGlvbiA9IGZyYW1lU2l6ZSAvIHNvdXJjZVNhbXBsZVJhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhbWVFbmRUaW1lID0gZnJhbWVTdGFydFRpbWUgKyBmcmFtZUR1cmF0aW9uO1xuICAgIC8vIGRlZmluZSBpZiB3ZSBuZWVkIHRvIHNoaWZ0IHRoZSBjYW52YXNcbiAgICBjb25zdCBzaGlmdFRpbWUgPSBmcmFtZUVuZFRpbWUgLSBjdXJyZW50VGltZTtcblxuICAgIC8vIGlmIHRoZSBjYW52YXMgaXMgbm90IHN5bmNlZCwgc2hvdWxkIG5ldmVyIGdvIHRvIGBlbHNlYFxuICAgIGlmIChzaGlmdFRpbWUgPiAwKSB7XG4gICAgICAvLyBzaGlmdCB0aGUgY2FudmFzIG9mIHNoaWZ0VGltZSBpbiBwaXhlbHNcbiAgICAgIGNvbnN0IGZTaGlmdCA9IChzaGlmdFRpbWUgLyBjYW52YXNEdXJhdGlvbikgKiBjYW52YXNXaWR0aCAtIHRoaXMuc2hpZnRFcnJvcjtcbiAgICAgIGNvbnN0IGlTaGlmdCA9IE1hdGguZmxvb3IoZlNoaWZ0ICsgMC41KTtcbiAgICAgIHRoaXMuc2hpZnRFcnJvciA9IGZTaGlmdCAtIGlTaGlmdDtcblxuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBmcmFtZVN0YXJ0VGltZSArIGZyYW1lRHVyYXRpb247XG4gICAgICB0aGlzLnNoaWZ0Q2FudmFzKGlTaGlmdCwgY3VycmVudFRpbWUpO1xuXG4gICAgICAvLyBpZiBzaWJsaW5ncywgc2hhcmUgdGhlIGluZm9ybWF0aW9uXG4gICAgICBpZiAodGhpcy5kaXNwbGF5U3luYylcbiAgICAgICAgdGhpcy5kaXNwbGF5U3luYy5zaGlmdFNpYmxpbmdzKGlTaGlmdCwgY3VycmVudFRpbWUsIHRoaXMpO1xuICAgIH1cblxuICAgIC8vIHdpZHRoIG9mIHRoZSBmcmFtZSBpbiBwaXhlbHNcbiAgICBjb25zdCBmRnJhbWVXaWR0aCA9IChmcmFtZUR1cmF0aW9uIC8gY2FudmFzRHVyYXRpb24pICogY2FudmFzV2lkdGg7XG4gICAgY29uc3QgZnJhbWVXaWR0aCA9IE1hdGguZmxvb3IoZkZyYW1lV2lkdGggKyAwLjUpO1xuXG4gICAgLy8gZGVmaW5lIHBvc2l0aW9uIG9mIHRoZSBoZWFkIGluIHRoZSBjYW52YXNcbiAgICBjb25zdCBjYW52YXNTdGFydFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lIC0gY2FudmFzRHVyYXRpb247XG4gICAgY29uc3Qgc3RhcnRUaW1lUmF0aW8gPSAoZnJhbWVTdGFydFRpbWUgLSBjYW52YXNTdGFydFRpbWUpIC8gY2FudmFzRHVyYXRpb247XG4gICAgY29uc3Qgc3RhcnRUaW1lUG9zaXRpb24gPSBzdGFydFRpbWVSYXRpbyAqIGNhbnZhc1dpZHRoO1xuXG4gICAgLy8gbnVtYmVyIG9mIHBpeGVscyBzaW5jZSBsYXN0IGZyYW1lXG4gICAgbGV0IHBpeGVsc1NpbmNlTGFzdEZyYW1lID0gdGhpcy5sYXN0RnJhbWVXaWR0aDtcblxuICAgIGlmICgoZnJhbWVUeXBlID09PSAnc2NhbGFyJyB8fCBmcmFtZVR5cGUgPT09ICd2ZWN0b3InKSAmJiBwcmV2aW91c0ZyYW1lKSB7XG4gICAgICBjb25zdCBmcmFtZUludGVydmFsID0gZnJhbWUudGltZSAtIHByZXZpb3VzRnJhbWUudGltZTtcbiAgICAgIHBpeGVsc1NpbmNlTGFzdEZyYW1lID0gKGZyYW1lSW50ZXJ2YWwgLyBjYW52YXNEdXJhdGlvbikgKiBjYW52YXNXaWR0aDtcbiAgICB9XG5cbiAgICAvLyBkcmF3IGN1cnJlbnQgZnJhbWVcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUoc3RhcnRUaW1lUG9zaXRpb24sIDApO1xuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lLCBmcmFtZVdpZHRoLCBwaXhlbHNTaW5jZUxhc3RGcmFtZSk7XG4gICAgY3R4LnJlc3RvcmUoKTtcblxuICAgIC8vIHNhdmUgY3VycmVudCBjYW52YXMgc3RhdGUgaW50byBjYWNoZWQgY2FudmFzXG4gICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICAgIHRoaXMuY2FjaGVkQ3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhcywgMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cbiAgICAvLyB1cGRhdGUgbGFzdEZyYW1lRHVyYXRpb24sIGxhc3RGcmFtZVdpZHRoXG4gICAgdGhpcy5sYXN0RnJhbWVEdXJhdGlvbiA9IGZyYW1lRHVyYXRpb247XG4gICAgdGhpcy5sYXN0RnJhbWVXaWR0aCA9IGZyYW1lV2lkdGg7XG4gICAgdGhpcy5wcmV2aW91c0ZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogU2hpZnQgY2FudmFzLCBhbHNvIGNhbGxlZCBmcm9tIGBEaXNwbGF5U3luY2BcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNoaWZ0Q2FudmFzKGlTaGlmdCwgdGltZSkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5jYWNoZWRDYW52YXM7XG4gICAgY29uc3QgY2FjaGVkQ3R4ID0gdGhpcy5jYWNoZWRDdHg7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGNvbnN0IGNyb3BwZWRXaWR0aCA9IHdpZHRoIC0gaVNoaWZ0O1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aW1lO1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguZHJhd0ltYWdlKGNhY2hlLCBpU2hpZnQsIDAsIGNyb3BwZWRXaWR0aCwgaGVpZ2h0LCAwLCAwLCBjcm9wcGVkV2lkdGgsIGhlaWdodCk7XG4gICAgLy8gc2F2ZSBjdXJyZW50IGNhbnZhcyBzdGF0ZSBpbnRvIGNhY2hlZCBjYW52YXNcbiAgICBjYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGNhY2hlZEN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLy8gQHRvZG8gLSBGaXggdHJpZ2dlciBtb2RlXG4gIC8vIGFsbG93IHRvIHdpdGNoIGVhc2lseSBiZXR3ZWVuIHRoZSAyIG1vZGVzXG4gIC8vIHNldFRyaWdnZXIoYm9vbCkge1xuICAvLyAgIHRoaXMucGFyYW1zLnRyaWdnZXIgPSBib29sO1xuICAvLyAgIC8vIGNsZWFyIGNhbnZhcyBhbmQgY2FjaGVcbiAgLy8gICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5wYXJhbXMud2lkdGgsIHRoaXMucGFyYW1zLmhlaWdodCk7XG4gIC8vICAgdGhpcy5jYWNoZWRDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucGFyYW1zLndpZHRoLCB0aGlzLnBhcmFtcy5oZWlnaHQpO1xuICAvLyAgIC8vIHJlc2V0IF9jdXJyZW50WFBvc2l0aW9uXG4gIC8vICAgdGhpcy5fY3VycmVudFhQb3NpdGlvbiA9IDA7XG4gIC8vICAgdGhpcy5sYXN0U2hpZnRFcnJvciA9IDA7XG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogQWx0ZXJuYXRpdmUgZHJhd2luZyBtb2RlLlxuICAvLyAgKiBEcmF3IGZyb20gbGVmdCB0byByaWdodCwgZ28gYmFjayB0byBsZWZ0IHdoZW4gPiB3aWR0aFxuICAvLyAgKi9cbiAgLy8gdHJpZ2dlck1vZGVEcmF3KHRpbWUsIGZyYW1lKSB7XG4gIC8vICAgY29uc3Qgd2lkdGggID0gdGhpcy5wYXJhbXMud2lkdGg7XG4gIC8vICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAvLyAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gIC8vICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgLy8gICBjb25zdCBkdCA9IHRpbWUgLSB0aGlzLnByZXZpb3VzVGltZTtcbiAgLy8gICBjb25zdCBmU2hpZnQgPSAoZHQgLyBkdXJhdGlvbikgKiB3aWR0aCAtIHRoaXMubGFzdFNoaWZ0RXJyb3I7IC8vIHB4XG4gIC8vICAgY29uc3QgaVNoaWZ0ID0gTWF0aC5yb3VuZChmU2hpZnQpO1xuICAvLyAgIHRoaXMubGFzdFNoaWZ0RXJyb3IgPSBpU2hpZnQgLSBmU2hpZnQ7XG5cbiAgLy8gICB0aGlzLmN1cnJlbnRYUG9zaXRpb24gKz0gaVNoaWZ0O1xuXG4gIC8vICAgLy8gZHJhdyB0aGUgcmlnaHQgcGFydFxuICAvLyAgIGN0eC5zYXZlKCk7XG4gIC8vICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAvLyAgIGN0eC5jbGVhclJlY3QoLWlTaGlmdCwgMCwgaVNoaWZ0LCBoZWlnaHQpO1xuICAvLyAgIHRoaXMuZHJhd0N1cnZlKGZyYW1lLCBpU2hpZnQpO1xuICAvLyAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgLy8gICAvLyBnbyBiYWNrIHRvIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMgYW5kIHJlZHJhdyB0aGUgc2FtZSB0aGluZ1xuICAvLyAgIGlmICh0aGlzLmN1cnJlbnRYUG9zaXRpb24gPiB3aWR0aCkge1xuICAvLyAgICAgLy8gZ28gYmFjayB0byBzdGFydFxuICAvLyAgICAgdGhpcy5jdXJyZW50WFBvc2l0aW9uIC09IHdpZHRoO1xuXG4gIC8vICAgICBjdHguc2F2ZSgpO1xuICAvLyAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYUG9zaXRpb24sIDApO1xuICAvLyAgICAgY3R4LmNsZWFyUmVjdCgtaVNoaWZ0LCAwLCBpU2hpZnQsIGhlaWdodCk7XG4gIC8vICAgICB0aGlzLmRyYXdDdXJ2ZShmcmFtZSwgdGhpcy5wcmV2aW91c0ZyYW1lLCBpU2hpZnQpO1xuICAvLyAgICAgY3R4LnJlc3RvcmUoKTtcbiAgLy8gICB9XG4gIC8vIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlRGlzcGxheTtcbiJdfQ==