import * as lfo from 'waves-lfo/common';
import { BaseLfo } from 'waves-lfo/core';

const initWindow = lfo.utils.initWindow;

const FFT_MIN_LOG2 = 2;
const FFT_MAX_LOG2 = 32;

const FFT_MIN_SIZE = 1 << FFT_MIN_LOG2;
const FFT_MAX_SIZE = 1 << FFT_MAX_LOG2;

const sqrt = Math.sqrt;

// function logDualis(n) {
//   let log2 = 0;

//   for (let i = n >> 1; i; i >>= 1)
//     log2++;

//   return log2;
// }

// tab = Float32Array(5 / 4 * fftSize + 1)
// sine = *tab + 0
// cosine = *tab + fftSize / 4
function fillFiveQuarterSineTable(tab, fftSize) {
  const tab_size = 5 * fftSize / 4;
  let step = 2 * Math.PI / fftSize;

  for (let i = 0; i <= tab_size; i++)
    tab[i] = Math.sin(i * step);

  return tab;
}

// tab = Uint32Array(fftSize)
function fillBitreversedTable(tab, fftSize) {
  let log_size, i;

  for (log_size = -1, i = fftSize; i; i >>= 1, log_size++)
  ;

  for (i = 0; i < fftSize; i++) {
    let idx = i;
    let xdi = 0;

    for (let j = 1; j < log_size; j++) {
      xdi += (idx & 1);
      xdi <<= 1;
      idx >>= 1;
    }

    tab[i] = xdi + (idx & 1);
  }

  return tab;
}

function isFftSize(n) {
  if (n < FFT_MIN_SIZE || n > FFT_MAX_SIZE)
    return false;

  /* power of 2? */
  while ((n >>= 1) && !(n & 1))
  ;

  return (n == 1);
}

// function nextFftSize(n) {
//   let fftSize = FFT_MIN_SIZE;

//   for (let i = ((n - 1) >> FFT_MIN_LOG2); i > 0; i >>= 1)
//     fftSize <<= 1;

//   return fftSize;
// }


const definitions = {
  size: {
    type: 'integer',
    default: 1024,
    metas: { kind: 'static' },
  },
  window: {
    type: 'enum',
    list: ['none', 'hann', 'hanning', 'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'],
    default: 'none',
    metas: { kind: 'static' },
  },
  mode: {
    type: 'enum',
    list: ['magnitude', 'power'], // add complex output
    default: 'magnitude',
  },
  norm: {
    type: 'enum',
    default: 'auto',
    list: ['auto', 'none', 'linear', 'power'],
  },
  fftWasmExport: {
    type: 'any',
    default: null,
  },
  wasmMemory: {
    type: 'any',
    default: null,
  },
}

