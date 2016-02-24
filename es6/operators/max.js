import BaseLfo from '../core/base-lfo';

export default class Max extends BaseLfo {
  constructor(options) {
    const defaults = {};
    super(options, defaults);
  }

  configureStream() {
    this.streamParams.frameSize = 1;
  }

  process(time, frame, metaData) {
    let max = -Infinity;
    let value;
    const length = frame.length;

    for (let i = 0; i < length; i++) {
      value = frame[i];

      if (value > max)
        max = value;
    }

    this.time = time;
    this.outFrame[0] = max;
    this.metaData = metaData;

    this.output();
  }
}
