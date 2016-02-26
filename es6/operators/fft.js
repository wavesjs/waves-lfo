import BaseLfo from '../core/base-lfo';
import jsfft from 'jsfft';
import complexArray from 'jsfft/lib/complex_array';
import initWindow from '../utils/fft-windows';

// const PI   = Math.PI;
// const cos  = Math.cos;
// const sin  = Math.sin;
const sqrt = Math.sqrt;

const isPowerOfTwo = function(number) {
  while ((number % 2 === 0) && number > 1) {
    number = number / 2;
  }

  return number === 1;
}

export default class Fft extends BaseLfo {
  constructor(options) {
    super(options, {
      fftSize: 1024,
      windowName: 'hann',
      outType: 'magnitude'
    });

    if (!isPowerOfTwo(this.params.fftSize)) {
      throw new Error('fftSize must be a power of two');
    }
  }

  initialize() {
    super.initialize();

    const inFrameSize = this.parent.streamParams.frameSize;
    const fftSize = this.params.fftSize;
    // keep of the window size to be applied
    this.appliedWindowSize = inFrameSize < fftSize ? inFrameSize : fftSize;
    // references to populate in window functions
    this.normalizeCoefs = { linear: 0, power: 0 };
    this.window = new Float32Array(this.appliedWindowSize);
    // init the complex array to reuse for the FFT
    this.complexFrame = new complexArray.ComplexArray(fftSize);

    initWindow(
      this.params.windowName,
      this.window, // buffer to populate with the window
      this.appliedWindowSize, // buffer.length
      this.normalizeCoefs // an object to populate with the normalization coefs
    );

    // ArrayBuffers to reuse in process
    this.windowedFrame = new Float32Array(fftSize);
  }

  configureStream() {
    this.streamParams.frameSize = this.params.fftSize / 2 + 1;
  }

  /**
   * the first call of this method can be quite long (~4ms),
   * the subsequent ones are faster (~0.5ms) for fftSize = 1024
   */
  process(time, frame, metaData) {
    const inFrameSize = this.parent.streamParams.frameSize;
    const outFrameSize = this.streamParams.frameSize;
    const sampleRate = this.streamParams.sourceSampleRate;
    const fftSize = this.params.fftSize;
    // clip frame if bigger than fftSize
    frame = (inFrameSize > fftSize) ? frame.subarray(0, fftSize) : frame;

    // apply window on frame
    // => `this.window` and `frame` have the same length
    // => if `this.windowedFrame` is bigger, it's filled with zero
    // and window don't apply there
    for (let i = 0; i < this.appliedWindowSize; i++) {
      this.windowedFrame[i] = frame[i] * this.window[i];
    }

    // FFT
    // this.complexFrame = new complexArray.ComplexArray(fftSize);
    // reuse the same complexFrame
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
    // @NOTE maybe check how to remove this loop properly
    if (this.params.outType === 'magnitude') {
      for (let i = 0; i < outFrameSize; i++) {
        this.outFrame[i] = sqrt(this.outFrame[i]);
      }
    }

    // @NOTE what shall we do with `this.normalizeCoefs` ?
    // time is centered on the frame ?
    this.time = time + (inFrameSize / sampleRate / 2);

    this.output();
  }
}
