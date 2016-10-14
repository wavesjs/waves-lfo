import BaseDisplay from './BaseDisplay';
import { getColors } from '../utils/display-utils';

const definitions = {
  radius: {
    type: 'float',
    min: 0,
    default: 0,
    metas: { kind: 'dynamic' }
  },
  line: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' },
  },
  colors: {
    type: 'any',
    default: null,
  }
}


/**
 * Break Point Function, display a stream of type `vector`.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.colors=null] - Array of colors for each index of the
 *  vector. _dynamic parameter_
 * @param {String} [options.radius=0] - Radius of the dot at each value.
 *  _dynamic parameter_
 * @param {String} [options.line=true] - Display a line between each consecutive
 *  values of the vector. _dynamic parameter_
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
 *  the canvas. _dynamic parameter_
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @memberof module:sink
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: 2,
 *   frameRate: 0.1,
 *   frameType: 'vector'
 * });
 *
 * const bpf = new lfo.sink.BpfDisplay({
 *   canvas: '#bpf',
 *   duration: 10,
 * });
 *
 * eventIn.connect(bpf);
 * eventIn.start();
 *
 * let time = 0;
 * const dt = 0.1;
 *
 * (function generateData() {
 *   eventIn.process(time, [Math.random() * 2 - 1, Math.random() * 2 - 1]);
 *   time += dt;
 *
 *   setTimeout(generateData, dt * 1000);
 * }());
 */
class BpfDisplay extends BaseDisplay {
  constructor(options) {
    super(definitions, options);

    this.prevFrame = null;
  }

  /** @private */
  getMinimumFrameWidth() {
    return this.params.get('radius');
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    if (this.params.get('colors') === null)
      this.params.set('colors', getColors('bpf', this.streamParams.frameSize));

    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame, frameWidth, pixelsSinceLastFrame) {
    const colors = this.params.get('colors');
    const radius = this.params.get('radius');
    const drawLine = this.params.get('line');
    const frameSize = this.streamParams.frameSize;
    const ctx = this.ctx;
    const data = frame.data;
    const prevData = this.prevFrame ? this.prevFrame.data : null;

    ctx.save();

    for (let i = 0, l = frameSize; i < l; i++) {
      const posY = this.getYPosition(data[i]);
      const color = colors[i];

      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      if (prevData && drawLine) {
        const lastPosY = this.getYPosition(prevData[i]);
        ctx.beginPath();
        ctx.moveTo(-pixelsSinceLastFrame, lastPosY);
        ctx.lineTo(0, posY);
        ctx.stroke();
        ctx.closePath();
      }

      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(0, posY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

    }

    ctx.restore();

    this.prevFrame = frame;
  }
}

export default BpfDisplay;
