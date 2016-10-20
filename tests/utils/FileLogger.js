import BaseLfo from '../../src/core/BaseLfo';
import path from 'path';
import fs from 'fs';
import util from 'util';

const definitions = {
  filename: {
    type: 'string',
    default: 'file-logger.txt',
  },
};

class FileLogger extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    const filename = path.join(this.params.get('filename'));
    this.file = fs.createWriteStream(filename);
  }

  processSignal() {}
  processVector() {}
  processScalar() {}

  processFrame(frame) {
    const str = util.format('%s\n', frame.data);
    this.file.write(str);
  }
}

export default FileLogger;

