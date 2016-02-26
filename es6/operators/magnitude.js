import BaseLfo from '../core/base-lfo';


export default class Magnitude extends BaseLfo {
  constructor(options) {
    const defaults = {
      normalize: false
    };

    super(options, defaults);
  }

  configureStream() {
    this.streamParams.frameSize = 1;
  }

  process(time, frame, metaData) {
    const frameSize = frame.length;
    let sum = 0;

    for (let i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    // sum is a mean here (for rms)
    if (this.params.normalize)
      sum /= frameSize;

    this.time = time;
    this.outFrame[0] = Math.sqrt(sum);
    this.metaData = metaData;

    this.output();
  }
}
