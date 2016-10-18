import Toggle from '../src/operator/Toggle';
import EventIn from '../src/source/EventIn';
import Asserter from './utils/Asserter';
import tape from 'tape';

tape('Toggle', (t) => {
  const frames = [
    { time: 0, data: [1, 2] },
    { time: 1, data: [3, 4] },
    { time: 2, data: [5, 6] },
  ];

  const expected = [
    { time: 0, data: [1, 2] },
    { time: 2, data: [5, 6] },
  ];

  const eventIn = new EventIn({
    frameSize: 2,
    frameRate: 0,
    frameType: 'vector',
  });

  const toggle = new Toggle();

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expected);

  eventIn.connect(toggle);
  toggle.connect(asserter);

  eventIn.start();

  // propagate to asserter
  eventIn.processFrame(frames[0]);

  // asserter bypassed
  toggle.setState('off');
  eventIn.processFrame(frames[1]);

  // subgraph reopened
  toggle.setState('on');
  eventIn.processFrame(frames[2]);

  t.end();
});
