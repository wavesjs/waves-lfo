import MovingAverage from '../src/operators/moving-average';
import tape from 'tape';

tape('MovingAverage', (t) => {

  const order = 7;
  const fill = 1;
  let expected;
  let values;
  let frameSize;

  const node = new MovingAverage({ order, fill });

  t.deepEqual(node.getParam('order'), order, 'should override default `order` value');
  t.deepEqual(node.getParam('fill'), fill, 'should override default `fill` value');

  frameSize = 1;
  node.initialize({ frameSize });
  node.reset();
  expected = new Float32Array(order);
  expected.fill(fill);

  t.deepLooseEqual(node.ringBuffer, expected, `should define ring buffer size according to order and frameSize filled with given default`);


  frameSize = 3;
  node.initialize({ frameSize });
  node.reset();
  expected = new Float32Array(order * frameSize);
  expected.fill(fill);

  t.deepLooseEqual(node.ringBuffer, expected, `should define ring buffer size according to order and frameSize filled with given default`);


  t.comment('scalar input');

  const sAvg = new MovingAverage({ order: 5, fill: 0 });
  sAvg.initialize({ frameSize: 1 });
  sAvg.reset();

  values = [1, 1, 1, 1, 1];
  expected = [1/5, 2/5, 3/5, 4/5, 1];

  for (let i = 0; i < values.length; i++) {
    const avg = sAvg.inputScalar(values[i]);
    t.deepEqual(avg, expected[i], 'should output a proper mean');
  }


  t.comment('array input');

  const aAvg = new MovingAverage({ order: 5, fill: 0 });
  aAvg.initialize({ frameSize: 2 });
  aAvg.reset();

  values = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
  expected = [[1/5, 1/5], [2/5, 2/5], [3/5, 3/5], [4/5, 4/5], [1, 1], ];

  for (let i = 0; i < values.length; i++) {
    const avg = aAvg.inputArray(values[i]);

    // ignore floating point errors introduced who knows why (Float32Array ?)...
    for (let j = 0; j < avg.length; j++)
      t.deepLooseEqual(avg[j].toFixed(2), expected[i][j], 'should output proper means');
  }


  t.comment('update order parameter');

  const updateOrder = new MovingAverage({ order: 3, fill: 0 });
  updateOrder.initialize({ frameSize: 1 });
  updateOrder.reset();
  updateOrder.setParam('order', 5);

  values = [1, 1, 1, 1, 1];
  expected = [1/5, 2/5, 3/5, 4/5, 1];

  for (let i = 0; i < values.length; i++) {
    const avg = updateOrder.inputScalar(values[i]);
    t.deepEqual(avg, expected[i], 'should output a proper mean');
  }

  t.comment('@todo - test `process`');

  t.end();
});
