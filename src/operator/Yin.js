import BaseLfo from '../core/BaseLfo';

const ceil = Math.ceil;
const sqrt = Math.sqrt;

/**
 * paper: http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * based on PiPo.yin and rta library implementations.
 * @private
 */

function autocorrelation(correlation, acSize, buffer, windowSize) {
  // corr, acSize, buffer, windowSize
  for (let tau = 0; tau < acSize; tau++) {
    correlation[tau] = 0;

    for (let i = 0; i < windowSize; i++)
      correlation[tau] += buffer[tau + i] * buffer[i];
  }

  return correlation;
}


const definitions = {
  // could be dynamic if we reallocate memory outside `processStreamParams`
  threshold: {
    type: 'float',
    default: 0.1, // default from paper
    metas: { kind: 'static' },
  },
  // could be dynamic if we reallocate memory outside `processStreamParams`
  downSamplingExp: { // downsampling factor
    type: 'integer',
    default: 2,
    min: 0,
    max: 3,
    metas: { kind: 'static' },
  },
  // could be dynamic if we reallocate memory outside `processStreamParams`
  minFreq: { //
    type: 'float',
    default: 60, // means 735 samples
    min: 0,
    metas: { kind: 'static' },
  },
};

/**
 * Yin fundamental frequency estimator, based on algorithm described in
 * [YIN, a fundamental frequency estimator for speech and music](http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf)
 * by Cheveigne and Kawahara.
 *
 * For good results the input frame size should be large (1024 or 2048).
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Number} [options.threshold=0.1] - Absolute threshold to test the
 *  normalized difference. see parper for more informations.
 * @param {Number} [options.downSamplingExp=2] - Down sample the input frame by
 *  a factor of 2 at the power of `downSamplingExp` (`min=0` and `max=3`) for
 *  performance improvements.
 * @param {Number} [options.minFreq=60] - Minimum frequency the operator can
 *  search for. This parameter defines the size of the autocorrelation performed
 *  on the signal, the input frame size should be around 2 time this size for
 *  good results (i.e. `inputFrameSize ≈ 2 * (samplingRate / minFreq)`).
 *
 * @example
 * import * as lfo from 'waves-lfo';
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
  constructor(options = {}) {
    super(definitions, options);

    this.probability = 0;
    this.pitch = -1;

    this.test = 0;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.inputFrameSize = prevStreamParams.frameSize;

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 4;
    this.streamParams.description = ['frequency', 'energy', 'periodicity', 'AC1'];

    const sourceSampleRate = this.streamParams.sourceSampleRate;
    // handle params
    const downSamplingExp = this.params.get('downSamplingExp');
    const downFactor = 1 << downSamplingExp; // 2^n
    const downSR = sourceSampleRate / downFactor;
    const downFrameSize = this.inputFrameSize / downFactor; // n_tick_down // 1 / 2^n

    let minFreq = this.params.get('minFreq');
    // limit min freq, cf. paper IV. sensitivity to parameters
    minFreq = (minFreq > 0.25 * downSR) ? 0.25 * downSR : minFreq;
    // size of autocorrelation
    this.acSize = ceil(downSR / minFreq) + 2;

    // minimum error to not crash but not enought to have results
    if (this.acSize >= downFrameSize)
      throw new Error('Invalid input frame size, too small for given "minFreq"');

    // allocate memory
    this.buffer = new Float32Array(downFrameSize);
    this.corr = new Float32Array(this.acSize);
    this.downSamplingExp = downSamplingExp;
    this.downSamplingRate = downSR;

    // maximum number of searched minima
    this.yinMaxMins = 128; // cf. PiPo for this value choice
    // interleaved min / tau used in this._yin
    this.yinMins = new Float32Array(this.yinMaxMins * 2);
    // values returned by _yin
    this.yinResults = new Array(2); // min, tau

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

  /** @private */
  _yin(corr, acSize, buffer, downSize, threshold) {
    const windowSize = downSize - acSize;

    autocorrelation(corr, acSize, buffer, windowSize);

    const corr0 = corr[0]; // energy of the input signal in windowSize (a^2)
    const maxMins = this.yinMaxMins;
    const mins = this.yinMins;
    const yinResults = this.yinResults;
    let biasedThreshold = threshold;
    let minCounter = 0;
    let absTau = acSize - 1.5;
    let absMin = 1;
    let x;
    let xm;
    let energy;
    let diff;
    let diffLeft;
    let diffRight;
    let sum;

    // diff[0]
    x = buffer[0];
    xm = buffer[windowSize];
    // corr[0] is a^2, corr[1-n] is ab, energy is b^2 (windowSize shifted by tau)
    energy = corr0 + xm * xm - x * x;
    diffLeft = 0;
    diff = 0;
    // (a - b)^2 = a^2 - 2ab + b2  (squared difference)
    diffRight = corr0 + energy - 2 * corr[1];
    sum = 0;

    // diff[1]
    x = buffer[1];
    xm = buffer[1 + windowSize];
    energy += xm * xm - x * x;
    diffLeft = diff;
    diff = diffRight;
    diffRight = corr0 + energy - 2 * corr[2];
    sum = diff;

    // minimum difference search
    for (let i = 2; i < acSize - 1 && minCounter < maxMins; i++) {
      x = buffer[i];
      xm = buffer[i + windowSize];
      energy += xm * xm - x * x;
      diffLeft = diff;
      diff = diffRight;
      diffRight = corr0 + energy - 2 * corr[i + 1];
      sum += diff;

      // local minima
      if (diff < diffLeft && diff < diffRight && sum !== 0) {
        // a bit of black magic... quadratic interpolation ?
        const a = diffLeft + diffRight - 2 * diff;
        const b = 0.5 * (diffRight - diffLeft);
        const min = diff - (b * b) / (2 * a);
        const normMin = i * min / sum;
        const tau = i - b / a;

        mins[minCounter * 2] = normMin;
        mins[minCounter * 2 + 1] = tau;
        minCounter += 1;

        if (normMin < absMin)
          absMin = normMin;
      }
    }

    biasedThreshold += absMin;

    // first minimum under biased threshold
    for (let i = 0; i < minCounter; i++) {
      const j = i * 2;

      if (mins[j] < biasedThreshold) {
        absMin = mins[j];
        absTau = mins[j + 1];
        break;
      }
    }

    if (absMin < 0)
      absMin = 0;

    yinResults[0] = absMin;
    yinResults[1] = absTau;

    return yinResults;
  }

  /**
   * Execute the Yin operator from outside a graph.
   *
   * @param {Array|Float32Array} input - The signal fragment to process.
   * @return {Array} - Array containing the frequency, energy, periodicity and AC1
   */
  inputSignal(input) {
    const threshold = this.params.get('threshold');
    const inputFrameSize = this.inputFrameSize;
    const downSamplingExp = this.downSamplingExp;
    const downSamplingRate = this.downSamplingRate;
    const acSize = this.acSize;
    const outData = this.frame.data;
    const buffer = this.buffer;
    const corr = this.corr;

    let ac1OverAc0;
    let periodicity;
    let energy;

    const downSize = this._downsample(input, inputFrameSize, buffer, downSamplingExp);
    const res = this._yin(corr, acSize, buffer, downSize, threshold);

    const min = res[0];
    const period = res[1];

    // energy
    energy = sqrt(corr[0] / (downSize - acSize));

    // periodicity
    if (min > 0)
      periodicity = (min < 1) ? 1.0 - sqrt(min) : 0;
    else
      periodicity = 1;

    // ac1 over ac0 (kind of spectral slope ?)
    if (corr[0] !== 0)
      ac1OverAc0 = corr[1] / corr[0];
    else
      ac1OverAc0 = 0;

    // populate frame with results
    outData[0] = downSamplingRate / period;
    outData[1] = energy;
    outData[2] = periodicity;
    outData[3] = ac1OverAc0;

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default Yin;
