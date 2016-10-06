import BaseLfo from '../Core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;

/**
 * Compute the Root Mean Sqaure of a signal.
 *
 * @memberof module:operator
 */
class RMS extends BaseLfo {
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    this.streamParams.frameSize = 1;
    this.streamParams.frameType = 'scalar';
    this.streamParams.description = ['rms'];
    this.propagateStreamParams();
  }

  /** @private */
  processSignal(frame) {
    this.frame.data[0] = this.inputSignal(frame.data);

  }

  /**
   * Allows for the use of a `RMS` outside a graph (e.g. inside
   * another node). Return the rms of the given signal block.
   *
   * @param {Number} signal - Signal block to be computed.
   * @return {Number} - rms of the input signal block.
   *
   * @todo - example
   */
  inputSignal(signal) {
    const length = signal.length;
    let rms = 0;

    for (let i = 0; i < length; i++)
      rms += (signal[i] * signal[i]);

    rms = rms / length;
    rms = sqrt(rms);

    return rms;
  }
}

export default RMS;
