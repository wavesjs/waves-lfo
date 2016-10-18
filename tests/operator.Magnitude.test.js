import Magnitude from '../src/operator/Magnitude';
import tape from 'tape';

tape('Magnitude', (t) => {

  t.comment('parameters');

  const defaults = new Magnitude();
  t.equal(defaults.params.get('normalize'), true, 'should have proper default params');
  t.equal(defaults.params.get('power'), false, 'should have proper default params');

  const override = new Magnitude({ normalize: false, power: true });
  t.equal(override.params.get('normalize'), false, 'should override default params');
  t.equal(override.params.get('power'), true, 'should override default params');


  t.comment('inputVector');

  const node = new Magnitude();
  node.initStream({ frameSize: 3 });

  const mag = node.inputVector([1, 2, 3]);
  t.equal(node.streamParams.frameSize, 1, 'should have out frame size of 1');
  t.equal(mag, Math.sqrt(14 / 3), 'should compute magnitude properly');

  t.end();
});
