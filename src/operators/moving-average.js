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

    // don't need to reinit the whole sub graph, only the ringBuffer
    this.addIntegerParam('order', 1, 1e9, 'static');
    this.addFloatParam('fill', -Infinity, +Infinity, 'static');
  }

  initialize(inStreamParams) {
    super.initialize(inStreamParams);

    const frameSize = this.streamParams.frameSize;
    const order = this.getParam('order');

    this.ringBuffer = new Float32Array(order * frameSize);

    if (frameSize > 1)
      this.sum = new Float32Array(frameSize);
    else
      this.sum = 0;
  }

  reset() {
    super.reset();

    const order = this.getParam('order');
    const fill = this.getParam('fill');

    this.ringBuffer.fill(fill);

    const fillSum = order * fill;

    if (this.streamParams.frameSize > 1)
      this.sum.fill(fillSum);
    else
      this.sum = fillSum;

    this.ringIndex = 0;
  }

  inputScalar(value) {
    const order = this.getParam('order');
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

  /**
   *
   *
   * @note - The fact of passing through an array seems to introduce more
   * floating point errors.
   */
  inputArray(frame) {
    const order = this.getParam('order');
    const outFrame = this.outFrame;
    const frameSize = this.streamParams.frameSize;
    const ringIndex = this.ringIndex;
    const ringOffset = ringIndex * frameSize;
    const ringBuffer = this.ringBuffer;
    const sum = this.sum;
    const scale = 1 / order;

    for (let i = 0; i < frameSize; i++) {
      const ringBufferIndex = ringOffset + i;
      const value = frame[i];
      let localSum = sum[i];

      localSum -= ringBuffer[ringBufferIndex];
      localSum += value;

      this.sum[i] = localSum;
      outFrame[i] = localSum * scale;
      ringBuffer[ringBufferIndex] = value;
    }

    this.ringIndex = (ringIndex + 1) % order;

    return outFrame;
  }

  process(time, frame, metadata) {
    const order = this.getParam('order');

    if (this.frameSize > 1)
      this.inputArray(frame);
    else
      this.outFrame[0] = this.inputScalar(frame[0]);

    // shift time to take account of the added latency
    if (this.streamParams.sourceSampleRate)
      time -= (0.5 * (order - 1) / this.streamParams.sourceSampleRate);

    this.output(time, this.outFrame, metadata);
  }
}
