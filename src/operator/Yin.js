import BaseLfo from '../core/BaseLfo';
import parameters from 'parameters';

/**
 * @private
 * paper: http://recherche.ircam.fr/equipes/pcm/cheveign/pss/2002_JASA_YIN.pdf
 * implementation based on https://github.com/ashokfernandez/Yin-Pitch-Tracking
 */

const definitions = {
  threshold: {
    type: 'float',
    default: 0.1, // default from paper
  },
  // cf. PiPo - 24 is "just ok for 2048 sample slices" (1 / minFreq * frameSize (?)),
  // @note - What about the fact that the autocorrelation is preformed on half
  // the frame size ?
  minFreq: {
    type: 'float',
    default: 24,
  }
  // @todo - decimateFactor (cf. PiPo) check resulting sampling rate against minFreq
}


/**
 * @todo
 */
class Yin extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);

    this.probability = 0;
    this.pitch = -1;

    this.test = 0;
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    this.streamParams.frameType = 'vector';
    this.streamParams.frameSize = 2;
    this.streamParams.description = ['frequency', 'probability'];

    const bufferSize = prevStreamParams.frameSize;
    this.halfBufferSize = bufferSize / 2;

    // @todo - check minFreq according to frameSize

    // autocorrelation buffer
    this.yinBuffer = new Float32Array(this.halfBufferSize);
    this.yinBuffer.fill(0);

    this.propagateStreamParams();
  }

  /**
   * Step 1 and 2 - Squared difference of the shifted signal with itself.
   */
  _difference(buffer) {
    const halfBufferSize = this.halfBufferSize;
    const yinBuffer = this.yinBuffer;

    // difference for different shift values (tau)
    for (let tau = 0; tau < halfBufferSize; tau++) {
      yinBuffer[tau] = 0; // reset buffer

      // take difference of the signal with a shifted version of itself then
      // sqaure the result
      for (let i = 0; i < halfBufferSize; i++) {
        const delta = buffer[i] - buffer[i + tau];
        yinBuffer[tau] += delta * delta;
      }
    }
  }

  /**
   * Step 3 - normalize yinBuffer.
   * @note - this could probably be merge with step 1 ?
   * @note - don't fully understand this formula...
   */
  _cumulativeMeanNormalizedDifference() {
    const yinBuffer = this.yinBuffer;
    const halfBufferSize = this.halfBufferSize;
    let sum = 0;

    yinBuffer[0] = 1; // avoid matching at tau = 0

    for (let tau = 1; tau < halfBufferSize; tau++) {
      sum += yinBuffer[tau];
      yinBuffer[tau] *= tau / sum;
    }
  }

  /**
   * Step 4 - find first best tau that is under the thresold.
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
   */
  _parabolicInterpolation(tauEstimate) {
    // console.log(tauEstimate);

    const halfBufferSize = this.halfBufferSize;
    const yinBuffer = this.yinBuffer;
    let betterTau;
    // @note - can't happen has loop start at 1 in step 4...
    // const x0 = (tauEstimate < 1) ? tauEstimate : tauEstimate - 1;
    const x0 = tauEstimate - 1;
    const x2 = (tauEstimate < halfBufferSize - 1) ? tauEstimate + 1 : tauEstimate;

    // deal with boudaries (can it really happen ?, cf. `_absoluteThreshold`)
    // if (x0 === tauEstimate) {
    //   if (yinBuffer[tauEstimate] <= yinBuffer[x2])
    //     betterTau = tauEstimate;
    //   else
    //     betterTau = x2;

    // } else

    // if `tauEstimate` is last index, we can't interpolate
    if (x2 === tauEstimate) {
      // @note - is already done in step 4...
      // if (yinBuffer[tauEstimate] <= yinBuffer[x0])
        betterTau = tauEstimate;
      // else
      //   betterTau = x0;

    } else {
      const s0 = yinBuffer[x0];
      const s1 = yinBuffer[tauEstimate];
      const s2 = yinBuffer[x2];

      // @note - don't fully understand this formula neither...
      betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    }

    return betterTau;
  }

  inputSignal(buffer) {
    this.pitch = -1;
    this.probability = 0;

    const sampleRate = this.streamParams.sourceSampleRate;
    const outData = this.frame.data;
    let tauEstimate = -1;

    // step 1 and 2 - squared difference of the signal with a shifted version of itself
    this._difference(buffer);
    // step 3 - normalize the whole thing
    this._cumulativeMeanNormalizedDifference();
    // step 4 - find first best tau estimate that is over the threshold
    tauEstimate = this._absoluteThreshold();

    if (tauEstimate !== -1) {
      // step 5 - so far tau is an integer shift of the signal, check if
      // there is a better fractionnal value around
      tauEstimate = this._parabolicInterpolation(tauEstimate);
      this.pitch = sampleRate / tauEstimate;
    }

    // step 6 - ?

    outData[0] = this.pitch;
    outData[1] = this.probability;

    return outData;
  }

  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default Yin;
