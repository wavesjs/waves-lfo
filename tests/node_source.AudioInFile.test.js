import path from 'path';
import tape from 'tape';

import AudioInFile from '../src/node/source/AudioInFile';
import Logger from '../src/common/sink/Logger';

tape('AudioInFile', (t) => {
  t.comment('implement proper test');
  t.comment('particularly with `channels`');

  const filename = path.join(__dirname, './audio/sine-172.265625-44.1kHz-1sec.wav');

  const audioInFile = new AudioInFile({
    filename: filename,
    frameSize: 512,
    // channel: 0,
  });

  const logger = new Logger({
    data: true,
  });

  audioInFile.connect(logger);
  audioInFile.start();

  t.end();
});
