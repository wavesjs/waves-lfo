import BaseDisplay from './BaseDisplay';
import { getColors, getHue, hexToRGB } from '../utils/display-utils';


const definitions = {
  color: {
    type: 'string',
    default: getColors('trace'),
    metas: { kind: 'dynamic' },
  },
  colorScheme: {
    type: 'enum',
    default: 'none',
    list: ['none', 'hue', 'opacity'],
  },
};

/**
 * Display a range value around a mean value (for example mean
 * and standart deviation).
 *
 * This sink can handle input of type `vector` of frameSize >= 2.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.color='orange'] - Color.
 * @param {String} [options.colorScheme='none'] - If a third value is available
 *  in the input, can be used to control the opacity or the hue. If input frame
 *  size is 2, this param is automatically set to `none`
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
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const AudioContext = (window.AudioContext || window.webkitAudioContext);
 * const audioContext = new AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const source = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     sourceNode: source,
 *     audioContext: audioContext,
 *   });
 *
 *   // not sure it make sens but...
 *   const meanStddev = new lfo.operator.MeanStddev();
 *
 *   const traceDisplay = new lfo.sink.TraceDisplay({
 *     canvas: '#trace',
 *   });
 *
 *   const logger = new lfo.sink.Logger({ data: true });
 *
 *   audioInNode.connect(meanStddev);
 *   meanStddev.connect(traceDisplay);
 *
 *   audioInNode.start();
 * }
 */
class TraceDisplay extends BaseDisplay {
  constructor(options = {}) {
    super(definitions, options);

    this.prevFrame = null;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    if (this.streamParams.frameSize === 2)
      this.params.set('colorScheme', 'none');

    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame, frameWidth, pixelsSinceLastFrame) {
    const colorScheme = this.params.get('colorScheme');
    const ctx = this.ctx;
    const prevData = this.prevFrame ? this.prevFrame.data : null;
    const data = frame.data;

    const halfRange = data[1] / 2;
    const mean = this.getYPosition(data[0]);
    const min = this.getYPosition(data[0] - halfRange);
    const max = this.getYPosition(data[0] + halfRange);

    let prevHalfRange;
    let prevMean;
    let prevMin;
    let prevMax;

    if (prevData !== null) {
      prevHalfRange = prevData[1] / 2;
      prevMean = this.getYPosition(prevData[0]);
      prevMin = this.getYPosition(prevData[0] - prevHalfRange);
      prevMax = this.getYPosition(prevData[0] + prevHalfRange);
    }

    const color = this.params.get('color');
    let gradient;
    let rgb;

    switch (colorScheme) {
      case 'none':
        rgb = hexToRGB(color);
        ctx.fillStyle = `rgba(${rgb.join(',')}, 0.7)`;
        ctx.strokeStyle = color;
      break;
      case 'hue':
        gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

        if (prevData)
          gradient.addColorStop(0, `hsl(${getHue(prevData[2])}, 100%, 50%)`);
        else
          gradient.addColorStop(0, `hsl(${getHue(data[2])}, 100%, 50%)`);

        gradient.addColorStop(1, `hsl(${getHue(data[2])}, 100%, 50%)`);
        ctx.fillStyle = gradient;
      break;
      case 'opacity':
        rgb = hexToRGB(this.params.get('color'));
        gradient = ctx.createLinearGradient(-pixelsSinceLastFrame, 0, 0, 0);

        if (prevData)
          gradient.addColorStop(0, `rgba(${rgb.join(',')}, ${prevData[2]})`);
        else
          gradient.addColorStop(0, `rgba(${rgb.join(',')}, ${data[2]})`);

        gradient.addColorStop(1, `rgba(${rgb.join(',')}, ${data[2]})`);
        ctx.fillStyle = gradient;
      break;
    }

    ctx.save();
    // draw range
    ctx.beginPath();
    ctx.moveTo(0, mean);
    ctx.lineTo(0, max);

    if (prevData !== null) {
      ctx.lineTo(-pixelsSinceLastFrame, prevMax);
      ctx.lineTo(-pixelsSinceLastFrame, prevMin);
    }

    ctx.lineTo(0, min);
    ctx.closePath();

    ctx.fill();

    // draw mean
    if (colorScheme === 'none' && prevMean) {
      ctx.beginPath();
      ctx.moveTo(-pixelsSinceLastFrame, prevMean);
      ctx.lineTo(0, mean);
      ctx.closePath();
      ctx.stroke();
    }


    ctx.restore();

    this.prevFrame = frame;
  }
};

export default TraceDisplay;
