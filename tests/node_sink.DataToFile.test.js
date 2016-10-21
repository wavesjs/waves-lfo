import path from 'path';
import EventIn from '../src/common/source/EventIn';
import Logger from '../src/common/sink/Logger';
import DataToFile from '../src/node/sink/DataToFile';


['txt', 'csv', 'json'].forEach((format) => {
  const eventIn = new EventIn({
    frameSize: 2,
    frameRate: 1,
    frameType: 'vector',
  });

  const dataToFile = new DataToFile({
    filename: path.join(__dirname, './node_sink.DataToFile.test.' + format),
    format: format,
  });

  const logger = new Logger({
    data: true,
  });

  eventIn.connect(logger);
  eventIn.connect(dataToFile);
  eventIn.start();

  let time = 0;
  const period = 1;

  (function loop(){
    const data = [Math.random(), Math.random()];
    eventIn.process(time, data);

    time += period;

    if (time < 20)
      setTimeout(loop, 300);
    else
      eventIn.stop();
  }());
});
