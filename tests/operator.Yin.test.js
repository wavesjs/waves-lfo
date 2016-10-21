import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInFile from '../src/node/source/AudioInFile';
import Slicer from '../src/common/operator/Slicer';
import Yin from '../src/common/operator/Yin';
import Bridge from '../src/common/sink/Bridge';
import DataToFile from '../src/node/sink/DataToFile';


tape('Yin', (t) => {
  const tolerance = 7e-3;
  const compareFile = './data/pipo-yin.txt';
  const audioFile = './audio/piano-scale-c-major.wav';

  t.comment(`compare against "${compareFile}"`);
  t.comment(`cf max patch "./data/pipo-yin.maxpat"`);
  t.comment(`with file "${audioFile}"`);
  t.comment('configuration:');
  t.comment('- slice.size: 2048');
  t.comment('- slice.hop: 2048');
  t.comment('- slice.wind: none');
  t.comment('- slice.norm: none');
  t.comment('- yin.downsamplingExp: 2');
  t.comment('- yin.threshold: 0.1');
  // t.comment(`tolerance: ${tolerance}`);

  // create a load compare file function
  const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));
  const frameSize = 2048;
  const results = [];

  const audioInFile = new AudioInFile({
    filename: path.join(__dirname, audioFile),
    frameSize: frameSize,
  });

  const slicer = new Slicer({
    frameSize: frameSize,
    hopSize: frameSize,
  });

  const yin = new Yin({
    threshold: 0.1,
    downSamplingExp: 2,
  });

  let counter = 0;

  const bridge = new Bridge({
    processFrame: (frame) => results.push(frame.data),
    finalizeStream: (endTime) => compareResults(),
  });

  const dataToFile = new DataToFile({
    filename: path.join(__dirname, './data/lfo-yin.json'),
    format: 'json',
  });

  audioInFile.connect(slicer);
  slicer.connect(yin);
  yin.connect(bridge);
  yin.connect(dataToFile);

  audioInFile.start();

  function compareResults() {
    let sum = 0;
    let len = 0;

    console.log('expected length:', expectedFrames.length);
    console.log('results length:', results.length);

    for (let i = 0; i < expectedFrames.length; i++) {
      console.log(expectedFrames[i][0], results[i]);

      // don't compare when pitch not found
      // if (results[i] !== -1) {
      //   const diff = results[i][0] - expectedFrames[i][0];
      //   sum += diff * diff;
      //   len += 1;
      // }
    }

    // const mean = sum / len;
    // const rmse = Math.sqrt(mean);
    // t.comment(`pitch error: ${rmse}`);
    t.end();
  }
});

