import Power from '../src/common/operator/Power';
import tape from 'tape';

tape('Power', t => {

  const power = new Power({
    exponent: 2,
  });

  power.processStreamParams({ frameSize: 4 });

  const a = power.inputVector([-1, 0, 1, 2]);
  t.looseEqual([1, 0, 1, 4], a, 'should rise vector at given exponent power');

  const b = power.inputSignal([-1, 0, 1, 2]);
  t.looseEqual([1, 0, 1, 4], b, 'should rise signal at given exponent power');


  power.params.set('exponent', 0.5);

  const c = power.inputVector([9, 0, 1, 4]);
  t.looseEqual([3, 0, 1, 2], c, 'should rise vector at given exponent power');

  const d = power.inputSignal([9, 0, 1, 4]);
  t.looseEqual([3, 0, 1, 2], d, 'should rise signal at given exponent power');

  t.end();
});
