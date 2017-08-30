import Clip from '../src/common/operator/Clip';
import tape from 'tape';

tape('Clip', t => {

  const clip = new Clip({ min: 0, max: 1 });
  clip.processStreamParams({
    frameSize: 4,
  });

  const res0 = clip.inputVector([-1, 0, 1, 2]);
  t.looseEqual([0, 0, 1, 1], res0, 'should clip vector properly');

  const res1 = clip.inputSignal([-1, 0, 1, 2]);
  t.looseEqual([0, 0, 1, 1], res1, 'should clip signal properly');

  t.end();
});
