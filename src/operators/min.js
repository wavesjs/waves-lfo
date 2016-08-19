import BaseLfo from '../core/base-lfo';


/**
 * Output the min value of the current frame.
 * @todo - define if their are options
 */
export default class Min extends BaseLfo {
  constructor(options) {
    super({}, options);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameSize: 1,
    });
  }

  process(time, frame, metaData) {
    let min = +Infinity;

    for (let i = 0; i < frame.length; i++)
      if (frame[i] < min) min = frame[i];

    this.time = time;
    this.outFrame[0] = min;
    this.metaData = metaData;

    this.output();
  }
}
