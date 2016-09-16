import EventIn from '../src/sources/EventIn';
import Logger from '../src/sinks/Logger';

const eventIn = new EventIn({
  frameType: 'scalar',
});

const logger = new Logger({
  streamParams: true,
  frameTime: true,
  frameData: true,
});

eventIn.connect(logger);
eventIn.start();

let time = 0;

(function loop() {
  eventIn.processFrame(time, Math.random());
  time += 1;

  setTimeout(loop, 1000);
}());
