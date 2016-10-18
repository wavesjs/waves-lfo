import av from 'av';
import path from 'path';
import tape from 'tape';
import * as utils from './utils/utils';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import FFT from '../src/operator/FFT';
import RMSE from './utils/RMSE';

tape('FFT', (t) => {
  const tolerance = 1e-5;

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
      frameSize: 1024,
      hopSize: 512,
    });

    const fft = new FFT({
      size: 1024,
      window: 'hann',
      mode: 'magnitude',
      norm: 'linear',
    });

    const rmse = new RMSE({
      expectedFrames: expectedFrames,
      asserter: t,
      tolerance: tolerance,
    });

    source.connect(slicer);
    slicer.connect(fft);
    fft.connect(rmse);

    source.start();
  });
});

