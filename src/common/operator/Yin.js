import BaseLfo from '../core/BaseLfo';

const ceil = Math.ceil;

/**
 * @private
 * paper: http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * implementation based on https://github.com/ashokfernandez/Yin-Pitch-Tracking
 */

const definitions = {
  threshold: {
    type: 'float',
    default: 0.1, // default from paper
    metas: { kind: 'static' },
  },
  downSamplingExp: { // downsampling factor
    type: 'integer',
    default: 2,
    min: 0,
    max: 3,
    metas: { kind: 'static' },
  },
  minFreq: { //
    type: 'float',
    default: 60, // mean 735 samples
    min: 0,
    metas: { kind: 'static' },
  },
}

/**
 * Yin fundamental frequency estimator, based on algorithm described in
 * [YIN, a fundamental frequency estimator for speech and music](http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf)
 * by Cheveigne and Kawahara.
 * On each frame, this operator propagate a vector containing the following
 * values: `frequency`, `energy`, `periodicity` and `AC1`.
 *
 * For good results the input frame size should be large (1024 or 2048).
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.threshold=0.1] - Absolute threshold to test the
 *  normalized difference (see paper for more informations).
 * @param {Number} [options.downSamplingExp=2] - Down sample the input frame by
 *  a factor of 2 at the power of `downSamplingExp` (min=0 and max=3) for
 *  performance improvements.
 * @param {Number} [options.minFreq=60] - Minimum frequency the operator can
 *  search for. This parameter defines the size of the autocorrelation performed
 *  on the signal, the input frame size should be around 2 time this size for
 *  good results (i.e. `inputFrameSize ≈ 2 * (samplingRate / minFreq)`).
 *
 * @example
 * import * as lfo from 'waves-lfo/client';
 *
 * // assuming some AudioBuffer
 * const source = new lfo.source.AudioInBuffer({
 *   audioBuffer: audioBuffer,
 * });
 *
 * const slicer = new lfo.operator.Slicer({
 *   frameSize: 2048,
 * });
 *
 * const yin = new lfo.operator.Yin();
 * const logger = new lfo.sink.Logger({ data: true });
 *
 * source.connect(slicer);
 * slicer.connect(yin);
 * yin.connect(logger);
 *
 * source.start();
 */
