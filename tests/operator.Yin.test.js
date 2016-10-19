import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import Yin from '../src/operator/_Yin1';
import Bridge from '../src/sink/Bridge';


tape('Yin', (t) => {
  const tolerance = 7e-3;
  const compareFile = './data/pipo-yin.txt';
  const audioFile = './audio/gould-bach-first-prelude-15sec.wav';

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
  t.comment(`tolerance: ${tolerance}`);

  const asset = av.Asset.fromFile(path.join(__dirname, audioFile));
  asset.on('error', (err) => console.log(err.stack));

  asset.decodeToBuffer((buffer) => {
    // create a load compare file function
    const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));
    const len = expectedFrames.length;
    const results = [];

    // mimic web audio needed interface
    const audioBuffer = {
      sampleRate: asset.format.sampleRate,
      getChannelData: () => buffer,
    };

    const source = new AudioInBuffer({
      audioBuffer: audioBuffer,
      useWorker: false,
    });

    const slicer = new Slicer({
      frameSize: 2048,
      hopSize: 2048,
    });

    const yin = new Yin({
      threshold: 0.1,
      // downSamplingExp: 2,
    });

    let counter = 0;

    const bridge = new Bridge({
      callback: (frame) => {
        results.push(frame.data);
        counter++;

        if (counter === len)
          compareResults();
      },
    });

    source.connect(slicer);
    slicer.connect(yin);
    yin.connect(bridge);

    source.start();

    function compareResults() {
      // @todo - test each column in a loop

      // pitch
      let sum = 0;

      for (let i = 0; i < len; i++) {
        console.log(expectedFrames[i][0], results[i][0]);
        const diff = results[i][0] - expectedFrames[i][0];
        sum += diff * diff;
      }

      const mean = sum / len;
      const rmse = Math.sqrt(mean);

      t.comment(`pitch error: ${rmse}`);
    }
  });

});

