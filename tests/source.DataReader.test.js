import DataReader from '../src/common/source/DataReader';
import Logger from '../src/common/sink/Logger';
import fs from 'fs';

const source = require('./data/data-reader.json');


const dataReader = new DataReader({ source });
const logger = new Logger({
  data: true,
  time: false,
});

dataReader.connect(logger);

dataReader
  .init()
  .then(dataReader.start)
  .catch(err => console.error(err.stack));
