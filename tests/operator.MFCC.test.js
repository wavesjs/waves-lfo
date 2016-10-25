import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInFile from '../src/node/source/AudioInFile';
import Slicer from '../src/common/operator/Slicer';
import FFT from '../src/common/operator/FFT';
import Mel from '../src/common/operator/Mel';
import DCT from '../src/common/operator/DCT';
import MFCC from '../src/common/operator/MFCC';
import DataToFile from '../src/node/sink/DataToFile';
import RMSE from './utils/RMSE';

// notes on testing
// error between each frames while large is stable if we take all cepstrum bins
// => does it have something to do with the dct modification ?
// lokks like yes because if we drop the first bin results are far far better...

tape('MFCC Manual', (t) => {
  const tolerance = 5e-3;
  const compareFile = './data/pipo-mfcc.txt';
  const audioFile = './audio/cherokee.wav';
  const logFile = './data/lfo-mfcc.txt';

  t.comment(`compare against "${compareFile}"`);
  t.comment(`cf max patch "./data/pipo-mfcc.maxpat"`);
  t.comment(`with file "${audioFile}"`);
  t.comment('configuration:');
  t.comment('- slice.size: 256');
  t.comment('- slice.hop: 256');
  t.comment('- slice.wind: power');
  t.comment('- slice.norm: power');
  t.comment('- fft.norm: 1');
  t.comment('- fft.weighting: none');
  t.comment('- bands.mode: htkmel');
  t.comment('- bands.num: 24');
  t.comment('- bands.log: true');
  t.comment('- bands.eqlmode: none');
  t.comment('- bands.power: 1');
  t.comment('- dct.order: 12');
  t.comment('- dct.weighting: htk');
  t.comment(`tolerance: ${tolerance}`);

  const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));
  const len = expectedFrames.length;
  const results = [];

  const audioInFile = new AudioInFile({
    filename: path.join(__dirname, audioFile),
    frameSize: 512,
  });

  const slicer = new Slicer({
    frameSize: 256,
    // hopSize: 512,
  });

  const fft = new FFT({
    mode: 'power',
    window: 'hann',
    norm: 'power',
    size: 256,
  });

  const mel = new Mel({
    nbrBands: 24,
    log: true,
    power: 1,
    minFreq: 0,
  });

  const dct = new DCT({
    order: 12,
  });

  const rmse = new RMSE({
    asserter: t,
    expectedFrames: expectedFrames,
    tolerance: 2,
    startIndex: 1, // ignore first value as dct is different than pipo here
  });

  const dataToFile = new DataToFile({
    filename: path.join(__dirname, logFile),
  });

  audioInFile.connect(slicer);
  slicer.connect(fft);
  fft.connect(mel);
  mel.connect(dct);

  dct.connect(rmse);
  dct.connect(dataToFile);

  audioInFile.start();
});


tape('MFCC Packed', (t) => {
  const tolerance = 5e-3;
  const compareFile = './data/pipo-mfcc.txt';
  const audioFile = './audio/cherokee.wav';
  const logFile = './data/lfo-mfcc-packed.txt';

  t.comment(`compare against "${compareFile}"`);
  t.comment(`cf max patch "./data/pipo-mfcc.maxpat"`);
  t.comment(`with file "${audioFile}"`);
  t.comment('configuration:');
  t.comment('- slice.size: 256');
  t.comment('- slice.hop: 256');
  t.comment('- slice.wind: power');
  t.comment('- slice.norm: power');
  t.comment('- fft.norm: 1');
  t.comment('- fft.weighting: none');
  t.comment('- bands.mode: htkmel');
  t.comment('- bands.num: 24');
  t.comment('- bands.log: true');
  t.comment('- bands.eqlmode: none');
  t.comment('- bands.power: 1');
  t.comment('- dct.order: 12');
  t.comment('- dct.weighting: htk');
  t.comment(`tolerance: ${tolerance}`);

  const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));
  const len = expectedFrames.length;
  const results = [];

  const audioInFile = new AudioInFile({
    filename: path.join(__dirname, audioFile),
    frameSize: 512,
  });

  const slicer = new Slicer({
    frameSize: 256,
    // hopSize: 512,
  });

  const mfcc = new MFCC({
    nbrBands: 24,
    nbrCoefs: 12,
  });

  const rmse = new RMSE({
    asserter: t,
    expectedFrames: expectedFrames,
    tolerance: 2,
    startIndex: 1, // ignore first value as dct is different than pipo here
  });

  const dataToFile = new DataToFile({
    filename: path.join(__dirname, logFile),
  });

  audioInFile.connect(slicer);
  slicer.connect(mfcc);

  mfcc.connect(rmse);
  mfcc.connect(dataToFile);

  audioInFile.start();
});
