import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;

/**
 * Compute mean and standard deviation of a given signal.
 *
 * @memberof module:operator
 *
 * @example
 * // todo
 */
class MeanStddev extends BaseLfo {
  constructor(options) {
    super();
    // this.params = parameters(definitions, options);
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['mean', 'stddev'];

    this.propagateStreamParams();
  }

  inputSignal(values) {
    const outData = this.frame.data;
    const length = values.length;

    let mean = 0;
    let m2 = 0;

    // compute mean and variance with Welford algorithm
    // https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
    for (let i = 0; i < length; i++) {
      const x = values[i];
      const delta = x - mean;
      mean += delta / (i + 1);
      m2 += delta * (x - mean);
    }

    const variance = m2 / (length - 1);
    const stddev = sqrt(variance);

    outData[0] = mean;
    outData[1] = stddev;

    return outData;
  }

  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default MeanStddev;
