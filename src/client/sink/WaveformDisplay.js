import BaseDisplay from './BaseDisplay';
import MinMax from '../../common/operator/MinMax';
import Rms from '../../common/operator/Rms';
import { getColors } from '../../common/utils/display-utils';


const definitions = {
  colors: {
    type: 'any',
    default: getColors('waveform'),
    metas: { kind: 'dyanmic' },
  },
  rms: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dyanmic' },
  }
};

/**
 * Display a waveform (along with optionnal Rms) of a given `signal` input in
 * a canvas.
 *
 * @param {Object} options - Override default parameters.
 * @param {Array<String>} [options.colors=['waveform', 'rms']] - Array
 *  containing the color codes for the waveform (index 0) and rms (index 1).
 *  _dynamic parameter_
 * @param {Boolean} [options.rms=false] - Set to `true` to display the rms.
 *  _dynamic parameter_
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
 * @param {Number} [options.referenceTime=null] - Optionnal reference time the
 *  display should considerer as the origin. Is only usefull when synchronizing
 *  several display using the `DisplaySync` class.
 *
 * @memberof module:client.sink
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const audioContext = new window.AudioContext();
 *
 * navigator.mediaDevices
 *   .getUserMedia({ audio: true })
 *   .then(init)
 *   .catch((err) => console.error(err.stack));
 *
 * function init(stream) {
 *   const audioIn = audioContext.createMediaStreamSource(stream);
 *
 *   const audioInNode = new lfo.source.AudioInNode({
 *     audioContext: audioContext,
 *     sourceNode: audioIn,
 *     frameSize: 512,
 *   });
 *
 *   const waveformDisplay = new lfo.sink.WaveformDisplay({
 *     canvas: '#waveform',
 *     duration: 3.5,
 *     rms: true,
 *   });
 *
 *   audioInNode.connect(waveformDisplay);
 *   audioInNode.start();
 * });
 */
class WaveformDisplay extends BaseDisplay {
  constructor(options) {
    super(definitions, options, true);

    this.minMaxOperator = new MinMax();
    this.rmsOperator = new Rms();
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.minMaxOperator.initStream(this.streamParams);
    this.rmsOperator.initStream(this.streamParams);

    this.propagateStreamParams();
  }

  /** @private */
  processSignal(frame, frameWidth, pixelsSinceLastFrame) {
    // drop frames that cannot be displayed
    if (frameWidth < 1) return;

    const colors = this.params.get('colors');
    const showRms = this.params.get('rms');
    const ctx = this.ctx;
    const data = frame.data;
    const iSamplesPerPixels = Math.floor(data.length / frameWidth);

    for (let index = 0; index < frameWidth; index++) {
      const start = index * iSamplesPerPixels;
      const end = index === frameWidth - 1 ? undefined : start + iSamplesPerPixels;
      const slice = data.subarray(start, end);

      const minMax = this.minMaxOperator.inputSignal(slice);
      const minY = this.getYPosition(minMax[0]);
      const maxY = this.getYPosition(minMax[1]);

      ctx.strokeStyle = colors[0];
      ctx.beginPath();
      ctx.moveTo(index, minY);
      ctx.lineTo(index, maxY);
      ctx.closePath();
      ctx.stroke();

      if (showRms) {
        const rms = this.rmsOperator.inputSignal(slice);
        const rmsMaxY = this.getYPosition(rms);
        const rmsMinY = this.getYPosition(-rms);

        ctx.strokeStyle = colors[1];
        ctx.beginPath();
        ctx.moveTo(index, rmsMinY);
        ctx.lineTo(index, rmsMaxY);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}

export default WaveformDisplay;
