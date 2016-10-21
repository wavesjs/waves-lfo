import OnOff from '../src/common/operator/OnOff';
import EventIn from '../src/common/source/EventIn';
import Asserter from './utils/Asserter';
import tape from 'tape';

tape('OnOff', (t) => {
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

  const onOff = new OnOff();

  const asserter = new Asserter(t);
  asserter.setExpectedFrames(expected);

  eventIn.connect(onOff);
  onOff.connect(asserter);

  eventIn.start();

  // propagate to asserter
  eventIn.processFrame(frames[0]);

  // asserter bypassed
  onOff.setState('off');
  eventIn.processFrame(frames[1]);

  // subgraph reopened
  onOff.setState('on');
  eventIn.processFrame(frames[2]);

  t.end();
});
