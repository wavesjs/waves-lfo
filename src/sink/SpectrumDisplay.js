import BaseDisplay from './BaseDisplay';
import FFT from '../operator/FFT';
import { getColors } from '../utils/display-utils';


const definitions = {
  scale: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' },
  },
  color: {
    type: 'string',
    default: getColors('spectrum'),
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  min: {
    type: 'float',
    default: -80,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 6,
    metas: { kind: 'dynamic' },
  }
};


/**
 * Display the spectrum of the incomming input of type `signal`.
 *
 * @memberof module:sink
 *
 * @param {Number} [options.scale=1] - Scale display of the spectrogram.
 * @param {String} [options.color=null] - Color of the spectrogram.
 * @param {Number} [options.min=-80] - Minimum displayed value (in dB).
 * @param {Number} [options.max=6] - Maximum displayed value (in dB).
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 *
 * @todo - expose more `fft` config options
 * @todo - add a slicer ?
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
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
 *     audioContext: audioContext,
 *     sourceNode: source,
 *   });
 *
 *   const spectrum = new lfo.sink.SpectrumDisplay({
 *     canvas: '#spectrum',
 *   });
 *
 *   audioInNode.connect(spectrum);
 *   audioInNode.start();
 * }
 */
class SpectrumDisplay extends BaseDisplay {
  constructor(options = {}) {
    super(definitions, options, false);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.fft = new FFT({
      size: this.streamParams.frameSize,
      window: 'hann',
      norm: 'linear',
    });

    this.fft.processStreamParams(this.streamParams);
    this.fft.resetStream();

    this.propagateStreamParams();
  }

  /** @private */
  processSignal(frame) {
    const bins = this.fft.inputSignal(frame.data);
    const nbrBins = bins.length;

    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const scale = this.params.get('scale');

    const binWidth = width / nbrBins;
    const ctx = this.ctx;

    ctx.fillStyle = this.params.get('color');

    // error handling needs review...
    let error = 0;

    for (let i = 0; i < nbrBins; i++) {
      const x1Float = i * binWidth + error;
      const x1Int = Math.round(x1Float);
      const x2Float = x1Float + (binWidth - error);
      const x2Int = Math.round(x2Float);

      error = x2Int - x2Float;

      if (x1Int !== x2Int) {
        const width = x2Int - x1Int;
        const db = 20 * Math.log10(bins[i]);
        const y = this.getYPosition(db * scale);
        ctx.fillRect(x1Int, y, width, height - y);
      } else {
        error -= binWidth;
      }
    }
  }
}

export default SpectrumDisplay;