class Yin extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.probability = 0;
    this.pitch = -1;

    this.test = 0;
  }

  /** @private */
  _downsample(input, size, output, downSamplingExp) {
    const outputSize = size >> downSamplingExp;
    let i, j;

    switch (downSamplingExp) {
      case 0: // no down sampling
        for (i = 0; i < size; i++)
          output[i] = input[i];

        break;
      case 1:
        for (i = 0, j = 0; i < outputSize; i++, j += 2)
          output[i] = 0.5 * (input[j] + input[j + 1]);

        break
      case 2:
        for (i = 0, j = 0; i < outputSize; i++, j += 4)
          output[i] = 0.25 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3]);

        break;
      case 3:
        for (i = 0, j = 0; i < outputSize; i++, j += 8)
          output[i] = 0.125 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3] + input[j + 4] + input[j + 5] + input[j + 6] + input[j + 7]);

        break;
    }

    return outputSize;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['frequency', 'confidence'];

    this.inputFrameSize = prevStreamParams.frameSize;
    // handle params
    const sourceSampleRate = this.streamParams.sourceSampleRate;
    const downSamplingExp = this.params.get('downSamplingExp');
    const downFactor = 1 << downSamplingExp; // 2^n
    const downSR = sourceSampleRate / downFactor;
    const downFrameSize = this.inputFrameSize / downFactor; // n_tick_down // 1 / 2^n

    const minFreq = this.params.get('minFreq');
    // limit min freq, cf. paper IV. sensitivity to parameters
    const minFreqNbrSamples = downSR / minFreq;
    // const bufferSize = prevStreamParams.frameSize;
    this.halfBufferSize = downFrameSize / 2;

    // minimum error to not crash but not enought to have results
    if (minFreqNbrSamples > this.halfBufferSize)
      throw new Error('Invalid input frame size, too small for given "minFreq"');

    this.downSamplingExp = downSamplingExp;
    this.downSamplingRate = downSR;
    this.downFrameSize = downFrameSize;
    this.buffer = new Float32Array(downFrameSize);
    // autocorrelation buffer
    this.yinBuffer = new Float32Array(this.halfBufferSize);
    this.yinBuffer.fill(0);

    this.propagateStreamParams();
  }

  /** @private */
  _downsample(input, size, output, downSamplingExp) {
    const outputSize = size >> downSamplingExp;
    let i, j;

    switch (downSamplingExp) {
      case 0: // no down sampling
        for (i = 0; i < size; i++)
          output[i] = input[i];

        break;
      case 1:
        for (i = 0, j = 0; i < outputSize; i++, j += 2)
          output[i] = 0.5 * (input[j] + input[j + 1]);

        break
      case 2:
        for (i = 0, j = 0; i < outputSize; i++, j += 4)
          output[i] = 0.25 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3]);

        break;
      case 3:
        for (i = 0, j = 0; i < outputSize; i++, j += 8)
          output[i] = 0.125 * (input[j] + input[j + 1] + input[j + 2] + input[j + 3] + input[j + 4] + input[j + 5] + input[j + 6] + input[j + 7]);

        break;
    }

    return outputSize;
  }

  /**
   * Step 1, 2 and 3 - Squared difference of the shifted signal with itself.
   * cumulative mean normalized difference.
   *
   * @private
   */
  _normalizedDifference(buffer) {
    const halfBufferSize = this.halfBufferSize;
    const yinBuffer = this.yinBuffer;
    let sum = 0;

    // difference for different shift values (tau)
    for (let tau = 0; tau < halfBufferSize; tau++) {
      let squaredDifference = 0; // reset buffer

      // take difference of the signal with a shifted version of itself then
      // sqaure the result
      for (let i = 0; i < halfBufferSize; i++) {
        const delta = buffer[i] - buffer[i + tau];
        squaredDifference += delta * delta;
      }

      // step 3 - normalize yinBuffer
      if (tau > 0) {
        sum += squaredDifference;
        yinBuffer[tau] = squaredDifference * (tau / sum);
      }
    }

    yinBuffer[0] = 1;
  }

  /**
   * Step 4 - find first best tau that is under the thresold.
   *
   * @private
   */
  _absoluteThreshold() {
    const threshold = this.params.get('threshold');
    const yinBuffer = this.yinBuffer;
    const halfBufferSize = this.halfBufferSize;
    let tau;

    for (tau = 1; tau < halfBufferSize; tau++) {
      if (yinBuffer[tau] < threshold) {
        // keep increasing tau if next value is better
        while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau])
          tau += 1;

        // best tau found , yinBuffer[tau] can be seen as an estimation of
        // aperiodicity then: periodicity = 1 - aperiodicity
        this.probability = 1 - yinBuffer[tau];
        break;
      }
    }

    // return -1 if not match found
    return (tau === halfBufferSize) ? -1 : tau;
  }

  /**
   * Step 5 - Find a better fractionnal approximate of tau.
   * this can probably be simplified...
   *
   * @private
   */
  _parabolicInterpolation(tauEstimate) {
    const halfBufferSize = this.halfBufferSize;
    const yinBuffer = this.yinBuffer;
    let betterTau;
    // @note - tauEstimate cannot be zero as the loop start at 1 in step 4
    const x0 = tauEstimate - 1;
    const x2 = (tauEstimate < halfBufferSize - 1) ? tauEstimate + 1 : tauEstimate;

    // if `tauEstimate` is last index, we can't interpolate
    if (x2 === tauEstimate) {
        betterTau = tauEstimate;
    } else {
      const s0 = yinBuffer[x0];
      const s1 = yinBuffer[tauEstimate];
      const s2 = yinBuffer[x2];

      // @note - don't fully understand this formula neither...
      betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    }

    return betterTau;
  }

  /**
   * Use the `Yin` operator in `standalone` mode (i.e. outside of a graph).
   *
   * @param {Array|Float32Array} input - The signal fragment to process.
   * @return {Array} - Array containing the `frequency`, `energy`, `periodicity`
   *  and `AC1`
   *
   * @example
   * import * as lfo from 'waves-lfo/client';
   *
   * const yin = new lfo.operator.Yin();
   * yin.initStream({
   *   frameSize: 2048,
   *   frameType: 'signal',
   *   sourceSampleRate: 44100
   * });
   *
   * const results = yin.inputSignal(signal);
   */
  inputSignal(input) {
    this.pitch = -1;
    this.probability = 0;

    const buffer = this.buffer;
    const inputFrameSize = this.inputFrameSize;
    const downSamplingExp = this.downSamplingExp;
    const sampleRate = this.downSamplingRate;
    const outData = this.frame.data;
    let tauEstimate = -1;

    // subsampling
    this._downsample(input, inputFrameSize, buffer, downSamplingExp);
    // step 1, 2, 3 - normalized squared difference of the signal with a
    // shifted version of itself
    this._normalizedDifference(buffer);
    // step 4 - find first best tau estimate that is over the threshold
    tauEstimate = this._absoluteThreshold();

    if (tauEstimate !== -1) {
      // step 5 - so far tau is an integer shift of the signal, check if
      // there is a better fractionnal value around
      tauEstimate = this._parabolicInterpolation(tauEstimate);
      this.pitch = sampleRate / tauEstimate;
    }

    outData[0] = this.pitch;
    outData[1] = this.probability;

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default Yin;
