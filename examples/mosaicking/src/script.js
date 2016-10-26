import * as lfo from 'waves-lfo/node';
import fs from 'fs';
import path from 'path';
import analyzer from './analyzer';
import config from '../config.json';

const nbrCoefs = 12;

const cwd = process.cwd();
const audioFile = path.join(cwd, 'assets/ligeti-artikulation.wav');
const outputFile = path.join(cwd, `assets/ligeti-artikulation-mfcc-${config.maxFreq}.json`);

const audioInFile = new lfo.source.AudioInFile({
  filename: audioFile,
});

analyzer.init(config, audioInFile)
analyzer.run()
  .then((frames) => {
    const file = fs.createWriteStream(outputFile);
    file.write('[\n');

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      frame.data = Array.from(frame.data);
      let str = JSON.stringify(frame);

      if (i < frames.length - 1)
        str += ',\n';

      file.write(str);
    }

    file.write('\n]');
  })
  .catch((err) => console.error(err.stack));
