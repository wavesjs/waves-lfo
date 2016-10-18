import BaseLfo from '../core/BaseLfo';

const min = Math.min;
const max = Math.max;
const pow = Math.pow;
const log10 = Math.log10;

function hertzToMelHtk(freqHz) {
  return 2595 * Math.log10(1 + (freqHz / 700));
}

function melToHertzHtk(freqMel) {
  return 700 * (Math.pow(10, freqMel / 2595) - 1);
}

/**
 * Returns a description of the weights to apply on the fft bins for each
 * Mel band filter.
 * @note - adapted from imtr-tools/rta
 *
 * @param {Number} nbrBins - Number of fft bins.
 * @param {Number} nbrFilter - Number of mel filters.
 * @param {Number} sampleRate - Sample Rate of the signal.
 * @param {Number} minFreq - Minimum Frequency to be considerered.
 * @param {Number} maxFreq - Maximum frequency to consider.
 * @return {Array<Object>} - Description of the weights to apply on the bins for
 *  each mel filter.
 *
 * @private
 */
function getMelBandWeights(nbrBins, nbrFilters, sampleRate, minFreq, maxFreq, type = 'htk') {

  let hertzToMel = null;
  let melToHertz = null;
  let minMel;
  let maxMel;

  if (type === 'htk') {
    hertzToMel = hertzToMelHtk;
    melToHertz = melToHertzHtk;
    minMel = hertzToMel(minFreq);
    maxMel = hertzToMel(maxFreq);
  } else {
    throw new Error(`Invalid mel band type: "${type}"`);
  }

  const melBandDescriptions = new Array(nbrFilters);
  // center frequencies of FFT bins
  const fftFreqs = new Float32Array(nbrBins);
  // center frequencies of mel bands - uniformly spaced in mel domain between
  // limits, there are 2 more frequencies than the actual number of filters in
  // order to calculate the slopes
  const filterFreqs = new Float32Array(nbrFilters + 2);
  // matrix to hold all the coefs to apply on the bins
  // const weightMatrix = new Float32Array(nbrFilters * nbrBins);

  const fftSize = (nbrBins - 1) * 2;
  // compute bins center frequencies
  for (let i = 0; i < nbrBins; i++)
    fftFreqs[i] = sampleRate * i / fftSize;

  for (let i = 0; i < nbrFilters + 2; i++)
    filterFreqs[i] = melToHertz(minMel + i / (nbrFilters + 1) * (maxMel - minMel));

  // loop throught filters
  for (let i = 0; i < nbrFilters; i++) {
    let minWeightIndexDefined = 0;

    const description = {
      startIndex: null,
      centerFreq: null,
      weights: [],
    }

    // define contribution of each bin for the filter at index (i + 1)
    // do not process the last spectrum component (Nyquist)
    for (let j = 0; j < nbrBins - 1; j++) {
      const posSlopeContrib = (fftFreqs[j] - filterFreqs[i]) /
                              (filterFreqs[i+1] - filterFreqs[i]);

      const negSlopeContrib = (filterFreqs[i+2] - fftFreqs[j]) /
                              (filterFreqs[i+2] - filterFreqs[i+1]);
      // lowerSlope and upper slope intersect at zero and with each other
      const contribution = max(0, min(posSlopeContrib, negSlopeContrib));

      if (contribution > 0) {
        if (description.startIndex === null) {
          description.startIndex = j;
          description.centerFreq = filterFreqs[i+1];
        }

        description.weights.push(contribution);
      }
    }

    // empty filter
    if (description.startIndex === null) {
      description.startIndex = 0;
      description.centerFreq = 0;
    }

    // @todo - do some scaling for Slaney-style mel

    melBandDescriptions[i] = description;
  }

  return melBandDescriptions;
}


const definitions = {
  log: {
    type: 'boolean',
    default: false,
    metas: { kind: 'static' },
  },
  nbrFilters: {
    type: 'integer',
    default: 24,
    metas: { kind: 'static' },
  },
  minFreq: {
    type: 'float',
    default: 0,
    metas: { kind: 'static' },
  },
  maxFreq: {
    type: 'float',
    default: null,
    nullable: true,
    metas: { kind: 'static' },
  },
  power: {
    type: 'integer',
    default: 1,
    metas: { kind: 'dynamic' },
  },
};


/**
 * Compute the mel bands spectrum from a given spectrum (`vector` type).
 * _Use the `htk` mel band style._
 *
 * @memberof module:operator
 *
 * @param {Object} options - Override default parameters.
 * @param {Boolean} [options.log=false] - Apply a logarithmic scale on the output.
 * @param {Number} [options.nbrFilters=24] - Number of filters defining the mel
 *  bands.
 * @param {Number} [options.minFreq=0] - Minimum frequency.
 * @param {Number} [options.maxFreq=null] - Maximum frequency, if null `maxFreq`
 *  is set to Nyquist frequency.
 * @param {Number} [options.power=1] - Apply a power scaling on each mel band.
 *
 * @todo - implement Slaney style mel bands
 *
 * @example
 * // todo
 */
class Mel extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const nbrBins = prevStreamParams.frameSize;
    const nbrFilters = this.params.get('nbrFilters');
    const sampleRate = this.streamParams.sourceSampleRate;
    const minFreq = this.params.get('minFreq');
    let maxFreq = this.params.get('maxFreq');

    //
    this.streamParams.frameSize = nbrFilters;
    this.streamParams.frameType = 'vector';
    this.streamParams.description = [];

    if (maxFreq === null)
      maxFreq = this.streamParams.sourceSampleRate / 2;

    this.melBandDescriptions = getMelBandWeights(nbrBins, nbrFilters, sampleRate, minFreq, maxFreq);

    this.propagateStreamParams();
  }

  // @todo
  // inputVector() {}

  /** @private */
  processVector(frame) {
    const power = this.params.get('power');
    const log = this.params.get('log');
    const spectrum = frame.data;
    const melBands = this.frame.data;
    const nbrBands = this.streamParams.frameSize;
    let scale = 1;

    const minLogValue = 1e-48;
    const minLog = -480;

    if (log)
      scale *= nbrBands;

    for (let i = 0; i < nbrBands; i++) {
      const { startIndex, weights } = this.melBandDescriptions[i];
      let value = 0;

      for (let j = 0; j < weights.length; j++)
        value += weights[j] * spectrum[startIndex + j];

      // apply same logic as in PiPoBands
      if (scale !== 1)
        value *= scale;

      if (log) {
        if (value > minLogValue)
          value = 10 * log10(value);
        else
          value = minLog;
      }

      if (power !== 1) // allow to
        value = pow(value, power);

      // console.log(raw, value);
      melBands[i] = value;
    }
  }
}

export default Mel;
