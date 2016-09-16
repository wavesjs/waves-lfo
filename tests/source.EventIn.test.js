import BaseLfo from '../src/core/BaseLfo';
import EventIn from '../src/sources/EventIn';
import tape from 'tape';


tape('EventIn', (t) => {
  t.comment('params');

  // test parameters defaults
  const a = new EventIn();

  t.equal(a.params.get('absoluteTime'), false, 'should have proper default values');
  t.equal(a.params.get('frameType'), 'signal', 'should have proper default values');
  t.equal(a.params.get('frameSize'), 1, 'should have proper default values');
  t.equal(a.params.get('sampleRate'), 0, 'should have proper default values');
  t.equal(a.params.get('description'), null, 'should have proper default values');

  const options = {
    absoluteTime: true,
    frameSize: 3,
    frameType: 'vector',
    sampleRate: 20,
    description: ['a', 'b', 'c'],
  };

  // test parameters overrides
  const b = new EventIn(options);

  t.equal(b.params.get('absoluteTime'), options.absoluteTime, 'should ovveride default values');
  t.equal(b.params.get('frameType'), options.frameType, 'should ovveride default values');
  t.equal(b.params.get('frameSize'), options.frameSize, 'should ovveride default values');
  t.equal(b.params.get('sampleRate'), options.sampleRate, 'should ovveride default values');
  t.equal(b.params.get('description'), options.description, 'should ovveride default values');

  t.comment('start (~ processStreamParams)');

  b.start();

  t.equal(b.streamParams.frameSize, options.frameSize, 'should initialize streamParams properly');
  t.equal(b.streamParams.sourceSampleRate, options.sampleRate, 'should initialize streamParams properly');
  t.equal(b.streamParams.frameType, options.frameType, 'should initialize streamParams properly');
  t.equal(b.streamParams.description, options.description, 'should initialize streamParams properly');
  t.equal(b.streamParams.frameRate, options.sampleRate, 'should initialize streamParams properly');


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
  b.start(); // repropagate start

  b.processFrame(frame);

  t.equal(b.frame.time, frame.time, 'should have proper frameTime');
  t.looseEqual(b.frame.data, frame.data, 'should have proper frameData');
  t.equal(b.frame.metadata, frame.metadata, 'should have proper frameMetadata');

  t.equal(c.frame.time, frame.time, 'should have propagated frameTime');
  t.looseEqual(c.frame.data, frame.data, 'should have propagated frameData');
  t.equal(c.frame.metadata, frame.metadata, 'should have propagated frameMetadata');

  b.stop();

  t.end();
});


// test `processFrame`

// test stop
