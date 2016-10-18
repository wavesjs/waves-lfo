import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;

const definitions = {
  normalize: {
    type: 'boolean',
    default: true,
    metas: { kind: 'dynamic' },
  },
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' },
  }
}

/**
 * Compute the magnitude of a `vector` input.
 *
 * _support `standalone` usage_
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.normalize=true] - Normalize output according to
 *  the vector size.
 * @param {Boolean} [options.power=false] - If true, returns the squared
 *  magnitude (power).
 *
 * @memberof module:operator
 *
 * @example
 * import * as lfo from 'waves-lfo';
 *
 * const eventIn = new lfo.source.EventIn({ frameSize: 2, frameType: 'vector' });
 * const magnitude = new lfo.operator.Magnitude();
 * const logger = new lfo.sink.Logger({ outFrame: true });
 *
 * eventIn.connect(magnitude);
 * magnitude.connect(logger);
 * eventIn.start();
 *
 * eventIn.process(null, [1, 1]);
 * > [1]
 * eventIn.process(null, [2, 2]);
 * > [2.82842712475]
 * eventIn.process(null, [3, 3]);
 * > [4.24264068712]
 */
class Magnitude extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);
    this.params.addListener(this.onParamUpdate.bind(this));

    this._normalize = this.params.get('normalize');
    this._power = this.params.get('power');
  }

  /** @private */
  onParamUpdate(name, value, metas) {
    super.onParamUpdate(name, value, metas);

    switch (name) {
      case 'normalize':
        this._normalize = value;
        break;
      case 'power':
        this._power = value;
        break;
    }
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.streamParams.frameSize = 1;
    this.streamParams.frameType = 'scalar';
    this.streamParams.description = ['magnitude'];
    this.propagateStreamParams();
  }

  /**
   * Allows for the use of a `Magnitude` outside a graph (e.g. inside another
   * node), in this case `processStreamParams` and `resetStream` sould be
   * called manually on the node.
   *
   * @param {Array|Float32Array} values - Values to process.
   * @return {Number} - Magnitude value.
   *
   * @example
   * import * as lfo from 'waves-lfo';
   *
   * const magnitude = new lfo.operator.Magnitude({ power: true });
   * magnitude.initStream({ frameType: 'vector', frameSize: 3 });
   * magnitude.inputVector([3, 3]);
   * > 4.24264068712
   */
  inputVector(values) {
    const length = values.length;
    let sum = 0;

    for (let i = 0; i < length; i++)
      sum += (values[i] * values[i]);

    let mag = sum;

    if (this._normalize)
      mag /= length;

    if (!this._power)
      mag = sqrt(mag);

    return mag;
  }

  /** @private */
  processVector(frame) {
    this.frame.data[0] = this.inputVector(frame.data);
  }
}

export default Magnitude;
