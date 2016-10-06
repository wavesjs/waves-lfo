import BaseLfo from '../core/BaseLfo';

/**
 * Find the minimun and maximum values of a given signal at each frame.
 *
 * @memberof module:operator
 *
 * @example
 *  const eventIn = new EventIn({
 *   frameSize: 512,
 *   frameType: 'signal',
 *   sampleRate: 0,
 * });
 *
 * const minMax = new MinMax();
 *
 * eventIn.connect(minMax);
 * eventIn.start()
 *
 * // create a signal frame
 * const signal = new Float32Array(512);
 * for (let i = 0; i < 512; i++)
 *   signal[i] = i + 1;
 *
 * eventIn.process(null, signal);
 * > [1, 512];
 */
class MinMax extends BaseLfo {
  /** @private */
  processStreamParams(prevStreamParams= {}) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['min', 'max'];

    this.propagateStreamParams();
  }

  /**
   * Allows for the use of a `minMax` outside a graph (e.g. inside
   * another node), in this case `processStreamParams` and `resetStream`
   * should be called manually on the node.
   *
   * @param {Float32Array|Array} data - Signal to feed the operator with.
   * @return {Array} - Array containing the min and max values.
   *
   * @example
   * const minMax = new MinMax();
   * // the input frame size must be defined manually as it is not
   * // forwarded by a parent node
   * minMax.processStreamParams({ frameSize: 10 });
   * minMax.resetStream();
   *
   * minMax.inputSignal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * > [0, 5]
   *
   * @see {@link module:core.BaseLfo#processStreamParams}
   * @see {@link module:core.BaseLfo#resetStream}
   */
  inputSignal(data) {
    const outData = this.frame.data;
    let min = +Infinity;
    let max = -Infinity;

    for (let i = 0, l = data.length; i < l; i++) {
      const value = data[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    outData[0] = min;
    outData[1] = max;

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default MinMax;
