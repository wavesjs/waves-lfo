import BaseLfo from '../core/base-lfo';
import jsfft from 'jsfft';
import complexArray from 'jsfft/lib/complex_array';
import initWindow from '../utils/fft-windows';

const sqrt = Math.sqrt;

const isPowerOfTwo = function(number) {
  while ((number % 2 === 0) && number > 1)
    number = number / 2;

  return number === 1;
}


/**
 *
 *
 *
 */
export default class Fft extends BaseLfo {
  constructor(options) {
    super({
      fftSize: 1024,        // dynamic
      windowName: 'hann',   // dyanmic
      outType: 'magnitude', // static ?
    }, options);

    this.windowSize = this.params.fftSize;

    if (!isPowerOfTwo(this.params.fftSize))
      throw new Error('fftSize must be a power of two');
  }

  initialize(inStreamParams) {
    // set the output frame size
    super.initialize(inStreamParams, {
      frameSize: this.params.fftSize / 2 + 1,
    });

    const inFrameSize = inStreamParams.frameSize;
    const fftSize = this.params.fftSize;

    // size of the window to apply on the input frame
    this.windowSize = fftSize;

    if (inFrameSize < fftSize)
      this.windowSize = inFrameSize;

    // references to populate in the window functions (cf. `initWindow`)
    this.normalizeCoefs = { linear: 0, power: 0 };
    this.window = new Float32Array(this.windowSize);

    initWindow(
      this.params.windowName, // name of the window
      this.window, // buffer populated with the window signal
      this.windowSize, // size of the window
      this.normalizeCoefs // object populated with the normalization coefs
    );

    // buffers to be reused in `process`
    this.complexFrame = new complexArray.ComplexArray(fftSize);
    this.windowedFrame = new Float32Array(fftSize);
  }

  /**
   * the first call of this method can be quite long (~4ms),
   * subsequent ones are faster (~0.5ms) for fftSize = 1024
   * If this comes from the FFT memory allocation, maybe make a dummy call of
   * `this.complexFrame.FFT` in `initialize` ?
   */
  process(time, frame, metaData) {
    const windowSize = this.windowSize;
    const outFrameSize = this.streamParams.frameSize;
    const fftSize = this.params.fftSize;

    // apply window on the input frame
    for (let i = 0; i < windowSize; i++)
      this.windowedFrame[i] = frame[i] * this.window[i];

    // if windowedFrame is bigger then input frame, fill with zeros
    if (windowSize < fftSize)
      this.windowedFrame.fill(0, windowSize);

    // FFT - reuse the same buffer for fft calculations
    this.complexFrame.map((value, i) => {
      value.real = this.windowedFrame[i];
      value.imag = 0;
    });

    const complexSpectrum = this.complexFrame.FFT();
    const scale = 1 / fftSize;

    // DC index
    const realDc = complexSpectrum.real[0];
    const imagDc = complexSpectrum.imag[0];
    this.outFrame[0] = (realDc * realDc + imagDc * imagDc) * scale;

    // Nquyst index
    const realNy = complexSpectrum.real[fftSize / 2];
    const imagNy = complexSpectrum.imag[fftSize / 2];
    this.outFrame[fftSize / 2] = (realNy * realNy + imagNy * imagNy) * scale;

    // power spectrum
    for (let i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
      const real = complexSpectrum.real[i] + complexSpectrum.real[j];
      const imag = complexSpectrum.imag[i] - complexSpectrum.imag[j];

      this.outFrame[i] = (real * real + imag * imag) * scale;
    }

    // magnitude spectrum
    if (this.params.outType === 'magnitude') {
      for (let i = 0; i < outFrameSize; i++)
        this.outFrame[i] = sqrt(this.outFrame[i]);
    }

    this.output(time);
  }
}
