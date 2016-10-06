import BaseLfo from '../src/core/BaseLfo';

/**
 * node that make assertions against expected frames
 * @todo - add assertion for metadata
 */
class Asserter extends BaseLfo {
  constructor(asserter) {
    super();

    this.asserter = asserter;
    this.counter = 0;
  }

  setExpectedFrame(frame) {
    this.expectedFrame = frame;
  };

  setExpectedFrames(frames) {
    this.expectedFrames = frames;
  }

  processSignal(frame) {
    const assert = this.asserter;

    const expectedFrame = this.expectedFrame ?
      this.expectedFrame : this.expectedFrames[this.counter];

    this.counter += 1;

    const { time, data, metadata } = expectedFrame;

    assert.deepEqual(frame.time, time, 'should have same time');
    assert.looseEqual(frame.data, data, 'should have same data');
    assert.looseEqual(frame.metadata, metadata, 'should have same metadata');
  }

  processVector(frame) {
    const assert = this.asserter;

    const expectedFrame = this.expectedFrame ?
      this.expectedFrame : this.expectedFrames[this.counter];

    this.counter += 1;

    const { time, data, metadata } = expectedFrame;

    // time must deal floating point errors
    assert.deepEqual(Math.abs(frame.time - time) < 1e-9, true, 'should have same time');
    assert.looseEqual(frame.data, data, 'should have same data');
    assert.looseEqual(frame.metadata, metadata, 'should have same metadata');
  }
}

export default Asserter;
