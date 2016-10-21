import EventIn from '../src/common/source/EventIn';
import Bridge from '../src/common/sink/Bridge';
import tape from 'tape';

tape('Bridge', (t) => {

  const frame0 = {
    time: 0,
    data: [0, 1],
    metadata: {},
  };

  const frame1 = {
    time: 1,
    data: [1, 2],
    metadata: {},
  };

  const eventIn = new EventIn({
    frameType: 'vector',
    frameSize: 2,
    frameRate: 1,
  });

  let index = 0;

  const bridge = new Bridge({
    processFrame: (frame) => {
      const expected = index === 0 ? frame0 : frame1;

      t.comment('push paradigm');
      t.deepEqual(frame.time, expected.time, 'should execute with proper time');
      t.looseEqual(frame.data, expected.data, 'should execute with proper data');
      t.equal(frame.data === expected.data, false, 'should be a copy data');
      t.deepEqual(frame.metadata, expected.metadata, 'should execute with proper metadata');

      index++;
    },
    finalizeStream: (endTime) => {
      t.comment('finalize');
      t.pass('Should call `finalizeStream`');
    }
  });

  eventIn.connect(bridge);
  eventIn.start();

  eventIn.processFrame(frame0);
  eventIn.processFrame(frame1);

  t.comment('pull paradigm');

  const expected = frame1;
  t.deepEqual(bridge.frame.time, expected.time, 'should execute with proper time');
  t.looseEqual(bridge.frame.data, expected.data, 'should execute with proper data');
  t.equal(bridge.frame.data === expected.data, false, 'should be a copy data');
  t.deepEqual(bridge.frame.metadata, expected.metadata, 'should execute with proper metadata');

  eventIn.stop();

  t.end();
});
