import BaseLfo from '../core/base-lfo';


// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?
export default class MovingAverage extends BaseLfo {
  constructor(options) {
    const defaults = {
      order: 10
    };

    super(options, defaults);

    this.sum = 0;
    this.counter = 0;
    this.stack = new Float32Array(this.params.order);
  }

  // streamParams should not change from parent

  reset() {
    super.reset();

    for (let i = 0, l = this.stack.length; i < l; i++) {
      this.stack[i] = 0;
    }

    this.sum = 0;
    this.counter = 0;
  }

  process(time, frame, metaData) {
    const outFrame = this.outFrame;
    const frameSize = this.streamParams.frameSize;
    const order = this.params.order;
    const pushIndex = this.params.order - 1;
    let divisor;

    for (let i = 0; i < frameSize; i++) {
      const current = frame[i];

      // is this necessary, or is it overhead ?
      if (this.counter < order) {
        this.counter += 1;
        divisor = this.counter;
      } else {
        divisor = order;
      }

      this.sum -= this.stack[0];
      this.sum += current;
      outFrame[i] = this.sum / divisor;
      // outFrame[i] = this.sum / order;

      // maintain stack
      this.stack.set(this.stack.subarray(1), 0);
      this.stack[pushIndex] = current;
    }

    this.output(time, outFrame, metaData);
  }
}
