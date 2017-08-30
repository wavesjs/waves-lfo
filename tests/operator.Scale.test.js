import Scale from '../src/common/operator/Scale';
import tape from 'tape';

tape('Scale', t => {

  const scale = new Scale({
    inputMin: 0,
    inputMax: 1,
    outputMin: 1,
    outputMax: 2,
  });

  scale.processStreamParams({ frameSize: 4 });

  const a = scale.inputVector([-1, 0, 1, 2]);
  t.looseEqual([0, 1, 2, 3], a, 'should scale vector properly');

  const b = scale.inputSignal([-1, 0, 1, 2]);
  t.looseEqual([0, 1, 2, 3], b, 'should scale signal properly');


  scale.params.set('outputMin', 0);
  scale.params.set('outputMax', 2);

  const c = scale.inputVector([-1, 0, 1, 2]);
  t.looseEqual([-2, 0, 2, 4], c, 'should scale vector properly');

  const d = scale.inputSignal([-1, 0, 1, 2]);
  t.looseEqual([-2, 0, 2, 4], d, 'should scale signal properly');

  t.end();
});
