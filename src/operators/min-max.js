import BaseLfo from '../core/base-lfo';

/**
 * Returns the min and max values from each frame
 */
export default class MinMax extends BaseLfo {
  constructor(options) {
    super(options);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameSize: 2,
    });
  }

  process(time, frame, metaData) {
    let min = +Infinity;
    let max = -Infinity;

    for (let i = 0, l = frame.length; i < l; i++) {
      const value = frame[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    this.time = time;
    this.outFrame[0] = min;
    this.outFrame[1] = max;
    this.metaData = metaData;

    this.output();
  }
}
