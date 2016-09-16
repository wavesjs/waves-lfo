import EventIn from '../src/sources/event-in';
import ZeroCrossing from '../src/operators/zero-crossing';
import Logger from '../src/sinks/logger';


const sourceSampleRate = 24000;
const frameSize = 128;
const framePeriod = frameSize / sourceSampleRate;
const freq = 507;
let currentTime = 0;

const eventIn = new EventIn({
  inputType: 'block',
  frameSize,
  sourceSampleRate,
});

const zrc = new ZeroCrossing({
  order: 100, // does it make sens
});

const logger = new Logger({
  metadata: false,
  time: false,
  outFrame: true,
});

eventIn.connect(zrc);
zrc.connect(logger);
eventIn.start();

const buffer = new Float32Array(frameSize);

for (let i = 0; i < sourceSampleRate * 10; i++) {
  const currentIndex = i % frameSize;
  const t = i / sourceSampleRate;

  const sample = Math.sin(t * freq * 2 * Math.PI);
  buffer[currentIndex] = sample;

  if (currentIndex === frameSize - 1)
    eventIn.process(t, buffer);
}


