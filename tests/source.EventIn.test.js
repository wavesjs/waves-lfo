import BaseLfo from '../src/core/BaseLfo';
import EventIn from '../src/common/source/EventIn';
import tape from 'tape';


tape('EventIn', (t) => {
  t.plan(22);
  t.comment('params');

  // test parameters defaults
  const a = new EventIn();

  t.equal(a.params.get('absoluteTime'), false, 'should have proper default values');
  t.equal(a.params.get('frameType'), 'signal', 'should have proper default values');
  t.equal(a.params.get('frameSize'), 1, 'should have proper default values');
  t.equal(a.params.get('frameRate'), null, 'should have proper default values');
  t.equal(a.params.get('sampleRate'), null, 'should have proper default values');
  t.equal(a.params.get('description'), null, 'should have proper default values');

  t.comment('Vector frame options');
  const options = {
    absoluteTime: true,
    frameSize: 3,
    frameType: 'vector',
    frameRate: 20,
    description: ['a', 'b', 'c'],
  };

  // test parameters overrides
  const b = new EventIn(options);

  t.equal(b.params.get('absoluteTime'), options.absoluteTime, 'should override "absoluteTime" default value');
  t.equal(b.params.get('frameType'), options.frameType, 'should override "frameType" default value');
  t.equal(b.params.get('frameSize'), options.frameSize, 'should override "frameSize" default value');
  t.equal(b.params.get('description'), options.description, 'should override "description" default value');

  t.comment('start (~ processStreamParams)');

  b.init().then(() => {

    t.equal(b.streamParams.frameSize, options.frameSize, 'should initialize streamParams.frameSize properly');
    t.equal(b.streamParams.frameType, options.frameType, 'should initialize streamParams.frameType properly');
    t.equal(b.streamParams.description, options.description, 'should initialize streamParam.description properly');
    t.equal(b.streamParams.frameRate, options.frameRate, 'should initialize streamParams.frameRate properly');
    t.equal(b.streamParams.sourceSampleRate, options.frameRate, 'should initialize streamParams.sampleRate properly');
  });


  t.comment('processFrame');

  class Child extends BaseLfo {
    processStreamParams(options) {
      super.processStreamParams(options);
      this.propagateStreamParams();
    }

    processVector(frame) {
      this.frame = frame;
    };
  }

  const frame = {
    time: 1,
    data: [1, 2, 3],
    metadata: {},
  };

  const c = new Child();

  b.connect(c);
  b.init().then(() => {
    b.start(); // repropagate start

    b.processFrame(frame);

    t.equal(b.frame.time, frame.time, 'should have proper frame.time');
    t.looseEqual(b.frame.data, frame.data, 'should have proper frame.data');
    t.equal(b.frame.metadata, frame.metadata, 'should have proper frame.metadata');

    t.equal(c.frame.time, frame.time, 'should have propagated frame.time');
    t.looseEqual(c.frame.data, frame.data, 'should have propagated frame.data');
    t.looseEqual(c.frame.data instanceof Float32Array, true, 'frame.data should be a Float32Array');
    t.equal(c.frame.metadata, frame.metadata, 'should have propagated frame.metadata');

    b.stop();
  });
});

