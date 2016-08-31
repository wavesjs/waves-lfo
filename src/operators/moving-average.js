import BaseLfo from '../core/base-lfo';

// NOTES:
// - add 'symetrical' option (how to deal with values between frames ?) ?
// - can we improve algorithm implementation ?
export default class MovingAverage extends BaseLfo {
  constructor(options) {
    super({
      order: 10,
      fill: 0,
    }, options);

    this.sum = null;
    this.ringBuffer = null;
    this.ringIndex = 0;
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    this.ringBuffer = new Float32Array(this.params.order * this.streamParams.frameSize);

    if (this.streamParams.frameSize > 1)
      this.sum = new Float32Array(this.streamParams.frameSize);
    else
      this.sum = 0;
  }

  reset() {
    super.reset();

    this.ringBuffer.fill(this.params.fill);

    const fillSum = this.params.order * this.params.fill;

    if (this.streamParams.frameSize > 1)
      this.sum.fill(fillSum);
    else
      this.sum = fillSum;

    this.ringIndex = 0;
  }

  inputScalar(value) {
    const order = this.params.order;
    const ringIndex = this.ringIndex;
    const ringBuffer = this.ringBuffer;
    let sum = this.sum;

    sum -= ringBuffer[ringIndex];
    sum += value;

    this.sum = sum;
    this.ringBuffer[ringIndex] = value;
    this.ringIndex = (ringIndex + 1) % order;

    return sum / order;
  }

  inputArray(frame) {
    const outFrame = this.outFrame;
    const order = this.params.order;
    const frameSize = this.streamParams.frameSize;
    const ringIndex = this.ringIndex;
    const ringOffset = ringIndex * frameSize;
    const ring = this.ringBuffer;
    const sum = this.sum;
    const scale = 1 / order;

    for (let i = 0; i < frameSize; i++) {
      const ringBufferIndex = ringOffset + i;
      const value = frame[i];
      let sum = sum[i];

      sum -= ringBuffer[ringBufferIndex];
      sum += value;

      outFrame[i] = sum * scale;

      this.sum[i] = sum;
      this.ringBuffer[ringBufferIndex] = value;
    }

    this.ringIndex = (ringIndex + 1) % order;

    return outFrame;
  }

  process(time, frame, metadata) {
    if (this.frameSize > 1)
      this.inputArray(frame);
    else
      this.outFrame[0] = this.inputScalar(frame[0]);

    // shift time to take account of the added latency
    if (this.streamParams.sourceSampleRate)
      time -= (0.5 * (this.params.order - 1) / this.streamParams.sourceSampleRate);

    this.output(time, this.outFrame, metadata);
  }
}
