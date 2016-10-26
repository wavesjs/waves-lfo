import BaseLfo from '../core/BaseLfo';

const sqrt = Math.sqrt;

const definitions = {
  power: {
    type: 'boolean',
    default: false,
    metas: { kind: 'dynamic' },
  },
};

/**
 * Compute the Root Mean Square of a `signal`.
 *
 * _support `standalone` usage_
 *
 * @memberof module:common.operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.power=false] - If `true` remove the "R" of the
 *  "Rms" and return the squared result (i.e. power).
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
 * const rms = new lfo.operator.Rms();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * audioInBuffer.connect(rms);
 * rms.connect(logger);
 *
 * audioInBuffer.start();
 */
class Rms extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);
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
   * Allows for the use of a `Rms` outside a graph (e.g. inside
   * another node). Return the rms of the given signal block.
   *
   * @param {Number} signal - Signal block to be computed.
   * @return {Number} - rms of the input signal.
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const rms = new lfo.operator.Rms();
   * rms.initStream({ frameType: 'signal', frameSize: 1000 });
   *
   * const results = rms.inputSignal([...values]);
   */
  inputSignal(signal) {
    const power = this.params.get('power');
    const length = signal.length;
    let rms = 0;

    for (let i = 0; i < length; i++)
      rms += (signal[i] * signal[i]);

    rms = rms / length;

    if (!power)
      rms = sqrt(rms);

    return rms;
  }

  /** @private */
  processSignal(frame) {
    this.frame.data[0] = this.inputSignal(frame.data);
  }
}

export default Rms;
