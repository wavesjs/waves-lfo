import BaseLfo from '../core/base-lfo';


export default class Magnitude extends BaseLfo {
  constructor(options) {
    super({
      normalize: true,
      power: false,
    }, options);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, {
      frameSize: 1,
    });
  }

  inputArray(frame) {
    const outFrame = this.outFrame;
    const frameSize = frame.length;
    let sum = 0;

    for (let i = 0; i < frameSize; i++)
      sum += (frame[i] * frame[i]);

    let mag = sum;

    if (this.params.normalize)
      mag /= frameSize;

    if (!this.params.power)
      mag = Math.sqrt(mag);

    outFrame[0] = mag;

    return outFrame;
  }

  process(time, frame, metaData) {
    this.inputArray(frame);
    this.output(time, this.outFrame, metaData);
  }
}
