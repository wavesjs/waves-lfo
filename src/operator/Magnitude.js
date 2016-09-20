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
 * Compute the magnitude of a vector.
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.normalize=true] - Normalize output accroding to
 *  the vector size.
 * @param {Boolean} [options.power=false] - If true, returns the squared
 *  magnitude (power).
 *
 * @todo - Define if output should be a `vector` or a `scalar`
 *
 * @memberof module:operator
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
 * eventIn.processFrame(null, [1, 1]);
 * > [1]
 * eventIn.processFrame(null, [2, 2]);
 * > [2]
 * eventIn.processFrame(null, [3, 3]);
 * > [3]
 * eventIn.processFrame(null, [4, 4]);
 * > [2, 2]
 * eventIn.processFrame(null, [5, 5]);
 * > [3, 3]
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
  processStreamParams(prevStreamParams = {}) {
    this.prepareStreamParams(prevStreamParams);
    this.streamParams.frameSize = 1;
    this.streamParams.frameType = 'scalar';
    this.streamParams.description = ['magnitude'];
    this.propagateStreamParams();
  }

  /** @private */
  processVector(frame) {
    this.frame.data[0] = this.inputVector(frame.data);
  }

  /**
   * @todo
   */
  inputVector(vector) {
    const length = vector.length;
    let sum = 0;

    for (let i = 0; i < length; i++)
      sum += (vector[i] * vector[i]);

    let mag = sum;

    if (this._normalize)
      mag /= length;

    if (!this._power)
      mag = sqrt(mag);

    return mag;
  }
}

export default Magnitude;
