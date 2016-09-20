import BaseDraw from './BaseDraw';
import { getRandomColor } from '../utils/draw-utils';

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
 * Draw a stream of type `vector` on a canvas.
 *
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
 * @param {String} [options.colors=null] - Array of colors for each index of the
 *  vector. _dynamic parameter_
 * @param {String} [options.radius=0] - Radius of the dot at each value.
 *  _dynamic parameter_
 * @param {String} [options.line=true] - Display a line between each consecutive
 *  values of the vector. _dynamic parameter_
 *
 * @memberof module:sink
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'vector',
 *   sampleRate: 4,
 *   frameSize: 2,
 * });
 *
 * const bpf = new lfo.sink.Bpf({
 *   colors: ['#242424', 'red', 'steelblue'],
 *   canvas: '#my-canvas-element',
 *   duration: 1,
 * });
 *
 * eventIn.connect(bpf);
 * eventIn.start();
 *
 * // generate random data
 * (function generateVector() {
 *   eventIn.process(null, [Math.random(), Math.random()]);
 *   setTimeout(generateVector, 250);
 * }());
 */
class Bpf extends BaseDraw {
  constructor(options) {
    super(definitions, options);
    // for loop mode
    // this._currentXPosition = 0;

    if (this.params.get('colors') === null) {
      const colors = [];

      for (let i = 0, l = this.streamParams.frameSize; i < l; i++)
        colors.push(getRandomColor());

      this.params.set('colors', colors);
    }
  }

  /** @private */
  processVector(frame, prevFrame, iShift) {
    const colors = this.params.get('colors');
    const radius = this.params.get('radius');
    const drawLine = this.params.get('line');
    const frameSize = this.streamParams.frameSize;
    const ctx = this.ctx;

    const data = frame.data;
    const prevData = prevFrame.data;

    for (let i = 0, l = frameSize; i < l; i++) {
      ctx.save();
      // color should bechosen according to index
      ctx.fillStyle = colors[i];
      ctx.strokeStyle = colors[i];

      const posY = this.getYPosition(data[i]);

      if (prevData && drawLine) {
        const lastPosY = this.getYPosition(prevData[i]);
        // draw line
        ctx.beginPath();
        ctx.moveTo(-(iShift + radius), lastPosY);
        ctx.lineTo(-radius, posY);
        ctx.stroke();
        ctx.closePath();
      }

      if (radius > 0) {
        ctx.beginPath();
        ctx.arc(-radius, posY, radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
      }

      ctx.restore();
    }
  }
}

export default Bpf;

