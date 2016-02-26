import BaseLfo from '../core/base-lfo';

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?
export default class MovingAverage extends BaseLfo {
  constructor(options) {
    super(options, {
      order: 10,
      zeroFill: true,
    });

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
    this.ringCount = 0;
  }

  initialize() {
    super.initialize();

    this.ringBuffer = new Float32Array(this.params.order * this.frameSize);

    if(this.frameSize > 1)
      this.sum = new Float32Array(this.frameSize);
    else
      this.sum = 0;
  }

  reset() {
    super.reset();

    this.ringBuffer.fill(0)

    if(this.frameSize > 1)
      this.sum.fill(0);
    else
      this.sum = 0;

    this.ringIndex = 0;
    this.ringCount = 0;
  }

  inputScalar(value) {
    const ringIndex = this.ringIndex;
    const nextRingIndex = (ringIndex + 1) % order;
    const ringOffset = ringIndex;
    const nextRingOffset = nextRingIndex;
    const ringBuffer = this.ringBuffer;
    let order = this.params.order;
    let sum = this.sum;

    if (!this.params.zeroFill && this.ringCount < order) {
      this.ringCount++;
      order = this.ringCount;
    }

    sum -= ringBuffer[nextRingOffset + i];
    sum += value;

    this.sum = sum;
    this.ringBuffer[ringOffset + i] = value;
    this.ringIndex = nextRingIndex;

    return sum / order;
  }

  inputArray(frame) {
    const outFrame = this.outFrame;
    const frameSize = this.streamParams.frameSize;
    const ringIndex = this.ringIndex;
    const nextRingIndex = (ringIndex + 1) % order;
    const ringOffset = ringIndex * frameSize;
    const nextRingOffset = nextRingIndex * frameSize;
    const ring = this.ringBuffer;
    const sum = this.sum;
    let order = this.params.order;

    if (!this.params.zeroFill && this.ringCount < order) {
      this.ringCount++;
      order = this.ringCount;
    }

    const scale = 1 / order;

    for (let i = 0; i < frameSize; i++) {
      const value = frame[i];
      let sum = sum[i];

      sum -= ringBuffer[nextRingOffset + i];
      sum += value;

      outFrame[i] = sum * scale;

      this.sum[i] = sum;
      this.ringBuffer[ringOffset + i] = value;
    }

    this.ringIndex = nextRingIndex;

    return outFrame;
  }

  process(time, frame, metaData) {
    if(this.frameSize > 1)
      this.inputArray(frame);
    else
      this.outFrame[0] = this.inputScalar(frame[0]);

    this.output(time, this.outFrame, metaData);
  }
}
