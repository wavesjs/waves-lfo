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
 */
class Magnitude extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);
    this.params.addListener(this.onParamUpdate.bind(this));

    this._normalize = this.params.get('normalize');
    this._power = this.params.get('power');
  }

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

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.streamParams.frameSize = 1;
    this.propagateStreamParams();
  }

  processVector(frame) {
    const mag = this.inputVector(frame.data);
    this.frame.data[0] = mag;
  }

  inputVector(vector) {
    const vectorLength = vector.length;
    let sum = 0;

    for (let i = 0; i < vectorLength; i++)
      sum += (vector[i] * vector[i]);

    let mag = sum;

    if (this._normalize)
      mag /= vectorLength;

    if (!this._power)
      mag = sqrt(mag);

    return mag;
  }
}

export default Magnitude;
