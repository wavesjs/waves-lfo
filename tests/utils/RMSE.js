import BaseLfo from '../../src/core/BaseLfo';

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
};

class RMSE extends BaseLfo {
  constructor(options) {
    super(definitions, options);

    this.expectedFrames = this.params.get('expectedFrames');
    this.frameIndex = 0;
  }

  finalizeStream() {
    super.finalizeStream();
    const t = this.params.get('asserter');
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

    if (!expected) {
      t.fail('No more expected frame');

      return;
    }

    const data = frame.data;
    const len = data.length;

    t.equal(data.length, expected.length, 'frames should have same size');

    // compute RMSE
    let sum = 0;

    for (let i = 0; i < len; i++) {
      const diff = data[i] - expected[i];
      sum += diff * diff;
    }

    const mean = sum / len;
    const rmse = sqrt(mean);

    t.equal(rmse <= tolerance, true, `rmse (${rmse}) should lower than tolerance (${tolerance})`);

    this.frameIndex += 1;
  }
}

export default RMSE;
