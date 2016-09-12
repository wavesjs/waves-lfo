import MovingMedian from '../src/operators/moving-median';
import tape from 'tape';

tape('MovingMedian', (t) => {

  const order = 7;
  const fill = 1;
  let expected;
  let values;
  let frameSize;

  const node = new MovingMedian({ order, fill });

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

  t.throws(() => new MovingMedian({ order: 4 }), 'should throw error if order is even');


  t.comment('scalar input');

  const sMedian = new MovingMedian({ order: 5, fill: 0 });
  sMedian.initialize({ frameSize: 1 });
  sMedian.reset();

  values = [1, 2, 3, 4, 5];
  expected = [0, 0, 1, 2, 3];

  for (let i = 0; i < values.length; i++) {
    const median = sMedian.inputScalar(values[i]);
    t.deepEqual(median, expected[i], 'should output a proper mean');
  }


  t.comment('array input (simple test)');

  const aMedian = new MovingMedian({ order: 3, fill: 0 });
  aMedian.initialize({ frameSize: 2 });
  aMedian.reset();

  values = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]];
  expected = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]];

  for (let i = 0; i < values.length; i++) {
    const median = aMedian.inputArray(values[i]);
    t.deepLooseEqual(median, expected[i], 'should output proper means');
  }

  t.comment('array input (brut force)');

  const fillValue = 0.24;
  const fMedian = new MovingMedian({ order: 5, fill: fillValue });
  fMedian.initialize({ frameSize: 2 });
  fMedian.reset();

  const stream0 = [];
  const stream1 = [];

  for (let i = 0; i < 5; i++) {
    stream0.push(fillValue);
    stream1.push(fillValue);
  }

  let error = false;

  for (let i = 0; i < 1000; i++) {
    const sample0 = Math.random();
    const sample1 = Math.random();
    // naive ring buffer
    stream0.shift();
    stream1.shift();

    stream0.push(sample0);
    stream1.push(sample1);

    // console.log(stream0);

    const copy0 = stream0.slice(0);
    const copy1 = stream1.slice(0);

    // naive sort
    copy0.sort((a, b) => a - b);
    copy1.sort((a, b) => a - b);

    // handle floating point errors ()
    const median0 = Math.round(copy0[2] * 1e3) / 1e3;
    const median1 = Math.round(copy1[2] * 1e3) / 1e3;

    const result = fMedian.inputArray([sample0, sample1]);

    const res0 = Math.round(result[0] * 1e3) / 1e3;
    const res1 = Math.round(result[1] * 1e3) / 1e3;

    if (res0 !== median0) {
      error = true;
      console.log(res0, median0);
    }

    if (res1 !== median1) {
      error = true;
      // console.log(res1, median1);
    }
  }

  t.deepEqual(error, false, `should pass brut force test`);

  t.comment('update order parameter');

  const updateOrder = new MovingMedian({ order: 3, fill: 0 });
  updateOrder.initialize({ frameSize: 1 });
  updateOrder.reset();
  updateOrder.setParam('order', 5);

  values = [1, 2, 3, 4, 5];
  expected = [0, 0, 1, 2, 3];

  for (let i = 0; i < values.length; i++) {
    const median = updateOrder.inputScalar(values[i]);
    t.deepEqual(median, expected[i], 'should output a proper mean');
  }

  // t.comment('@todo - test `process`');

  t.end();
});
