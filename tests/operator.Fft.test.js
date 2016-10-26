import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInFile from '../src/node/source/AudioInFile';
import Slicer from '../src/common/operator/Slicer';
import Fft from '../src/common/operator/Fft';
import Rmse from './utils/Rmse';

tape('Fft', (t) => {
  const tolerance = 3e-5;

  t.comment('compare against "./data/pipo-fft.txt"');
  t.comment('cf max patch "./data/pipo-fft.maxpat"');
  t.comment('with file "./audio/cherokee.wav"');
  t.comment('configuration:');
  t.comment('- slice.size: 1024');
  t.comment('- slice.hop: 512');
  t.comment('- slice.wind: hann');
  t.comment('- slice.norm: linear');
  t.comment('- fft.size: 1024');
  t.comment('- fft.mode: magnitude');
  t.comment('- fft.norm: true');
  t.comment('- fft.weighting: none');
  t.comment(`tolerance: ${tolerance}`);

  const compareFile = './data/pipo-fft.txt';
  const audioFile = './audio/cherokee.wav';
  const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));

  const audioInFile = new AudioInFile({
    filename: path.join(__dirname, audioFile),
    frameSize: 512,
  });

  const slicer = new Slicer({
    frameSize: 1024,
    hopSize: 512,
  });

  const fft = new Fft({
    size: 1024,
    window: 'hann',
    mode: 'magnitude',
    norm: 'linear',
  });

  const rmse = new Rmse({
    expectedFrames: expectedFrames,
    asserter: t,
    tolerance: tolerance,
  });

  audioInFile.connect(slicer);
  slicer.connect(fft);
  fft.connect(rmse);

  audioInFile.start();
});
