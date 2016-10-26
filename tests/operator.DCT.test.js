import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInFile from '../src/node/source/AudioInFile';
import Slicer from '../src/common/operator/Slicer';
import Dct from '../src/common/operator/Dct';
import Rmse from './utils/Rmse';

tape('Dct', (t) => {
  const tolerance = 1e-5;

  t.comment('compare against "./data/pipo-dct.txt"');
  t.comment('cf max patch "./data/pipo-dct.maxpat"');
  t.comment('with file "./audio/sine-172.265625-44.1kHz-1sec.wav"');
  t.comment('configuration:');
  t.comment('- slice.size: 512');
  t.comment('- slice.hop: 512');
  t.comment('- slice.norm: none');
  t.comment('- slice.wind: none');
  t.comment('- dct.order: 12');
  t.comment('- dct.weighting: htk');
  t.comment(`tolerance: ${tolerance}`);

  const compareFile = './data/pipo-dct.txt';
  const audioFile = './audio/sine-172.265625-44.1kHz-1sec.wav';
  const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));

  const audioInFile = new AudioInFile({
    filename: path.join(__dirname, audioFile),
    frameSize: 512,
  });

  const slicer = new Slicer({
    frameSize: 512,
    hopSize: 512,
  });

  const dct = new Dct({
    order: 12,
  });

  const rmse = new Rmse({
    expectedFrames: expectedFrames,
    asserter: t,
    tolerance: tolerance,
  });

  audioInFile.connect(slicer);
  slicer.connect(dct);
  dct.connect(rmse);

  audioInFile.start();
});
