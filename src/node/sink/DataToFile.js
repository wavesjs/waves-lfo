import BaseLfo from '../../core/BaseLfo';
import fse from 'fs-extra';
import fs from 'fs';
import util from 'util';

const definitions = {
  filename: {
    type: 'string',
    default: null,
    constant: true,
  },
  format: {
    type: 'enum',
    default: 'txt',
    list: ['txt', 'json', 'csv'],
  },
  // header: {
  //   type: 'boolean',
  //   default: false,
  // },
};


/**
 * Record input frames into a file.
 *
 * @param {Object} options - Override default parameters.
 * @param {String} [options.filename=null] - Path of the output file.
 * @param {String} [options.format='txt'] - Format in which the data should
 *  be stored. Available options: 'txt', 'json' or 'csv'.
 *
 * @memberof module:node.sink
 *
 * @todo - add an option to store the `streamParams`
 *
 * @example
 * import path from 'path';
 * import EventIn from '../src/common/source/EventIn';
 * import Logger from '../src/common/sink/Logger';
 * import DataToFile from '../src/node/sink/DataToFile';
 *
 * const eventIn = new EventIn({
 *   frameSize: 2,
 *   frameRate: 1,
 *   frameType: 'vector',
 * });
 *
 * const dataToFile = new DataToFile({
 *   filename: path.join(__dirname, './node_sink.DataToFile.test.json'),
 *   format: 'json',
 * });
 *
 * const logger = new Logger({
 *   data: true,
 * });
 *
 * eventIn.connect(logger);
 * eventIn.connect(dataToFile);
 * eventIn.start();
 *
 * let time = 0;
 * const period = 1;
 *
 * (function loop(){
 *   const data = [Math.random(), Math.random()];
 *   eventIn.process(time, data);
 *
 *   time += period;
 *
 *   if (time < 20)
 *     setTimeout(loop, 300);
 *   else
 *     eventIn.stop();
 * }());
 */
class DataToFile extends BaseLfo {
  constructor(options = {}) {
    super(definitions, options);

    this.firstRow = true;
  }

  /** @private */
  processStreamParams(prevStreamParams) {
    this.prepareStreamParams(prevStreamParams);

    const filename = this.params.get('filename');
    this.file = fs.createWriteStream(filename);

    const format = this.params.get('format');

    switch (format) {
      case 'txt':
        break;
      case 'json':
        this.file.write('[\n');
        break;
      case 'csv':
        const { description, frameSize } = this.streamParams;

        let header = 'time';

        if (description !== null && description.length) {
          header += ',' + description.join(',');
        } else {
          for (let i = 0; i < frameSize; i++)
            header += ',row-' + i;
        }

        header += '\n';

        this.file.write(header);
        break;
    }
  }

  /** @private */
  finalizeStream(endTime) {
    const format = this.params.get('format');

    switch (format) {
      case 'txt':
        break;
      case 'json':
        this.file.write('\n]');
        break;
        case 'csv':
        // this.file.write(endTime.toString());
        break;
    }
  }

  // process any kind of stream
  /** @private */
  processSignal() {}
  /** @private */
  processVector() {}
  /** @private */
  processScalar() {}

  /** @private */
  processFrame(frame) {
    const format = this.params.get('format');
    let str;

    switch (format) {
      case 'txt':
        str = util.format('%s\n', frame.data);
        break;
      case 'json':
        frame.data = Array.from(frame.data);
        str = JSON.stringify(frame);

        if (!this.firstRow)
          str = ',\n' + str;

        this.firstRow = false;
        break;
      case 'csv':
        str = frame.time + ',';
        str += util.format('%s\n', frame.data);
        break;
    }

    this.file.write(str);
  }
}

export default DataToFile;
