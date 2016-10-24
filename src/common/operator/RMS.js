import BaseLfo from '../core/BaseLfo';

const sqrt = Math.sqrt;

/**
 * Compute the Root Mean Square of a `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some `AudioBuffer`
 * const audioInBuffer = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 *   frameSize: 512,
 * });
 *
 * const rms = new lfo.operator.RMS();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInBuffer.connect(rms);
 * rms.connect(logger);
 *
 * audioInBuffer.start();
 */
class RMS extends BaseLfo {
  constructor(options = {}) {
    // throw error if trying to set inexistant param
    super({}, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameSize = 1;
    this.streamParams.frameType = 'scalar';
    this.streamParams.description = ['rms'];

    this.propagateStreamParams();
  }

  /**
   * Allows for the use of a `RMS` outside a graph (e.g. inside
   * another node). Return the rms of the given signal block.
   *
   * @param {Number} signal - Signal block to be computed.
   * @return {Number} - rms of the input signal.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const rms = new lfo.operator.RMS();
   * rms.initParam({ frameType: 'signal', frameSize: 256 });
   *
   * rms.inputSignal(signal);
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

  /** @private */
  processSignal(frame) {
    this.frame.data[0] = this.inputSignal(frame.data);
  }
}

export default RMS;
