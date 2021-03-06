import MovingAverage from '../src/common/operator/MovingAverage';
import tape from 'tape';

tape('MovingAverage', (t) => {

  const order = 7;
  const fill = 1;
  let expected;
  let values;
  let frameSize;

  const node = new MovingAverage({ order, fill });

  t.deepEqual(node.params.get('order'), order, 'should override default `order` value');
  t.deepEqual(node.params.get('fill'), fill, 'should override default `fill` value');

  frameSize = 1;
  node.processStreamParams({ frameSize });
  node.resetStream();
  expected = new Float32Array(order);
  expected.fill(fill);

  t.deepLooseEqual(node.ringBuffer, expected, `should define ring buffer size according to order and frameSize filled with given default`);


  frameSize = 3;
  node.processStreamParams({ frameSize });
  node.resetStream();
  expected = new Float32Array(order * frameSize);
  expected.fill(fill);

  t.deepLooseEqual(node.ringBuffer, expected, `should define ring buffer size according to order and frameSize filled with given default`);


  t.comment('#inputScalar');

  const isAvg = new MovingAverage({ order: 5, fill: 0 });
  isAvg.processStreamParams({ frameSize: 1 });
  isAvg.resetStream();

  values = [1, 1, 1, 1, 1];
  expected = [1/5, 2/5, 3/5, 4/5, 1];

  for (let i = 0; i < values.length; i++) {
    const avg = isAvg.inputScalar(values[i]);
    t.deepEqual(avg, expected[i], 'should output a proper mean');
  }

  t.comment('#processScalar');

  const psAvg = new MovingAverage({ order: 5, fill: 0 });
  psAvg.processStreamParams({ frameSize: 1 });
  psAvg.resetStream();

  values = [1, 1, 1, 1, 1];
  expected = [1/5, 2/5, 3/5, 4/5, 1];

  for (let i = 0; i < values.length; i++) {
    // create a frame as if comming from a previous node
    const frame = { data: [values[i]] };
    psAvg.processScalar(frame);
    // avoid floating point errors
    const avg = parseFloat(psAvg.frame.data[0].toFixed(6));

    t.deepEqual(avg, expected[i], 'should output a proper mean');
  }


  t.comment('array input');

  const aAvg = new MovingAverage({ order: 5, fill: 0 });
  aAvg.processStreamParams({ frameSize: 2 });
  aAvg.resetStream();

  values = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
  expected = [[1/5, 1/5], [2/5, 2/5], [3/5, 3/5], [4/5, 4/5], [1, 1], ];

  for (let i = 0; i < values.length; i++) {
    const avg = aAvg.inputVector(values[i]);

    // ignore floating point errors introduced who knows why (Float32Array ?)...
    for (let j = 0; j < avg.length; j++)
      t.deepLooseEqual(avg[j].toFixed(2), expected[i][j], 'should output proper means');
  }


  t.comment('update order parameter');

  const updateOrder = new MovingAverage({ order: 3, fill: 0 });
  updateOrder.processStreamParams({ frameSize: 1 });
  updateOrder.resetStream();
  updateOrder.params.set('order', 5);

  values = [1, 1, 1, 1, 1];
  expected = [1/5, 2/5, 3/5, 4/5, 1];

  for (let i = 0; i < values.length; i++) {
    const avg = updateOrder.inputScalar(values[i]);
    t.deepEqual(avg, expected[i], 'should output a proper mean');
  }

  t.end();
});
