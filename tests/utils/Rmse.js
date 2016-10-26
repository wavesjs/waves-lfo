import BaseLfo from '../../src/common/core/BaseLfo';

const sqrt = Math.sqrt;

const definitions = {
  asserter: {
    type: 'any',
    default: null,
  },
  expectedFrames: {
    type: 'any',
    default: null,
  },
  tolerance: {
    type: 'float',
    default: 0,
  },
  startIndex: {
    type: 'integer',
    default: 0,
  },
};

class Rmse extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.expectedFrames = this.params.get('expectedFrames');
    this.frameIndex = 0;

    this.rmseBoundaries = [+Infinity, -Infinity];
  }

  finalizeStream() {
    super.finalizeStream();
    const t = this.params.get('asserter');

    // log boundaries
    const [min, max] = this.rmseBoundaries;
    t.comment(`RSME comprised between ${min} and ${max}`);

    t.end();
  }

  // handle any type of input
  processSignal() {}
  processVector() {}
  processScalar() {}

  // compute rmse between expected frame and current frame
  processFrame(frame) {
    const t = this.params.get('asserter');
    const tolerance = this.params.get('tolerance');
    const expected = this.expectedFrames[this.frameIndex];
    const startIndex = this.params.get('startIndex');

    if (!expected) {
      t.fail('No more expected frame');

      return;
    }

    const data = frame.data;
    const len = data.length;

    t.equal(data.length, expected.length, 'frames should have same size');

    // compute Rmse
    let sum = 0;

    for (let i = startIndex; i < len; i++) {
      const diff = data[i] - expected[i];
      sum += diff * diff;
    }

    const mean = sum / len;
    const rmse = sqrt(mean);

    t.equal(rmse <= tolerance, true, `rmse (${rmse}) should be lower than tolerance (${tolerance})`);

    if (rmse < this.rmseBoundaries[0])
      this.rmseBoundaries[0] = rmse;

    if (rmse > this.rmseBoundaries[1])
      this.rmseBoundaries[1] = rmse;

    this.frameIndex += 1;
  }
}

export default Rmse;
