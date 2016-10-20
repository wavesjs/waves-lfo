import BaseLfo from '../core/BaseLfo';
import FFT from './FFT';
import Mel from './Mel';
import DCT from './DCT';

const definitions = {
  nbrBands: {
    type: 'integer',
    default: 24,
    meta: { kind: 'static' },
  },
  nbrCoefs: {
    type: 'integer',
    default: 12,
    meta: { kind: 'static' },
  },
};

/**
 * @todo
 */
class MFCC extends BaseLfo {
  constructor(options) {
    super(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const nbrBands = this.params.get('nbrBands');
    const nbrCoefs = this.params.get('nbrCoefs');
    const inputFrameSize = prevStreamParams.frameSize;
    const inputFrameRate = prevStreamParams.frameRate;
    const inputSampleRate = prevStreamParams.sourceSampleRate;
    const nbrBins = inputFrameSize / 2 + 1;

    this.streamParams.frameSize = nbrCoefs;
    this.streamParams.frameType = 'vector';
    this.streamParams.description = [];

    this.fft = new FFT({
      window: 'hann',
      mode: 'power',
      norm: 'power',
      size: inputFrameSize,
    });

    this.mel = new Mel({
      nbrBands: nbrBands,
      log: true,
      power: 1,
      minFreq: 0,
    });

    this.dct = new DCT({
      order: nbrCoefs,
    });

    // init streams
    this.fft.initStream({
      frameType: 'signal',
      frameSize: inputFrameSize,
      frameRate: inputFrameRate,
      sourceSampleRate: inputSampleRate,
    });

    this.mel.initStream({
      frameType: 'vector',
      frameSize: nbrBins,
      frameRate: inputFrameRate,
      sourceSampleRate: inputSampleRate,
    });

    this.dct.initStream({
      frameType: 'vector',
      frameSize: nbrBands,
      frameRate: inputFrameRate,
      sourceSampleRate: inputSampleRate,
    });

    this.propagateStreamParams();
  }

  /**
   * @todo
   */
  inputSignal(data) {
    const output = this.frame.data;
    const nbrCoefs = this.params.get('nbrCoefs');

    const bins = this.fft.inputSignal(data);
    const melBands = this.mel.inputVector(bins);
    // console.log(melBands);
    const coefs = this.dct.inputSignal(melBands);

    for (let i = 0; i < nbrCoefs; i++)
      output[i] = coefs[i];

    return output;
  }

  /** @private */
  processSignal(frame) {
    this.inputSignal(frame.data);
  }
}

export default MFCC;
