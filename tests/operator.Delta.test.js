import Delta from '../src/common/operator/Delta';
import tape from 'tape';

tape('Delta', t => {

  t.comment('inputVector');

  const delta = new Delta({ order: 3 });
  delta.processStreamParams({
    frameSize: 2,
    frameRate: 2,
  });

  const res0 = delta.inputVector([0, 2]);
  t.looseEqual([0, 0], res0, 'should return 0 before the buffer is filled');
  const res1 = delta.inputVector([0.5, 1]);
  t.looseEqual([0, 0], res1, 'should return 0 before the buffer is filled');
  const res2 = delta.inputVector([1, 0]);
  t.looseEqual([1, -2], res2, 'should compute slope properly');

  t.end();
});
