import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import DCT from '../src/operator/DCT';
import RMSE from './utils/RMSE';

tape('DCT', (t) => {
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

  const compareFile = './data/pipo-dct.txt';
  const audioFile = './audio/sine-172.265625-44.1kHz-1sec.wav';

  const asset = av.Asset.fromFile(path.join(__dirname, audioFile));
  asset.on('error', (err) => console.log(err.stack));

  asset.decodeToBuffer((buffer) => {
    // create a load compare file function
    const expectedFrames = utils.loadPiPoOutput(path.join(__dirname, compareFile));

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
      frameSize: 512,
      hopSize: 512,
    });

    const dct = new DCT({
      order: 12,
    });

    const rmse = new RMSE({
      expectedFrames: expectedFrames,
      asserter: t,
      tolerance: 1e-5,
    });

    source.connect(slicer);
    slicer.connect(dct);
    dct.connect(rmse);

    source.start();
  });
});
