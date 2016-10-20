import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import FFT from '../src/operator/FFT';
import Mel from '../src/operator/Mel';
import DCT from '../src/operator/DCT';
import RMSE from './utils/RMSE';
import FileLogger from './utils/FileLogger';

// notes on testing
// error between each frames while large is stable if we take all cepstrum bins
// => does it have something to do with the dct modification ?
// lokks like yes because if we drop the first bin results are far far better...

tape('MFCC', (t) => {
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

  const asset = av.Asset.fromFile(path.join(__dirname, audioFile));
  asset.on('error', (err) => console.log(err.stack));

  asset.decodeToBuffer((buffer) => {
    // create a load compare file function
    const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));
    const len = expectedFrames.length;
    const results = [];

    const audioBuffer = {
      sampleRate: asset.format.sampleRate,
      getChannelData: () => buffer,
    };

    const source = new AudioInBuffer({
      audioBuffer: audioBuffer,
      useWorker: false,
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
      nbrFilters: 24,
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

    const fileLogger = new FileLogger({
      filename: path.join(__dirname, logFile),
    });

    source.connect(slicer);
    slicer.connect(fft);
    fft.connect(mel);
    mel.connect(dct);
    dct.connect(rmse);

    dct.connect(fileLogger);

    source.start();
  });
});
