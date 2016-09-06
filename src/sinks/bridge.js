import BaseLfo from '../core/base-lfo';


/**
 * Create a bridge between `push` to `pull` paradigms.
 * Alias `outFrame` to `data` and accumulate incomming frames into it.
 */
export default class Bridge extends BaseLfo {
  constructor(options, process) {
    super(options);

    this.process = process.bind(this);
    this.data = this.outFrame = [];
  }

  setupStream() {
    super.setupStream();
    this.data.length = 0;
  }

  reset() {
    this.data.length = 0;
  }

  process(time, frame, metadata) {
    for (let i = 0; i < this.streamParams.frameSize; i++)
      this.data[i] = frame[i];

    this.time = 0;
    this.metadata = metadata;
  }
}
