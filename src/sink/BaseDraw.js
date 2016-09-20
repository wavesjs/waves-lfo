import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';


const commonDefinitions = {
  duration: {
    type: 'float',
    min: 0,
    max: +Infinity,
    default: 1,
    metas: { kind: 'dynamic' },
  },
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
}

/**
 * Base class to extend in order to create graphical sinks.
 *
 * @memberof module:sink
 * @param {Object} options - Override default parameters.
 * @param {Number} options.duration - Duration (in seconds) represented in
 *  the canvas. _dynamic parameter_
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
 */
class BaseDraw extends BaseLfo {
  constructor(defs, options) {
    super();

    const definitions = Object.assign({}, commonDefinitions, defs);
    this.params = parameters(definitions, options);
    this.params.addListener(this.onParamUpdate.bind(this));

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

    this.previousFrame = {};
    this.lastShiftError = 0;
    this.currentPartialShift = 0;

    //
    this._stack;
    this._rafId;

    this.renderStack = this.renderStack.bind(this);

    this._resize();
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

  /** @private */
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

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this._stack = [];
    this._rafId = requestAnimationFrame(this.renderStack);
  }

  resetStream() {
    super.resetStream();

    const width = this.canvasWidth;
    const height = this.canvasHeight;

    this.ctx.clearRect(0, 0, width, height);
    this.cachedCtx.clearRect(0, 0, width, height);
  }

  finalizeStream(endTime) {
    super.finalizeStream(endTime);
    cancelAnimationFrame(this._rafId);
  }

  /**
   * Add the current frame to the frames to draw. Should not be overriden.
   * @inheritdoc
   * @final
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
  }

  renderStack() {
    for (let i = 0, l = this._stack.length; i < l; i++)
      this.executeDraw(this._stack[i]);

    // reinit stack for next call
    this._stack.length = 0;
    this._rafId = requestAnimationFrame(this.renderStack);
  }

  executeDraw(frame) {
    this.scrollModeDraw(frame);
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

  // executeDraw(frame) {
  //   // if (this.params.trigger)
  //   //   this.triggerModeDraw(time, frame);
  //   // else
  //   this.scrollModeDraw(frame);
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

  // default draw mode
  scrollModeDraw(frame) {
    const time = frame.time;
    const prevTime = this.previousFrame.time;
    const ctx = this.ctx;
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const duration = this.params.get('duration');
    let iShift = 0;

    if (prevTime !== undefined) {
      const dt = time - prevTime;
      const fShift = (dt / duration) * width - this.lastShiftError;
      iShift = Math.round(fShift);
      this.lastShiftError = iShift - fShift;

      const partialShift = iShift - this.currentPartialShift;
      this.shiftCanvas(partialShift);

      // shift all siblings if synchronized
      if (this.params.isSynchronized && this.synchronizer)
        this.synchronizer.shiftSiblings(partialShift, this);
    } else {
      iShift = 0;
    }

    // translate to the current frame and draw a new polygon
    ctx.save();
    ctx.translate(width, 0);

    this.processFunction(frame, this.previousFrame, iShift);

    ctx.restore();
    // keep track of the error
    this.currentPartialShift -= iShift;
    // save current state into buffering canvas
    this.cachedCtx.clearRect(0, 0, width, height);
    this.cachedCtx.drawImage(this.canvas, 0, 0, width, height);

    this.previousFrame = frame;
  }

  shiftCanvas(shift) {
    const ctx = this.ctx;
    const width = this.canvasWidth;
    const height = this.canvasHeight;

    this.currentPartialShift += shift;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    const croppedWidth = width - this.currentPartialShift;

    ctx.drawImage(this.cachedCanvas,
      this.currentPartialShift, 0, croppedWidth, height,
      0, 0, croppedWidth, height
    );

    ctx.restore();
  }

  /**
   * Interface method to implement in order to define how to draw the shape
   * between the previous and the current frame, assuming the canvas context
   * is centered on the current frame.
   * @param {Object} frame - Current frame.
   * @param {Object} prevFrame - Previous frame.
   * @param {Number} iShift - Number of pixels between the last and the current
   *  frame.
   */
  // processFunction(frame, prevFrame, iShift) {
  //   console.error('must be implemented');
  // }
}

export default BaseDraw;
