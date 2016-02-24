import BaseLfo from '../core/base-lfo';


// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?
export default class MovingAverage extends BaseLfo {
  constructor(options) {
    const defaults = {
      order: 10,
      zeroFill: true,
    };

    super(options, defaults);

    this.sum = 0;
    this.counter = 0;
    this.queue = new Float32Array(this.params.order);
  }

  // streamParams should stay the same ?

  reset() {
    super.reset();

    for (let i = 0, l = this.queue.length; i < l; i++)
      this.queue[i] = 0;

    this.sum = 0;
    this.counter = 0;
  }

  process(time, frame, metaData) {
    const outFrame = this.outFrame;
    const frameSize = this.streamParams.frameSize;
    const order = this.params.order;
    const pushIndex = this.params.order - 1;
    const zeroFill = this.params.zeroFill;
    let divisor;

    for (let i = 0; i < frameSize; i++) {
      const current = frame[i];

      this.sum -= this.queue[0];
      this.sum += current;

      if (!zeroFill) {
        if (this.counter < order) {
          this.counter += 1;
          divisor = this.counter;
        } else {
          divisor = order;
        }

        outFrame[i] = this.sum / divisor;
      } else {
        outFrame[i] = this.sum / order;
      }

      // maintain stack
      this.queue.set(this.queue.subarray(1), 0);
      this.queue[pushIndex] = current;
    }

    this.output(time, outFrame, metaData);
  }
}
