import BaseLfo from '../core/BaseLfo';
import complexArray from 'jsfft/lib/complex_array';
import initWindow from '../utils/windows';
import jsfft from 'jsfft';
import parameters from 'parameters';

const sqrt = Math.sqrt;

const isPowerOfTwo = function(number) {
  while ((number % 2 === 0) && number > 1)
    number = number / 2;

  return number === 1;
}

const definitions = {
  fftSize: {
    type: 'integer',
    default: 1024,
    metas: { kind: 'static' },
  },
  windowName: {
    type: 'enum',
    list: [ 'hann', 'hanning', 'hamming', 'blackman', 'blackmanharris', 'sine', 'rectangle'],
    default: 'hann',
    metas: { kind: 'static' },
  },
  outType: {
    type: 'enum',
    list: ['magnitude', 'power'],
    default: 'magnitude',
  }
}

/**
 *
 *
 *
 */
class FFT extends BaseLfo {
  constructor(options) {
    super();

    this.params = parameters(definitions, options);

    this.windowSize = null;

    if (!isPowerOfTwo(this.params.get('fftSize')))
      throw new Error('fftSize must be a power of two');
  }

  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);
    // set the output frame size
    const inFrameSize = prevStreamParams.frameSize;
    const fftSize = this.params.get('fftSize');
    const outType = this.params.get('outType');
    const windowName = this.params.get('windowName');

    this.streamParams.frameSize = fftSize / 2 + 1;
    this.streamParams.frameType = 'vector';
    this.streamParams.description = ['fft bins'];
    // size of the window to apply on the input frame
    this.windowSize = (inFrameSize < fftSize) ? inFrameSize : fftSize;

    // references to populate in the window functions (cf. `initWindow`)
    this.normalizeCoefs = { linear: 0, power: 0 };
    this.window = new Float32Array(this.windowSize);

    initWindow(
      windowName, // name of the window
      this.window, // buffer populated with the window signal
      this.windowSize, // size of the window
      this.normalizeCoefs // object populated with the normalization coefs
    );

    const { linear, power } = this.normalizeCoefs;
    this.windowScale = (outType === 'magnitude') ? linear : power;
    this.complexFrame = new complexArray.ComplexArray(fftSize);
    this.windowedFrame = new Float32Array(fftSize);

    this.propagateStreamParams();
  }


  inputSignal(signal) {
    const windowSize = this.windowSize;
    const frameSize = this.streamParams.frameSize;
    const fftSize = this.params.get('fftSize');
    const outData = this.frame.data;

    // apply window on the input signal
    // @todo - test the `windowScale` factor
    for (let i = 0; i < windowSize; i++)
      this.windowedFrame[i] = signal[i] * this.window[i] * this.windowScale;

    // if windowedFrame is bigger than input signal, fill with zeros
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
    outData[0] = (realDc * realDc + imagDc * imagDc) * scale;

    // Nquyst index
    const realNy = complexSpectrum.real[fftSize / 2];
    const imagNy = complexSpectrum.imag[fftSize / 2];
    outData[fftSize / 2] = (realNy * realNy + imagNy * imagNy) * scale;

    // power spectrum
    for (let i = 1, j = fftSize - 1; i < fftSize / 2; i++, j--) {
      const real = complexSpectrum.real[i] + complexSpectrum.real[j];
      const imag = complexSpectrum.imag[i] - complexSpectrum.imag[j];

      outData[i] = (real * real + imag * imag) * scale;
    }

    // magnitude spectrum
    if (this.params.get('outType') === 'magnitude') {
      for (let i = 0; i < frameSize; i++)
        outData[i] = sqrt(outData[i]);
    }

    return outData;
  }

  /**
   * the first call of this method can be quite long (~4ms),
   * subsequent ones are faster (~0.5ms) for fftSize = 1024
   * If this comes from the FFT memory allocation, maybe make a dummy call of
   * `this.complexFrame.FFT` in `initialize` ?
   */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default FFT;
