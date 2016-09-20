import BaseLfo from '../Core/BaseLfo';
import parameters from 'parameters';

const sqrt = Math.sqrt;

/**
 * Compute the Root Mean Sqaure of a signal.
 *
 */
class RMS extends BaseLfo {
  processStreamParams(prevStreamParams = {}) {
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
