import BaseLfo from '../src/core/BaseLfo';

/**
 * node that make assertions against expected frames
 * @todo - add assertion for metadata
 */
class Asserter extends BaseLfo {
  constructor(asserter) {
    super();

    this.asserter = asserter;
  }

  setExpectedFrame(frame) {
    this.expectedFrame = frame;
  };

  processVector(frame) {
    const assert = this.asserter;
    const { time, data, metadata } = this.expectedFrame;

    assert.deepEqual(frame.time, time, 'should have same time');
    assert.looseEqual(frame.data, data, 'should have same data');
    assert.deepEqual(frame.metadata, metadata, 'should have same metadata');
  }
}

export default Asserter;
