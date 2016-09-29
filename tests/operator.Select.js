import Select from '../src/operator/Select';
import EventIn from '../src/source/EventIn';
import Asserter from './Asserter';
import tape from 'tape';

tape('Select', (t) => {

  let select;
  let eventIn = new EventIn({
    frameSize: 3,
    frameType: 'vector',
  });

  eventIn.start();

  select = new Select({ index: 4 });
  t.throws(() => eventIn.connect(select), 'should throw if index too large');

  eventIn.disconnect(select);

  select = new Select({ indices: [0, 4] });
  t.throws(() => eventIn.connect(select), 'should throw if index too large');

  eventIn.disconnect(select);

  const asserter = new Asserter(t);

  select = new Select({ index: 1 });
  const actual1 = { time: 0, data: [0, 1, 2], metadata: null };
  const expected1 = { time: 0, data: [1], metadata: null };

  eventIn.connect(select);
  select.connect(asserter);

  asserter.setExpectedFrame(expected1);
  eventIn.processFrame(actual1);

  eventIn.disconnect(select);
  select.disconnect(asserter);

  select = new Select({ indices: [0, 2] });
  const actual2 = { time: 0, data: [4, 5, 6], metadata: null };
  const expected2 = { time: 0, data: [4, 6], metadata: null };

  eventIn.connect(select);
  select.connect(asserter);

  asserter.setExpectedFrame(expected2);
  eventIn.processFrame(actual2);

  t.end();
});
