import BaseDisplay from './BaseDisplay';
import MinMax from '../operator/MinMax';
import RMS from '../operator/RMS';
import { getRandomColor } from '../utils/draw-utils';


const definitions = {
  color: {
    type: 'string',
    default: null,
    nullable: true,
  },
  rms: {
    type: 'boolean',
    default: false,
  }
};

/**
 * Draw a stream of type `signal` on a canvas.
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
 * @param {String} [options.color=null] - Color of the signal. Defaults to
 *  random color. _dynamic parameter_
 *
 * @memberof module:sink
 *
 * @example
 * const eventIn = new lfo.source.AudioInBuffer({
 *   audioBuffer: someAudioBuffer,
 *   sampleSize: 512,
 * });
 *
 * const signal = new lfo.sink.Waveform({
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
class WaveformDisplay extends BaseDisplay {
  constructor(options) {
    super(definitions, options);

    this.minMaxOperator = new MinMax();
    this.rmsOperator = new RMS();
  }

  processStreamParams(prevStreamParams) {
    super.processStreamParams(prevStreamParams);

    this.minMaxOperator.processStreamParams();
    this.minMaxOperator.resetStream();

    this.rmsOperator.processStreamParams();
    this.rmsOperator.resetStream();
  }

  /** @private */
  processSignal(frame, previousFrame, iShift) {
    // keep track of these frames, or ignoring is ok ?
    if (iShift < 1) return;

    const color = this.params.get('color');
    const showRms = this.params.get('rms');
    const ctx = this.ctx;
    const data = frame.data;
    const iSamplesPerPixels = Math.floor(data.length / iShift);

    for (let index = 0; index < iShift; index++) {
      const start = index * iSamplesPerPixels;
      const end = index === iShift - 1 ? undefined : start + iSamplesPerPixels;
      const slice = data.subarray(start, end);
      const x = -iShift + index;
      // signal
      const minMax = this.minMaxOperator.inputSignal(slice);
      const minY = this.getYPosition(minMax[0]);
      const maxY = this.getYPosition(minMax[1]);

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.closePath();
      ctx.stroke();

      // rms
      if (showRms) {
        const rms = this.rmsOperator.inputSignal(slice);
        const rmsMaxY = this.getYPosition(rms[0]);
        const rmsMinY = this.getYPosition(-rms[0]);

        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(x, rmsMinY);
        ctx.lineTo(x, rmsMaxY);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}

export default WaveformDisplay;
