import BaseLfo from '../../core/BaseLfo';

const definitions = {
  // float or array
  factor: {
    type: 'any',
    default: 1,
  }
};

/**
 * Multiply a given signal or vector by a given factor. On vector
 * streams, `factor` can be an array of values to apply on each dimension of the
 * vector frames.
 *
 * _support `standalone` usage_
 *
 * @param {Object} options - override default values
 * @param {Number|Array} [options.factor=1] - factor or array of factor to
 *  apply on the incomming frame. Setting an array is only defined in case of
 *  a vector stream.
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/common';
 *
 * const eventIn = new lfo.operator.EventIn({
 *   type: 'vector',
 *   frameSize: 2,
 *   frameRate: 0,
 * });
 * const scaler = new lfo.operator.Multiplier({ factor: 0.1 });
 *
 * eventIn.connect(scaler);
 *
 * eventIn.process(null, [2, 3]);
 * > [0.2, 0.3]
 */
class Multiplier extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  /**
   * Use the `Multiplier` operator in standalone mode.
   *
   * @param {Float32Array|Array} data - Input vector
   * @return {Array} - Scaled values
   *
   * @example
   * const scaler = new Multiplier({ factor: [2, 4] });
   * scaler.initStream({ frameType: 'vector', frameSize: 2 });
   *
   * scaler.inputVector([3, 2]);
   * > [6, 8]
   */
  inputVector(data) {
    const output = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');

    if (Array.isArray(factor)) {
      for (let i = 0; i < frameSize; i++)
        output[i] = data[i] * factor[i];
    } else {
      for (let i = 0; i < frameSize; i++)
        output[i] = data[i] * factor;
    }

    return output;
  }

  /** @private */
  processVector(frame) {
    this.frame.data = this.inputVector(frame.data);
  }

  /**
   * Use the `Multiplier` operator in standalone mode.
   *
   * @param {Float32Array|Array} data - Input signal.
   * @return {Array} - Scaled signal.
   *
   * @example
   * const scaler = new Multiplier({ factor: 0.1 });
   * scaler.initStream({ frameType: 'signal', frameSize: 2 });
   *
   * scaler.inputVector([1, 2]);
   * > [0.1, 0.2]
   */
  inputSignal(data) {
    const output = this.frame.data;
    const frameSize = this.streamParams.frameSize;
    const factor = this.params.get('factor');

    for (let i = 0; i < frameSize; i++)
      output[i] = data[i] * factor;

    return output;
  }

  /** @private */
  processSignal(frame) {
    this.frame.data = this.inputSignal(frame.data);
  }
}

export default Multiplier;
