import BaseLfo from '../../core/BaseLfo';

const commonDefinitions = {
  min: {
    type: 'float',
    default: -1,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' },
  },
  width: {
    type: 'integer',
    default: 300,
    metas: { kind: 'dynamic' },
  },
  height: {
    type: 'integer',
    default: 150,
    metas: { kind: 'dynamic' },
  },
  container: {
    type: 'any',
    default: null,
    constant: true,
  },
  canvas: {
    type: 'any',
    default: null,
    constant: true,
  },
};

const hasDurationDefinitions = {
  duration: {
    type: 'float',
    min: 0,
    max: +Infinity,
    default: 1,
    metas: { kind: 'dynamic' },
  },
  referenceTime: {
    type: 'float',
    default: 0,
    constant: true,
  },
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
class BaseDisplay extends BaseLfo {
  constructor(defs, options = {}, hasDuration = true) {
    let commonDefs;

    if (hasDuration)
      commonDefs = Object.assign({}, commonDefinitions, hasDurationDefinitions);
    else
      commonDefs = commonDefinitions

    const definitions = Object.assign({}, commonDefs, defs);

    super(definitions, options);

    if (this.params.get('canvas') === null && this.params.get('container') === null)
      throw new Error('Invalid parameter: `canvas` or `container` not defined');

    const canvasParam = this.params.get('canvas');
    const containerParam = this.params.get('container');

    // prepare canvas
    if (canvasParam) {
      if (typeof canvasParam === 'string')
        this.canvas = document.querySelector(canvasParam);
      else
        this.canvas = canvasParam;
    } else if (containerParam) {
      let container;

      if (typeof containerParam === 'string')
        container = document.querySelector(containerParam);
      else
        container = containerParam;

      this.canvas = document.createElement('canvas');
      container.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.cachedCanvas = document.createElement('canvas');
    this.cachedCtx = this.cachedCanvas.getContext('2d');

    this.hasDuration = hasDuration;
    this.previousFrame = null;
    this.currentTime = hasDuration ? this.params.get('referenceTime') : null;

    /**
     * Instance of the `DisplaySync` used to synchronize the different displays
     * @private
     */
    this.displaySync = false;

    this._stack = [];
    this._rafId = null;

    this.renderStack = this.renderStack.bind(this);
    this.shiftError = 0;

    // initialize canvas size and y scale transfert function
    this._resize();
  }

  /** @private */
  _resize() {
    const width = this.params.get('width');
    const height = this.params.get('height');

    const ctx = this.ctx;
    const cachedCtx = this.cachedCtx;

    const dPR = window.devicePixelRatio || 1;
    const bPR = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;

    this.pixelRatio = dPR / bPR;

    const lastWidth = this.canvasWidth;
    const lastHeight = this.canvasHeight;
    this.canvasWidth = width * this.pixelRatio;
    this.canvasHeight = height * this.pixelRatio;

    cachedCtx.canvas.width = this.canvasWidth;
    cachedCtx.canvas.height = this.canvasHeight;

    // copy current image from ctx (resize)
    if (lastWidth && lastHeight) {
      cachedCtx.drawImage(ctx.canvas,
        0, 0, lastWidth, lastHeight,
        0, 0, this.canvasWidth, this.canvasHeight
      );
    }

    ctx.canvas.width = this.canvasWidth;
    ctx.canvas.height = this.canvasHeight;
    ctx.canvas.style.width = `${width}px`;
    ctx.canvas.style.height = `${height}px`;

    // update scale
    this._setYScale();
  }

  /**
   * Create the transfert function used to map values to pixel in the y axis
   * @private
   */
  _setYScale() {
    const min = this.params.get('min');
    const max = this.params.get('max');
    const height = this.canvasHeight;

    const a = (0 - height) / (max - min);
    const b = height - (a * min);

    this.getYPosition = (x) => a * x + b;
  }

  /**
   * Returns the width in pixel a `vector` frame needs to be drawn.
   * @private
   */
  getMinimumFrameWidth() {
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
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

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
  propagateStreamParams() {
    super.propagateStreamParams();
  }

  /** @private */
  resetStream() {
    super.resetStream();

    const width = this.canvasWidth;
    const height = this.canvasHeight;

    this.previousFrame = null;
    this.currentTime = this.hasDuration ? this.params.get('referenceTime') : null;

    this.ctx.clearRect(0, 0, width, height);
    this.cachedCtx.clearRect(0, 0, width, height);
  }

  /** @private */
  finalizeStream(endTime) {
    this.currentTime = null;
    super.finalizeStream(endTime);

    this._rafId = null;

    // clear the stack if not empty
    if (this._stack.length > 0)
      this.renderStack();
  }

  /**
   * Add the current frame to the frames to draw. Should not be overriden.
   * @private
   */
  processFrame(frame) {
    const frameSize = this.streamParams.frameSize;
    const copy = new Float32Array(frameSize);
    const data = frame.data;

    // copy values of the input frame as they might be updated
    // in reference before being consumed in the draw function
    for (let i = 0; i < frameSize; i++)
      copy[i] = data[i];

    this._stack.push({
      time: frame.time,
      data: copy,
      metadata: frame.metadata,
    });

    if (this._rafId === null)
      this._rafId = window.requestAnimationFrame(this.renderStack);
  }

  /**
   * Render the accumulated frames. Method called in `requestAnimationFrame`.
   * @private
   */
  renderStack() {
    if (this.params.has('duration')) {
      // render all frame since last `renderStack` call
      for (let i = 0, l = this._stack.length; i < l; i++)
        this.scrollModeDraw(this._stack[i]);
    } else {
      // only render last received frame if any
      if (this._stack.length > 0) {
        const frame = this._stack[this._stack.length - 1];
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.processFunction(frame);
      }
    }

    this._stack.length = 0; // reinit stack for next call
    this._rafId = null;
  }

  /**
   * Draw data from right to left with scrolling
   * @private
   * @todo - check possibility of maintaining all values from one place to
   *         minimize float error tracking.
   */
  scrollModeDraw(frame) {
    const frameType = this.streamParams.frameType;
    const frameRate = this.streamParams.frameRate;
    const frameSize = this.streamParams.frameSize;
    const sourceSampleRate = this.streamParams.sourceSampleRate;

    const canvasDuration = this.params.get('duration');
    const ctx = this.ctx;
    const canvasWidth = this.canvasWidth;
    const canvasHeight = this.canvasHeight;

    const previousFrame = this.previousFrame;

    // current time at the left of the canvas
    const currentTime = (this.currentTime !== null) ? this.currentTime : frame.time;
    const frameStartTime = frame.time;
    const lastFrameTime = previousFrame ? previousFrame.time : 0;
    const lastFrameDuration = this.lastFrameDuration ? this.lastFrameDuration : 0;

    let frameDuration;

    if (frameType === 'scalar' || frameType === 'vector') {
      const pixelDuration = canvasDuration / canvasWidth;
      frameDuration = this.getMinimumFrameWidth() * pixelDuration;
    } else if (this.streamParams.frameType === 'signal') {
      frameDuration = frameSize / sourceSampleRate;
    }

    const frameEndTime = frameStartTime + frameDuration;
    // define if we need to shift the canvas
    const shiftTime = frameEndTime - currentTime;

    // if the canvas is not synced, should never go to `else`
    if (shiftTime > 0) {
      // shift the canvas of shiftTime in pixels
      const fShift = (shiftTime / canvasDuration) * canvasWidth - this.shiftError;
      const iShift = Math.floor(fShift + 0.5);
      this.shiftError = fShift - iShift;

      const currentTime = frameStartTime + frameDuration;
      this.shiftCanvas(iShift, currentTime);

      // if siblings, share the information
      if (this.displaySync)
        this.displaySync.shiftSiblings(iShift, currentTime, this);
    }

    // width of the frame in pixels
    const floatFrameWidth = (frameDuration / canvasDuration) * canvasWidth;
    const frameWidth = Math.floor(floatFrameWidth + 0.5);

    // define position of the head in the canvas
    const canvasStartTime = this.currentTime - canvasDuration;
    const startTimeRatio = (frameStartTime - canvasStartTime) / canvasDuration;
    const startTimePosition = startTimeRatio * canvasWidth;

    // number of pixels since last frame
    let pixelsSinceLastFrame = this.lastFrameWidth;

    if ((frameType === 'scalar' || frameType === 'vector') && previousFrame) {
      const frameInterval = frame.time - previousFrame.time;
      pixelsSinceLastFrame = (frameInterval / canvasDuration) * canvasWidth;
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
  shiftCanvas(iShift, time) {
    const ctx = this.ctx;
    const cache = this.cachedCanvas;
    const cachedCtx = this.cachedCtx;
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const croppedWidth = width - iShift;
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

}

export default BaseDisplay;
