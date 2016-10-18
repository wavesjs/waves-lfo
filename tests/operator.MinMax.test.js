import Asserter from './utils/Asserter';
import MinMax from '../src/operator/MinMax';
import EventIn from '../src/source/EventIn';
import tape from 'tape';

tape('MinMax', (t) => {

  t.comment('processSignal');

  const eventIn = new EventIn({
    frameSize: 512,
    frameType: 'signal',
    sampleRate: 0,
    absoluteTime: true,
  });

  const minMax = new MinMax();
  const asserter = new Asserter(t);

  eventIn.connect(minMax);
  minMax.connect(asserter);

  // prepare test frame and expected frame
  const signal = new Float32Array(512);

  for (let i = 0; i < 512; i++)
    signal[i] = Math.random();

  const frame = {
    time: Math.random(),
    data: signal,
    metadata: { a: 'a' },
  };

  const expected = {
    time: frame.time,
    data: [Math.min.apply(null, signal), Math.max.apply(null, signal)],
    metadata: frame.metadata,
  };

  asserter.setExpectedFrames([expected]);

  eventIn.start();
  eventIn.processFrame(frame);

  t.comment('inputSignal');

  const input = new Float32Array(512);

  for (let i = 0; i < 512; i++)
    input[i] = Math.random();

  const output = minMax.inputSignal(input);

  t.deepEqual(output[0], Math.min.apply(null, input), 'should have proper min');
  t.deepEqual(output[1], Math.max.apply(null, input), 'should have proper max');

  t.end();
});






