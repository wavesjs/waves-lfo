
const min = Math.min;
const max = Math.max;

function hertzToMelHtk(freqHz) {
  return 2595 * Math.log10(1 + (freqHz / 700));
}

function melToHertzHtk(freqMel) {
  return 700 * (Math.pow(10, freqMel / 2595) - 1);
}

// [
//   {
//     startIndex: 0,
//     weights: [0, 0.1, 0.2, 0.1],
//   },
//   // ...
// ]
function getMelBandDescriptions(nbrBins, nbrFilters, sampleRate, minFreq, maxFreq, type = 'htk') {

  const hertzToMel = hertzToMelHtk;
  const melToHertz = melToHertzHtk;

  let minMel;
  let maxMel;

  if (type === 'htk') {
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
    for (let j = 0; j < nbrBins - 1; j++) {
      let hasContribution = false;
      const lowerSlopeContrib = (fftFreqs[j] - filterFreqs[i]) / (filterFreqs[i+1] - filterFreqs[i]);
      const upperSlopeContrib = (filterFreqs[i+2] - fftFreqs[j]) / (filterFreqs[i+2] - filterFreqs[i+1]);
      // lowerSlope and upper slope intersect at zero and with each other
      const contribution = max(0, min(lowerSlopeContrib, upperSlopeContrib));

      if (contribution > 0) {
        if (description.startIndex === null) {
          description.startIndex = j;
          description.centerFreq = filterFreqs[i+1];
        }

        description.weights.push(contribution);
        hasContribution = true;

      // break early if already contributed
      } else if (contribution === 0 && hasContribution) {
        break;
      }
    }

    // empty filter
    if (description.startIndex === null)
      description.startIndex = 0;

    // @todo - do some scaling for Slaney-style mel

    // @todo - define what to do with that:
    /* Make sure that 2nd half of FFT is zero */
    /* (We process only the middle, not the upper part) */
    /* Seems like a good idea to avoid aliasing */
    // j = spectrum_size-1;
    // for(i=0; i<filters_number; i++)
    // {
    //   weights_matrix[i*spectrum_size+j] = 0.;
    // }
    // ret = 1;
    melBandDescriptions[i] = description;
  }

  return melBandDescriptions;
}


export default getMelBandDescriptions;
