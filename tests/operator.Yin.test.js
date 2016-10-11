import av from 'av';
import path from 'path';
import fs from 'fs';
import util from 'util';

import AudioInBuffer from '../src/source/AudioInBuffer';
import Slicer from '../src/operator/Slicer';
import Yin from '../src/operator/Yin';
import Logger from '../src/sink/Logger';


const files = [
  './assets/cosine-172.265625-44.1kHz-1sec.wav',
  './assets/sine-172.265625-44.1kHz-1sec.wav',
  './assets/sine-344.53125-44.1kHz-1sec.wav',
  './assets/sawtooth-440-44.1kHz-1s.wav',
  './assets/human-voice.wav',
  './assets/cherokee.wav',
];

const asset = av.Asset.fromFile(path.join(__dirname, files[5]));
asset.on('error', (err) => console.log(err.stack));

asset.decodeToBuffer((buffer) => {

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
  });

  const yin = new Yin();

  const logFile = fs.createWriteStream(path.join(__dirname, './tmp/log-yin'));
  const logger = new Logger({ data: true });
  logger.processFrame = (function(frame) {
    const str = util.format('%s\n', frame.data);
    // let str = '';
    // frame.data.forEach((value) => str += value + '\n');

    logFile.write(str);
  }).bind(logger);

  source.connect(slicer);
  slicer.connect(yin);
  yin.connect(logger);

  source.start();
});