class FftAsm extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.windowSize = null;
    this.normalizeCoefs = null;
    this.window = null;
    this.real = null;
    this.imag = null;
    this.fft = null;

    // if (!isFftSize(this.params.get('size')))
    //   throw new Error('fftSize must be a power of two');
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    // set the output frame size
    const inFrameSize = prevStreamParams.frameSize;
    const fftSize = this.params.get('size');
    const mode = this.params.get('mode');
    const norm = this.params.get('norm');
    let windowName = this.params.get('window');

    const buffer = this.params.get('wasmMemory');

    // prepare sine table
    this.sineTableOffset = 0;
    this.cosineTableOffset = 0 + 4 * fftSize / 4;
    const sineTableLength = 5 / 4 * fftSize + 1;

    this.sineTableBuffer = new Float32Array(buffer, 0, sineTableLength);
    fillFiveQuarterSineTable(this.sineTableBuffer, fftSize);

    // prepare bit shift pointer
    this.bitreversedTableOffset = this.sineTableOffset + 4 * sineTableLength;
    const bitreversedTableLength = fftSize;

    this.bitreversedTableBuffer = new Uint32Array(buffer, this.bitreversedTableOffset, bitreversedTableLength);
    fillBitreversedTable(this.bitreversedTableBuffer, fftSize);


    this.complexBufferOffset = this.bitreversedTableOffset + 4 * bitreversedTableLength;
    this.complexBufferLength = fftSize * 2;
    this.complexBuffer = new Float32Array(buffer, this.complexBufferOffset, this.complexBufferLength);

    // window `none` and `rectangle` are aliases
    if (windowName === 'none')
      windowName = 'rectangle';

    this.streamParams.frameSize = fftSize / 2 + 1;
    this.streamParams.frameType = 'vector';
    this.streamParams.description = [];
    // size of the window to apply on the input frame
    this.windowSize = (inFrameSize < fftSize) ? inFrameSize : fftSize;

    // references to populate in the window functions (cf. `initWindow`)
    this.normalizeCoefs = { linear: 0, power: 0 };
    this.window = new Float32Array(this.windowSize);

    initWindow(
      windowName,         // name of the window
      this.window,        // buffer populated with the window signal
      this.windowSize,    // size of the window
      this.normalizeCoefs // object populated with the normalization coefs
    );

    const { linear, power } = this.normalizeCoefs;

    switch (norm) {
      case 'none':
        this.windowNorm = 1;
        break;

      case 'linear':
        this.windowNorm = linear;
        break;

      case 'power':
        this.windowNorm = power;
        break;

      case 'auto':
        if (mode === 'magnitude')
          this.windowNorm = linear;
        else if (mode === 'power')
          this.windowNorm = power;
        break;
    }

    this.propagateStreamParams();
  }

  /**
   * Use the `Fft` operator in `standalone` mode (i.e. outside of a graph).
   *
   * @param {Array} signal - Input values.
   * @return {Array} - Fft of the input signal.
   *
   * @example
   * const fft = new lfo.operator.Fft({ size: 512, window: 'hann' });
   * // mandatory for use in standalone mode
   * fft.initStream({ frameSize: 256, frameType: 'signal' });
   * fft.inputSignal(signal);
   */
  inputSignal(signal) {
    const mode = this.params.get('mode');
    const windowSize = this.windowSize;
    const frameSize = this.streamParams.frameSize;
    const fftSize = this.params.get('size');
    const fftWasmExport = this.params.get('fftWasmExport');
    const outData = this.frame.data;

    // apply window on the input signal and reset imag buffer
    for (let i = 0; i < windowSize; i++) {
      this.complexBuffer[i * 2] = signal[i] * this.window[i] * this.windowNorm; // real
      this.complexBuffer[i * 2 + 1] = 0; // img
    }

    // if real is bigger than input signal, fill with zeros
    for (let i = windowSize; i < fftSize; i++) {
      this.complexBuffer[i * 2] = 0;
      this.complexBuffer[i * 2 + 1] = 0;
    }

    // this.fft.forward(this.real, this.imag);
    fftWasmExport._cfftInplc(
      this.complexBufferOffset,
      this.bitreversedTableOffset,
      this.cosineTableOffset,
      this.sineTableOffset,
      fftSize
    );

    if (mode === 'magnitude') {
      const norm = 1 / fftSize;

      // DC index
      const realDc = this.complexBuffer[0];
      const imagDc = this.complexBuffer[1];
      outData[0] = sqrt(realDc * realDc + imagDc * imagDc) * norm;

      // Nquyst index
      const realNy = this.complexBuffer[2 * fftSize / 2];
      const imagNy = this.complexBuffer[2 * fftSize / 2 + 1];
      outData[fftSize / 2] = sqrt(realNy * realNy + imagNy * imagNy) * norm;

      // power spectrum
      for (let i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
        const real = 0.5 * (this.complexBuffer[2 * i] + this.complexBuffer[2 * j]);
        const imag = 0.5 * (this.complexBuffer[2 * i + 1] - this.complexBuffer[2 * j + 1]);

        outData[i] = 2 * sqrt(real * real + imag * imag) * norm;
      }

    } else if (mode === 'power') {
      const norm = 1 / (fftSize * fftSize);

      // DC index
      const realDc = this.complexBuffer[0];
      const imagDc = this.complexBuffer[1];
      outData[0] = (realDc * realDc + imagDc * imagDc) * norm;

      // Nquyst index
      const realNy = this.complexBuffer[2 * fftSize / 2];
      const imagNy = this.complexBuffer[2 * fftSize / 2 + 1];
      outData[fftSize / 2] = (realNy * realNy + imagNy * imagNy) * norm;

      // power spectrum
      for (let i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
        const real = 0.5 * (this.complexBuffer[2 * i] + this.complexBuffer[2 * j]);
        const imag = 0.5 * (this.complexBuffer[2 * i + 1] - this.complexBuffer[2 * j + 1]);

        outData[i] = 4 * (real * real + imag * imag) * norm;
      }
    }

    return outData;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default FftAsm;
