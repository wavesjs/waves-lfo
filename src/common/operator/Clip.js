import BaseLfo from '../../core/BaseLfo';

const definitions = {
  min: {
    type: 'float',
    default: 0,
    min: -Infinity,
    max: +Infinity,
  },
  max: {
    type: 'float',
    default: 1,
    min: -Infinity,
    max: +Infinity,
  },
};

/**
 * Clip incomming according to given `min` and `max` parameters
 *
 * @param {Object} options - Override default paramters
 * @param {Number} [options.min=0] - Minimum value
 * @param {Number} [options.max=1] - Maximum value
 */
class Clip extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  inputVector(data) {
    const min = this.params.get('min');
    const max = this.params.get('max');
    const frameSize = this.streamParams.frameSize;
    const outData = this.frame.data;

    // @todo - could handle vector as min and max
    for (let i = 0; i < frameSize; i++)
      outData[i] = Math.min(max, Math.max(min, data[i]));

    return outData;
  }

  processVector(frame) {
    this.frame.data = this.inputVector(frame.data);
  }

  inputSignal(data) {
    const min = this.params.get('min');
    const max = this.params.get('max');
    const frameSize = this.streamParams.frameSize;
    const outData = this.frame.data;

    for (let i = 0; i < frameSize; i++)
      outData[i] = Math.min(max, Math.max(min, data[i]));

    return outData;
  }

  processSignal(frame) {
    this.frame.data = this.inputSignal(frame.data);
  }
}

export default Clip;
