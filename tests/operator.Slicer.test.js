import Slicer from '../src/common/operator/Slicer';
import EventIn from '../src/common/source/EventIn';
import Logger from '../src/common/sink/Logger';
import Asserter from './utils/Asserter';
import tape from 'tape';

tape('Slicer (frameSize === hopSize)', (t) => {
  const signal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const expectedFrames = [
    { time: 0, data: [0, 1] },
    { time: 1, data: [2, 3] },
    { time: 2, data: [4, 5] },
    { time: 3, data: [6, 7] },
    { time: 4, data: [8, 9] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 10,
    sampleRate: 2,
  });

  // as hopSize is not defined stream is reinitialized on first frame
  const slicer = new Slicer({
    frameSize: 2,
    // hopSize: 2,
  });

  const logger = new Logger({ data: true });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  // eventIn.connect(logger);
  slicer.connect(asserter);

  eventIn.start();
  eventIn.process(0, signal);

  t.end();
});

tape('Slicer (frameSize > hopSize)', (t) => {
  const signal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const expectedFrames = [
    { time: 0, data: [0, 1, 2, 3] },
    { time: 1, data: [2, 3, 4, 5] },
    { time: 2, data: [4, 5, 6, 7] },
    { time: 3, data: [6, 7, 8, 9] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 10,
    sampleRate: 2,
  });

  const slicer = new Slicer({
    frameSize: 4,
    hopSize: 2
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  eventIn.process(0, signal);

  t.end();
});

tape('Slicer (frameSize < hopSize)', (t) => {
  const signal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const expectedFrames = [
    { time: 0, data: [0] },
    { time: 1, data: [2] },
    { time: 2, data: [4] },
    { time: 3, data: [6] },
    { time: 4, data: [8] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 10,
    sampleRate: 2,
  });

  const slicer = new Slicer({
    frameSize: 1,
    hopSize: 2
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  eventIn.process(0, signal);

  t.end();
});

tape('Slicer (frameSize > hopSize)', (t) => {
  const blocks = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]];

  const expectedFrames = [
    { time: 0, data: [0, 1, 2, 3] },
    { time: 0.4, data: [2, 3, 4, 5] },
    { time: 0.8, data: [4, 5, 6, 7] },
    { time: 1.2, data: [6, 7, 8, 9] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 5,
    // as we use the block index to define time, each block must be 1 sec
    sampleRate: 5,
  });

  const slicer = new Slicer({
    frameSize: 4,
    hopSize: 2,
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  blocks.forEach((signal, index) => eventIn.process(index, signal));

  t.end();
});

tape('Slicer (frameSize < hopSize)', (t) => {
  const blocks = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]];

  const expectedFrames = [
    { time: 0, data: [0] },
    { time: 0.4, data: [2] },
    { time: 0.8, data: [4] },
    { time: 1.2, data: [6] },
    { time: 1.6, data: [8] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 5,
    // as we use the block index to define time, each block must be 1 sec
    sampleRate: 5,
  });

  const slicer = new Slicer({
    frameSize: 1,
    hopSize: 2,
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  blocks.forEach((signal, index) => eventIn.process(index, signal));

  t.end();
});

tape('Slicer (frameSize < hopSize)', (t) => {
  const blocks = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11]];

  const expectedFrames = [
    { time: 0, data: [0] },
    { time: 2 * 1/6, data: [2] },
    { time: 4 * 1/6, data: [4] },
    { time: 6 * 1/6, data: [6] },
    { time: 8 * 1/6, data: [8] },
    { time: 10 * 1/6, data: [10] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 6,
    // as we use the block index to define time, each block must be 1 sec
    sampleRate: 6,
  });

  const slicer = new Slicer({
    frameSize: 1,
    hopSize: 2,
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  blocks.forEach((signal, index) => eventIn.process(index, signal));

  t.end();
});

tape('Slicer (inputFrameSize < frameSize)', (t) => {
  const blocks = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]];

  const expectedFrames = [
    { time: 0, data: [0, 1, 2, 3, 4, 5] },
    { time: 2, data: [6, 7, 8, 9, 10, 11] },
  ];

  const eventIn = new EventIn({
    frameType: 'signal',
    frameSize: 3,
    sampleRate: 3,
  });

  const slicer = new Slicer({
    frameSize: 6,
    hopSize: 6,
  });

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expectedFrames);

  eventIn.connect(slicer);
  slicer.connect(asserter);

  eventIn.start();
  blocks.forEach((signal, index) => eventIn.process(index, signal));

  t.end();
});


