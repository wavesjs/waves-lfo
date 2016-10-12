import BaseDisplay from './BaseDisplay';
import { getRandomColor } from '../utils/display-utils';

const floor = Math.floor;
const ceil = Math.ceil;

function downSample(data, targetLength) {
  const length = data.length;
  const hop = length / targetLength;
  const target = new Float32Array(targetLength);
  let counter = 0;

  for (let i = 0; i < targetLength; i++) {
    const index = floor(counter);
    const phase = counter - index;
    const prev = data[index];
    const next = data[index + 1];

    target[i] = (next - prev) * phase + prev;
    counter += hop;
  }

  return target;
}

const definitions = {
  color: {
    type: 'string',
    default: null,
    nullable: true,
  },
};


/**
 * Display a stream of type `signal` on a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.duration=1] - Duration (in seconds) represented in
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
 * @param {String} [options.color=null] - Color of the signal. Defaults to
 *  random color. _dynamic parameter_
 *
 * @memberof module:sink
 *
 * @example
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'signal',
 *   sampleRate: 8,
 *   frameSize: 4,
 * });
 *
 * const signal = new lfo.sink.Signal({
 *   color: '#242424',
 *   canvas: '#my-canvas-element',
 *   duration: 1,
 * });
 *
 * eventIn.connect(signal);
 * eventIn.start();
 *
 * // should draw a triangle signal
 * eventIn.process(0, [0, 0.5, 1, 0.5]);
 * eventIn.process(0.5, [0, -0.5, -1, -0.5]);
 */
class SignalDisplay extends BaseDisplay {
  constructor(options) {
    super(definitions, options);

    if (this.params.get('color') === null)
      this.params.set('color', getRandomColor());

    this.lastPosY = null;
  }

  /** @private */
  processSignal(frame, frameWidth, pixelsSinceLastFrame) {
    const color = this.params.get('color');
    const frameSize = this.streamParams.frameSize;
    const ctx = this.ctx;
    let data = frame.data;

    if (frameWidth < frameSize)
      data = downSample(data, frameWidth);

    const length = data.length;
    const hopX = frameWidth / length;
    let posX = 0;
    let lastY = this.lastPosY;

    ctx.strokeStyle = color;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const posY = this.getYPosition(data[i]);

      if (lastY === null) {
        ctx.moveTo(posX, posY);
      } else {
        if (i === 0)
          ctx.moveTo(-hopX, lastY);

        ctx.lineTo(posX, posY);
      }

      posX += hopX;
      lastY = posY;
    }

    ctx.stroke();
    ctx.closePath();

    this.lastPosY = lastY;
  }
}

export default SignalDisplay;
