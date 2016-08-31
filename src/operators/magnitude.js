import BaseLfo from '../core/base-lfo';


const sqrt = Math.sqrt;


/**
 *
 * is an rms is `power === false` (default)
 */
export default class Magnitude extends BaseLfo {
  constructor(options) {
    super({
      normalize: true,  // static ?
      power: false,     // static ?
    }, options);
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams, { frameSize: 1 });
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
      mag = sqrt(mag);

    outFrame[0] = mag;

    return outFrame;
  }

  process(time, frame, metadata) {
    this.inputArray(frame);
    this.output(time, this.outFrame, metadata);
  }
}
