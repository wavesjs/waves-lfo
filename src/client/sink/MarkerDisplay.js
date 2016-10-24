import BaseDisplay from './BaseDisplay';
import { getColors } from '../../common/utils/display-utils';

const definitions = {
  threshold: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' },
  },
  thresholdIndex: {
    type: 'integer',
    default: 0,
    metas: { kind: 'dynamic' },
  },
  color: {
    type: 'string',
    default: getColors('marker'),
    nullable: true,
    metas: { kind: 'dynamic' },
  }
};

/**
 * Display a marker according to the input frame.
 * This sink can handle input of type `vector`.
 *
 * @memberof module:client.sink
 *
 * @param {Object} options - Override default parameters.
 * @param {String} options.color - Color of the marker.
 * @param {Number} [options.thresholdIndex=0] - Index of the incomming frame
 *  data to compare against the threshold. _Should be used in conjonction with
 *  `threshold`_.
 * @param {Number} [options.threshold=null] - Minimum value the incomming value
 *  must have to trigger the display of a marker. If null each incomming event
 *  triggers a marker. _Should be used in conjonction with `thresholdIndex`_.
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
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * const eventIn = new lfo.source.EventIn({
 *   frameType: 'scalar',
 * });
 *
 * const marker = new lfo.sink.MarkerDisplay({
 *   canvas: '#marker',
 *   threshold: 0.5,
 * });
 *
 * eventIn.connect(marker);
 * eventIn.start();
 *
 * let time = 0;
 * const period = 1;
 *
 * (function generateData() {
 *   eventIn.process(time, Math.random());
 *
 *   time += period;
 *   setTimeout(generateData, period * 1000);
 * }());
 */
class MarkerDisplay extends BaseDisplay {
  constructor(options = {}) {
    super(definitions, options);
  }

  /** @private */
  processVector(frame, frameWidth, pixelsSinceLastFrame) {
    const color = this.params.get('color');
    const threshold = this.params.get('threshold');
    const thresholdIndex = this.params.get('thresholdIndex');
    const ctx = this.ctx;
    const height = ctx.height;
    const value = frame.data[thresholdIndex];

    if (threshold === null || value >= threshold) {
      let yMin = this.getYPosition(this.params.get('min'));
      let yMax = this.getYPosition(this.params.get('max'));

      if (yMin > yMax) {
        const v = yMax;
        yMax = yMin;
        yMin = v;
      }

      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(0, yMin, 1, yMax);
      ctx.restore();
    }
  }
}

export default MarkerDisplay;
