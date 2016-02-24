import BaseLfo from '../core/base-lfo';

/**
 * a NoOp Lfo
 */
export default class Noop extends BaseLfo {
  constructor(options) {
    super(options, {});
  }

  process(time, frame, metaData) {
    this.outFrame.set(frame, 0);
    this.time = time;
    this.metaData = metaData;

    this.output();
  }
}
