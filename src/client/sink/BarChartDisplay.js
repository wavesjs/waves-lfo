import BaseDisplay from './BaseDisplay';
import Fft from '../../common/operator/Fft';
import { getColors } from '../utils/display-utils';


const definitions = {
  scale: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' },
  },
  colors: {
    type: 'any',
    default: getColors('bar-chart'),
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  min: {
    type: 'float',
    default: 0,
    metas: { kind: 'dynamic' },
  },
  max: {
    type: 'float',
    default: 1,
    metas: { kind: 'dynamic' },
  }
};


/**
 * Display a bar chart from an incomming `vector` input.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.colors=null] - Colors of the bars.
 * @param {Number} [options.min=-80] - Minimum displayed value.
 * @param {Number} [options.max=6] - Maximum displayed value.
 * @param {Number} [options.width=300] - Width of the canvas.
 *  _dynamic parameter_
 * @param {Number} [options.height=150] - Height of the canvas.
 *  _dynamic parameter_
 * @param {Element|CSSSelector} [options.container=null] - Container element
 *  in which to insert the canvas. _constant parameter_
 * @param {Element|CSSSelector} [options.canvas=null] - Canvas element
 *  in which to draw. _constant parameter_
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 * import * as lfo from 'waves-lfo/client';
 *
 * const frameSize = 5;
 * const dt = 0.02;
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameSize: frameSize,
 *   frameRate: 1 / dt,
 *   frameType: 'vector',
 * });
 *
 * const barChart = new lfo.sink.BarChartDisplay({
 *   canvas: '#bar-chart',
 * });
 *
 * eventIn.connect(barChart);
 * eventIn.start();
 *
 * const data = [0, 0.2, 0.4, 0.6, 0.8];
 *
 * (function generateData() {
 *   for (let i = 0; i < frameSize; i++)
 *     data[i] = (data[i] + 0.001) % 1;
 *
 *   eventIn.process(null, data);
 *
 *   setTimeout(generateData, dt * 1000);
 * }());
 */
class BarChartDisplay extends BaseDisplay {
  constructor(options = {}) {
    super(definitions, options, false);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame) {
    const frameSize = this.streamParams.frameSize;
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    const colors = this.params.get('colors');
    const data = frame.data;

    const barWidth = width / frameSize;
    const ctx = this.ctx;

    // error handling needs review...
    let error = 0;

    for (let i = 0; i < frameSize; i++) {
      const x1Float = i * barWidth + error;
      const x1Int = Math.round(x1Float);
      const x2Float = x1Float + (barWidth - error);
      const x2Int = Math.round(x2Float);

      error = x2Int - x2Float;

      if (x1Int !== x2Int) {
        const width = x2Int - x1Int;
        const y = this.getYPosition(data[i]);

        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(x1Int, y, width, height - y);
      } else {
        error -= barWidth;
      }
    }
  }
}

export default BarChartDisplay;
