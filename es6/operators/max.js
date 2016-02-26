import BaseLfo from '../core/base-lfo';

export default class Max extends BaseLfo {
  constructor(options) {
    super(options, {});
  }

  configureStream() {
    this.streamParams.frameSize = 1;
  }

  process(time, frame, metaData) {
    this.time = time;
    this.outFrame[0] = Math.max.apply(null, frame);
    this.metaData = metaData;

    this.output();
  }
}
