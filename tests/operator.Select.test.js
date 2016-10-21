import Select from '../src/common/operator/Select';
import EventIn from '../src/common/source/EventIn';
import Asserter from './utils/Asserter';
import tape from 'tape';

tape('Select', (t) => {

  let select;
  let asserter;
  let eventIn = new EventIn({
    frameSize: 3,
    frameType: 'vector',
    frameRate: 0,
  });

  eventIn.start();
  t.comment('check given indices');

  select = new Select({ index: 4 });
  t.throws(() => eventIn.connect(select), 'should throw if index too large');

  eventIn.disconnect(select);

  select = new Select({ indices: [0, 4] });
  t.throws(() => eventIn.connect(select), 'should throw if index too large');

  eventIn.disconnect(select);

  t.comment('select index');
  asserter = new Asserter(t);
  select = new Select({ index: 1 });
  const actual1 = { time: 0, data: [0, 1, 2], metadata: null };
  const expected1 = { time: 0, data: [1], metadata: null };

  eventIn.connect(select);
  select.connect(asserter);

  asserter.setExpectedFrames([expected1]);
  eventIn.processFrame(actual1);

  eventIn.disconnect(select);
  select.disconnect(asserter);

  t.comment('select indices');
  asserter = new Asserter(t);
  select = new Select({ indices: [0, 2] });
  const actual2 = { time: 0, data: [4, 5, 6], metadata: null };
  const expected2 = { time: 0, data: [4, 6], metadata: null };

  eventIn.connect(select);
  select.connect(asserter);

  asserter.setExpectedFrames([expected2]);
  eventIn.processFrame(actual2);

  t.end();
});
