import BaseLfo from '../../core/BaseLfo';

const definitions = {
  exponent: {
    type: 'float',
    default: 1,
  },
};

/**
 * Apply an exponant power to the stream.
 *
 * @param {Object} options - Override default parameters
 * @param {Number} exponent - Exponent
 */
class Power extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  inputVector(data) {
    const outData = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const exponent = this.params.get('exponent');

    for (let i = 0; i < frameSize; i++)
      outData[i] = Math.pow(data[i], exponent);

    return outData;
  }

  /** @private */
  processVector(frame) {
    this.inputVector(frame.data);
  }

  inputSignal(data) {
    const outData = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const exponent = this.params.get('exponent');

    for (let i = 0; i < frameSize; i++)
      outData[i] = Math.pow(data[i], exponent);

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default Power;
